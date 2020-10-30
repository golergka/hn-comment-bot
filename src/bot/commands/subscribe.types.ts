/** Types generated for queries found in "./src/bot/commands/subscribe.ts" */

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
