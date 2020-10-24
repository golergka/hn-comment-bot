import { difference, concat } from 'lodash'
import got from 'got'

export type ItemID = string

export interface Root {
	id: ItemID
	kids?: ItemID[]
}

export interface User {
	id: string
	submitted?: ItemID[]
}

export interface IDBReadable {
	getUser(id: string): Promise<User>
	getRoot(id: ItemID): Promise<Root>
}

export interface Item {
	id: ItemID
	parent: ItemID
	by: string
	// title?: string
	text?: string
	kids?: ItemID[]
	// type: "job"|"story"|"comment"|"poll"|"pollopt"
}

export interface HN {
	getUser(id: string): Promise<User>
	getItem(id: ItemID): Promise<Item>
}

export class Crawler {
	constructor(readonly hn: HN, readonly db: IDBReadable) {}

	public async getNewRootsForUser(dbUser: User): Promise<Root[]> {
		const hnUser = await this.hn.getUser(dbUser.id)
		const newRootIDs = difference(hnUser.submitted, dbUser.submitted || [])
		return Promise.all(newRootIDs.map(this.hn.getItem))
	}

	async getNewCommentsForRoot(rootID: ItemID): Promise<Item[]> {
		const [dbRoot, hnRoot] = await Promise.all([
			this.db.getRoot(rootID),
			this.hn.getItem(rootID)
		])
		if (!dbRoot.kids) {
			return []
		}
		const newItems = difference(hnRoot.kids, dbRoot.kids)
		return await Promise.all(newItems.map((n) => this.hn.getItem(n)))
	}

	public async getNewCommentsForUser(dbUser: User): Promise<Item[]> {
		if (!dbUser.submitted) {
			return []
		}
		const newComments = await Promise.all(
			dbUser.submitted.map((r) => this.getNewCommentsForRoot(r))
		)
		return concat([], ...newComments)
	}
}

async function getItem(id: ItemID) {
	const { body } = await got<Item>(
		`https://hacker-news.firebaseio.com/v0/item/${id}.json`,
		{
			responseType: 'json'
		}
	)
	return body
}

;(async () => {
	/*
	const item = await traverseItem('24857357')
	console.log('response', JSON.stringify(item))
	*/
})()
