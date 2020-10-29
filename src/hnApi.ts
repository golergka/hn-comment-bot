import got from 'got'
import { DateTime, Duration } from 'luxon'

export type ItemID = number

interface BaseItem {
	id: ItemID
	by: string
	kids?: ItemID[]
	time: number
}

export interface Story extends BaseItem {
	descendants: number
	score: number
	title: string
	type: 'story'
}

export interface Comment extends BaseItem {
	text: string
	parent: ItemID
	type: 'comment'
}

export type Item = Story | Comment

export function hnUrl(itemID: ItemID): string {
	return `https://news.ycombinator.com/item?id=${itemID}`
}

export function isItemArchived(item: Item): boolean {
	const itemTime = DateTime.fromJSDate(new Date(item.time * 1000))
	const elapsed = itemTime.diffNow()
	return elapsed > Duration.fromObject({ weeks: -2 })
}

export async function loadHNItem<T extends BaseItem = Item>(
	itemID: ItemID
): Promise<T> {
	const { body } = await got<T>(
		`https://hacker-news.firebaseio.com/v0/item/${itemID}.json`,
		{
			responseType: 'json'
		}
	)
	return body
}

export async function loadHNRoot(item: Item): Promise<Story> {
	if (item.type === 'story') {
		return item
	}
	const parentItem = await loadHNItem(item.parent)
	return loadHNRoot(parentItem)
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
