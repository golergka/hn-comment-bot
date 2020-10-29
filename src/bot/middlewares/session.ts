import { sql } from '@pgtyped/query'
import { Middleware } from 'telegraf'
import { SessionContext } from 'src/bot/sessionContext'
import { IGetSessionQuery, ISetSessionQuery } from './session.types'

const getSession = sql<IGetSessionQuery>`
	SELECT session
	FROM tg_users
	WHERE chat_id = $chatId
	FOR UPDATE
`

const setSession = sql<ISetSessionQuery>`
	INSERT INTO tg_users (chat_id, session)
	VALUES ($chatId, $session)
	ON CONFLICT (chat_id) DO UPDATE SET session = $session
`

export const sessionMiddleware: Middleware<SessionContext> = async (
	ctx: SessionContext,
	next
) => {
	// Only support private chats
	if (!ctx.chat || ctx.chat?.type !== 'private') {
		return next()
	}
	const chatId = ctx.chat.id
	const result = await getSession.run({ chatId }, ctx.db!)
	ctx.session = result[0]?.session || {}

	await next()

	await setSession.run({ chatId, session: ctx.session }, ctx.db!)
	ctx.session = undefined
}
