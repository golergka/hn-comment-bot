import { sql } from '@pgtyped/query'
import { Middleware } from 'telegraf'
import { tx } from '../pg'
import { SessionContext } from '../sessionContext'

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
