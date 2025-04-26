let apiRoot = ''
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-api-lh59.onrender.com'
}
export const API_ROOT = apiRoot

export const DEFAULT_MESSAGES = 1
export const DEFAULT_ITEMS_PER_MESSAGES = 10
export const USER_ROLES = {
  CLIENT: 'client',
  LANDLORD:'landlord',
  ADMIN: 'admin'
}
