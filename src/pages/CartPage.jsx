import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import '../styles/cart.css'

const initialItems = [
  { id: 1, type: 'iphone-gradient', short: 'iPhone', name: 'iPhone 15 Pro Max 256GB', meta: 'Titan Tự Nhiên · Bảo hành chính hãng 12 tháng', price: 29990000, qty: 1 },
  { id: 2, type: 'mac-gradient', short: 'Mac', name: 'MacBook Air M2 13 inch', meta: '8GB RAM · 256GB SSD · Midnight', price: 28990000, qty: 1 },
  { id: 3, type: 'accessory-gradient', short: 'AirPods', name: 'AirPods Pro 2 USB-C', meta: 'Chống ồn chủ động · Kết nối hệ sinh thái Apple', price: 6790000, qty: 1 },
]

const formatCurrency = (value) => `${value.toLocaleString('vi-VN')}đ`

export default function CartPage() {
  const [items, setItems] = useState(initialItems)
  const [coupon, setCoupon] = useState('')

  const updateQty = (id, amount) => setItems((prev) => prev.map((item) => item.id === id ? { ...item, qty: Math.max(1, item.qty + amount) } : item))
  const removeItem = (id) => setItems((prev) => prev.filter((item) => item.id !== id))

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.qty, 0), [items])
  const discount = subtotal > 0 ? 1500000 : 0
  const total = Math.max(0, subtotal - discount)

  return (
    <div className="cart-page-scope">
      <SiteHeader />

      <section className="page-hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <h1>Giỏ hàng của bạn</h1>
            <p>Kiểm tra nhanh các sản phẩm Apple đã chọn, cập nhật số lượng, áp dụng ưu đãi và chuẩn bị cho bước thanh toán với trải nghiệm rõ ràng, hiện đại và nhất quán với toàn bộ hệ thống Synex.</p>
          </div>
        </div>
      </section>

      <main className="cart-page">
        <div className="container cart-layout">
          <section className="cart-main">
            <div className="section-head"><div><h2>Danh sách sản phẩm</h2></div><button className="ghost-btn" type="button">Cập nhật giỏ hàng</button></div>
            <div className="cart-list">
              {items.map((item) => (
                <article className="cart-item" key={item.id}>
                  <div className={`item-image ${item.type}`}><span>{item.short}</span></div>
                  <div className="item-content">
                    <div className="item-top">
                      <div><h3>{item.name}</h3><p className="item-meta">{item.meta}</p></div>
                      <button className="remove-btn" type="button" onClick={() => removeItem(item.id)}>Xóa</button>
                    </div>
                    <div className="item-bottom">
                      <div className="qty-box"><span>Số lượng</span><div className="qty-control"><button type="button" onClick={() => updateQty(item.id, -1)}>-</button><strong>{item.qty}</strong><button type="button" onClick={() => updateQty(item.id, 1)}>+</button></div></div>
                      <div className="price-box"><span>Đơn giá</span><strong>{formatCurrency(item.price * item.qty)}</strong></div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="cart-sidebar">
            <div className="summary-card">
              <div className="summary-head"><h2>Tóm tắt đơn hàng</h2></div>
              <div className="summary-line"><span>Tạm tính</span><strong>{formatCurrency(subtotal)}</strong></div>
              <div className="summary-line"><span>Giảm giá thành viên</span><strong>-{formatCurrency(discount)}</strong></div>
              <div className="summary-line"><span>Vận chuyển</span><strong>Miễn phí</strong></div>
              <div className="coupon-box">
                <label htmlFor="coupon">Mã ưu đãi</label>
                <div className="coupon-row"><input id="coupon" type="text" placeholder="Nhập mã giảm giá" value={coupon} onChange={(e) => setCoupon(e.target.value)} /><button type="button">Áp dụng</button></div>
              </div>
              <div className="summary-total"><span>Tổng thanh toán</span><strong>{formatCurrency(total)}</strong></div>
              <Link to="/checkout" className="btn-dark full">Tiến hành thanh toán</Link>
              <Link to="/products" className="outline-btn full">Chọn thêm sản phẩm</Link>
            </div>
          </aside>
        </div>
      </main>

      <section className="faq-section">
        <div className="container">
          <div className="faq-header"><h2>Thông tin hữu ích trước khi thanh toán</h2></div>
          <div className="faq-grid">
            <article className="faq-card"><h3>Giỏ hàng có được lưu lại không?</h3><p>Có. Hệ thống sẽ lưu danh sách sản phẩm tạm thời để bạn tiếp tục mua sắm trong phiên hiện tại và có thể mở rộng với localStorage ở bước tiếp theo.</p></article>
            <article className="faq-card"><h3>Tôi có thể thay đổi số lượng ở đây không?</h3><p>Có. Khu vực điều chỉnh số lượng hiện đã hoạt động bằng React state, thuận tiện để nâng cấp thành tính năng đồng bộ server sau này.</p></article>
            <article className="faq-card"><h3>Giỏ hàng đã sẵn sàng cho trang checkout chưa?</h3><p>Rồi. Bố cục bên phải đã chia rõ phần tổng tiền, mã ưu đãi và nút chuyển sang thanh toán, rất thuận lợi để nối flow giỏ hàng sang checkout.</p></article>
          </div>
        </div>
      </section>
    </div>
  )
}
