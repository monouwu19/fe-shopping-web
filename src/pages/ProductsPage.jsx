import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import '../styles/products.css'
import { products } from '../data/products'

export default function ProductsPage() {
  return (
    <div className="products-page">
      <SiteHeader />

      <section className="products">
        <div className="container products-layout">
          <aside className="filter">
            <div className="filter-header">☰ <strong>Bộ lọc</strong></div>
            <div className="filter-block">
              <h4>Loại sản phẩm</h4>
              {[
                ['iPhone', 8, true],
                ['iPad', 6, false],
                ['Mac', 5, false],
                ['Phụ kiện', 12, false],
              ].map(([name, count, active]) => (
                <div className={`filter-item ${active ? 'active' : ''}`} key={name}>
                  <div className="icon-box"></div>
                  <span className="name">{name}</span>
                  <span className="count">{count}</span>
                </div>
              ))}
            </div>
            <div className="filter-block"><h4>Màu sắc</h4></div>
            <div className="filter-block toggle"><span>Chỉ hiển thị còn hàng</span><input type="checkbox" /></div>
          </aside>

          <div className="product-area">
            <div className="product-top"><div></div><div className="sort">Sắp xếp theo: <strong>Nổi bật</strong></div></div>
            <div className="product-grid">
              {products.map((product) => (
                <Link className="product-card" to={`/products/${product.slug}`} key={product.slug}>
                  {product.badge && <span className="badge">{product.badge}</span>}
                  <img src={product.image} alt={product.name} />
                  <p className="category">{product.category}</p>
                  <h3>{product.name}</h3>
                  <div className="price"><span className="new">{product.price}</span></div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-grid">
          <div><strong>Synex</strong><p>Apple Authorized Reseller</p></div>
          <div><h4>Liên kết</h4><Link to="/products">Sản phẩm</Link><a href="#">Blog</a><Link to="/contact">Liên hệ</Link></div>
          <div><h4>Liên hệ</h4><p>Hotline: 1900 xxxx</p><p>Email: info@synexvn</p></div>
        </div>
      </footer>
    </div>
  )
}
