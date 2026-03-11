import express from 'express'
import { apiRouter } from './routers/apiRouter.js'
import cors from 'cors'
import authRouter from './routers/authRouter.js'

const app = express()

app.use(cors())

const PORT = 3000

app.use(express.json());
app.use('/api', apiRouter)
app.use('/api/auth', authRouter)
app.use((_req, res) => {
    res.status(404).json({message: "Route not found"})
})

app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}/api`)
})