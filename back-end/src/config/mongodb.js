/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
//huynguyenlaminh
//YukSfu89I1yiQZP5
import { env } from '~/config/environment'


import { MongoClient, ServerApiVersion } from 'mongodb'
//Khởi tạo đối tượng trelloDatabaseInstance ban đầu là null (Vì chúng ta chưa connec)
let trelloDatabaseInstance = null
//Khởi tạo 1 đối tượng mongoClientInstance để connect trới MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})
// Kết nối database
export const CONNECT_DB = async () => {
  //Gọi kết nối tới MongoDB Atlas với URI đã khai báo trong thân của môngClientInstance
  await mongoClientInstance.connect()
  //Kết nối thành công thì lấy Database theo tên và gán ngược nó vào biến trelloDatabaseInstance ở trên của chúng ta
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}
// function GET_DB(không async) này có nhiệm vụ export ra cái Trello Database Instance sau khi đã connect thành công tới MongoDB
// để chúng ta sử dụng nhiều nơi khác nhau trong code.
//Lưu ý phải đảm bảo luôn gọi cái GetDB sau khi kết nối thành công tới MongoDB
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must connect to Database first')
  return trelloDatabaseInstance
}
export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}