import { Link } from 'react-router-dom'
import NavLinkItem from './NavLinkItem'

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-shell">
        <div className="site-header-inner">
          <Link className="site-logo" to="/dashboard">Synex</Link>

          <nav className="site-nav">
            <NavLinkItem to="/dashboard" className="site-nav-link" activeClassName="active">Trang chủ</NavLinkItem>
            <NavLinkItem to="/products" className="site-nav-link" activeClassName="active">Sản phẩm</NavLinkItem>
            <NavLinkItem to="/contact" className="site-nav-link" activeClassName="active">Liên hệ</NavLinkItem>
            <NavLinkItem to="/profile" className="site-nav-link" activeClassName="active">Hồ sơ</NavLinkItem>
          </nav>

          <div className="site-header-actions">
            <Link className="site-text-link" to="/profile">Tài khoản</Link>
            <Link className="site-btn-cta" to="/cart">Giỏ hàng</Link>
          </div>
        </div>
      </div>
    </header>
  )
}
