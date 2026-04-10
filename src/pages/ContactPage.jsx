import { useState } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import '../styles/contact.css'

export default function ContactPage() {
  const [form, setForm] = useState({ fullname: '', phone: '', email: '', topic: 'Chọn chủ đề', message: '', agree: false })

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    alert(`Đã gửi yêu cầu cho Synex\n\nHọ tên: ${form.fullname}\nSĐT: ${form.phone}\nEmail: ${form.email}\nChủ đề: ${form.topic}`)
  }

  return (
    <div className="contact-page">
      <SiteHeader />

      <main>
        <section className="hero-banner">
          <div className="container hero-inner">
            <div className="hero-copy">
              <h1>Kết nối nhanh với đội ngũ tư vấn Apple chuyên nghiệp</h1>
              <p>Chúng tôi hỗ trợ tư vấn chọn thiết bị Apple, báo giá doanh nghiệp, bảo hành, kỹ thuật và các giải pháp phù hợp cho cá nhân lẫn tổ chức.</p>
              <div className="hero-actions">
                <a href="#contact-form" className="btn-dark">Liên hệ ngay</a>
                <a href="#faq" className="btn-light">Xem câu hỏi thường gặp</a>
              </div>
            </div>
            <div className="hero-card">
              <div className="hero-card-top"><span className="status-dot"></span><p>Đội ngũ phản hồi trong vòng 30 phút làm việc</p></div>
              <ul className="hero-points">
                <li>Tư vấn mua iPhone, iPad, MacBook, phụ kiện</li>
                <li>Hỗ trợ đơn hàng doanh nghiệp và dự án</li>
                <li>Tiếp nhận bảo hành và hỗ trợ kỹ thuật</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="contact-section">
          <div className="container contact-grid">
            <div className="contact-content">
              <div className="section-heading"><h2>Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ</h2></div>
              <div className="info-list">
                <article className="info-card"><h3>Hotline bán hàng</h3><p>1900 6868</p><span>Tư vấn sản phẩm, báo giá, chương trình ưu đãi</span></article>
                <article className="info-card"><h3>Email hỗ trợ</h3><p>support@synex.vn</p><span>Phản hồi yêu cầu, hỗ trợ đơn hàng và chăm sóc khách hàng</span></article>
                <article className="info-card"><h3>Địa chỉ showroom</h3><p>12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</p><span>Mở cửa 08:00 - 21:00 tất cả các ngày trong tuần</span></article>
              </div>
            </div>

            <div className="form-shell" id="contact-form">
              <div className="form-header"><h2>Gửi yêu cầu cho Synex</h2><p>Điền thông tin để đội ngũ của chúng tôi liên hệ lại sớm nhất.</p></div>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row two-col">
                  <div className="field"><label htmlFor="fullname">Họ và tên</label><input name="fullname" type="text" id="fullname" placeholder="Nhập họ và tên" value={form.fullname} onChange={handleChange} /></div>
                  <div className="field"><label htmlFor="phone">Số điện thoại</label><input name="phone" type="tel" id="phone" placeholder="Nhập số điện thoại" value={form.phone} onChange={handleChange} /></div>
                </div>
                <div className="form-row two-col">
                  <div className="field"><label htmlFor="email">Email</label><input name="email" type="email" id="email" placeholder="example@email.com" value={form.email} onChange={handleChange} /></div>
                  <div className="field"><label htmlFor="topic">Chủ đề</label><select name="topic" id="topic" value={form.topic} onChange={handleChange}><option>Chọn chủ đề</option><option>Tư vấn sản phẩm</option><option>Báo giá doanh nghiệp</option><option>Bảo hành - kỹ thuật</option><option>Khác</option></select></div>
                </div>
                <div className="form-row"><div className="field"><label htmlFor="message">Nội dung liên hệ</label><textarea name="message" id="message" rows="6" placeholder="Mô tả nhu cầu, thiết bị quan tâm hoặc vấn đề cần hỗ trợ..." value={form.message} onChange={handleChange}></textarea></div></div>
                <div className="form-row agreement-row"><label className="checkbox-wrap"><input name="agree" type="checkbox" checked={form.agree} onChange={handleChange} /><span>Tôi đồng ý để Synex liên hệ lại dựa trên thông tin đã cung cấp.</span></label></div>
                <div className="form-actions"><button type="submit" className="btn-dark submit-btn">Gửi yêu cầu</button></div>
              </form>
            </div>
          </div>
        </section>

        <section className="faq-section" id="faq">
          <div className="container">
            <div className="section-heading center"><h2>Những câu hỏi khách hàng thường quan tâm</h2></div>
            <div className="faq-grid">
              <details className="faq-item" open><summary>Synex có hỗ trợ tư vấn mua hàng cho doanh nghiệp không?</summary><p>Có. Chúng tôi hỗ trợ báo giá, cấu hình, số lượng lớn và giải pháp triển khai phù hợp theo nhu cầu doanh nghiệp.</p></details>
              <details className="faq-item"><summary>Tôi có thể yêu cầu hỗ trợ bảo hành qua form này không?</summary><p>Có. Bạn chỉ cần chọn chủ đề bảo hành - kỹ thuật và mô tả tình trạng thiết bị, đội ngũ sẽ chủ động liên hệ lại.</p></details>
              <details className="faq-item"><summary>Sau khi gửi form bao lâu tôi sẽ nhận phản hồi?</summary><p>Trong giờ làm việc, chúng tôi thường phản hồi trong khoảng 30 phút đến 2 giờ tùy thời điểm tiếp nhận.</p></details>
              <details className="faq-item"><summary>Tôi có thể để lại số điện thoại để được gọi lại không?</summary><p>Có. Chỉ cần điền số điện thoại trong form, nhân viên tư vấn sẽ gọi lại để hỗ trợ chi tiết hơn.</p></details>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
