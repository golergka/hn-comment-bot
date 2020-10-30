/** Types generated for queries found in "./src/bot/commands/unsubscribe.ts" */

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
