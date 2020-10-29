import { SessionContext } from './sessionContext'

export function getArgument(
	ctx: SessionContext,
	index: number
): string | undefined {
	if (!ctx.message?.text) {
		throw new Error(`can't get message text`)
	}
	const split = ctx.message.text.split(' ')
	return split[index]
}
