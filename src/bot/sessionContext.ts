import { PoolClient } from 'pg'
import { TelegrafContext } from 'telegraf/typings/context'

export interface SessionContext extends TelegrafContext {
	db?: PoolClient
	session?: any
}
