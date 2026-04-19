import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI!
let client: MongoClient
let db: Db

export async function connectToDatabase() {
	if (!client) {
		client = new MongoClient(uri)
		await client.connect()
		db = client.db()
	}
	return { db, client }
}

export async function getUsersCollection() {
	const { db } = await connectToDatabase()
	return db.collection('users')
}

export async function getVideosCollection() {
	const { db } = await connectToDatabase()
	return db.collection('videos')
}

export async function getWorksheetsCollection() {
	const { db } = await connectToDatabase()
	return db.collection('worksheets')
}
