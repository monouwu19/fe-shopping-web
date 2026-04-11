import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import { apiRequest, getAuthToken } from '../services/api'
import '../styles/profile.css'

const EMPTY_FORM = {
  fullName: '',
  phone: '',
  email: '',
  birthday: '',
  gender: 'Khác',
  city: '',
}

function pickUserName(user) {
  return (
    user?.fullName ||
    user?.name ||
    user?.username ||
    user?.email ||
    'Người dùng Synex'
  )
}

function normalizeProfile(user) {
  if (!user) return EMPTY_FORM

  return {
    fullName: user.fullName || user.name || user.username || '',
    phone: user.phone || user.phoneNumber || '',
    email: user.email || '',
    birthday: user.birthday || user.birthDate || '',
    gender: user.gender || 'Khác',
    city: user.city || user.address?.city || '',
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(EMPTY_FORM)
  const [user, setUser] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        setError('')
        setMessage('')

        const token = getAuthToken()
        if (!token) {
          throw new Error('Không tải được thông tin tài khoản. Hãy đăng nhập lại.')
        }

        const [userPayload, addressPayload] = await Promise.allSettled([
          apiRequest('/api/users/me', { includeAuth: true }),
          apiRequest('/api/users/me/addresses', { includeAuth: true }),
        ])

        if (userPayload.status === 'fulfilled') {
          const userData = userPayload.value
          setUser(userData)
          setProfile(normalizeProfile(userData))
        } else {
          throw new Error('Không tải được thông tin tài khoản. Hãy đăng nhập lại.')
        }

        if (addressPayload.status === 'fulfilled') {
          const raw = addressPayload.value
          setAddresses(Array.isArray(raw) ? raw : [])
        } else {
          setAddresses([])
        }
      } catch (err) {
        setError(err.message || 'Không tải được hồ sơ người dùng.')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const displayName = useMemo(() => pickUserName(user), [user])

  const handleChange = (field) => (event) => {
    setProfile((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setSaving(true)
      setError('')
      setMessage('')

      const payload = {
        fullName: profile.fullName,
        phone: profile.phone,
        email: profile.email,
        birthday: profile.birthday,
        gender: profile.gender,
        city: profile.city,
      }

      const updated = await apiRequest('/api/users/me', {
        method: 'PUT',
        includeAuth: true,
        body: JSON.stringify(payload),
      })

      setUser(updated)
      setProfile(normalizeProfile(updated))
      setMessage('Đã cập nhật hồ sơ thành công.')
    } catch (err) {
      setError(err.message || 'Không cập nhật được hồ sơ.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="profile-page">
      <SiteHeader />

      <section className="profile-hero">
        <div className="container profile-hero-grid">
          <div className="profile-summary-card">
            <div className="avatar">
              {(displayName?.[0] || 'U').toUpperCase()}
            </div>

            <div className="profile-summary-copy">
              <p className="eyebrow">TÀI KHOẢN CỦA TÔI</p>
              <h1>{displayName}</h1>
            </div>
          </div>

          <div className="profile-stats-grid">
            <div className="stat-card">
              <strong>{addresses.length.toString().padStart(2, '0')}</strong>
              <span>Địa chỉ nhận hàng</span>
            </div>

            <div className="stat-card">
              <strong>00</strong>
              <span>Đơn hàng gần đây</span>
            </div>

            <div className="stat-card highlight">
              <strong>JWT</strong>
              <span>Cần token hợp lệ để tải dữ liệu</span>
            </div>

            <div className="stat-card">
              <strong>{user ? 'OK' : '--'}</strong>
              <span>Trạng thái hồ sơ</span>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-section">
        <div className="container profile-layout">
          <div className="profile-main">
            <div className="panel-card">
              <div className="panel-head">
                <h2>Thông tin cá nhân</h2>
                <p>Cập nhật hồ sơ trực tiếp lên backend.</p>
              </div>

              {loading && <p className="form-message">Đang tải hồ sơ...</p>}
              {error && <p className="form-message">{error}</p>}
              {message && <p className="form-message">{message}</p>}

              {!loading && (
                <form className="profile-form" onSubmit={handleSubmit}>
                  <div className="form-grid two-col">
                    <label className="field">
                      <span>Họ và tên</span>
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={handleChange('fullName')}
                        placeholder="Nhập họ và tên"
                      />
                    </label>

                    <label className="field">
                      <span>Số điện thoại</span>
                      <input
                        type="text"
                        value={profile.phone}
                        onChange={handleChange('phone')}
                        placeholder="Nhập số điện thoại"
                      />
                    </label>

                    <label className="field">
                      <span>Email</span>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={handleChange('email')}
                        placeholder="Nhập email"
                      />
                    </label>

                    <label className="field">
                      <span>Ngày sinh</span>
                      <input
                        type="date"
                        value={profile.birthday}
                        onChange={handleChange('birthday')}
                      />
                    </label>

                    <label className="field">
                      <span>Giới tính</span>
                      <select value={profile.gender} onChange={handleChange('gender')}>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </label>

                    <label className="field">
                      <span>Thành phố</span>
                      <input
                        type="text"
                        value={profile.city}
                        onChange={handleChange('city')}
                        placeholder="Nhập thành phố"
                      />
                    </label>
                  </div>

                  <div className="form-actions">
                    <button className="btn-primary" type="submit" disabled={saving}>
                      {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button
                      className="btn-secondary"
                      type="button"
                      onClick={() => {
                        setProfile(normalizeProfile(user))
                        setError('')
                        setMessage('')
                      }}
                    >
                      Khôi phục
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="profile-side">
            <div className="panel-card compact">
              <div className="panel-head inline">
                <div>
                  <h2>Địa chỉ nhận hàng</h2>
                  <p>Dữ liệu lấy từ backend.</p>
                </div>
              </div>

              {loading ? (
                <p className="form-message">Đang tải địa chỉ...</p>
              ) : addresses.length > 0 ? (
                <ul className="saved-list">
                  {addresses.map((address, index) => (
                    <li key={address.id || index}>
                      <strong>{address.fullName || address.receiverName || 'Người nhận'}</strong>
                      <br />
                      {address.phone || address.phoneNumber || 'Chưa có số điện thoại'}
                      <br />
                      {[
                        address.line1 || address.addressLine1 || address.address,
                        address.ward,
                        address.district,
                        address.city,
                      ]
                        .filter(Boolean)
                        .join(', ') || 'Chưa có địa chỉ chi tiết'}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="form-message">Chưa có địa chỉ nào từ backend.</p>
              )}
            </div>

            <div className="panel-card compact support-card">
              <div className="panel-head">
                <h2>Hỗ trợ nhanh</h2>
                <p>Cần trợ giúp về đơn hàng, bảo hành hoặc tư vấn thiết bị?</p>
              </div>

              <div className="support-links">
                <Link to="/contact">Liên hệ ngay</Link>
                <Link to="/products">Xem thêm sản phẩm</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}