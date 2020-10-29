import got from 'got'

export type ItemID = number

export interface Item {
	id: ItemID
	parent: ItemID
	by: string
	// title?: string
	text?: string
	kids?: ItemID[]
	time: number
	// type: "job"|"story"|"comment"|"poll"|"pollopt"
}

export async function loadHNItem(itemID: ItemID) {
	const { body } = await got<Item>(
		`https://hacker-news.firebaseio.com/v0/item/${itemID}.json`,
		{
			responseType: 'json'
		}
	)
	return body
}

export async function loadHNUser(
	username: string
): Promise<{ submitted?: ItemID[] }> {
	const { body } = await got<{
		submitted?: ItemID[]
	}>(`https://hacker-news.firebaseio.com/v0/user/${username}.json?`, {
		responseType: 'json'
	})
	return body
}
