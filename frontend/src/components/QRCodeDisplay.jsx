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

    // High resolution card scaling (1000x1400 output)
    const cardWidth = 500
    const cardHeight = 700
    const scale = 2

    canvas.width = cardWidth * scale
    canvas.height = cardHeight * scale

    // Scale canvas context so we can use standard 500x700 coordinates
    ctx.scale(scale, scale)

    img.onload = () => {
      // 1. Draw rounded card border and background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, cardWidth, cardHeight)

      // 2. Draw Top Emerald Header Banner
      const bannerHeight = 130
      ctx.fillStyle = '#047857' // emerald-700
      ctx.fillRect(0, 0, cardWidth, bannerHeight)

      // 3. Draw Lightning Bolt Logo Icon in Header
      ctx.beginPath()
      ctx.moveTo(35 + 17, 35 + 5)
      ctx.lineTo(35 + 2, 35 + 29)
      ctx.lineTo(35 + 14, 35 + 29)
      ctx.lineTo(35 + 7, 35 + 49)
      ctx.lineTo(35 + 22, 35 + 25)
      ctx.lineTo(35 + 10, 35 + 25)
      ctx.closePath()
      ctx.fillStyle = '#ffffff'
      ctx.fill()

      // 4. Draw Header Text
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 30px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('easyCRM', 75, 70)

      ctx.fillStyle = '#a7f3d0' // emerald-200
      ctx.font = '500 13px system-ui, -apple-system, sans-serif'
      ctx.fillText('Simple & Professional Lead CRM', 75, 95)

      // 5. Draw Card Body Titles
      ctx.fillStyle = '#0f172a' // slate-900
      ctx.font = 'bold 26px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Scan to Connect', cardWidth / 2, 195)

      ctx.fillStyle = '#64748b' // slate-500
      ctx.font = '14px system-ui, -apple-system, sans-serif'
      ctx.fillText('Point your phone camera here to join as a lead.', cardWidth / 2, 225)

      // 6. Draw QR Code Container Box
      const qrBoxSize = 280
      const qrBoxX = (cardWidth - qrBoxSize) / 2
      const qrBoxY = 265
      const borderRadius = 16

      // Draw rounded container box for the QR Code
      ctx.beginPath()
      ctx.moveTo(qrBoxX + borderRadius, qrBoxY)
      ctx.lineTo(qrBoxX + qrBoxSize - borderRadius, qrBoxY)
      ctx.quadraticCurveTo(qrBoxX + qrBoxSize, qrBoxY, qrBoxX + qrBoxSize, qrBoxY + borderRadius)
      ctx.lineTo(qrBoxX + qrBoxSize, qrBoxY + qrBoxSize - borderRadius)
      ctx.quadraticCurveTo(qrBoxX + qrBoxSize, qrBoxY + qrBoxSize, qrBoxX + qrBoxSize - borderRadius, qrBoxY + qrBoxSize)
      ctx.lineTo(qrBoxX + borderRadius, qrBoxY + qrBoxSize)
      ctx.quadraticCurveTo(qrBoxX, qrBoxY + qrBoxSize, qrBoxX, qrBoxY + qrBoxSize - borderRadius)
      ctx.lineTo(qrBoxX, qrBoxY + borderRadius)
      ctx.quadraticCurveTo(qrBoxX, qrBoxY, qrBoxX + borderRadius, qrBoxY)
      ctx.closePath()
      ctx.fillStyle = '#ffffff'
      ctx.fill()
      ctx.strokeStyle = '#e2e8f0' // slate-200
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Draw QR Image inside the container
      const qrCodeSize = 250
      const qrCodeX = qrBoxX + (qrBoxSize - qrCodeSize) / 2
      const qrCodeY = qrBoxY + (qrBoxSize - qrCodeSize) / 2
      ctx.drawImage(img, qrCodeX, qrCodeY, qrCodeSize, qrCodeSize)

      // 7. Draw Referral Code Pill
      const pillWidth = 200
      const pillHeight = 36
      const pillX = (cardWidth - pillWidth) / 2
      const pillY = 575
      const pillRadius = 8

      ctx.beginPath()
      ctx.moveTo(pillX + pillRadius, pillY)
      ctx.lineTo(pillX + pillWidth - pillRadius, pillY)
      ctx.quadraticCurveTo(pillX + pillWidth, pillY, pillX + pillWidth, pillY + pillRadius)
      ctx.lineTo(pillX + pillWidth, pillY + pillHeight - pillRadius)
      ctx.quadraticCurveTo(pillX + pillWidth, pillY + pillHeight, pillX + pillWidth - pillRadius, pillY + pillHeight)
      ctx.lineTo(pillX + pillRadius, pillY + pillHeight)
      ctx.quadraticCurveTo(pillX, pillY + pillHeight, pillX, pillY + pillHeight - pillRadius)
      ctx.lineTo(pillX, pillY + pillRadius)
      ctx.quadraticCurveTo(pillX, pillY, pillX + pillRadius, pillY)
      ctx.closePath()
      ctx.fillStyle = '#f0fdf4' // emerald-50
      ctx.fill()
      ctx.strokeStyle = '#bbf7d0' // emerald-200
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Referral code text
      ctx.fillStyle = '#047857' // emerald-700
      ctx.font = 'bold 15px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`Code: ${referralCode}`, cardWidth / 2, pillY + 23)

      // 8. Draw Divider Line
      ctx.beginPath()
      ctx.moveTo(40, 640)
      ctx.lineTo(cardWidth - 40, 640)
      ctx.strokeStyle = '#e2e8f0' // slate-200
      ctx.lineWidth = 1
      ctx.stroke()

      // 9. Draw Footer Text
      ctx.fillStyle = '#94a3b8' // slate-400
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Powered by easyCRM', cardWidth / 2, 670)

      // 10. Generate and trigger download
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
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium shadow-sm cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Download QR
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  )
}
