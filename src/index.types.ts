/** Types generated for queries found in "./src/index.ts" */

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
