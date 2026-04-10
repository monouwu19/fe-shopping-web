import { useState } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import '../styles/checkout.css'

export default function CheckoutPage() {
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', region: 'TP. Hồ Chí Minh', address: '', note: '',
    delivery: 'home', payment: 'bank', needVat: false, company: '', taxCode: ''
  })

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    alert(`Xác nhận thanh toán thành công\n\nNgười nhận: ${form.fullName || 'Chưa nhập'}\nSố điện thoại: ${form.phone || 'Chưa nhập'}\nPhương thức thanh toán: ${form.payment}`)
  }

  return (
    <div className="checkout-page-scope">
      <SiteHeader />

      <main className="checkout-page">
        <div className="container checkout-layout">
          <section className="checkout-main">
            <div className="section-head"><div><h2>Thông tin thanh toán</h2></div><div className="secure-pill">Bảo mật SSL · Xác thực đơn hàng</div></div>
            <form className="checkout-form" onSubmit={handleSubmit}>
              <div className="form-block">
                <div className="block-header"><h3>Thông tin người nhận</h3><p>Điền chính xác để đội ngũ Synex xác nhận và giao hàng nhanh hơn.</p></div>
                <div className="form-grid two-col">
                  <label><span>Họ và tên</span><input name="fullName" type="text" placeholder="Nguyễn Văn A" value={form.fullName} onChange={handleChange} /></label>
                  <label><span>Số điện thoại</span><input name="phone" type="tel" placeholder="0901 234 567" value={form.phone} onChange={handleChange} /></label>
                </div>
                <div className="form-grid two-col">
                  <label><span>Email</span><input name="email" type="email" placeholder="ban@email.com" value={form.email} onChange={handleChange} /></label>
                  <label><span>Khu vực</span><select name="region" value={form.region} onChange={handleChange}><option>TP. Hồ Chí Minh</option><option>Hà Nội</option><option>Đà Nẵng</option><option>Cần Thơ</option></select></label>
                </div>
                <div className="form-grid"><label><span>Địa chỉ nhận hàng</span><input name="address" type="text" placeholder="Số nhà, tên đường, phường/xã, quận/huyện" value={form.address} onChange={handleChange} /></label></div>
                <div className="form-grid"><label><span>Ghi chú đơn hàng</span><textarea name="note" rows="4" placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..." value={form.note} onChange={handleChange}></textarea></label></div>
              </div>

              <div className="form-block">
                <div className="block-header"><h3>Phương thức giao hàng</h3><p>Chọn hình thức nhận hàng phù hợp với nhu cầu của bạn.</p></div>
                <div className="option-grid">
                  <label className={`option-card ${form.delivery === 'home' ? 'active' : ''}`}><input type="radio" name="delivery" value="home" checked={form.delivery === 'home'} onChange={handleChange} /><div><strong>Giao hàng tận nơi</strong><p>Miễn phí nội thành cho đơn từ 10 triệu. Dự kiến 1 - 3 ngày.</p></div></label>
                  <label className={`option-card ${form.delivery === 'store' ? 'active' : ''}`}><input type="radio" name="delivery" value="store" checked={form.delivery === 'store'} onChange={handleChange} /><div><strong>Nhận tại showroom</strong><p>Giữ hàng tại cửa hàng Synex gần nhất, hỗ trợ kiểm tra máy khi nhận.</p></div></label>
                </div>
              </div>

              <div className="form-block">
                <div className="block-header"><h3>Phương thức thanh toán</h3><p>Lựa chọn cách thanh toán thuận tiện và phù hợp nhất.</p></div>
                <div className="option-grid payment-grid">
                  <label className={`option-card ${form.payment === 'bank' ? 'active' : ''}`}><input type="radio" name="payment" value="bank" checked={form.payment === 'bank'} onChange={handleChange} /><div><strong>Chuyển khoản ngân hàng</strong><p>Nhận xác nhận nhanh, ưu tiên xử lý đơn ngay sau khi thanh toán.</p></div></label>
                  <label className={`option-card ${form.payment === 'cod' ? 'active' : ''}`}><input type="radio" name="payment" value="cod" checked={form.payment === 'cod'} onChange={handleChange} /><div><strong>Thanh toán khi nhận hàng</strong><p>Áp dụng cho đơn đủ điều kiện trong khu vực hỗ trợ COD.</p></div></label>
                  <label className={`option-card ${form.payment === 'card' ? 'active' : ''}`}><input type="radio" name="payment" value="card" checked={form.payment === 'card'} onChange={handleChange} /><div><strong>Thẻ tín dụng / ghi nợ</strong><p>Bảo mật nhiều lớp, hỗ trợ xuất hóa đơn doanh nghiệp.</p></div></label>
                </div>
              </div>

              <div className="form-block invoice-block">
                <div className="block-header"><h3>Thông tin xuất hóa đơn</h3><p>Tùy chọn dành cho khách hàng cá nhân hoặc doanh nghiệp.</p></div>
                <div className="invoice-toggle"><label><input name="needVat" type="checkbox" checked={form.needVat} onChange={handleChange} /> Tôi cần xuất hóa đơn VAT</label></div>
                <div className="form-grid two-col">
                  <label><span>Tên công ty</span><input name="company" type="text" placeholder="Công ty TNHH ABC" value={form.company} onChange={handleChange} /></label>
                  <label><span>Mã số thuế</span><input name="taxCode" type="text" placeholder="0312xxxxxx" value={form.taxCode} onChange={handleChange} /></label>
                </div>
              </div>

              <div className="form-actions"><Link to="/cart" className="outline-btn">Quay lại giỏ hàng</Link><button type="submit" className="btn-dark">Xác nhận thanh toán</button></div>
            </form>
          </section>

          <aside className="order-sidebar">
            <div className="summary-card">
              <div className="summary-head"><h2>Chi tiết đơn hàng</h2></div>
              <div className="summary-items">
                <article className="summary-item"><div className="summary-thumb iphone-gradient">iPhone</div><div><h3>iPhone 15 Pro Max</h3><p>256GB · Titan Tự Nhiên</p><strong>29.990.000đ</strong></div></article>
                <article className="summary-item"><div className="summary-thumb mac-gradient">Mac</div><div><h3>MacBook Air M3</h3><p>13 inch · 8GB · 256GB</p><strong>28.990.000đ</strong></div></article>
                <article className="summary-item compact"><div className="summary-thumb accessory-gradient">AirPods</div><div><h3>AirPods Pro 2</h3><p>USB-C</p><strong>6.790.000đ</strong></div></article>
              </div>
              <div className="summary-line"><span>Tạm tính</span><strong>65.770.000đ</strong></div>
              <div className="summary-line"><span>Giảm giá</span><strong>-1.500.000đ</strong></div>
              <div className="summary-line"><span>Phí giao hàng</span><strong>Miễn phí</strong></div>
              <div className="summary-total"><span>Tổng thanh toán</span><strong>64.270.000đ</strong></div>
              <div className="policy-box"><h3>Cam kết dịch vụ</h3><ul><li>Hàng chính hãng Apple, nguyên seal</li><li>Hỗ trợ kỹ thuật và kích hoạt sau mua</li><li>Xuất hóa đơn đầy đủ theo yêu cầu</li></ul></div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
