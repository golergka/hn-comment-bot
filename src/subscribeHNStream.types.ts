/** Types generated for queries found in "./src/subscribeHNStream.ts" */

/** 'GetSubscribedUser' parameters type */
export interface IGetSubscribedUserParams {
	id: string | null | void
}

/** 'GetSubscribedUser' return type */
export interface IGetSubscribedUserResult {
	id: string
}

/** 'GetSubscribedUser' query type */
export interface IGetSubscribedUserQuery {
	params: IGetSubscribedUserParams
	result: IGetSubscribedUserResult
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
		postedAt: Date | null | void
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

/** 'GetSubscribedRoot' parameters type */
export interface IGetSubscribedRootParams {
	id: number | null | void
}

/** 'GetSubscribedRoot' return type */
export interface IGetSubscribedRootResult {
	id: number
}

/** 'GetSubscribedRoot' query type */
export interface IGetSubscribedRootQuery {
	params: IGetSubscribedRootParams
	result: IGetSubscribedRootResult
}
