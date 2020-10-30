/** Types generated for queries found in "./src/bot/commands/subscriptions.ts" */

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
