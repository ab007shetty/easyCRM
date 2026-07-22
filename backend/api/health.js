export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    service: 'easyCRM API',
    timestamp: new Date().toISOString()
  })
}
