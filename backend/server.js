import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import healthHandler from './api/health.js'
import treeHandler from './api/leads/tree.js'
import publicAddHandler from './api/leads/public-add.js'
import subLeadsHandler from './api/leads/sub-leads.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Helper wrapper to adapt express (req, res) to Vercel serverless function format
const adapt = (handler) => async (req, res) => {
  try {
    await handler(req, res)
  } catch (err) {
    console.error('API Error:', err)
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || 'Internal server error' })
    }
  }
}

app.all('/api/health', adapt(healthHandler))
app.all('/api/leads/tree', adapt(treeHandler))
app.all('/api/leads/public-add', adapt(publicAddHandler))
app.all('/api/leads/sub-leads', adapt(subLeadsHandler))

app.listen(PORT, () => {
  console.log(`Backend API running locally at http://localhost:${PORT}`)
})
