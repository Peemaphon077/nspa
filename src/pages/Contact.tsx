export default function Contact() {
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
      <div style={{
        background: 'rgba(0,0,0,0.5)',
        borderRadius: 16,
        maxWidth: 480,
        margin: '0 auto',
        padding: 32,
      }}>
        <h1>ติดต่อ Long Doo Spa</h1>
        <p>📞 โทร: 08x-xxx-xxxx</p>
        <p>💬 Line: @longdoo</p>
        <p>📘 Facebook: Long Doo Spa</p>
        <h2>แผนที่</h2>
        <iframe
          title="map"
          src="https://maps.google.com/maps?q=19.165,99.901&hl=th&z=14&output=embed"
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: 8 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  )
}