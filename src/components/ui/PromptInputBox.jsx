import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Tooltip from '@radix-ui/react-tooltip'
import { ArrowUp, Mic, Paperclip, X } from 'lucide-react'
import { cn } from '../../lib/cn.js'

const MAX_TEXTAREA_HEIGHT = 200

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (ev) => resolve(ev.target?.result || null)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const PromptInputBox = forwardRef(function PromptInputBox(
  { onSend, placeholder = 'Schreib etwas …', className, maxFiles = 1 },
  ref,
) {
  const [text, setText] = useState('')
  const [files, setFiles] = useState([]) // [{ id, dataUrl }]
  const [dragOver, setDragOver] = useState(false)

  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
    clear: () => {
      setText('')
      setFiles([])
    },
  }))

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    const next = Math.min(ta.scrollHeight, MAX_TEXTAREA_HEIGHT)
    ta.style.height = `${next}px`
  }, [text])

  const canSend = text.trim().length > 0 || files.length > 0

  async function addFiles(fileList) {
    const imgs = Array.from(fileList || []).filter((f) =>
      f.type?.startsWith('image/'),
    )
    if (imgs.length === 0) return
    const remaining = Math.max(0, maxFiles - files.length)
    const toRead = imgs.slice(0, remaining)
    const dataUrls = await Promise.all(toRead.map(readFileAsDataUrl))
    setFiles((prev) =>
      [
        ...prev,
        ...dataUrls
          .filter(Boolean)
          .map((d) => ({ id: `${Date.now()}-${Math.random()}`, dataUrl: d })),
      ].slice(0, maxFiles),
    )
  }

  function onPickFile(e) {
    addFiles(e.target.files)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removeFile(id) {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  function handleSend() {
    if (!canSend) return
    const dataUrls = files.map((f) => f.dataUrl)
    onSend?.(text.trim(), dataUrls)
    setText('')
    setFiles([])
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function onPaste(e) {
    const items = e.clipboardData?.items
    if (!items) return
    const imageFiles = []
    for (const it of items) {
      if (it.kind === 'file' && it.type.startsWith('image/')) {
        const f = it.getAsFile()
        if (f) imageFiles.push(f)
      }
    }
    if (imageFiles.length > 0) {
      e.preventDefault()
      addFiles(imageFiles)
    }
  }

  function onDragOver(e) {
    e.preventDefault()
    setDragOver(true)
  }
  function onDragLeave(e) {
    e.preventDefault()
    setDragOver(false)
  }
  function onDrop(e) {
    e.preventDefault()
    setDragOver(false)
    addFiles(e.dataTransfer?.files)
  }

  return (
    <Tooltip.Provider delayDuration={300}>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          'rounded-2xl border bg-white text-forest-900 shadow-sm transition',
          'border-forest-200 focus-within:border-forest-400 focus-within:ring-2 focus-within:ring-forest-200',
          dragOver && 'border-forest-500 ring-2 ring-forest-200',
          className,
        )}
      >
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 px-3 pt-3">
            {files.map((f) => (
              <div
                key={f.id}
                className="relative w-16 h-16 rounded-lg overflow-hidden border border-forest-200 bg-stone-warm"
              >
                <img
                  src={f.dataUrl}
                  alt="Anhang"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFile(f.id)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center active:scale-95"
                  aria-label="Anhang entfernen"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2 p-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 w-9 h-9 rounded-full text-forest-700 hover:bg-forest-50 flex items-center justify-center active:scale-95"
            aria-label="Bild anhängen"
            disabled={files.length >= maxFiles}
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickFile}
          />

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            rows={1}
            placeholder={placeholder}
            className="flex-1 resize-none bg-transparent outline-none text-forest-900 placeholder:text-forest-400 px-1 py-2 text-sm leading-snug max-h-[200px]"
          />

          <div className="shrink-0 flex items-center">
            <AnimatePresence mode="wait" initial={false}>
              {canSend ? (
                <motion.button
                  key="send"
                  type="button"
                  onClick={handleSend}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.12 }}
                  className="w-9 h-9 rounded-full bg-forest-700 text-stone-warm flex items-center justify-center shadow-sm active:scale-95"
                  aria-label="Senden"
                >
                  <ArrowUp className="w-5 h-5" strokeWidth={2.4} />
                </motion.button>
              ) : (
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <motion.div
                      key="mic"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.12 }}
                      className="w-9 h-9 rounded-full text-forest-700 flex items-center justify-center"
                      aria-label="Diktat-Hinweis"
                    >
                      <Mic className="w-5 h-5" />
                    </motion.div>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="top"
                      sideOffset={6}
                      className="z-50 max-w-[240px] rounded-lg bg-forest-900 text-stone-warm text-xs px-3 py-2 shadow-md"
                    >
                      Tipp: das 🎤 auf deiner Tastatur diktiert für dich
                      <Tooltip.Arrow className="fill-forest-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  )
})

export default PromptInputBox
