import { QRCodeSVG } from 'qrcode.react'
import { Download, Copy, Check, Eye } from 'lucide-react'
import { useState, useRef } from 'react'
import QRCardPreviewModal from './QRCardPreviewModal'

export default function QRCodeDisplay({ referralCode, userFullName, userEmail, size = 200 }) {
  const [copied, setCopied] = useState(false)
  const [showModal, setShowModal] = useState(false)
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

  const handleDownload = async () => {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const data = new XMLSerializer().serializeToString(svg)

    const cardWidth = 500
    const cardHeight = 700
    const scale = 2

    canvas.width = cardWidth * scale
    canvas.height = cardHeight * scale
    ctx.scale(scale, scale)

    // Load logo
    const logoImg = new Image()
    logoImg.src = '/logo.png'
    await new Promise(r => { logoImg.onload = r; logoImg.onerror = r })

    // Load QR SVG
    const qrImg = new Image()
    qrImg.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(data)))
    await new Promise(r => { qrImg.onload = r; qrImg.onerror = r })

    // 1. White background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, cardWidth, cardHeight)

    // 2. Emerald header banner
    ctx.fillStyle = '#047857'
    ctx.fillRect(0, 0, cardWidth, 130)

    // 3. Logo image
    if (logoImg.width) {
      ctx.drawImage(logoImg, 35, 45, 40, 40)
    }

    // 4. Brand text
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 30px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('easyCRM', 85, 75)

    ctx.fillStyle = '#a7f3d0'
    ctx.font = '500 13px system-ui, -apple-system, sans-serif'
    ctx.fillText('Simple & Professional Lead CRM', 85, 100)

    // 5. Name & email
    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    const nameText = userFullName ? `Connect with ${userFullName}` : 'Scan to Connect'
    ctx.fillText(nameText, cardWidth / 2, 185)

    ctx.fillStyle = '#64748b'
    ctx.font = '15px system-ui, -apple-system, sans-serif'
    const emailText = userEmail || 'Point your phone camera here to join as a lead.'
    ctx.fillText(emailText, cardWidth / 2, 215)

    // 6. QR Code container box
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

    // Draw QR code inside container
    const qrCodeSize = 250
    const qrCodeX = qrBoxX + (qrBoxSize - qrCodeSize) / 2
    const qrCodeY = qrBoxY + (qrBoxSize - qrCodeSize) / 2
    ctx.drawImage(qrImg, qrCodeX, qrCodeY, qrCodeSize, qrCodeSize)

    // 7. Referral code pill
    const pillWidth = 210
    const pillHeight = 36
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

    // 8. Divider
    ctx.beginPath()
    ctx.moveTo(40, 620)
    ctx.lineTo(cardWidth - 40, 620)
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    ctx.stroke()

    // 9. Footer
    ctx.fillStyle = '#94a3b8'
    ctx.font = 'bold 13px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Powered by easyCRM', cardWidth / 2, 655)

    // 10. Trigger download
    const link = document.createElement('a')
    link.download = `easycrm-qr-${referralCode}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
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
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium shadow-sm cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium shadow-sm cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>

      {showModal && (
        <QRCardPreviewModal
          referralCode={referralCode}
          userFullName={userFullName}
          userEmail={userEmail}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
