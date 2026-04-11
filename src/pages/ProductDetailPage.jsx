import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import '../styles/product-detail.css'
import {
  apiRequest,
  ensureCart,
  formatCurrency,
  getProductIdFromSlug,
  normalizeProduct,
  normalizeProducts,
} from '../services/api'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const productId = getProductIdFromSlug(slug)
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedImage, setSelectedImage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!productId) return

    const loadData = async () => {
      try {
        setLoading(true)
        setError('')

        const [productPayload, productsPayload] = await Promise.all([
          apiRequest(`/api/products/${productId}`),
          apiRequest('/api/products'),
        ])

        const currentProduct = normalizeProduct(productPayload)
        const allProducts = normalizeProducts(productsPayload)

        setProduct(currentProduct)
        setSelectedImage(currentProduct.gallery[0] || currentProduct.image)
        setRelatedProducts(
          allProducts.filter((item) => item.id !== currentProduct.id).slice(0, 3)
        )
      } catch (err) {
        setError(err.message || 'Không tải được chi tiết sản phẩm.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [productId])

  if (!productId) return <Navigate to="/products" replace />

  const handleAddToCart = async () => {
    try {
      setMessage('')

      if (!product?.id) {
        setMessage('Không tìm thấy thông tin sản phẩm.')
        return false
      }

      const cartId = await ensureCart()

      await apiRequest(
        `/api/cart/add?cartId=${Number(cartId)}&productId=${product.id}&quantity=${quantity}`,
        {
          method: 'POST',
          includeAuth: true,
        }
      )

      setMessage('Đã thêm sản phẩm vào giỏ hàng.')
      return true
    } catch (err) {
      setMessage(err.message || 'Không thêm được vào giỏ hàng.')
      return false
    }
  }

  const handleBuyNow = async () => {
    const added = await handleAddToCart()
    if (added) {
      navigate('/checkout')
    }
  }

  return (
    <div className="product-detail-page">
      <SiteHeader />

      <section className="detail-hero">
        <div className="container breadcrumb-row">
          <Link to="/dashboard">Trang chủ</Link>
          <span>/</span>
          <Link to="/products">Sản phẩm</Link>
          <span>/</span>
          <strong>{product?.name || 'Chi tiết sản phẩm'}</strong>
        </div>
      </section>

      {loading && (
        <main className="detail-main">
          <div className="container">
            <p>Đang tải chi tiết sản phẩm...</p>
          </div>
        </main>
      )}

      {error && (
        <main className="detail-main">
          <div className="container">
            <p>{error}</p>
          </div>
        </main>
      )}

      {!loading && !error && product && (
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
              <p className="short-desc">
                {product.shortDescription ||
                  product.description ||
                  'Đang cập nhật mô tả sản phẩm.'}
              </p>

              <div className="price-row">
                <strong>{formatCurrency(product.price)}</strong>
                {product.oldPrice ? (
                  <span>{formatCurrency(product.oldPrice)}</span>
                ) : (
                  <span></span>
                )}
              </div>

              <div className="status-row">
                <div>
                  <span>Tình trạng</span>
                  <strong>{product.status}</strong>
                </div>
                <div>
                  <span>Mã sản phẩm</span>
                  <strong>{product.sku}</strong>
                </div>
              </div>

              {product.colors.length > 0 && (
                <div className="option-block">
                  <span>Màu sắc</span>
                  <div className="chip-row">
                    {product.colors.map((color) => (
                      <button type="button" key={color} className="chip">
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="option-block">
                <span>Số lượng</span>
                <div className="qty-control">
                  <button
                    type="button"
                    onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
                  >
                    -
                  </button>
                  <strong>{quantity}</strong>
                  <button type="button" onClick={() => setQuantity((qty) => qty + 1)}>
                    +
                  </button>
                </div>
              </div>

              <div className="cta-row">
                <button className="btn-dark" type="button" onClick={handleAddToCart}>
                  Thêm vào giỏ
                </button>
                <button className="btn-light" type="button" onClick={handleBuyNow}>
                  Mua ngay
                </button>
              </div>

              {message && <p>{message}</p>}

              <div className="detail-copy">
                <h3>Mô tả</h3>
                <p>{product.description || 'Đang cập nhật mô tả chi tiết.'}</p>
              </div>
            </section>
          </div>

          <section className="related-section">
            <div className="container related-head">
              <h2>Sản phẩm liên quan</h2>
              <Link to="/products">Xem tất cả</Link>
            </div>

            <div className="container related-grid">
              {relatedProducts.map((item) => (
                <article className="related-card" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <p>{item.category}</p>
                  <h3>{item.name}</h3>
                  <strong>{formatCurrency(item.price)}</strong>
                  <Link to={`/products/${item.slug}`}>Xem sản phẩm</Link>
                </article>
              ))}
            </div>
          </section>

          <footer className="footer">
            <div className="container footer-grid">
              <div>
                <strong>Synex</strong>
                <p>Apple Authorized Reseller</p>
              </div>
              <div>
                <h4>Liên kết</h4>
                <Link to="/products">Sản phẩm</Link>
                <Link to="/contact">Liên hệ</Link>
              </div>
              <div>
                <h4>Liên hệ</h4>
                <p>Hotline: 1900 xxxx</p>
                <p>Email: info@synexvn</p>
              </div>
            </div>
          </footer>
        </main>
      )}
    </div>
  )
}