import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import chalk from 'chalk'
import connectDB from './src/dbConnection.js'
import userRouter from './src/routers/userRouter.js'
import memberRouter from './src/routers/memberRouter.js'
import blogRouter from './src/routers/blogRouter.js'
import {notFound, errorHandler} from './src/middleware/errorHandler.js'
import path from 'path'
const __dirname = path.resolve()

const app = express()
dotenv.config()
connectDB()

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.use('/api/users', userRouter)
app.use('/api/members', memberRouter)
app.use('/api/blogs', blogRouter)
app.use('/uploads', express.static(path.resolve('server/src/uploads')))
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/client/build')))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '/client/build/index.html'))
    } )
}
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5000
const environment = process.env.NODE_ENV    
app.listen(
    port, 
    console.log(chalk.yellow.bold(`server is running in ${environment} on port ${port}`)))