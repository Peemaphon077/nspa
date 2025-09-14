import { Link } from 'react-router-dom';

export default function Home() {
  // ปรับความโปร่งให้โทนเดียวกับหน้าที่เหลือ
  const OVERLAY_TOP = 0.18;
  const OVERLAY_BOTTOM = 0.25;
  const CARD_ALPHA = 0.36;
  const BORDER_ALPHA = 0.12;

  const card = {
    background: `rgba(0,0,0,${CARD_ALPHA})`,
    border: `1px solid rgba(255,255,255,${BORDER_ALPHA})`,
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 6px 22px rgba(0,0,0,0.28)',
  };

  return (
    <>
      {/* CSS สำหรับเอฟเฟกต์ปุ่ม (hover/active/focus) */}
      <style>{`
        .btn {
          display: inline-block;
          padding: 10px 16px;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          transition: transform .2s ease, box-shadow .2s ease, background .2s ease, color .2s ease, border-color .2s ease;
          backdrop-filter: blur(6px);
          border: 1px solid rgba(0,0,0,0.1);
          will-change: transform;
        }
        .btn:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 24px rgba(0,0,0,0.30);
        }
        .btn:active {
          transform: translateY(0) scale(0.98);
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        }
        .btn:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 2px;
        }

        .btn-primary {
          background: rgba(255,255,255,0.92);
          color: #000;
        }
        .btn-primary:hover {
          background: rgba(255,255,255,1);
        }

        .btn-ghost {
          background: rgba(255,255,255,0.18);
          color: #fff;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.28);
        }
      `}</style>

      <div
        id="home"
        style={{
          minHeight: '100vh',
          color: 'white',
          textShadow: '0 1px 4px rgba(0,0,0,0.35)',
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,${OVERLAY_TOP}), rgba(0,0,0,${OVERLAY_BOTTOM})), url("/barber-bg.jpg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Hero */}
        <div style={{ padding: '64px 16px' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ ...card, padding: 32 }}>
              <h1 style={{ fontSize: 48, lineHeight: 1.1, margin: '6px 0 12px' }}>
                Long Doo Spa
              </h1>
              <p style={{ fontSize: 20, margin: '0 0 20px', opacity: 0.95 }}>
                สปาและนวดผ่อนคลายใจกลางเมืองพะเยา
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/services" className="btn btn-ghost">
                  ดูบริการทั้งหมด
                </Link>
                <a href="tel:0830441242" className="btn btn-ghost">
                  โทรจองคิว 083-044-1242
                </a>
                <Link to="/contact" className="btn btn-ghost">
                  ติดต่อเรา
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div style={{ padding: '0 16px 32px' }}>
          <div
            style={{
              maxWidth: 960,
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 16,
            }}
          >
            <div style={card}>
              <h2 style={{ fontSize: 22, marginTop: 0 }}>เวลาเปิด – ปิด</h2>
              <p style={{ margin: 0 }}>เปิดทุกวัน 10:00 – 20:00</p>
              <p style={{ margin: '6px 0 0', opacity: 0.9 }}>
                รับคิวสุดท้าย 19:00 น.
              </p>
            </div>

            <div style={card}>
              <h2 style={{ fontSize: 22, marginTop: 0 }}>ที่อยู่</h2>
              <p style={{ margin: 0 }}>
                123/4 ถนนสุขภาพดี อำเภอเมือง จังหวัดพะเยา
              </p>
              <p style={{ margin: '6px 0 0', opacity: 0.9 }}>
                มีที่จอดรถ / ใกล้ Big C พะเยา
              </p>
            </div>

            <div style={card}>
              <h2 style={{ fontSize: 22, marginTop: 0 }}>โปรโมชั่น</h2>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>นวดไทย 90 นาที เหลือ 399.-</li>
                <li>นวดน้ำมัน 60 นาที แถมฟรีประคบสมุนไพร</li>
                <li>มา 2 คน ลดเพิ่ม 10%</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{ padding: '0 16px 32px' }}>
          <div
            style={{
              maxWidth: 960,
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
            }}
          >
            {[
              { title: 'บรรยากาศเงียบสงบ', desc: 'ห้องส่วนตัว สะอาด ปลอดโปร่ง' },
              { title: 'ช่างผู้เชี่ยวชาญ', desc: 'ผ่านการอบรมและมีประสบการณ์' },
              { title: 'ผลิตภัณฑ์คุณภาพ', desc: 'น้ำมันหอมระเหย/สมุนไพรคัดสรร' },
              { title: 'ช่องทางการชำระ', desc: 'เงินสด/โอน' },
            ].map((f) => (
              <div key={f.title} style={{ ...card, padding: 20 }}>
                <h3 style={{ margin: '0 0 6px', fontSize: 18 }}>{f.title}</h3>
                <p style={{ margin: 0, opacity: 0.95 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery */}
        <div style={{ padding: '0 16px 32px' }}>
          <div
            style={{
              maxWidth: 960,
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
            }}
          >
            {['/gallery1.jpg', '/gallery2.jpg', '/gallery3.jpg'].map((src) => (
              <div
                key={src}
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: `1px solid rgba(255,255,255,${BORDER_ALPHA})`,
                }}
              >
                <img
                  src={src}
                  alt="บรรยากาศร้าน"
                  style={{ width: '100%', height: 180, objectFit: 'cover' }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
