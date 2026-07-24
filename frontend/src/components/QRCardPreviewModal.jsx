import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Download } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

export default function QRCardPreviewModal({ referralCode, userFullName, userEmail, onClose }) {
  const qrRef = useRef(null)
  const canvasRef = useRef(null)
  const [rendered, setRendered] = useState(false)

  const appUrl = import.meta.env.VITE_APP_URL || window.location.origin
  const joinUrl = `${appUrl}/join/${referralCode}`

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const svg = qrRef.current?.querySelector('svg')
      const canvas = canvasRef.current
      if (!svg || !canvas) return

      const ctx = canvas.getContext('2d')
      const data = new XMLSerializer().serializeToString(svg)

      const cardWidth = 500
      const cardHeight = 700
      const scale = 2
      canvas.width = cardWidth * scale
      canvas.height = cardHeight * scale
      ctx.scale(scale, scale)

      const logoImg = new Image()
      logoImg.src = '/logo.png'
      await new Promise(r => { logoImg.onload = r; logoImg.onerror = r })

      const qrImg = new Image()
      qrImg.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(data)))
      await new Promise(r => { qrImg.onload = r; qrImg.onerror = r })

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, cardWidth, cardHeight)

      ctx.fillStyle = '#047857'
      ctx.fillRect(0, 0, cardWidth, 130)

      if (logoImg.width) ctx.drawImage(logoImg, 35, 45, 40, 40)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 30px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('easyCRM', 85, 75)
      ctx.fillStyle = '#a7f3d0'
      ctx.font = '500 13px system-ui, -apple-system, sans-serif'
      ctx.fillText('Simple & Professional Lead CRM', 85, 100)

      ctx.fillStyle = '#0f172a'
      ctx.font = 'bold 24px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(userFullName ? `Connect with ${userFullName}` : 'Scan to Connect', cardWidth / 2, 185)
      ctx.fillStyle = '#64748b'
      ctx.font = '15px system-ui, -apple-system, sans-serif'
      ctx.fillText(userEmail || 'Point your phone camera here to join as a lead.', cardWidth / 2, 215)

      const qrBoxSize = 280
      const qrBoxX = (cardWidth - qrBoxSize) / 2
      const qrBoxY = 245
      const r16 = 16
      ctx.beginPath()
      ctx.moveTo(qrBoxX + r16, qrBoxY)
      ctx.lineTo(qrBoxX + qrBoxSize - r16, qrBoxY)
      ctx.quadraticCurveTo(qrBoxX + qrBoxSize, qrBoxY, qrBoxX + qrBoxSize, qrBoxY + r16)
      ctx.lineTo(qrBoxX + qrBoxSize, qrBoxY + qrBoxSize - r16)
      ctx.quadraticCurveTo(qrBoxX + qrBoxSize, qrBoxY + qrBoxSize, qrBoxX + qrBoxSize - r16, qrBoxY + qrBoxSize)
      ctx.lineTo(qrBoxX + r16, qrBoxY + qrBoxSize)
      ctx.quadraticCurveTo(qrBoxX, qrBoxY + qrBoxSize, qrBoxX, qrBoxY + qrBoxSize - r16)
      ctx.lineTo(qrBoxX, qrBoxY + r16)
      ctx.quadraticCurveTo(qrBoxX, qrBoxY, qrBoxX + r16, qrBoxY)
      ctx.closePath()
      ctx.fillStyle = '#ffffff'
      ctx.fill()
      ctx.strokeStyle = '#e2e8f0'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.drawImage(qrImg, qrBoxX + 15, qrBoxY + 15, qrBoxSize - 30, qrBoxSize - 30)

      const pillWidth = 210, pillHeight = 36
      const pillX = (cardWidth - pillWidth) / 2
      const pillY = 555
      const r8 = 8
      ctx.beginPath()
      ctx.moveTo(pillX + r8, pillY)
      ctx.lineTo(pillX + pillWidth - r8, pillY)
      ctx.quadraticCurveTo(pillX + pillWidth, pillY, pillX + pillWidth, pillY + r8)
      ctx.lineTo(pillX + pillWidth, pillY + pillHeight - r8)
      ctx.quadraticCurveTo(pillX + pillWidth, pillY + pillHeight, pillX + pillWidth - r8, pillY + pillHeight)
      ctx.lineTo(pillX + r8, pillY + pillHeight)
      ctx.quadraticCurveTo(pillX, pillY + pillHeight, pillX, pillY + pillHeight - r8)
      ctx.lineTo(pillX, pillY + r8)
      ctx.quadraticCurveTo(pillX, pillY, pillX + r8, pillY)
      ctx.closePath()
      ctx.fillStyle = '#f0fdf4'
      ctx.fill()
      ctx.strokeStyle = '#bbf7d0'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.fillStyle = '#047857'
      ctx.font = 'bold 15px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`Code: ${referralCode}`, cardWidth / 2, pillY + 23)

      ctx.beginPath()
      ctx.moveTo(40, 620)
      ctx.lineTo(cardWidth - 40, 620)
      ctx.strokeStyle = '#e2e8f0'
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.fillStyle = '#94a3b8'
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Powered by easyCRM', cardWidth / 2, 655)

      setRendered(true)
    }, 100)

    return () => clearTimeout(timeout)
  }, [referralCode, userFullName, userEmail])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `easycrm-qr-${referralCode}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const modal = (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-base">Your QR Card Preview</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 flex flex-col items-center gap-4">
          <div ref={qrRef} className="hidden">
            <QRCodeSVG value={joinUrl} size={250} level="H" bgColor="#ffffff" fgColor="#0f172a" />
          </div>

          <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 flex items-center justify-center min-h-[260px]">
            {!rendered && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <canvas
              ref={canvasRef}
              className="w-full h-auto"
              style={{ display: rendered ? 'block' : 'none' }}
            />
          </div>

          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/20 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download QR Card
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
