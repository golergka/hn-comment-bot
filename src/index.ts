import got from 'got'
import { notificationSendLoop } from './notificationSendLoop'
import { serverRestartCheck } from './serverRestartCheck'
import { subscribeHNStream } from './subscribeHNStream'

async function healthCheck() {
	const { HEALTH_CHECK_URL } = process.env
	if (!HEALTH_CHECK_URL) {
		throw new Error('Must specify HEALTH_CHECK_URL')
	}

	for (;;) {
		try {
			// eslint-disable-next-line no-await-in-loop
			await got.get(HEALTH_CHECK_URL)
			console.log('Health check ping sent')
		} catch (error) {
			console.error('Health check failed:', error)
		}

		// eslint-disable-next-line no-await-in-loop
		// eslint-disable-next-line no-promise-executor-return
		void (await new Promise((resolve) => setTimeout(resolve, 60000)))
	}
}

notificationSendLoop()
subscribeHNStream()
serverRestartCheck()
healthCheck()
