/** Types generated for queries found in "./src/index.ts" */

/** 'GetUserRootsKids' parameters type */
export interface IGetUserRootsKidsParams {
	hnUsername: string | null | void
}

/** 'GetUserRootsKids' return type */
export interface IGetUserRootsKidsResult {
	rootId: number
	kidId: number
}

/** 'GetUserRootsKids' query type */
export interface IGetUserRootsKidsQuery {
	params: IGetUserRootsKidsParams
	result: IGetUserRootsKidsResult
}

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
