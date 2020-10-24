import { concat, chunk } from 'lodash'
import got from 'got'
import { sql } from '@pgtyped/query'
import {
	ICreateKidsQuery,
	ICreateRootsQuery,
	IGetSessionQuery,
	ISetSessionQuery
} from './index.types'
import { tx } from './pg'
import Telegraf from 'telegraf'
import { TelegrafContext } from 'telegraf/typings/context'
import { PoolClient } from 'pg'

export interface Item {
	id: ItemID
	parent: ItemID
	by: string
	// title?: string
	text?: string
	kids?: ItemID[]
	// type: "job"|"story"|"comment"|"poll"|"pollopt"
}

export type ItemID = number

const createRoots = sql<ICreateRootsQuery>`
	INSERT INTO hn_submitted (hn_username, hn_id)
	VALUES $$roots(hnUsername, id)
	ON CONFLICT (hn_id) DO NOTHING
`

const createKids = sql<ICreateKidsQuery>`
	INSERT INTO hn_kids (parent_id, id)
	VALUES $$kids(parentId, id)
	ON CONFLICT (id) DO NOTHING
	RETURNING parent_id, id
`

async function getHNItem(itemID: ItemID) {
	console.log(`loading item ${itemID}...`)
	const { body } = await got<Item>(
		`https://hacker-news.firebaseio.com/v0/item/${itemID}.json`,
		{
			responseType: 'json'
		}
	)
	console.log(`loaded item ${itemID}`)
	return body
}

async function getHNUser(username: string): Promise<{ submitted?: ItemID[] }> {
	const { body } = await got<{
		submitted?: ItemID[]
	}>(`https://hacker-news.firebaseio.com/v0/user/${username}.json?`, {
		responseType: 'json'
	})
	return body
}

async function updateRoots(hnUsername: string, submitted: number[]) {
	const hnRoots = await Promise.all(submitted.map(getHNItem))
	const createdKids = await tx(async (db) => {
		const [_, createdKids] = await Promise.all([
			createRoots.run(
				{
					roots: hnRoots.map((r) => ({
						hnUsername,
						id: r.id
					}))
				},
				db
			),
			createKids.run(
				{
					kids: concat(
						[],
						...hnRoots.map((r) =>
							(r.kids || []).map((k) => ({
								id: k,
								parentId: r.id
							}))
						)
					)
				},
				db
			)
		])
		return createdKids
	})
	await Promise.all(
		createdKids.map(async (k) => {
			const kidItem = await getHNItem(k.id)
			const kidRoot = hnRoots.find((r) => r.id === k.parent_id)
			console.log(
				`New comment on\n${JSON.stringify(kidRoot)}\n${JSON.stringify(kidItem)}`
			)
		})
	)
}

async function updateUser(hnUsername: string) {
	const hnUser: { submitted?: ItemID[] } = await getHNUser(hnUsername)
	const submitted = hnUser.submitted || []
	const chunks = chunk(submitted, 10)
	for (const c of chunks) {
		await updateRoots(hnUsername, c)
	}
}

const { TELEGRAM_BOT_TOKEN } = process.env
if (!TELEGRAM_BOT_TOKEN) {
	throw new Error('Must specify TELEGRAM_BOT_TOKEN')
}

const bot = new Telegraf(TELEGRAM_BOT_TOKEN)

const getSession = sql<IGetSessionQuery>`
	SELECT session, hn_username
	FROM tg_users
	WHERE chat_id = $chatId
	FOR UPDATE
`

const setSession = sql<ISetSessionQuery>`
	INSERT INTO tg_users (chat_id, session, hn_username)
	VALUES ($chatId, $session, $hnUsername)
	ON CONFLICT (chat_id) DO UPDATE SET 
		session = $session,
		hn_username = $hnUsername
`

interface SessionContext extends TelegrafContext {
	db?: PoolClient
	hnUsername?: string
	session?: any
}

// All db handling in one transaction
bot.use(async (ctx: SessionContext, next) => {
	await tx(async (db) => {
		ctx.db = db
		await next()
		ctx.db = undefined
	})
})

// Minimal postgres-based middleware
bot.use(async (ctx: SessionContext, next) => {
	// Only support private chats
	if (!ctx.chat || ctx.chat?.type !== 'private') {
		return next()
	}
	const chatId = ctx.chat.id
	const result = await getSession.run({ chatId }, ctx.db!)
	ctx.session = result[0]?.session || {}
	ctx.hnUsername = result[0]?.hn_username || undefined

	await next()

	await setSession.run(
		{ chatId, session: ctx.session, hnUsername: ctx.hnUsername },
		ctx.db!
	)
	ctx.session = undefined
	ctx.hnUsername = undefined
})

// Logging chat details into db just in case
bot.use(async (ctx: SessionContext, next) => {
	const chat = await ctx.getChat()
	if (chat) {
		ctx.session = {
			chat,
			...ctx.session
		}
	}
	await next()
})

bot.start(({ reply }) =>
	reply(
		'This bot will allow you to get updates about new comment replies on Hacker News. Use command /subscribe {username} to with your HN username to subscribe to new comments.'
	)
)

const checkHNUser = sql`
	SELECT hn_username
	FROM hn_users
	WHERE hn_username = $hnUsername
`

const createHNUser = sql`
	INSERT INTO hn_users (hn_username)
	VALUES ($hnUsername)
`

bot.command('subscribe', async (ctx: SessionContext) => {
	const text = ctx.message!.text!
	const split = text.split(' ')
	if (split.length <= 1) {
		await ctx.reply('Please specify username to subscribe to')
		return
	}
	const hnUsername = split[1]

	const [check, _] = await Promise.all([
		checkHNUser.run({ hnUsername }, ctx.db!),
		ctx.reply(`Checking username ${hnUsername}...`)
	])
	if (!check || check.length === 0) {
		const hnUser = await getHNUser(hnUsername)
		if (!hnUser) {
			await ctx.reply(
				`Can't find HN user ${hnUsername}. Are you sure you spelled username right?`
			)
			return
		}
		await createHNUser.run({ hnUsername }, ctx.db!)
	}

	const oldUsername = ctx.hnUsername
	ctx.hnUsername = hnUsername
	const subscribeMessage = oldUsername
		? `Subscribed to ${hnUsername} instead of ${oldUsername}. `
		: `Subscriedb to ${hnUsername}. `
	await ctx.reply(
		subscribeMessage + `Use command /unsubscribe to remove subscription.`
	)
})

bot.command('unsubscribe', async (ctx: SessionContext) => {
	if (!ctx.hnUsername) {
		await ctx.reply('No active subscription found')
		return
	}
	const oldUsername = ctx.hnUsername
	ctx.hnUsername = undefined
	await ctx.reply(`Unsubscribed from ${oldUsername}`)
})

bot.launch()
