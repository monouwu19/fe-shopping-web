import { Link, useLocation } from 'react-router-dom'

export default function NavLinkItem({ to, children, activeClassName = 'active', className = '' }) {
  const location = useLocation()
  const isActive = location.pathname === to
  const classes = [className, isActive ? activeClassName : ''].filter(Boolean).join(' ')
  return <Link to={to} className={classes}>{children}</Link>
}
