/** Types generated for queries found in "./src/index.ts" */
export type Json =
	| null
	| boolean
	| number
	| string
	| Json[]
	| { [key: string]: Json }

/** 'CreateRoots' parameters type */
export interface ICreateRootsParams {
	roots: Array<{
		hnUsername: string | null | void
		id: number | null | void
	}>
}

/** 'CreateRoots' return type */
export type ICreateRootsResult = void

/** 'CreateRoots' query type */
export interface ICreateRootsQuery {
	params: ICreateRootsParams
	result: ICreateRootsResult
}

/** 'CreateKids' parameters type */
export interface ICreateKidsParams {
	kids: Array<{
		parentId: number | null | void
		id: number | null | void
	}>
}

/** 'CreateKids' return type */
export interface ICreateKidsResult {
	parent_id: number
	id: number
}

/** 'CreateKids' query type */
export interface ICreateKidsQuery {
	params: ICreateKidsParams
	result: ICreateKidsResult
}

/** 'GetSession' parameters type */
export interface IGetSessionParams {
	chatId: number | null | void
}

/** 'GetSession' return type */
export interface IGetSessionResult {
	session: Json
	hn_username: string | null
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
	hnUsername: string | null | void
}

/** 'SetSession' return type */
export type ISetSessionResult = void

/** 'SetSession' query type */
export interface ISetSessionQuery {
	params: ISetSessionParams
	result: ISetSessionResult
}

/** 'GetHnUser' parameters type */
export interface IGetHnUserParams {
	hnUsername: string | null | void
}

/** 'GetHnUser' return type */
export interface IGetHnUserResult {
	hn_username: string
	subscribed_at: Date
}

/** 'GetHnUser' query type */
export interface IGetHnUserQuery {
	params: IGetHnUserParams
	result: IGetHnUserResult
}

/** 'CreateHnUser' parameters type */
export interface ICreateHnUserParams {
	hnUsername: string | null | void
}

/** 'CreateHnUser' return type */
export type ICreateHnUserResult = void

/** 'CreateHnUser' query type */
export interface ICreateHnUserQuery {
	params: ICreateHnUserParams
	result: ICreateHnUserResult
}
