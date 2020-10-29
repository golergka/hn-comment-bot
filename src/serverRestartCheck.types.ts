/** Types generated for queries found in "./src/serverRestartCheck.ts" */

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

/** 'GetSubscribedUsers' parameters type */
export type IGetSubscribedUsersParams = void

/** 'GetSubscribedUsers' return type */
export interface IGetSubscribedUsersResult {
	hn_user_id: string
}

/** 'GetSubscribedUsers' query type */
export interface IGetSubscribedUsersQuery {
	params: IGetSubscribedUsersParams
	result: IGetSubscribedUsersResult
}

/** 'MarkOutdatedPosts' parameters type */
export type IMarkOutdatedPostsParams = void

/** 'MarkOutdatedPosts' return type */
export type IMarkOutdatedPostsResult = void

/** 'MarkOutdatedPosts' query type */
export interface IMarkOutdatedPostsQuery {
	params: IMarkOutdatedPostsParams
	result: IMarkOutdatedPostsResult
}
