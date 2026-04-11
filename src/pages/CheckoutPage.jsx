import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import { apiRequest, formatCurrency, getAuthToken, normalizeCart } from '../services/api'
import '../styles/checkout.css'

function getItemPrice(item) {
  return Number(item?.price || 0)
}

function getItemQuantity(item) {
  return Number(item?.qty || item?.quantity || 1)
}

function getItemName(item) {
  return item?.name || 'Sản phẩm'
}

export default function CheckoutPage() {
  const [cart, setCart] = useState({ id: null, items: [], subtotal: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true)
        setError('')
        setMessage('')

        const token = getAuthToken()
        if (!token) {
          throw new Error('Không tải được giỏ hàng để checkout. Hãy đăng nhập trước.')
        }

        const payload = await apiRequest('/api/cart', { includeAuth: true })
        setCart(normalizeCart(payload))
      } catch (err) {
        setError(err.message || 'Không tải được giỏ hàng để checkout.')
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [])

  const items = cart.items || []

  const subtotal = useMemo(() => {
    if (cart.subtotal) return cart.subtotal
    return items.reduce((sum, item) => sum + getItemPrice(item) * getItemQuantity(item), 0)
  }, [cart.subtotal, items])

  const shippingFee = useMemo(() => (items.length > 0 ? 30000 : 0), [items])
  const total = subtotal + shippingFee

  const handlePlaceOrder = () => {
    setMessage(
      'Backend hiện chưa có API /api/orders để tạo đơn hàng. Trang này đang đọc dữ liệu giỏ hàng đúng bố cục, nhưng chưa thể lưu đơn.'
    )
  }

  return (
    <div className="checkout-page-scope">
      <SiteHeader />

      <section className="page-hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">Thanh toán Synex</p>
            <h1>Thanh toán</h1>
          </div>

          <div className="hero-card">
            <span>Checkout</span>
            <strong>{items.length.toString().padStart(2, '0')} sản phẩm</strong>
            <p>Backend chưa có API tạo đơn hàng, nên hiện chỉ hiển thị dữ liệu.</p>
          </div>
        </div>
      </section>

      <section className="checkout-page">
        <div className="container checkout-layout">
          <div className="checkout-main">
            <div className="section-head">
              <h2>Thông tin đơn hàng</h2>
              <span className="secure-pill">API local 8080</span>
            </div>

            {loading && <p>Đang tải dữ liệu giỏ hàng...</p>}
            {error && <p>{error}</p>}
            {message && <p>{message}</p>}

            {!loading && !error && (
              <div className="checkout-form">
                <div className="form-block">
                  <div className="block-header">
                    <h3>Sản phẩm đã chọn</h3>
                  </div>

                  {items.length === 0 ? (
                    <p>Giỏ hàng đang trống.</p>
                  ) : (
                    <div className="summary-items">
                      {items.map((item, index) => (
                        <article className="summary-item" key={item.id || index}>
                          <div className={`summary-thumb ${item.imageClass || 'iphone-gradient'}`}>
                            {item.imageText || getItemName(item)}
                          </div>
                          <div>
                            <h3>{getItemName(item)}</h3>
                            <p>Số lượng: {getItemQuantity(item)}</p>
                            <strong>
                              {formatCurrency(getItemPrice(item) * getItemQuantity(item))}
                            </strong>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-block">
                  <div className="block-header">
                    <h3>Lưu ý</h3>
                    <p>
                      Backend hiện chưa có endpoint tạo đơn hàng. Khi nào backend thêm
                      <strong> POST /api/orders </strong>
                      thì trang này mới lưu đơn vào database hoàn chỉnh.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside className="summary-card">
            <div className="summary-head">
              <h2>Tóm tắt</h2>
              <p>Dữ liệu tính từ giỏ hàng hiện tại.</p>
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
              className="btn-dark"
              onClick={handlePlaceOrder}
              disabled={items.length === 0}
            >
              Đặt hàng
            </button>

            <Link to="/cart" className="outline-btn">
              Quay lại giỏ hàng
            </Link>

            <div className="policy-box">
              <h3>Trạng thái hiện tại</h3>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}