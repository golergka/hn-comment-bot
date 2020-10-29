import Telegraf from 'telegraf'
import { Command } from './command'
import { subscribe } from './commands/subscribe'
import { subscriptions } from './commands/subscriptions'
import { unsubscribe } from './commands/unsubscribe'
import { sessionMiddleware } from './middlewares/session'
import { txMiddleware } from './middlewares/tx'
import { SessionContext } from './sessionContext'

const { TELEGRAM_BOT_TOKEN } = process.env
if (!TELEGRAM_BOT_TOKEN) {
	throw new Error('Must specify TELEGRAM_BOT_TOKEN')
}

export const bot = new Telegraf(TELEGRAM_BOT_TOKEN)

// All db handling in one transaction
bot.use(txMiddleware)

// Minimal postgres-based middleware
bot.use(sessionMiddleware)

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

const commands = [subscribe, subscriptions, unsubscribe]

for (const c of commands) {
	bot.command(c.command, c.middleware)
}

bot.telegram.setMyCommands(commands)

bot.launch()
