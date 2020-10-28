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

/** 'GetHnUser' parameters type */
export interface IGetHnUserParams {
	hnUsername: string | null | void
}

/** 'GetHnUser' return type */
export interface IGetHnUserResult {
	id: string
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

/** 'CreateSubscription' parameters type */
export interface ICreateSubscriptionParams {
	tgUserChatId: number | null | void
	hnUserId: string | null | void
}

/** 'CreateSubscription' return type */
export interface ICreateSubscriptionResult {
	tg_user_chat_id: number
	hn_user_id: string
	subscribed_at: Date
}

/** 'CreateSubscription' query type */
export interface ICreateSubscriptionQuery {
	params: ICreateSubscriptionParams
	result: ICreateSubscriptionResult
}

/** 'GetSubscriptionsByUser' parameters type */
export interface IGetSubscriptionsByUserParams {
	tgUserChatId: number | null | void
}

/** 'GetSubscriptionsByUser' return type */
export interface IGetSubscriptionsByUserResult {
	hn_user_id: string
}

/** 'GetSubscriptionsByUser' query type */
export interface IGetSubscriptionsByUserQuery {
	params: IGetSubscriptionsByUserParams
	result: IGetSubscriptionsByUserResult
}

/** 'GetAllSubscriptions' parameters type */
export type IGetAllSubscriptionsParams = void

/** 'GetAllSubscriptions' return type */
export interface IGetAllSubscriptionsResult {
	hn_user_id: string
	tg_user_chat_id: number
	subscribed_at: Date
}

/** 'GetAllSubscriptions' query type */
export interface IGetAllSubscriptionsQuery {
	params: IGetAllSubscriptionsParams
	result: IGetAllSubscriptionsResult
}

/** 'DeleteSubscription' parameters type */
export interface IDeleteSubscriptionParams {
	tgUserChatId: number | null | void
	hnUserId: string | null | void
}

/** 'DeleteSubscription' return type */
export interface IDeleteSubscriptionResult {
	tg_user_chat_id: number
	hn_user_id: string
	subscribed_at: Date
}

/** 'DeleteSubscription' query type */
export interface IDeleteSubscriptionQuery {
	params: IDeleteSubscriptionParams
	result: IDeleteSubscriptionResult
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

/** 'MarkOutdatedPosts' parameters type */
export type IMarkOutdatedPostsParams = void

/** 'MarkOutdatedPosts' return type */
export type IMarkOutdatedPostsResult = void

/** 'MarkOutdatedPosts' query type */
export interface IMarkOutdatedPostsQuery {
	params: IMarkOutdatedPostsParams
	result: IMarkOutdatedPostsResult
}
