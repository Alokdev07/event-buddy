import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import cors from 'cors'


dotenv.config()

const app = express()

app.use(express.json({limit : "20kb"}))
app.use(express.urlencoded({extended : true}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
},))


app.get('/',(req,res) => {
    res.json("hello world")
})

import authRoutes from '../routes/user.route.js'

app.use('/api/v1/users',authRoutes)



export default app