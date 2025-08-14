import { Link, Outlet } from 'react-router-dom'

export default function Root() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 12, borderBottom: '1px solid #e5e5e5' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'black', fontWeight: 700, fontSize: 20 }}>phewtube</Link>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link to="/">Home</Link>
          <Link to="/upload">Upload</Link>
        </nav>
      </header>
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: 16 }}>
        <Outlet />
      </main>
    </div>
  )
}


