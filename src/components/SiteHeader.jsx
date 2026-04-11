import { Link, useNavigate } from 'react-router-dom'
import NavLinkItem from './NavLinkItem'
import { useAuth } from '../context/AuthContext'

export default function SiteHeader() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

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
            {isAuthenticated ? (
              <>
                <Link className="site-text-link" to="/profile">
                  {user?.username || user?.email || 'Tài khoản'}
                </Link>
                <button className="site-btn-ghost" type="button" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link className="site-text-link" to="/login">Đăng nhập</Link>
            )}

            <Link className="site-btn-cta" to="/cart">Giỏ hàng</Link>
          </div>
        </div>
      </div>
    </header>
  )
}