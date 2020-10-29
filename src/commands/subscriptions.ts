import { sql } from '@pgtyped/query'
import { SessionContext } from '../sessionContext'
import { IGetSubscriptionsByUserQuery } from './subscriptions.types'

const getSubscriptionsByUser = sql<IGetSubscriptionsByUserQuery>`
	SELECT hn_user_id
	FROM tg_subscriptions
	WHERE tg_user_chat_id = $tgUserChatId
`

export const subscriptions = async (ctx: SessionContext) => {
	const subscriptions = await getSubscriptionsByUser.run(
		{
			tgUserChatId: ctx.chat!.id!
		},
		ctx.db!
	)
	const userIds = subscriptions.map((s) => s.hn_user_id)
	await ctx.reply(
		userIds.length > 0
			? `You're subscribed to: ${userIds.join(', ')}`
			: `You're not subscribed to anyone.`
	)
}
