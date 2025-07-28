// app/page.tsx (or pages/index.tsx in older Next.js)
export default function UnityPage() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <iframe
        src="/webtrix_world_refined/index.html"
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          border: 'none',
          zIndex: 0,
        }}
        allowFullScreen
      />

      {/* Optional overlay UI */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 1,
        }}
      >
        <button style={{ padding: '10px 20px' }}>React UI Overlay</button>
      </div>
    </div>
  );
}
