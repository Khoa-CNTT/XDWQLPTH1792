/**
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
//client->routers->valication->controler<->service<->model<->database
import express from 'express'
import cors from 'cors' // Dùng để ngăn chặn không cho những domain khác truy cập vào lấy tài nguyên
import { corsOptions } from './config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import cookieParser from 'cookie-parser'

// Xử lý socket real-time với gói socket.io
//https://socket.io/get-started/chat/#integrating-socketio
import http from 'http'
import socketIo from 'socket.io'
const START_SERVER = () => {
  const app = express()
  // Fix cái vụ Cache from disk của ExpressJS
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })
  // Cấu hình Cookie Parser
  app.use(cookieParser())
  //Xử lý cors
  app.use(cors(corsOptions))


  app.use(express.json())
  //Use APIs v1
  app.use('/v1', APIs_V1)
  //Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  // Tạo 1 cái server mới bọc app của express để làm real-time với socket.io
  const server = http.createServer(app)
  // Khởi tạo  biến  io với server và cors
  const io = socketIo(server, { cors: corsOptions })

  io.on('connection', (socket) => {
    // Lắng nghe sự kiện mà client emit lên có tên là FE_USER_INVITED_TO_HOSTEL
    socket.on('FE_USER_INVITED_TO_HOSTEL', (invitation) => {
      // Cách làm nhanh và đơn giản nhất: Emit ngược lại một sự kiện về cho mọi client khác ( Ngoại trừ chính cái thằng gửi req lên) rồi 
      // để phía FE check
      socket.broadcast.emit('BE_USER_INVITED_TO_HOSTEL', invitation)

    })
    socket.on('FE_USER_MESSAGE', (coversation) => {
      socket.broadcast.emit('BE_USER_MESSAGE', coversation)
    })
    socket.on('FE_USER_REPAIR_REQUEST', (request) => {
      socket.broadcast.emit('BE_USER_REPAIR_REQUEST', request)
    })
  })
  if (env.BUILD_MODE === 'production') {
    // Môi trường production( cụ thể là đang support render.com)
    server.listen(process.env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`3. Production: ${env.AUTHOR} , Back_End Server is running successfully at Port ${process.env.PORT}`)
    })
  } else {
    // Môi trường local Dev
    server.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      // eslint-disable-next-line no-console
      console.log(`3. Hello ${env.AUTHOR} , I am running at http://${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}/`)
    })
  }


  // Thực hiên các tác vụ cleanup trước khi dừng server
  exitHook(() => {
    CLOSE_DB()
  })
};
// IIFE chạy chức năng ngay lập tức ()();
(async () => {
  try {
    console.log('1.Connecting to MongoDB Cloud Atlas')
    await CONNECT_DB();
    console.log('2.Connected to MongoDB Cloud Atlas')
    START_SERVER();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(0)
  }
})()
// CONNECT_DB()
//   .then(() => console.log('Connected to MongoDB Cloud Atlas'))
//   .then(()=> START_SERVER())
//   .catch(error => {
//     console.error('Error connecting to MongoDB:', error)
//     process.exit(0)
//   });
