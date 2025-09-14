import { useEffect, useState, type CSSProperties } from 'react'
import { fetchServices, type Service } from '../lib/service'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { isOwner } from '../lib/isOwner'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function Services() {
  const [data, setData] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState<Partial<Service>>({})
  const [busy, setBusy] = useState(false)

  const { user } = useAuth()
  const owner = isOwner(user?.email)

  const navigate = useNavigate()
  const [search] = useSearchParams()

  // ✅ Debug log ช่วยตรวจสอบค่าจริง (ลบออกได้หลัง deploy)
  useEffect(() => {
    console.log('🔎 owner:', owner)
    console.log('🔎 edit param:', search.get('edit'))
  }, [owner, search])

  // ✅ เปิดโหมดแก้ไขเมื่อเป็นเจ้าของ + มี ?edit=1
  useEffect(() => {
    if (owner && search.get('edit') === '1') {
      setEditMode(true)
    }
  }, [owner, search])

  // โหลดข้อมูลเริ่มต้น
  useEffect(() => {
    (async () => {
      try {
        setData(await fetchServices())
      } catch (e: any) {
        setErr(e?.message ?? 'error')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // ✅ เปิด realtime: refetch เมื่อมีเปลี่ยนแปลงในตาราง
  useEffect(() => {
    const ch = supabase
      .channel('services-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, async () => {
        try {
          const fresh = await fetchServices()
          setData(fresh)
        } catch (e: any) {
          setErr(e?.message ?? 'error')
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  // ✅ ปุ่ม Edit → ไปหน้า Login พร้อม redirect และ edit=1
  const onClickEdit = () => {
    const safeRedirect = encodeURIComponent('/services?edit=1')
    navigate(`/login?redirect=${safeRedirect}`)
  }

  const onExitEdit = () => {
    setEditMode(false)
    setForm({})
  }

  // ✅ CRUD ทำงานเฉพาะ owner + editMode เท่านั้น
  const upsert = async () => {
    if (!(owner && editMode)) return
    setBusy(true); setErr(null)
    const payload: any = {
      id: form.id,
      name: form.name,
      price: Number(form.price),
      duration_min: Number(form.duration_min),
      description: form.description ?? null,
    }
    const { error } = await supabase.from('services').upsert(payload)
    setBusy(false)
    if (error) setErr(error.message)
    setForm({})
  }

  const editRow = (s: Service) => {
    if (!(owner && editMode)) return
    setForm(s)
  }

  const del = async (id: string) => {
    if (!(owner && editMode)) return
    if (!confirm('ลบรายการนี้?')) return
    const { error } = await supabase.from('services').delete().eq('id', id)
    if (error) setErr(error.message)
  }

  // ---------- styles ----------
  const field: CSSProperties = {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.25)',
    background: 'rgba(255,255,255,0.08)',
    color: 'white',
    outline: 'none',
    boxSizing: 'border-box'
  }
  const card: CSSProperties = {
    background: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    maxWidth: 900,
    margin: '12px auto',
    padding: 32
  }

  if (loading) return <div style={{ padding: 24 }}>กำลังโหลดบริการ…</div>
  if (err) return <div style={{ padding: 24, color: 'crimson' }}>เกิดข้อผิดพลาด: {err}</div>

  return (
    <div
      style={{
        padding: 24,
        minHeight: '100vh',
        backgroundImage: 'url("/barber-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textShadow: '0 2px 8px rgba(0,0,0,0.7)',
      }}
    >
      {/* ปุ่มจัดการ/ออก */}
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        {!editMode ? (
          <button onClick={onClickEdit}>จัดการร้าน</button>
        ) : (
          <button onClick={onExitEdit}>ออก</button>
        )}
      </div>

      <div style={card}>
        <h1>บริการของร้าน</h1>

        {/* ✅ แบบฟอร์มแก้ไข/เพิ่ม - แสดงเฉพาะ owner + editMode */}
        {owner && editMode && (
          <div
            style={{
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 12,
              padding: 16,
              margin: '12px 0',
            }}
          >
            <h3 style={{ marginTop: 0 }}>{form.id ? 'แก้ไขบริการ' : 'เพิ่มบริการใหม่'}</h3>

            <div style={{ display: 'grid', gap: 12, width: '100%' }}>
              <input
                style={field}
                placeholder="ชื่อบริการ"
                value={form.name ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
              <input
                style={field}
                type="number"
                placeholder="ราคา (บาท)"
                value={form.price ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value as any }))}
              />
              <input
                style={field}
                type="number"
                placeholder="ระยะเวลา (นาที)"
                value={form.duration_min ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, duration_min: e.target.value as any }))}
              />
              <textarea
                style={{ ...field, minHeight: 96, resize: 'vertical' }}
                placeholder="คำอธิบาย (ไม่บังคับ)"
                value={form.description ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button onClick={upsert} disabled={busy}>
                  {form.id ? 'บันทึกการแก้ไข' : 'เพิ่มบริการ'}
                </button>
                {form.id && (
                  <button onClick={() => setForm({})} type="button">
                    ยกเลิก
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* รายการบริการ */}
        <div style={{ display: 'grid', gap: 16 }}>
          {data.map((s) => (
            <div
              key={s.id}
              style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, background: 'rgba(0,0,0,0.3)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>{s.name}</h3>
                {owner && editMode && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => editRow(s)}>แก้ไข</button>
                    <button onClick={() => del(s.id)} style={{ color: 'crimson' }}>
                      ลบ
                    </button>
                  </div>
                )}
              </div>
              <p>ระยะเวลา: {s.duration_min} นาที</p>
              <p>ราคา: {s.price} บาท</p>
              {s.description && <p>{s.description}</p>}
            </div>
          ))}
          {data.length === 0 && <div>ยังไม่มีบริการ</div>}
        </div>
      </div>
    </div>
  )
}
