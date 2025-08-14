import { useState } from 'react'

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    setStatus('Uploading...')
    const fd = new FormData()
    fd.append('file', file)
    fd.append('title', title)
    fd.append('description', description)
    const res = await fetch('/api/videos/upload', {
      method: 'POST',
      headers: {
        'x-user-id': 'dev-user' // simple placeholder while auth not wired
      },
      body: fd
    })
    if (!res.ok) {
      setStatus('Upload failed')
      return
    }
    setStatus('Uploaded!')
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
      <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <input type="file" accept="video/*" onChange={e => setFile(e.target.files?.[0] ?? null)} required />
      <button type="submit" disabled={!file}>Upload</button>
      <div>{status}</div>
    </form>
  )
}


