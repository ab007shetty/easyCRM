import { QRCodeSVG } from 'qrcode.react'
import { Download, Copy, Check } from 'lucide-react'
import { useState, useRef } from 'react'

export default function QRCodeDisplay({ referralCode, size = 200 }) {
  const [copied, setCopied] = useState(false)
  const qrRef = useRef(null)

  const appUrl = import.meta.env.VITE_APP_URL || window.location.origin
  const joinUrl = `${appUrl}/join/${referralCode}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = joinUrl
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const data = new XMLSerializer().serializeToString(svg)
    const img = new Image()

    canvas.width = size * 2
    canvas.height = size * 2

    img.onload = () => {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      const link = document.createElement('a')
      link.download = `easycrm-qr-${referralCode}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(data)))
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* QR Code */}
      <div ref={qrRef} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <QRCodeSVG
          value={joinUrl}
          size={size}
          level="H"
          bgColor="#ffffff"
          fgColor="#0f172a"
          imageSettings={{
            src: '',
            height: 0,
            width: 0,
            excavate: false,
          }}
        />
      </div>

      {/* URL display */}
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-2.5 pl-3">
          <p className="flex-1 text-xs text-slate-600 truncate font-mono">{joinUrl}</p>
          <button
            onClick={handleCopy}
            className={`shrink-0 p-1.5 rounded-md transition-all duration-200 ${
              copied ? 'bg-emerald-500 text-white' : 'bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium shadow-sm"
        >
          <Download className="w-4 h-4" />
          Download QR
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  )
}
