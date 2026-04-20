import { getStore } from '@netlify/blobs'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

const WORKSHEET_STORE_NAME = 'worksheet-store'
const WORKSHEET_FILE_URL_PREFIX = '/api/worksheets/'

const LOCAL_STORAGE_ROOT = path.resolve(process.cwd(), '.storage')

function isMissingBlobsEnvironmentError(error: unknown) {
	return error instanceof Error && error.name === 'MissingBlobsEnvironmentError'
}

function getWorksheetStore() {
	try {
		return getStore(WORKSHEET_STORE_NAME)
	} catch (error) {
		if (isMissingBlobsEnvironmentError(error)) {
			return null
		}

		throw error
	}
}

function resolveLocalStoragePath(key: string) {
	const segments = key.split('/').filter(Boolean)

	if (!segments.length || segments.some((segment) => segment === '.')) {
		throw new Error('Worksheet key tidak valid')
	}

	if (segments.some((segment) => segment.includes('..'))) {
		throw new Error('Worksheet key tidak valid')
	}

	const targetPath = path.resolve(LOCAL_STORAGE_ROOT, ...segments)

	if (
		targetPath !== LOCAL_STORAGE_ROOT &&
		!targetPath.startsWith(`${LOCAL_STORAGE_ROOT}${path.sep}`)
	) {
		throw new Error('Worksheet key tidak valid')
	}

	return targetPath
}

export function createWorksheetFileKey(fileName: string) {
	const safeFileName = path
		.basename(fileName || 'worksheet.pdf')
		.replace(/[^a-zA-Z0-9._-]+/g, '-')

	return `worksheets/${Date.now()}-${safeFileName}`
}

export function getWorksheetFileUrl(key: string) {
	return `${WORKSHEET_FILE_URL_PREFIX}${encodeURIComponent(key)}`
}

export function getWorksheetKeyFromUrl(fileUrl: string) {
	if (!fileUrl.startsWith(WORKSHEET_FILE_URL_PREFIX)) {
		return null
	}

	return decodeURIComponent(fileUrl.slice(WORKSHEET_FILE_URL_PREFIX.length))
}

export async function saveWorksheetFile(key: string, data: Buffer) {
	const store = getWorksheetStore()

	if (store) {
		await store.set(key, Uint8Array.from(data).buffer)
		return
	}

	const filePath = resolveLocalStoragePath(key)
	await mkdir(path.dirname(filePath), { recursive: true })
	await writeFile(filePath, data)
}

export async function readWorksheetFile(key: string) {
	const store = getWorksheetStore()

	if (store) {
		const data = await store.get(key)
		return data ? Buffer.from(data) : null
	}

	const filePath = resolveLocalStoragePath(key)

	try {
		return await readFile(filePath)
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
			return null
		}

		throw error
	}
}

export async function deleteWorksheetFile(key: string) {
	const store = getWorksheetStore()

	if (store) {
		await store.delete(key)
		return
	}

	const filePath = resolveLocalStoragePath(key)

	try {
		await rm(filePath, {
			force: true,
			maxRetries: 3,
			retryDelay: 100
		})
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
			throw error
		}
	}
}
