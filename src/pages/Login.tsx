// src/pages/Login.tsx
import { useState, useEffect, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [search] = useSearchParams()

  const redirect = search.get('redirect') || '/'
  const wantEdit = search.get('edit') === '1'

  useEffect(() => {
    document.title = 'เข้าสู่ระบบ | Long Doo Spa'
  }, [])

  const signIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErr(null); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setErr(error.message)

    const backUrl = wantEdit
      ? `${redirect}${redirect.includes('?') ? '&' : '?'}edit=1`
      : redirect
    navigate(backUrl, { replace: true })
  }

  // ================== Styles ==================
  const palette = {
    baseCream: 'rgba(241,236,223,0.92)',  // ฟิล์มครีมโปร่งทับรูป
    overlay: 'rgba(70,66,60,0.62)',       // การ์ดเทาอมน้ำตาลโปร่ง
    overlayBorder: 'rgba(255,255,255,0.10)',
    textOnOverlay: 'rgba(255,255,255,0.92)',
    heading: '#ffffff',
    shadow: '0 24px 60px rgba(0,0,0,0.35)',
  }

  const page: React.CSSProperties = {
    minHeight: '100svh',
    display: 'grid',
    placeItems: 'center',
    padding: 24,
    // ใช้ภาพที่ให้เป็นพื้นหลัง + ฟิล์มครีมโปร่งเพื่อให้อ่านง่าย
    backgroundImage: 'url("/barber-bg.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#f1ecdf', // เผื่อรูปไม่โหลด
  }

  const card: React.CSSProperties = {
    width: '100%',
    maxWidth: 460,
    borderRadius: 28,
    padding: 28,
    background: palette.overlay,
    border: `1px solid ${palette.overlayBorder}`,
    boxShadow: palette.shadow,
    backdropFilter: 'blur(4px)',
    overflow: 'hidden',
    color: palette.textOnOverlay,
  }

  const title: React.CSSProperties = {
    margin: '4px 0 6px',
    fontSize: 24,
    lineHeight: 1.2,
    color: palette.heading,
    textShadow: '0 2px 10px rgba(0,0,0,0.35)',
  }

  const subtitle: React.CSSProperties = {
    margin: '0 0 14px',
    fontSize: 13.5,
    color: palette.textOnOverlay,
    opacity: 0.9,
  }

  const label: React.CSSProperties = {
    fontSize: 13,
    color: palette.textOnOverlay,
    marginBottom: 6,
  }

  const input: React.CSSProperties = {
    width: '100%',
    height: 44,
    padding: '12px 14px',
    borderRadius: 12,
    border: '1.5px solid rgba(255,255,255,0.35)',
    background: 'rgba(255,255,255,0.9)',
    outline: 'none',
    fontSize: 14.5,
    color: '#1e1e1e',
    boxSizing: 'border-box',
  }

  const inputWrap: React.CSSProperties = { display: 'grid', gap: 6, marginTop: 10 }

  // ใช้ grid สำหรับช่องรหัสผ่าน + ปุ่มแสดง/ซ่อน (กันล้นกรอบ)
  const inputRow: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: 8,
    alignItems: 'center',
  }

  const eyeBtn: React.CSSProperties = {
    height: 44,
    padding: '0 12px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.35)',
    background: 'rgba(255,255,255,0.2)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: 12.5,
    whiteSpace: 'nowrap',
  }

  const primaryBtn: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    marginTop: 14,
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.35)',
    background: 'rgba(255,255,255,0.18)',
    color: '#fff',
    fontWeight: 600,
    fontSize: 15,
    cursor: 'pointer',
    boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
  }

  const disabledBtn: React.CSSProperties = {
    opacity: 0.6,
    cursor: 'not-allowed',
    boxShadow: 'none',
  }

  const errorBox: React.CSSProperties = {
    marginTop: 12,
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid #f1c5c5',
    background: '#ffecec',
    color: '#842029',
    fontSize: 13.5,
  }

  const footer: React.CSSProperties = {
    marginTop: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 13,
    color: palette.textOnOverlay,
  }

  return (
    <div style={page}>
      <form onSubmit={signIn} style={card} aria-label="ฟอร์มเข้าสู่ระบบสำหรับเจ้าของร้าน">
        <h2 style={title}>เข้าสู่ระบบสำหรับเจ้าของร้าน</h2>
        <p style={subtitle}>
          {wantEdit ? 'ยืนยันตัวตนเพื่อเข้าโหมดแก้ไขบริการ' : 'กรอกอีเมลและรหัสผ่านเพื่อจัดการข้อมูลร้าน'}
        </p>

        {/* Email */}
        <div style={inputWrap}>
          <label htmlFor="email" style={label}>อีเมล</label>
          <input
            id="email"
            type="email"
            placeholder="owner@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-required
            style={input}
            autoComplete="username"
          />
        </div>

        {/* Password */}
        <div style={inputWrap}>
          <label htmlFor="password" style={label}>รหัสผ่าน</label>
          <div style={inputRow}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-required
              style={input}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
              style={eyeBtn}
            >
              {showPassword ? 'ซ่อน' : 'แสดง'}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{ ...primaryBtn, ...(loading ? disabledBtn : {}) }}
        >
          {loading ? 'กำลังตรวจสอบ…' : (wantEdit ? 'ล็อกอินเพื่อเข้าโหมดแก้ไข' : 'เข้าสู่ระบบ')}
        </button>

        {err && (
          <div role="alert" style={errorBox}>
            ⚠️ {err}
          </div>
        )}

        {/* Footer */}
        <div style={footer}>
          <Link to="/services" style={{ color: '#fff', textDecoration: 'underline' }}>
            กลับไปที่บริการ
          </Link>
        </div>
      </form>
    </div>
  )
}
