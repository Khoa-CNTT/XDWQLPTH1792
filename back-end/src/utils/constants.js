import { env } from '~/config/environment'
// Những cái domains được phép truy cập tới tài nguyên server
export const WHITELIST_DOMAINS = [
  // 'http://localhost:5173' // Không cần localhost nữa vì ở file config/cors đã luôn luôn cho phép môi trường dev(env.BUILD_MODE==='dev)
  //... ví dụ sau này chúng ta sẽ deploy lên domain chính thức
  'https://trello-web-wheat.vercel.app'
]
export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

export const WEBSITE_DOMAIN = (env.BUILD_MODE=== 'production') ? env.WEBSITE_DOMAIN_PRODUCTION : env.WEBSITE_DOMAIN_DEVELOPMENT

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12