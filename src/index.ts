import { difference, concat, values, chunk } from 'lodash'
import got from 'got'
import { sql } from '@pgtyped/query'
import {
	ICreateKidsParams,
	ICreateKidsQuery,
	ICreateRootsQuery,
	IGetUserRootsKidsQuery
} from './index.types'
import { tx } from './pg'

export interface Item {
	id: ItemID
	parent: ItemID
	by: string
	// title?: string
	text?: string
	kids?: ItemID[]
	// type: "job"|"story"|"comment"|"poll"|"pollopt"
}

export type ItemID = number

const createRoots = sql<ICreateRootsQuery>`
	INSERT INTO hn_submitted (hn_username, hn_id)
	VALUES $$roots(hnUsername, id)
	ON CONFLICT (hn_id) DO NOTHING
`

const createKids = sql<ICreateKidsQuery>`
	INSERT INTO hn_kids (parent_id, id)
	VALUES $$kids(parentId, id)
	ON CONFLICT (id) DO NOTHING
	RETURNING parent_id, id
`

async function getHNItem(itemID: ItemID) {
	console.log(`loading item ${itemID}...`)
	const { body } = await got<Item>(
		`https://hacker-news.firebaseio.com/v0/item/${itemID}.json`,
		{
			responseType: 'json'
		}
	)
	console.log(`loaded item ${itemID}`)
	return body
}

async function getHNUser(username: string): Promise<{ submitted?: ItemID[] }> {
	console.log(`loading user ${username}...`)
	const { body } = await got<{
		submitted?: ItemID[]
	}>(`https://hacker-news.firebaseio.com/v0/user/${username}.json?`, {
		responseType: 'json'
	})
	console.log(`loaded user ${username}`)
	return body
}

async function updateRoots(hnUsername: string, submitted: number[]) {
	const hnRoots = await Promise.all(submitted.map(getHNItem))
	const createdKids = await tx(async (db) => {
		const [_, createdKids] = await Promise.all([
			createRoots.run(
				{
					roots: hnRoots.map((r) => ({
						hnUsername,
						id: r.id
					}))
				},
				db
			),
			createKids.run(
				{
					kids: concat(
						[],
						...hnRoots.map((r) =>
							(r.kids || []).map((k) => ({
								id: k,
								parentId: r.id
							}))
						)
					)
				},
				db
			)
		])
		return createdKids
	})
	await Promise.all(
		createdKids.map(async (k) => {
			const kidItem = await getHNItem(k.id)
			const kidRoot = hnRoots.find((r) => r.id === k.parent_id)
			console.log(
				`New comment on\n${JSON.stringify(kidRoot)}\n${JSON.stringify(kidItem)}`
			)
		})
	)
}

async function updateuser(hnUsername: string) {
	const hnUser: { submitted?: ItemID[] } = await getHNUser(hnUsername)
	const submitted = hnUser.submitted || []
	const chunks = chunk(submitted, 10)
	for (const c of chunks) {
		await updateRoots(hnUsername, c)
	}
}

;(async () => {
	await updateuser('golergka')
})()
