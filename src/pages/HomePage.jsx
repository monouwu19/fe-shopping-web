import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import '../styles/dashboard.css'
import hero from '../assets/images/hero.jpg'
import about from '../assets/images/about.jpg'
import cat1 from '../assets/images/cat1.png'
import cat2 from '../assets/images/cat2.png'
import cat3 from '../assets/images/cat3.png'
import cat4 from '../assets/images/cat4.png'
import project1 from '../assets/images/project1.jpg'
import project2 from '../assets/images/project2.jpg'
import project3 from '../assets/images/project3.jpg'

export default function HomePage() {
  return (
    <div className="dashboard-page">
      <SiteHeader />

      <section className="hero" style={{ backgroundImage: `url(${hero})` }}>
        <div className="hero-content">
          <h1>Discover what&apos;s new</h1>
          <p>Giải pháp đơn giản cho mọi công việc của bạn</p>
          <Link to="/products" className="btn-dark">View all</Link>
        </div>
      </section>

      <section className="categories">
        <div className="container">
          <div className="grid">
            {[['iPhone', cat1], ['iPad', cat2], ['MacBook', cat3], ['Phụ kiện', cat4]].map(([name, image]) => (
              <div className="card" key={name}>
                <div className="img-box"><img src={image} alt={name} /></div>
                <h3>{name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about">
        <div className="container about-inner">
          <div className="about-text">
            <span className="tag">Apple at Work</span>
            <h2>Phối hợp nhịp nhàng cho mọi đội ngũ</h2>
            <p>Apple mang đến hệ sinh thái thiết bị mạnh mẽ, giúp cá nhân và doanh nghiệp làm việc hiệu quả, bảo mật và linh hoạt hơn mỗi ngày.</p>
            <Link to="/contact" className="btn-dark">Tìm hiểu thêm</Link>
          </div>
          <div className="about-image"><img src={about} alt="Apple at Work" /></div>
        </div>
      </section>

      <section className="projects">
        <div className="container">
          <h2>What&apos;s new</h2>
          <div className="project-grid">
            <img src={project1} alt="Project 1" />
            <img src={project2} alt="Project 2" />
            <img src={project3} alt="Project 3" />
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-grid">
          <div><strong>Synex</strong><p>Apple Authorized Reseller</p></div>
          <div><h4>Liên kết</h4><Link to="/products">Sản phẩm</Link><Link to="/contact">Liên hệ</Link></div>
          <div><h4>Liên hệ</h4><p>Hotline: 1900 xxxx</p><p>Email: info@synexvn</p></div>
        </div>
      </footer>
    </div>
  )
}
