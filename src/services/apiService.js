// API服务层 - 统一入口，支持真实API和模拟数据切换
import realApiService from './realApiService';

// 检查是否使用真实API
const shouldUseRealAPI = () => {
  const config = JSON.parse(localStorage.getItem('api_config') || '{}');
  return config.useRealAPI === true;
};

// 统一的API服务对象
export const apiService = {
  // 认证相关API
  auth: {
    // 用户登录
    login: async (username, password) => {
      return await realApiService.auth.login(username, password);
    },
    
    // 用户注册
    register: async (username, password, email) => {
      return await realApiService.auth.register(username, password, email);
    },

    // 用户登出
    logout: async () => {
      return await realApiService.auth.logout();
    },

    // 刷新token
    refreshToken: async () => {
      return await realApiService.auth.refreshToken();
    }
  },

  // 用户相关API
  user: {
    // 获取用户信息
    getProfile: async (userId) => {
      return await realApiService.user.getProfile(userId);
    },

    // 更新用户信息
    updateProfile: async (userData) => {
      return await realApiService.user.updateProfile(userData);
    },

    // 上传头像
    uploadAvatar: async (file) => {
      return await realApiService.user.uploadAvatar(file);
    },
  },
  
  // 搭子需求相关API
  demands: {
    // 获取所有需求
    getAll: async (filters = {}) => {
      return await realApiService.demands.getAll(filters);
    },
    
    // 根据ID获取需求详情
    getById: async (demandId) => {
      return await realApiService.demands.getById(demandId);
    },
    
    // 创建新需求
    create: async (demand) => {
      return await realApiService.demands.create(demand);
    },

    // 更新需求
    update: async (demandId, demandData) => {
      return await realApiService.demands.update(demandId, demandData);
    },
    
    // 删除需求
    delete: async (demandId) => {
      return await realApiService.demands.delete(demandId);
    },

    // 搜索需求
    search: async (query, filters = {}) => {
      return await realApiService.demands.search(query, filters);
    },

    // 智能匹配
    match: async (demand) => {
      return await realApiService.demands.match(demand);
    }
  },
  
  // 搭子关系相关API
  partners: {
    // 获取用户的搭子关系
    getPartners: async (userId) => {
      return await realApiService.partners.getPartners(userId);
    },
    
    // 发送搭子邀请
    sendInvitation: async (fromUserId, toUserId, demandId) => {
      return await realApiService.partners.sendInvitation(fromUserId, toUserId, demandId);
    },
    
    // 接受搭子邀请
    acceptInvitation: async (invitationId) => {
      return await realApiService.partners.acceptInvitation(invitationId);
    },
    
    // 拒绝搭子邀请
    rejectInvitation: async (invitationId) => {
      return await realApiService.partners.rejectInvitation(invitationId);
    },

    // 移除搭子
    removePartner: async (partnerId) => {
      return await realApiService.partners.removePartner(partnerId);
    }
  },
  
  // 聊天相关API
  chat: {
    // 获取聊天记录
    getMessages: async (userId1, userId2, page = 1, limit = 50) => {
      return await realApiService.chat.getMessages(userId1, userId2, page, limit);
    },
    
    // 发送消息
    sendMessage: async (fromUserId, toUserId, content, type = 'text') => {
      return await realApiService.chat.sendMessage(fromUserId, toUserId, content, type);
    },

    // 获取聊天房间列表
    getRooms: async (userId) => {
      return await realApiService.chat.getRooms(userId);
    }
  },
  
  // 评分相关API
  ratings: {
    // 提交评分
    submitRating: async (raterId, targetId, rating) => {
      return await realApiService.ratings.submitRating(raterId, targetId, rating);
    },
    
    // 获取用户评分
    getUserRatings: async (userId) => {
      return await realApiService.ratings.getUserRatings(userId);
    }
  },

  // 通知相关API
  notifications: {
    // 获取通知列表
    getList: async (userId, page = 1, limit = 20) => {
      return await realApiService.notifications.getList(userId, page, limit);
    },

    // 标记通知为已读
    markAsRead: async (notificationId) => {
      return await realApiService.notifications.markAsRead(notificationId);
    },

    // 删除通知
    delete: async (notificationId) => {
      return await realApiService.notifications.delete(notificationId);
    },
  },

  // 地图相关API
  location: {
    // 更新用户位置
    updateLocation: async (userId, latitude, longitude, address) => {
      return await realApiService.location.updateLocation(userId, latitude, longitude, address);
    },

    // 获取搭子位置
    getFriendsLocations: async (userId) => {
      return await realApiService.location.getFriendsLocations(userId);
    },

    // 获取附近的需求
    getNearbyDemands: async (latitude, longitude, radius = 5000) => {
      return await realApiService.location.getNearbyDemands(latitude, longitude, radius);
    },
  },

  // API配置管理
  config: {
    // 设置API模式
    setMode: (useRealAPI) => {
      const config = JSON.parse(localStorage.getItem('api_config') || '{}');
      config.useRealAPI = useRealAPI;
      localStorage.setItem('api_config', JSON.stringify(config));
    },

    // 获取当前模式
    getMode: () => {
      const config = JSON.parse(localStorage.getItem('api_config') || '{}');
      return config.useRealAPI || false;
    },

    // 设置API基础URL
    setBaseURL: (baseURL) => {
      const config = JSON.parse(localStorage.getItem('api_config') || '{}');
      config.baseURL = baseURL;
      localStorage.setItem('api_config', JSON.stringify(config));
    },

    // 获取API基础URL
    getBaseURL: () => {
      const config = JSON.parse(localStorage.getItem('api_config') || '{}');
      return config.baseURL || 'http://localhost:3001/api';
    }
  }
};

export default apiService;