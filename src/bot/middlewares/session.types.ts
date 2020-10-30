/** Types generated for queries found in "./src/bot/middlewares/session.ts" */
export type Json =
	| null
	| boolean
	| number
	| string
	| Json[]
	| { [key: string]: Json }

/** 'GetSession' parameters type */
export interface IGetSessionParams {
	chatId: number | null | void
}

/** 'GetSession' return type */
export interface IGetSessionResult {
	session: Json
}

/** 'GetSession' query type */
export interface IGetSessionQuery {
	params: IGetSessionParams
	result: IGetSessionResult
}

/** 'SetSession' parameters type */
export interface ISetSessionParams {
	chatId: number | null | void
	session: Json | null | void
}

/** 'SetSession' return type */
export type ISetSessionResult = void

/** 'SetSession' query type */
export interface ISetSessionQuery {
	params: ISetSessionParams
	result: ISetSessionResult
}
