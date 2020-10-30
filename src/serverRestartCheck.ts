import { pg, tx } from './pg'
import _, { chunk, concat, orderBy } from 'lodash'
import { isItemArchived, Item, ItemID, loadHNItem, loadHNUser } from './hnApi'
import { sql } from '@pgtyped/query'
import {
	ICreateKidsQuery,
	ICreateRootsQuery,
	IDeleteOutdatedKidsQuery,
	IDeleteOutdatedPostsQuery,
	IGetSubscribedUsersQuery,
	IMarkOutdatedPostsQuery
} from './serverRestartCheck.types'

const createRoots = sql<ICreateRootsQuery>`
	INSERT INTO hn_submitted (hn_user_id, id)
	VALUES $$roots(hnUsername, id)
	ON CONFLICT (id) DO NOTHING
`

const createKids = sql<ICreateKidsQuery>`
	INSERT INTO hn_kids (parent_id, id, posted_at)
	VALUES $$kids(parentId, id, postedAt)
	ON CONFLICT (id) DO NOTHING
	RETURNING parent_id, id
`

async function checkKids(submitted: Item[]): Promise<void> {
	const kids = concat(
		[],
		...submitted.map((r) =>
			(r.kids || []).map((k) => ({
				id: k,
				parentId: r.id,
				postedAt: new Date(r.time * 1000)
			}))
		)
	)
	if (kids.length > 0) {
		await createKids.run(
			{
				kids
			},
			pg
		)
	}
}

async function checkRoots(
	hnUsername: string,
	submitted: Item[]
): Promise<void> {
	console.log(`Checking posts ${JSON.stringify(submitted.map((s) => s.id))}`)
	await createRoots.run(
		{
			roots: submitted.map((item) => ({
				hnUsername,
				id: item.id
			}))
		},
		pg
	)
	await checkKids(submitted)
}

async function getActiveItems(
	itemIds: number[]
): Promise<{
	active: Item[]
	firstInactive?: Item
}> {
	const active: Item[] = []
	let firstInactive = undefined
	for (const id of itemIds) {
		const item = await loadHNItem(id)
		if (isItemArchived(item)) {
			firstInactive = item
			break
		}
		active.push(item)
	}
	return { active, firstInactive }
}

async function checkUser(
	hnUsername: string
): Promise<{
	firstInactive?: Item
}> {
	console.log(`Checking user ${hnUsername}`)
	const hnUser: { submitted?: ItemID[] } = await loadHNUser(hnUsername)
	const submittedIds = hnUser.submitted || []
	const { active, firstInactive } = await getActiveItems(submittedIds)
	console.log(`active ${active.length} out of ${submittedIds.length} submitted`)
	const chunks = chunk(active, 10)
	for (const c of chunks) {
		await checkRoots(hnUsername, c)
	}
	return { firstInactive }
}

const getSubscribedUsers = sql<IGetSubscribedUsersQuery>`
	SELECT hn_user_id
	FROM tg_subscriptions
	GROUP BY hn_user_id
`

const markOutdatedPosts = sql<IMarkOutdatedPostsQuery>`
	WITH emptyIds AS (
		SELECT
			hn_kids.id AS "id"
		FROM hn_kids
			LEFT JOIN hn_submitted ON hn_kids.parent_id = hn_submitted.id,
			LATERAL (
				SELECT count(tg_subscriptions.tg_user_chat_id) AS "chatIds"
				FROM tg_subscriptions
				WHERE
					tg_subscriptions.hn_user_id = hn_submitted.hn_user_id AND
					tg_subscriptions.subscribed_at < hn_kids.posted_at
			) AS tg
		WHERE NOT hn_kids.notified
		GROUP BY hn_kids.id
		HAVING sum("chatIds") = 0
	)
	UPDATE hn_kids
	SET notified = TRUE
	FROM emptyIds
`

const deleteOutdatedKids = sql<IDeleteOutdatedKidsQuery>`
	DELETE FROM hn_kids
	WHERE id <= $id
`

const deleteOutdatedPosts = sql<IDeleteOutdatedPostsQuery>`
	DELETE FROM hn_submitted
	WHERE id <= $id
`

/**
 * Runs once on server start - we go through all the current users and their past post to find	comments we might have missed
 */
export async function serverRestartCheck() {
	console.log('Checking all users...')
	const users = await getSubscribedUsers.run(undefined, pg)
	const firstInactiveItems = []
	for (const u of users) {
		firstInactiveItems.push(await checkUser(u.hn_user_id))
	}
	const inactive = _(firstInactiveItems)
		.filter((f) => !!f.firstInactive)
		.map((f) => f.firstInactive!)
		.sort((i) => i.time)
		.orderBy((i) => i.time, 'desc')
		.first()
	if (inactive) {
		tx(async (db) => {
			await deleteOutdatedKids.run({ id: inactive.id }, db)
			await deleteOutdatedPosts.run({ id: inactive.id }, db)
		})
	}
	await markOutdatedPosts.run(undefined, pg)
	console.log('All users checked.')
}
