import { sql } from '@pgtyped/query'
import { getArgument } from '../getArgument'
import { loadHNUser } from '../hnApi'
import { SessionContext } from '../sessionContext'
import {
	IGetHnUserQuery,
	ICreateHnUserQuery,
	ICreateSubscriptionQuery
} from './subscribe.types'

const getHNUser = sql<IGetHnUserQuery>`
	SELECT id
	FROM hn_users
	WHERE id = $hnUsername
`

const createHNUser = sql<ICreateHnUserQuery>`
	INSERT INTO hn_users (id)
	VALUES ($hnUsername)
`

const createSubscription = sql<ICreateSubscriptionQuery>`
	INSERT INTO tg_subscriptions (tg_user_chat_id, hn_user_id)
	VALUES ($tgUserChatId, $hnUserId)
	ON CONFLICT (tg_user_chat_id, hn_user_id) DO NOTHING
	RETURNING *
`

export const subscribe = async (ctx: SessionContext) => {
	const hnUsername = getArgument(ctx, 1)
	if (!hnUsername) {
		await ctx.reply('Please specify username to subscribe to')
		return
	}

	const [check, _] = await Promise.all([
		getHNUser.run({ hnUsername }, ctx.db!),
		ctx.reply(`Checking username ${hnUsername}...`)
	])
	if (!check || check.length === 0) {
		const hnUser = await loadHNUser(hnUsername)
		if (!hnUser) {
			await ctx.reply(
				`Can't find HN user ${hnUsername}. Are you sure you spelled username right?`
			)
			return
		}
		await createHNUser.run({ hnUsername }, ctx.db!)
	}

	const [created] = await createSubscription.run(
		{ tgUserChatId: ctx.session!.chat!.id, hnUserId: hnUsername },
		ctx.db!
	)
	if (!created) {
		await ctx.reply(
			`You're already subscribed to ${hnUsername}! Use /subscriptions to check the list of existing subscriptions`
		)
		return
	}

	await ctx.reply(
		`Subscriedb to ${hnUsername}. Use command /unsubscribe to remove subscription.`
	)
}
