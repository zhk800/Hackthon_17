// API配置文件
export const API_CONFIG = {
  // 开发环境配置
  development: {
    baseURL: 'http://localhost:3001/api', // 本地后端API地址
    timeout: 10000,
    useMockData: true, // 开发时可以使用模拟数据
  },
  
  // 生产环境配置
  production: {
    baseURL: 'https://api.findpartner.com/api', // 生产环境API地址
    timeout: 15000,
    useMockData: false,
  },
  
  // 测试环境配置
  test: {
    baseURL: 'http://test-api.findpartner.com/api',
    timeout: 8000,
    useMockData: true,
  }
};

// 获取当前环境配置
export const getCurrentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return API_CONFIG[env] || API_CONFIG.development;
};

// API端点配置
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
  },
  
  // 用户相关
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
    AVATAR: '/user/avatar',
    SETTINGS: '/user/settings',
  },
  
  // 需求相关
  DEMANDS: {
    LIST: '/demands',
    CREATE: '/demands',
    UPDATE: '/demands/:id',
    DELETE: '/demands/:id',
    SEARCH: '/demands/search',
    MATCH: '/demands/match',
  },
  
  // 搭子关系相关
  PARTNERS: {
    LIST: '/partners',
    INVITE: '/partners/invite',
    ACCEPT: '/partners/accept',
    REJECT: '/partners/reject',
    REMOVE: '/partners/remove',
  },
  
  // 聊天相关
  CHAT: {
    MESSAGES: '/chat/messages',
    SEND: '/chat/send',
    ROOMS: '/chat/rooms',
  },
  
  // 评分相关
  RATINGS: {
    SUBMIT: '/ratings/submit',
    LIST: '/ratings',
    USER_RATINGS: '/ratings/user/:userId',
  },
  
  // 通知相关
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/read',
    DELETE: '/notifications/:id',
  },
  
  // 地图相关
  LOCATION: {
    UPDATE: '/location/update',
    FRIENDS: '/location/friends',
    NEARBY: '/location/nearby',
  }
};

// HTTP状态码常量
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// 错误消息映射
export const ERROR_MESSAGES = {
  [HTTP_STATUS.BAD_REQUEST]: '请求参数错误',
  [HTTP_STATUS.UNAUTHORIZED]: '未授权访问',
  [HTTP_STATUS.FORBIDDEN]: '访问被禁止',
  [HTTP_STATUS.NOT_FOUND]: '资源不存在',
  [HTTP_STATUS.CONFLICT]: '数据冲突',
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: '服务器内部错误',
  [HTTP_STATUS.SERVICE_UNAVAILABLE]: '服务暂时不可用',
  NETWORK_ERROR: '网络连接失败',
  TIMEOUT: '请求超时',
  UNKNOWN: '未知错误',
};
