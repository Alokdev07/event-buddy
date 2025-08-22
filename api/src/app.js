import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(express.json({limit : "20kb"}))
app.use(express.urlencoded({extended : true}))
app.use(express.static("./public/temp"))
app.use(cookieParser())

app.get('/',(req,res) => {
    res.json("hello world")
})

app.listen(process.env.PORT,() => {
    console.log(`app is listening on port ${process.env.PORT}`)
})

export default app