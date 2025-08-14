import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

type Video = {
  id: string
  title: string
  thumbnailPath: string
  durationSec: number
  uploader: { id: string; username: string }
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([])

  useEffect(() => {
    fetch('/api/videos').then(r => r.json()).then(setVideos)
  }, [])

  return (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
      {videos.map(v => (
        <Link key={v.id} to={`/watch/${v.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #eee' }}>
            <img src={`/static/${v.thumbnailPath}`} alt="thumb" style={{ width: '100%', display: 'block' }} />
            <div style={{ padding: 8 }}>
              <div style={{ fontWeight: 600 }}>{v.title}</div>
              <div style={{ color: '#666', fontSize: 12 }}>{v.uploader.username}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}


