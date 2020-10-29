import { Middleware } from 'telegraf'
import { tx } from 'src/pg'
import { SessionContext } from 'src/bot/sessionContext'

export const txMiddleware: Middleware<SessionContext> = async (
	ctx: SessionContext,
	next
) => {
	await tx(async (db) => {
		ctx.db = db
		await next()
		ctx.db = undefined
	})
}
