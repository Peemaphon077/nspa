// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import OwnerOnly from './components/OwnerOnly';

export default function App() {
  return (
    <>
      {/* GLOBAL CSS — จัด layout ทั้งเว็บ + พื้นหลังขาว */}
      <style>{`
        html, body, #root { height: 100%; }
        body { margin: 0; background: #fff; font-family: system-ui, sans-serif; }

        /* โครงเว็บแบบ sticky footer */
        .site { min-height: 100dvh; display: flex; flex-direction: column; background:#fff; }
        main { flex: 1 0 auto; }  /* ดัน footer ชิดล่างเมื่อเนื้อหาน้อย */
        footer { flex-shrink: 0; }

        /* (เผื่ออนาคตจะมี header ใช้งาน) */
        .header { position: sticky; top: 0; z-index: 20; background: transparent; border-bottom: none; backdrop-filter: none; }
        .header-inner { max-width: 1040px; margin: 0 auto; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; }
        .brand { text-decoration: none; color: #222; font-weight: 800; letter-spacing: .4px; }
      `}</style>

      <div className="site">
        <main>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route element={<OwnerOnly />}>
                {/* เส้นทางที่ล็อกด้วย OwnerOnly ใส่เพิ่มภายหลังได้ */}
              </Route>
            </Routes>
          </BrowserRouter>
        </main>

        {/* Footer */}
        <footer style={{ background: '#faf7f0', borderTop: '1px solid #eee' }}>
          <div style={{
            maxWidth: 1040, margin: '0 auto', padding: 16,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, color: '#333'
          }}>
            <span>© {new Date().getFullYear()} Long Doo Spa</span>
            <nav style={{ display: 'flex', gap: 16 }}>
              <a href="/" style={{ color: '#333', textDecoration: 'none' }}>Home</a>
              <a href="/services" style={{ color: '#333', textDecoration: 'none' }}>Services</a>
              <a href="/contact" style={{ color: '#333', textDecoration: 'none' }}>Contact</a>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
