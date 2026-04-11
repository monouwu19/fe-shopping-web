import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import SiteHeader from '../components/SiteHeader'
import '../styles/products.css'
import { apiRequest, formatCurrency, normalizeProducts } from '../services/api'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError('')
        const payload = await apiRequest('/api/products')
        setProducts(normalizeProducts(payload))
      } catch (err) {
        setError(err.message || 'Không tải được danh sách sản phẩm.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const categories = useMemo(() => {
    const counts = products.reduce((accumulator, product) => {
      accumulator[product.category] = (accumulator[product.category] || 0) + 1
      return accumulator
    }, {})

    return Object.entries(counts)
  }, [products])

  return (
    <div className="products-page">
      <SiteHeader />

      <section className="products">
        <div className="container products-layout">
          <aside className="filter">
            <div className="filter-header">☰ <strong>Bộ lọc</strong></div>
            <div className="filter-block">
              <h4>Loại sản phẩm</h4>
              {categories.length > 0 ? categories.map(([name, count], index) => (
                <div className={`filter-item ${index === 0 ? 'active' : ''}`} key={name}>
                  <div className="icon-box"></div>
                  <span className="name">{name}</span>
                  <span className="count">{count}</span>
                </div>
              )) : <p>Đang đồng bộ danh mục...</p>}
            </div>
            <div className="filter-block"><h4>Màu sắc</h4></div>
            <div className="filter-block toggle"><span>Chỉ hiển thị còn hàng</span><input type="checkbox" disabled /></div>
          </aside>

          <div className="product-area">
            <div className="product-top"><div></div><div className="sort">Nguồn dữ liệu: <strong>API local 8080</strong></div></div>

            {loading && <p>Đang tải sản phẩm từ backend...</p>}
            {error && <p>{error}</p>}

            {!loading && !error && (
              <div className="product-grid">
                {products.map((product) => (
                  <Link className="product-card" to={`/products/${product.slug}`} key={product.slug}>
                    {product.badge && <span className="badge">{product.badge}</span>}
                    <img src={product.image} alt={product.name} />
                    <p className="category">{product.category}</p>
                    <h3>{product.name}</h3>
                    <div className="price"><span className="new">{formatCurrency(product.price)}</span></div>
                  </Link>
                ))}
              </div>
            )}
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
