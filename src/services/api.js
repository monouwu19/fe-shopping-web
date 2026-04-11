const API_BASE_URL = 'http://localhost:8080'

const TOKEN_KEYS = ['token', 'accessToken', 'authToken', 'jwt', 'jwtToken']
const CART_ID_KEY = 'synex_cart_id'

export const getApiBaseUrl = () => API_BASE_URL

export function getAuthToken() {
  const rawAuth = localStorage.getItem('synex_auth')
  if (rawAuth) {
    try {
      const parsed = JSON.parse(rawAuth)
      if (parsed?.token) return parsed.token
    } catch {}
  }

  for (const key of TOKEN_KEYS) {
    const value = localStorage.getItem(key)
    if (value) return value
  }

  return ''
}

export function getStoredCartId() {
  return localStorage.getItem(CART_ID_KEY)
}

export function setStoredCartId(cartId) {
  if (cartId !== undefined && cartId !== null) {
    localStorage.setItem(CART_ID_KEY, String(cartId))
  }
}

export function clearStoredCartId() {
  localStorage.removeItem(CART_ID_KEY)
}

function buildHeaders(customHeaders = {}, includeAuth = false) {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  }

  if (includeAuth) {
    const token = getAuthToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  return headers
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      payload?.details ||
      (typeof payload === 'string' ? payload : `API error ${response.status}`)
    throw new Error(message)
  }

  return payload
}

export async function apiRequest(path, options = {}) {
  const { includeAuth = false, headers, ...restOptions } = options
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: buildHeaders(headers, includeAuth),
  })

  return parseResponse(response)
}

export function extractData(payload) {
  if (Array.isArray(payload)) return payload
  return payload?.data ?? payload?.result ?? payload?.content ?? payload?.items ?? payload
}

export function toSlug(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function formatCurrency(value) {
  const numericValue = Number(value || 0)
  return `${numericValue.toLocaleString('vi-VN')}đ`
}

export function normalizeProduct(rawProduct, fallbackIndex = 0) {
  const id = rawProduct?.id ?? rawProduct?.productId ?? rawProduct?.product_id ?? fallbackIndex + 1
  const name = rawProduct?.name ?? rawProduct?.productName ?? rawProduct?.title ?? `Sản phẩm ${id}`
  const categoryName =
    rawProduct?.category?.name ??
    rawProduct?.categoryName ??
    rawProduct?.category ??
    'Sản phẩm'

  const image =
    rawProduct?.imageUrl ??
    rawProduct?.thumbnail ??
    rawProduct?.image ??
    rawProduct?.image_url ??
    'https://via.placeholder.com/600x600?text=Synex'

  const price = Number(rawProduct?.price ?? rawProduct?.salePrice ?? rawProduct?.unitPrice ?? 0)
  const oldPrice = rawProduct?.oldPrice ?? rawProduct?.originalPrice ?? rawProduct?.listPrice ?? null
  const gallery = Array.isArray(rawProduct?.gallery) && rawProduct.gallery.length > 0 ? rawProduct.gallery : [image]

  return {
    id,
    slug: `${id}-${toSlug(name)}`,
    badge: rawProduct?.badge ?? (rawProduct?.featured ? 'Hot' : ''),
    image,
    gallery,
    category: categoryName,
    name,
    price,
    oldPrice: oldPrice ? Number(oldPrice) : null,
    sku: rawProduct?.sku ?? rawProduct?.code ?? `SP-${id}`,
    status: rawProduct?.status ?? (rawProduct?.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'),
    shortDescription: rawProduct?.shortDescription ?? rawProduct?.summary ?? rawProduct?.description ?? '',
    description: rawProduct?.description ?? rawProduct?.shortDescription ?? '',
    colors: rawProduct?.colors ?? [],
    highlights: rawProduct?.highlights ?? [],
    specs: rawProduct?.specs ?? [],
    raw: rawProduct,
  }
}

export function normalizeProducts(payload) {
  const data = extractData(payload)
  const list = Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : []
  return list.map(normalizeProduct)
}

export function getProductIdFromSlug(slug = '') {
  const [idPart] = String(slug).split('-')
  const parsedId = Number(idPart)
  return Number.isNaN(parsedId) ? null : parsedId
}

export async function ensureCart() {
  const existingCartId = getStoredCartId()
  if (existingCartId) return existingCartId

  const payload = await apiRequest('/api/cart', {
    method: 'POST',
    includeAuth: true,
    body: JSON.stringify({}),
  })

  const cartId =
    payload?.id ??
    payload?.cartId ??
    payload?.data?.id ??
    payload?.data?.cartId ??
    payload?.result?.id ??
    payload?.result?.cartId

  if (!cartId) {
    throw new Error('Không tạo được giỏ hàng từ backend.')
  }

  setStoredCartId(cartId)
  return String(cartId)
}

export function normalizeCartItem(rawItem, index = 0) {
  const product = rawItem?.product ?? rawItem?.productResponse ?? rawItem?.item ?? {}
  const productName = product?.name ?? rawItem?.productName ?? `Sản phẩm ${index + 1}`
  const price = Number(rawItem?.price ?? product?.price ?? 0)
  const quantity = Number(rawItem?.quantity ?? rawItem?.qty ?? 1)
  const itemId = rawItem?.id ?? rawItem?.cartItemId ?? product?.id ?? index + 1

  return {
    id: itemId,
    productId: product?.id ?? rawItem?.productId,
    name: productName,
    meta: product?.shortDescription ?? product?.category?.name ?? rawItem?.variant ?? 'Sản phẩm từ hệ thống',
    price,
    qty: quantity,
    imageText: productName.split(' ')[0],
    imageClass: 'iphone-gradient',
  }
}

export function normalizeCart(payload) {
  const data = extractData(payload) || {}
  const rawItems = data?.items ?? data?.cartItems ?? data?.details ?? []
  const items = Array.isArray(rawItems) ? rawItems.map(normalizeCartItem) : []
  const subtotal = Number(data?.subtotal ?? items.reduce((sum, item) => sum + item.price * item.qty, 0))
  const total = Number(data?.total ?? data?.grandTotal ?? subtotal)

  return {
    id: data?.id ?? data?.cartId,
    items,
    subtotal,
    total,
  }
}
