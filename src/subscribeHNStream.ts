import { sql } from '@pgtyped/query'
import got from 'got'
import { Item, loadHNItem } from './hnApi'
import { tx } from './pg'
import {
	ICreateKidsQuery,
	ICreateRootsQuery,
	IGetSubscribedRootQuery,
	IGetSubscribedUserQuery
} from './subscribeHNStream.types'

const getSubscribedUser = sql<IGetSubscribedUserQuery>`
	SELECT id
	FROM hn_users
	INNER JOIN tg_subscriptions ON hn_users.id = tg_subscriptions.hn_user_id
	WHERE id = $id
	LIMIT 1
`

const createRoots = sql<ICreateRootsQuery>`
	INSERT INTO hn_submitted (hn_user_id, id)
	VALUES $$roots(hnUsername, id)
	ON CONFLICT (id) DO NOTHING
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

const createKids = sql<ICreateKidsQuery>`
	INSERT INTO hn_kids (parent_id, id, posted_at)
	VALUES $$kids(parentId, id, postedAt)
	ON CONFLICT (id) DO NOTHING
	RETURNING parent_id, id
`

const getSubscribedRoot = sql<IGetSubscribedRootQuery>`
	SELECT id
	FROM hn_submitted
	INNER JOIN tg_subscriptions ON tg_subscriptions.hn_user_id = hn_submitted.hn_user_id
	WHERE id = $id
	LIMIT 1
`

function checkItemKid(item: Item) {
	return tx(async (db) => {
		if (item.type !== 'comment') {
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

export function subscribeHNStream() {
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
		console.log(`new item ids`, itemIds)
		const items = await Promise.all(itemIds.map(loadHNItem))
		// This order is crucial
		await Promise.all(items.map(checkItemRoot))
		await Promise.all(items.map(checkItemKid))
	})
}
