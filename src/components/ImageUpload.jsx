import React, { useRef } from 'react'

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = reject
    r.readAsDataURL(file)
  })
}

export default function ImageUpload({ images = [], onChange, label = 'Foto hinzufügen' }) {
  const inputRef = useRef(null)

  async function handleFiles(files) {
    const next = [...images]
    for (const f of files) {
      if (!f.type.startsWith('image/')) continue
      const dataUrl = await fileToDataURL(f)
      next.push(dataUrl)
    }
    onChange?.(next)
  }

  function remove(idx) {
    const next = images.filter((_, i) => i !== idx)
    onChange?.(next)
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button type="button" className="btn-secondary w-full" onClick={() => inputRef.current?.click()}>
        📸 {label}
      </button>
      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {images.map((src, i) => (
            <div key={i} className="relative">
              <img src={src} alt="" className="w-full h-24 object-cover rounded-xl border border-forest-100" />
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Bild entfernen"
                className="absolute -top-1.5 -right-1.5 bg-white border border-forest-200 rounded-full w-6 h-6 flex items-center justify-center text-forest-700 shadow"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
