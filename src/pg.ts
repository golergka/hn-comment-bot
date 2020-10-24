import {
	Pool,
	PoolClient,
	types,
	Client,
	QueryResult,
	QueryResultRow
} from 'pg'
import { as as queryFormat } from 'pg-promise'

const { POSTGRES_URL } = process.env

if (!POSTGRES_URL) {
	console.log('env', process.env)
	throw new Error('Must specify POSTGRES_URL')
}

export const pg = new Pool({
	connectionString: POSTGRES_URL,
	max: 300
})

const originalClientQuery = Client.prototype.query
Client.prototype.query = async function (
	this: Client,
	queryText: string,
	values: any[], // eslint-disable-line @typescript-eslint/no-explicit-any
	callback: (err: Error, result: QueryResult<QueryResultRow>) => void
) {
	try {
		return await originalClientQuery.call(this, queryText, values, callback)
	} catch (e) {
		e.isPostgresError = true
		e.query = queryFormat
			.format(queryText, values, { partial: true })
			.replace(/\t/g, ' ')

		throw e
	}
} as any // eslint-disable-line @typescript-eslint/no-explicit-any

types.setTypeParser(20, (numberValue) => parseInt(numberValue, 10))

export async function tx<T>(
	callback: (db: PoolClient) => Promise<T>
): Promise<T> {
	const client = await pg.connect()
	await client.query('BEGIN')

	let result

	try {
		result = await callback(client)
		await client.query('COMMIT')
	} catch (e) {
		await client.query('ROLLBACK')
		throw e
	} finally {
		client.release()
	}

	return result
}
