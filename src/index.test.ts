import { Root, ItemID, User, Item, IDBReadable, HN, Crawler } from './index'
import { mock, instance, when, anything } from 'ts-mockito'

describe('getNewCommentsForRoot', () => {
	it.concurrent('returns new item', async () => {
		const dbMock = mock<IDBReadable>()
		when(dbMock.getUser("golergka")).thenResolve({ id: "golergka", submitted: ['24857357'] })
		when(dbMock.getRoot('24857357')).thenResolve({ id: "24857357", kids: ['24857727']})
		const hnMock = mock<HN>()
		when(hnMock.getUser('golergka')).thenResolve({ id: "golergka", submitted: ['24857357'] })
		when(hnMock.getItem('24857357')).thenResolve({
			id: '24857357',
			parent: '24857242',
			kids: ['24857727', '24858118'],
			by: 'golergka',
			text:
				'&gt; XYZ’s protocol is not just based on JSON, but it’s based on a particular technique known as polymorphic JSON. In this, a single field could have a different data type in different circumstances. For example, the resources field can be an array when requesting a single access token, or it can be an object when requesting multiple named access tokens. The difference in type indicates a difference in processing from the server. Within the resources array, each element can be either an object, representing a rich resource request description, or a string, representing a resource handle (scope).<p>This is horrible.'
		})
		when(hnMock.getItem('24858118')).thenResolve({
			id: '24858118',
			parent: '24857357',
			by: 'alyandon',
			text: 'Lovely - I can&#x27;t wait to see how horrible something like that is to implement in a language like Go.'
		})
		const crawler = new Crawler(instance(hnMock), instance(dbMock))

		const newItems = await crawler.getNewCommentsForRoot("24857357")

		expect(newItems).toEqual([{
			id: '24858118',
			parent: '24857357',
			by: 'alyandon',
			text: 'Lovely - I can&#x27;t wait to see how horrible something like that is to implement in a language like Go.'
		}])
	})
})