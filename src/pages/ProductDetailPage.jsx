import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import { getProductBySlug, products } from '../data/products'
import '../styles/product-detail.css'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const product = getProductBySlug(slug)
  const [selectedImage, setSelectedImage] = useState(product?.gallery?.[0] || '')
  const [quantity, setQuantity] = useState(1)

  const relatedProducts = useMemo(() => products.filter((item) => item.slug !== slug).slice(0, 3), [slug])

  if (!product) return <Navigate to="/products" replace />

  return (
    <div className="product-detail-page">
      <SiteHeader />

      <section className="detail-hero">
        <div className="container breadcrumb-row">
          <Link to="/dashboard">Trang chủ</Link>
          <span>/</span>
          <Link to="/products">Sản phẩm</Link>
          <span>/</span>
          <strong>{product.name}</strong>
        </div>
      </section>

      <main className="detail-main">
        <div className="container detail-layout">
          <section className="product-gallery-card">
            <div className="main-image-wrap">
              {product.badge && <span className="badge">{product.badge}</span>}
              <img src={selectedImage} alt={product.name} className="main-image" />
            </div>
            <div className="thumb-grid">
              {product.gallery.map((image, index) => (
                <button
                  type="button"
                  key={`${product.slug}-${index}`}
                  className={`thumb ${selectedImage === image ? 'active' : ''}`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          </section>

          <section className="product-summary-card">
            <p className="category">{product.category}</p>
            <h1>{product.name}</h1>
            <p className="short-desc">{product.shortDescription}</p>

            <div className="price-row">
              <strong>{product.price}</strong>
              <span>{product.oldPrice}</span>
            </div>

            <div className="status-row">
              <div><span>Tình trạng</span><strong>{product.status}</strong></div>
              <div><span>Mã sản phẩm</span><strong>{product.sku}</strong></div>
            </div>

            <div className="option-block">
              <span>Màu sắc</span>
              <div className="chip-row">
                {product.colors.map((color) => <button type="button" key={color} className="chip">{color}</button>)}
              </div>
            </div>

            <div className="option-block">
              <span>Số lượng</span>
              <div className="qty-control">
                <button type="button" onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}>-</button>
                <strong>{quantity}</strong>
                <button type="button" onClick={() => setQuantity((qty) => qty + 1)}>+</button>
              </div>
            </div>

            <div className="cta-row">
              <Link className="btn-dark" to="/cart">Thêm vào giỏ</Link>
              <Link className="btn-light" to="/checkout">Mua ngay</Link>
            </div>

            <div className="highlights-box">
              <h3>Điểm nổi bật</h3>
              <ul>
                {product.highlights.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </section>
        </div>
      </main>

      <section className="detail-info">
        <div className="container info-grid">
          <article className="info-card">
            <h2>Mô tả sản phẩm</h2>
            <p>{product.description}</p>
          </article>
          <article className="info-card">
            <h2>Thông số kỹ thuật</h2>
            <div className="spec-list">
              {product.specs.map(([label, value]) => (
                <div className="spec-row" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="related-section">
        <div className="container">
          <div className="section-head">
            <h2>Sản phẩm liên quan</h2>
            <Link to="/products">Xem tất cả</Link>
          </div>
          <div className="related-grid">
            {relatedProducts.map((item) => (
              <article className="related-card" key={item.slug}>
                <img src={item.image} alt={item.name} />
                <p>{item.category}</p>
                <h3>{item.name}</h3>
                <strong>{item.price}</strong>
                <Link to={`/products/${item.slug}`}>Xem sản phẩm</Link>
              </article>
            ))}
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
