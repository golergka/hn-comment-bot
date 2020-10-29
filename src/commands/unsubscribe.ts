import { sql } from '@pgtyped/query'
import { getArgument } from '../getArgument'
import { SessionContext } from '../sessionContext'
import { IDeleteSubscriptionQuery } from './unsubscribe.types'

const deleteSubscription = sql<IDeleteSubscriptionQuery>`
	DELETE
	FROM tg_subscriptions
	WHERE tg_user_chat_id = $tgUserChatId AND 
		hn_user_id = $hnUserId
	RETURNING *
`

export const unsubscribe = async (ctx: SessionContext) => {
	const hnUsername = getArgument(ctx, 1)
	if (!hnUsername) {
		await ctx.reply('Please specify username to unsubscribe from')
		return
	}

	const deleted = await deleteSubscription.run(
		{ tgUserChatId: ctx.session!.chat!.id, hnUserId: hnUsername },
		ctx.db!
	)

	await ctx.reply(
		deleted.length > 0
			? `Unsubscribed from ${hnUsername}. Use command /subscribe to subscribe back.`
			: `You haven't been subscribed to ${hnUsername}. Check /subscriptions to check your active subscriptions.`
	)
}
