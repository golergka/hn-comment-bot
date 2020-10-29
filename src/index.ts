import { notificationSendLoop } from './notificationSendLoop'
import { serverRestartCheck } from './serverRestartCheck'
import { subscribeHNStream } from './subscribeHNStream'

notificationSendLoop()
subscribeHNStream()
serverRestartCheck()
