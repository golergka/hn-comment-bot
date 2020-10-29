import { tx } from './pg'
import { promisify } from 'util'
import { Comment, hnUrl, loadHNItem, loadHNRoot as loadHNStory } from './hnApi'
import {
	IGetUnnotifiedPostsQuery,
	ISetPostsNotifiedQuery
} from './notificationSendLoop.types'
import { sql } from '@pgtyped/query'
import { bot } from './bot'
import { DateTime } from 'luxon'
import { Extra } from 'telegraf'

const getUnnotifiedPosts = sql<IGetUnnotifiedPostsQuery>`
	SELECT
		hn_kids.id AS "itemId",
		tg_subscriptions.tg_user_chat_id AS "chatId"
	FROM hn_kids
		LEFT JOIN hn_submitted ON hn_kids.parent_id = hn_submitted.id
		INNER JOIN tg_subscriptions ON hn_submitted.hn_user_id = tg_subscriptions.hn_user_id
	WHERE
		NOT hn_kids.notified AND
		hn_kids.posted_at > tg_subscriptions.subscribed_at
`

const setPostsNotified = sql<ISetPostsNotifiedQuery>`
	UPDATE hn_kids
	SET notified = TRUE
	WHERE id IN $$ids
`

/**
 * Infinitely looping await functions that sends notifications
 * about new comments to tg users
 */
export async function notificationSendLoop() {
	// eslint-disable-next-line no-constant-condition
	while (true) {
		const empty = await tx(
			async (db): Promise<boolean> => {
				const unnotified = await getUnnotifiedPosts.run(undefined, db)
				if (unnotified.length === 0) {
					return true
				}
				await Promise.all<unknown>([
					setPostsNotified.run({ ids: unnotified.map((u) => u.itemId) }, db),
					...unnotified.map(async (u) => {
						const item = await loadHNItem<Comment>(u.itemId)
						const root = await loadHNStory(item)
						const jsDate = new Date(item.time * 1000)
						const date = DateTime.fromJSDate(jsDate)
						const dateText = date.toLocaleString(DateTime.DATETIME_MED)
						const messageText =
							`Re: <a href="${hnUrl(root.id)}">${root.title}</a>` +
							`\n\n` +
							item.text.replace(/<p>/g, '\n\n') +
							`\n\n` +
							`${item.by}, <a href="${hnUrl(item.id)}">${dateText}</a>`
						bot.telegram.sendMessage(u.chatId, messageText, {
							parse_mode: 'HTML'
						})
						Extra.markup
					})
				])
				return false
			}
		)
		if (empty) {
			await promisify(setTimeout)(1000)
		}
	}
}
