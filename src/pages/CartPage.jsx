import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import { apiRequest, ensureCart, formatCurrency, getAuthToken, normalizeCart } from '../services/api'
import '../styles/cart.css'

function getItemId(item, index) {
  return item?.id ?? item?.productId ?? index
}

function getProductId(item) {
  return item?.productId ?? item?.id ?? null
}

function getItemName(item) {
  return item?.name || 'Sản phẩm'
}

function getItemMeta(item) {
  return item?.meta || 'Sản phẩm từ hệ thống'
}

function getItemPrice(item) {
  return Number(item?.price || 0)
}

function getItemQuantity(item) {
  return Number(item?.qty || item?.quantity || 1)
}

export default function CartPage() {
  const navigate = useNavigate()
  const [cart, setCart] = useState({ id: null, items: [], subtotal: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const loadCart = async () => {
    try {
      setLoading(true)
      setError('')

      const token = getAuthToken()
      if (!token) {
        throw new Error('Không tải được giỏ hàng. Hãy đăng nhập trước.')
      }

      const payload = await apiRequest('/api/cart', { includeAuth: true })
      const normalized = normalizeCart(payload)
      setCart(normalized)
    } catch (err) {
      setError(err.message || 'Không tải được giỏ hàng.')
      setCart({ id: null, items: [], subtotal: 0, total: 0 })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCart()
  }, [])

  const items = cart.items || []

  const subtotal = useMemo(() => {
    if (cart.subtotal) return cart.subtotal
    return items.reduce((sum, item) => sum + getItemPrice(item) * getItemQuantity(item), 0)
  }, [cart.subtotal, items])

  const shippingFee = useMemo(() => (items.length > 0 ? 30000 : 0), [items])
  const total = useMemo(() => subtotal + shippingFee, [subtotal, shippingFee])

  const handleQuantityChange = async (item, nextQuantity) => {
    try {
      setMessage('')
      setError('')

      if (nextQuantity < 1) return

      const productId = getProductId(item)
      if (!productId) {
        setMessage('Không xác định được sản phẩm để cập nhật.')
        return
      }

      const cartId = await ensureCart()
      setUpdatingId(getItemId(item))

      await apiRequest(
        `/api/cart/add?cartId=${Number(cartId)}&productId=${productId}&quantity=${nextQuantity}`,
        {
          method: 'POST',
          includeAuth: true,
        }
      )

      setMessage('Đã cập nhật số lượng.')
      await loadCart()
    } catch (err) {
      setError(err.message || 'Không cập nhật được số lượng.')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleRemove = async (item) => {
    try {
      setMessage('')
      setError('')

      const productId = getProductId(item)
      if (!productId) {
        setMessage('Không xác định được sản phẩm để xoá.')
        return
      }

      const cartId = await ensureCart()
      setUpdatingId(getItemId(item))

      await apiRequest(
        `/api/cart/add?cartId=${Number(cartId)}&productId=${productId}&quantity=0`,
        {
          method: 'POST',
          includeAuth: true,
        }
      )

      setMessage('Đã cập nhật giỏ hàng.')
      await loadCart()
    } catch (err) {
      setError(err.message || 'Backend chưa hỗ trợ xoá sản phẩm riêng.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="cart-page-scope">
      <SiteHeader />

      <section className="page-hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">Giỏ hàng Synex</p>
            <h1>Giỏ hàng của bạn</h1>
          </div>

          <div className="hero-card">
            <span>Giỏ hàng</span>
            <strong>{items.length.toString().padStart(2, '0')} sản phẩm</strong>
            <p>Cần đăng nhập hợp lệ để tải và cập nhật dữ liệu giỏ hàng.</p>
          </div>
        </div>
      </section>

      <section className="cart-page">
        <div className="container cart-layout">
          <div className="cart-main">
            <div className="section-head">
              <h2>Sản phẩm trong giỏ</h2>
              <Link className="ghost-btn" to="/products">Tiếp tục mua sắm</Link>
            </div>

            {loading && <p>Đang tải giỏ hàng...</p>}
            {error && <p>{error}</p>}
            {message && <p>{message}</p>}

            {!loading && !error && items.length === 0 && (
              <p>Giỏ hàng đang trống.</p>
            )}

            {!loading && !error && items.length > 0 && (
              <div className="cart-list">
                {items.map((item, index) => (
                  <article className="cart-item" key={getItemId(item, index)}>
                    <div className={`item-image ${item.imageClass || 'iphone-gradient'}`}>
                      {item.imageText || getItemName(item)}
                    </div>

                    <div className="item-content">
                      <div className="item-top">
                        <div>
                          <p className="item-category">Synex</p>
                          <h3>{getItemName(item)}</h3>
                          <p className="item-meta">{getItemMeta(item)}</p>
                        </div>

                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => handleRemove(item)}
                          disabled={updatingId === getItemId(item, index)}
                        >
                          Xoá
                        </button>
                      </div>

                      <div className="item-bottom">
                        <div className="qty-box">
                          <span>Số lượng</span>
                          <div className="qty-control">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item, getItemQuantity(item) - 1)}
                              disabled={updatingId === getItemId(item, index)}
                            >
                              -
                            </button>
                            <strong>{getItemQuantity(item)}</strong>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item, getItemQuantity(item) + 1)}
                              disabled={updatingId === getItemId(item, index)}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="price-box">
                          <span>Tạm tính</span>
                          <strong>{formatCurrency(getItemPrice(item) * getItemQuantity(item))}</strong>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside className="summary-card">
            <div className="summary-head">
              <h2>Tóm tắt đơn hàng</h2>
            </div>

            <div className="summary-line">
              <span>Tạm tính</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>

            <div className="summary-line">
              <span>Phí vận chuyển</span>
              <strong>{formatCurrency(shippingFee)}</strong>
            </div>

            <div className="summary-total">
              <span>Tổng cộng</span>
              <strong>{formatCurrency(total)}</strong>
            </div>

            <button
              type="button"
              className="btn-dark full"
              onClick={() => navigate('/checkout')}
              disabled={items.length === 0}
            >
              Tiến hành thanh toán
            </button>

            <Link to="/products" className="outline-btn full">
              Tiếp tục mua sắm
            </Link>
          </aside>
        </div>
      </section>
    </div>
  )
}