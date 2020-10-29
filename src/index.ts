import { concat, chunk } from 'lodash'
import got from 'got'
import { sql } from '@pgtyped/query'
import {
	ICreateKidsQuery,
	ICreateRootsQuery,
	IGetAllSubscriptionsQuery,
	IGetSubscribedRootQuery,
	IGetSubscribedUserQuery,
	IGetSubscribedUsersQuery,
	IMarkOutdatedPostsQuery
} from './index.types'
import { pg, tx } from './pg'
import { loadHNItem, ItemID, loadHNUser, Item } from './hnApi'
import { notificationSendLoop } from './notificationSendLoop'

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

async function updateKids(submitted: number[]): Promise<void> {
	const hnRoots = await Promise.all(submitted.map(loadHNItem))
	const kids = concat(
		[],
		...hnRoots.map((r) =>
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

async function updateRoots(
	hnUsername: string,
	submitted: number[]
): Promise<void> {
	console.log(`Checking posts ${JSON.stringify(submitted)}`)
	await createRoots.run(
		{
			roots: submitted.map((id) => ({ hnUsername, id }))
		},
		pg
	)
	await updateKids(submitted)
}

async function updateUser(hnUsername: string): Promise<void> {
	console.log(`Checking user ${hnUsername}`)
	const hnUser: { submitted?: ItemID[] } = await loadHNUser(hnUsername)
	const submitted = hnUser.submitted || []
	const chunks = chunk(submitted, 10)

	for (const c of chunks) {
		await updateRoots(hnUsername, c)
	}
}

const getAllSubscriptions = sql<IGetAllSubscriptionsQuery>`
	SELECT hn_user_id, tg_user_chat_id, subscribed_at
	FROM tg_subscriptions
`

const getSubscribedUsers = sql<IGetSubscribedUsersQuery>`
	SELECT hn_user_id
	FROM tg_subscriptions
	GROUP BY hn_user_id
`

/**
 * Runs once on server start - we go through all the current users and their past post to find	comments we might have missed
 */
async function checkAllUsers() {
	console.log('Checking all users...')
	const users = await getSubscribedUsers.run(undefined, pg)
	for (const u of users) {
		await updateUser(u.hn_user_id)
	}
	await markOutdatedPosts.run(undefined, pg)
	console.log('All users checked.')
}

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

notificationSendLoop()

const getSubscribedUser = sql<IGetSubscribedUserQuery>`
	SELECT id
	FROM hn_users
	INNER JOIN tg_subscriptions ON hn_users.id = tg_subscriptions.hn_user_id
	WHERE id = $id
	LIMIT 1
`

function checkItemRoot(item: Item) {
	return tx(async (db) => {
		const subscribedUser = await getSubscribedUser.run(
			{
				id: item.by
			},
			db
		)
		if (subscribedUser.length === 0) {
			return
		}
		await createRoots.run(
			{
				roots: [
					{
						hnUsername: item.by,
						id: item.id
					}
				]
			},
			db
		)
	})
}

const getSubscribedRoot = sql<IGetSubscribedRootQuery>`
	SELECT id
	FROM hn_submitted
	INNER JOIN tg_subscriptions ON tg_subscriptions.hn_user_id = hn_submitted.hn_user_id
	WHERE id = $id
	LIMIT 1
`

function checkItemKid(item: Item) {
	return tx(async (db) => {
		if (!item.parent) {
			return
		}
		const subscribedRoots = await getSubscribedRoot.run(
			{
				id: item.parent
			},
			db
		)
		if (subscribedRoots.length === 0) {
			return
		}
		await createKids.run(
			{
				kids: [
					{
						id: item.id,
						parentId: item.parent,
						postedAt: new Date(item.time * 1000)
					}
				]
			},
			db
		)
	})
}

async function checkStream() {
	const hnStream = got.stream(
		'https://hacker-news.firebaseio.com/v0/updates.json',
		{
			http2: true,
			headers: {
				Accept: 'text/event-stream'
			}
		}
	)
	hnStream.on('data', async (chunk: Buffer) => {
		const lines = chunk.toString().split('\n', 2)
		const event = lines[0].split(': ', 2)[1]
		if (event !== 'put') {
			return
		}
		const {
			data: { items: itemIds }
		} = JSON.parse(lines[1].split(': ', 2)[1]) as {
			data: {
				items: number[]
			}
		}
		const items = await Promise.all(itemIds.map(loadHNItem))
		// This order is crucial
		await Promise.all(items.map(checkItemRoot))
		await Promise.all(items.map(checkItemKid))
	})
}

checkStream()
;(async () => {
	try {
		await checkAllUsers()
	} catch (err) {
		console.error('exception', err)
		throw err
	}
})()
