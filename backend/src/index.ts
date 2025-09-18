import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { aiAnalysisRouter } from './routes/analysis'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com']
    : ['http://localhost:3000']
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api', limiter)
app.use(express.json({ limit: '1mb' }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/analysis', aiAnalysisRouter)

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 Love Meter v2 API server running on port ${PORT}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
  console.log(`🤖 OpenAI API: ${process.env.OPENAI_API_KEY ? '✅ Configured' : '❌ Missing'}`)
})