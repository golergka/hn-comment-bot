import { Middleware } from 'telegraf'
import { SessionContext } from './sessionContext'

export interface Command {
	command: string
	description: string
	middleware: Middleware<SessionContext>
}
