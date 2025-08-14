import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import { useParams } from 'react-router-dom'

type Video = {
  id: string
  title: string
  description: string
  hlsPath: string
  uploader: { id: string; username: string }
}

export default function Watch() {
  const { id } = useParams()
  const [video, setVideo] = useState<Video | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/videos/${id}`).then(r => r.json()).then(setVideo)
  }, [id])

  useEffect(() => {
    if (!video || !videoRef.current) return
    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(`/static/${video.hlsPath}`)
      hls.attachMedia(videoRef.current)
      return () => {
        hls.destroy()
      }
    }
    return
  }, [video])

  if (!video) return null

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <video
        ref={videoRef}
        controls
        style={{ width: '100%', background: '#000' }}
        src={Hls.isSupported() ? undefined : `/static/${video.hlsPath}`}
      />
      <h1 style={{ margin: 0 }}>{video.title}</h1>
      <div>{video.description}</div>
      <div style={{ color: '#666' }}>by {video.uploader.username}</div>
    </div>
  )
}


