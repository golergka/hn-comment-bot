/** Types generated for queries found in "./src/notificationSendLoop.ts" */

/** 'GetUnnotifiedPosts' parameters type */
export type IGetUnnotifiedPostsParams = void

/** 'GetUnnotifiedPosts' return type */
export interface IGetUnnotifiedPostsResult {
	itemId: number
	chatId: number
}

/** 'GetUnnotifiedPosts' query type */
export interface IGetUnnotifiedPostsQuery {
	params: IGetUnnotifiedPostsParams
	result: IGetUnnotifiedPostsResult
}

/** 'SetPostsNotified' parameters type */
export interface ISetPostsNotifiedParams {
	ids: Array<number | null | void>
}

/** 'SetPostsNotified' return type */
export type ISetPostsNotifiedResult = void

/** 'SetPostsNotified' query type */
export interface ISetPostsNotifiedQuery {
	params: ISetPostsNotifiedParams
	result: ISetPostsNotifiedResult
}
