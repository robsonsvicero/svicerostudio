const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const TOKEN_KEY = 'svicero_admin_token'

const authListeners = new Set()

const getToken = () => localStorage.getItem(TOKEN_KEY)

const setToken = (token) => {
	if (token) {
		localStorage.setItem(TOKEN_KEY, token)
	} else {
		localStorage.removeItem(TOKEN_KEY)
	}
}

const notifyAuthChange = (event, session) => {
	authListeners.forEach((callback) => {
		try {
			callback(event, session)
		} catch {
			// Ignorar falhas de callbacks externos
		}
	})
}

const makeHeaders = (isJson = true) => {
	const headers = {}
	if (isJson) {
		headers['Content-Type'] = 'application/json'
	}

	const token = getToken()
	if (token) {
		headers.Authorization = `Bearer ${token}`
	}

	return headers
}

const normalizeError = (errorMessage, fallback = 'Erro na requisição') => ({
	message: errorMessage || fallback,
})

const executeDbQuery = async (table, body) => {
	try {
		const response = await fetch(`${API_URL}/api/db/${table}/query`, {
			method: 'POST',
			headers: makeHeaders(true),
			body: JSON.stringify(body),
		})

		const payload = await response.json().catch(() => ({}))

		if (!response.ok) {
			return {
				data: null,
				error: normalizeError(payload?.error, `Erro ao consultar ${table}`),
			}
		}

		return {
			data: payload?.data ?? null,
			error: null,
		}
	} catch (error) {
		return {
			data: null,
			error: normalizeError(error?.message, `Falha de conexão com API (${table})`),
		}
	}
}

class QueryBuilder {
	constructor(table) {
		this.table = table
		this.operation = 'select'
		this.selectFields = '*'
		this.filters = []
		this.orderByClause = null
		this.limitValue = null
		this.singleResult = false
		this.payload = null
		this.returning = false
	}

	select(fields = '*') {
		this.selectFields = fields
		if (this.operation !== 'select') {
			this.returning = true
		}
		return this
	}

	eq(column, value) {
		this.filters.push({ column, operator: 'eq', value })
		return this
	}

	ilike(column, value) {
		this.filters.push({ column, operator: 'ilike', value })
		return this
	}

	order(column, options = {}) {
		this.orderByClause = {
			column,
			ascending: options?.ascending !== false,
		}
		return this
	}

	limit(value) {
		this.limitValue = value
		return this
	}

	single() {
		this.singleResult = true
		return this
	}

	insert(values) {
		this.operation = 'insert'
		this.payload = values
		return this
	}

	update(values) {
		this.operation = 'update'
		this.payload = values
		return this
	}

	delete() {
		this.operation = 'delete'
		this.payload = null
		return this
	}

	async execute() {
		return executeDbQuery(this.table, {
			operation: this.operation,
			select: this.selectFields,
			filters: this.filters,
			orderBy: this.orderByClause,
			limit: this.limitValue,
			payload: this.payload,
			single: this.singleResult,
			returning: this.returning,
		})
	}

	then(resolve, reject) {
		return this.execute().then(resolve, reject)
	}
}

const storage = {
	from(bucket) {
		return {
			async upload(path, file) {
				try {
					const formData = new FormData()
					formData.append('bucket', bucket)
					formData.append('key', path)
					formData.append('file', file)

					const response = await fetch(`${API_URL}/api/storage/upload`, {
						method: 'POST',
						headers: makeHeaders(false),
						body: formData,
					})

					const payload = await response.json().catch(() => ({}))

					if (!response.ok) {
						return {
							data: null,
							error: normalizeError(payload?.error, 'Erro ao fazer upload'),
						}
					}

					return {
						data: payload?.data ?? { path },
						error: null,
					}
				} catch (error) {
					return {
						data: null,
						error: normalizeError(error?.message, 'Falha no upload'),
					}
				}
			},
			getPublicUrl(path) {
				return {
					data: {
						publicUrl: `${API_URL}/api/storage/public/${encodeURIComponent(bucket)}/${encodeURIComponent(path)}`,
					},
				}
			},
		}
	},
}

const auth = {
	async getSession() {
		const token = getToken()
		if (!token) {
			return { data: { session: null }, error: null }
		}

		try {
			const response = await fetch(`${API_URL}/api/auth/session`, {
				method: 'GET',
				headers: makeHeaders(true),
			})

			if (!response.ok) {
				setToken(null)
				return { data: { session: null }, error: null }
			}

			const payload = await response.json()
			return {
				data: {
					session: {
						user: payload.user,
						access_token: token,
					},
				},
				error: null,
			}
		} catch {
			return { data: { session: null }, error: null }
		}
	},
	onAuthStateChange(callback) {
		authListeners.add(callback)

		return {
			data: {
				subscription: {
					unsubscribe: () => authListeners.delete(callback),
				},
			},
		}
	},
	async signInWithPassword({ email, password }) {
		try {
			const response = await fetch(`${API_URL}/api/auth/login`, {
				method: 'POST',
				headers: makeHeaders(true),
				body: JSON.stringify({ email, password }),
			})

			const payload = await response.json().catch(() => ({}))

			if (!response.ok) {
				return {
					data: null,
					error: normalizeError(payload?.error, 'Falha no login'),
				}
			}

			setToken(payload.token)
			const session = {
				user: payload.user,
				access_token: payload.token,
			}

			notifyAuthChange('SIGNED_IN', session)

			return {
				data: { session, user: payload.user },
				error: null,
			}
		} catch (error) {
			return {
				data: null,
				error: normalizeError(error?.message, 'Erro de conexão no login'),
			}
		}
	},
	async signOut() {
		setToken(null)
		notifyAuthChange('SIGNED_OUT', null)
		return { error: null }
	},
}

export const supabase = {
	from(table) {
		return new QueryBuilder(table)
	},
	storage,
	auth,
}
