import got from 'got'
import { notificationSendLoop } from './notificationSendLoop'
import { serverRestartCheck } from './serverRestartCheck'
import { subscribeHNStream } from './subscribeHNStream'

const { HEALTH_CHECK_URL } = process.env
if (!HEALTH_CHECK_URL) {
  throw new Error('Must specify HEALTH_CHECK_URL')
}

async function healthCheck() {
  while (true) {
    try {
      await got.get(HEALTH_CHECK_URL)
      console.log('Health check ping sent')
    } catch (error) {
      console.error('Health check failed:', error)
    }
    
    // Wait 60 seconds
    await new Promise(resolve => setTimeout(resolve, 60000))
  }
}

notificationSendLoop()
subscribeHNStream()
serverRestartCheck()
healthCheck()
