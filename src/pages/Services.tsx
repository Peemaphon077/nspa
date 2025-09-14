import { useEffect, useState, type CSSProperties } from 'react'
import { fetchServices, type Service } from '../lib/service'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { isOwner } from '../lib/isOwner'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function Services() {
  // ข้อมูลสำหรับหน้า public
  const [data, setData] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  // โหมดแก้ไข (เปิดได้เมื่อกลับมาด้วย ?edit=1 และเป็นเจ้าของร้าน)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState<Partial<Service>>({})
  const [busy, setBusy] = useState(false)

  const { user } = useAuth()
  const owner = isOwner(user?.email)

  const navigate = useNavigate()
  const [search] = useSearchParams()

  // เปิดโหมดแก้ไขอัตโนมัติ ถ้าเป็น owner และมี ?edit=1 ติด URL
  useEffect(() => {
    if (owner && search.get('edit') === '1') setEditMode(true)
  }, [owner, search])

  // โหลดข้อมูลครั้งแรก
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

  // Realtime: refetch เมื่อมี insert/update/delete
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

  // ปุ่ม Edit → ไปหน้า Login เสมอ (เพื่อให้ยืนยันอีเมล/รหัสก่อน)
  const onClickEdit = () => {
    navigate('/login?redirect=/services&edit=1')
  }
  const onExitEdit = () => { setEditMode(false); setForm({}) }

  // ===== CRUD: ทำงานได้เฉพาะเมื่อ owner && editMode =====
  const upsert = async () => {
    if (!(owner && editMode)) return
    setBusy(true); setErr(null)
    const payload: any = {
      id: form.id,
      name: form.name,
      price: Number(form.price),
      duration_min: Number(form.duration_min),
      description: form.description ?? null,
      // ❌ เอา is_active ออก (ให้โชว์เสมอ / ใช้ default ใน DB)
      // is_active: true,
    }
    const { error } = await supabase.from('services').upsert(payload)
    setBusy(false)
    if (error) setErr(error.message)
    setForm({})
    // ไม่ต้อง setData — realtime จะรีเฟรชให้
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
  // ==============================================

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
  // ----------------------------

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
      {/* แถบบน: ปุ่ม Edit → ไปหน้า Login เสมอ */}
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        {!editMode ? (
          <button onClick={onClickEdit}>จัดการร้าน</button>
        ) : (
          <button onClick={onExitEdit}>ออก</button>
        )}
      </div>

      <div style={card}>
        <h1>โหมดแก้ไขบริการสำหรับเจ้าของร้าน</h1>

        {/* ฟอร์มเพิ่ม/แก้ไข: แสดงเฉพาะเมื่อเป็นเจ้าของร้าน + editMode เปิดอยู่ */}
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
              {/* ❌ ลบช่องติ๊ก is_active ออก */}
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
              {/* ❌ ไม่ต้องแสดงป้ายสถานะซ่อนแล้ว */}
            </div>
          ))}
          {data.length === 0 && <div>ยังไม่มีบริการ</div>}
        </div>
      </div>
    </div>
  )
}
