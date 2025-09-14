// 真实API服务层，支持后端API集成
import httpClient from './httpClient';
import { API_ENDPOINTS } from './apiConfig';

// 模拟数据服务（当后端API不可用时使用）
import mockApiService from './mockApiService';

// 检查是否使用模拟数据
const shouldUseMockData = () => {
  const config = JSON.parse(localStorage.getItem('api_config') || '{}');
  return config.useRealAPI !== true; // 只有当useRealAPI为true时才不使用模拟数据
};

// 模拟延迟（开发环境）
const simulateDelay = (ms = 300) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// 真实API服务对象
export const realApiService = {
  // 认证相关API
  auth: {
    // 用户登录
    login: async (username, password) => {
      if (shouldUseMockData()) {
        return await mockApiService.auth.login(username, password);
      }

      try {
        const response = await httpClient.post(API_ENDPOINTS.AUTH.LOGIN, {
          username,
          password,
        });

        if (response.success && response.data.token) {
          httpClient.setAuthToken(response.data.token);
        }

        // 转换响应格式以匹配前端期望
        return {
          success: response.success,
          user: response.data.user,
          token: response.data.token,
          message: response.message
        };
      } catch (error) {
        console.error('Login API error:', error);
        return {
          success: false,
          message: '登录失败，请检查网络连接',
        };
      }
    },

    // 用户注册
    register: async (username, password, email) => {
      if (shouldUseMockData()) {
        return await mockApiService.auth.register(username, password);
      }

      try {
        const response = await httpClient.post(API_ENDPOINTS.AUTH.REGISTER, {
          username,
          password,
          email,
        });

        return response;
      } catch (error) {
        console.error('Register API error:', error);
        return {
          success: false,
          message: '注册失败，请检查网络连接',
        };
      }
    },

    // 用户登出
    logout: async () => {
      if (shouldUseMockData()) {
        httpClient.setAuthToken(null);
        return { success: true, message: '登出成功' };
      }

      try {
        const response = await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT);
        httpClient.setAuthToken(null);
        return response;
      } catch (error) {
        console.error('Logout API error:', error);
        httpClient.setAuthToken(null);
        return { success: true, message: '登出成功' };
      }
    },

    // 刷新token
    refreshToken: async () => {
      if (shouldUseMockData()) {
        return { success: true };
      }

      try {
        const response = await httpClient.post(API_ENDPOINTS.AUTH.REFRESH);
        
        if (response.success && response.data.token) {
          httpClient.setAuthToken(response.data.token);
        }

        return response;
      } catch (error) {
        console.error('Refresh token API error:', error);
        return { success: false, message: 'Token刷新失败' };
      }
    },
  },

  // 用户相关API
  user: {
    // 获取用户信息
    getProfile: async (userId) => {
      if (shouldUseMockData()) {
        return await mockApiService.user.getProfile(userId);
      }

      try {
        const response = await httpClient.get(API_ENDPOINTS.USER.PROFILE, { userId });
        return response;
      } catch (error) {
        console.error('Get profile API error:', error);
        return {
          success: false,
          message: '获取用户信息失败',
        };
      }
    },

    // 更新用户信息
    updateProfile: async (userData) => {
      if (shouldUseMockData()) {
        return await mockApiService.user.updateProfile(userData);
      }

      try {
        const response = await httpClient.put(API_ENDPOINTS.USER.UPDATE, userData);
        return response;
      } catch (error) {
        console.error('Update profile API error:', error);
        return {
          success: false,
          message: '更新用户信息失败',
        };
      }
    },

    // 上传头像
    uploadAvatar: async (file) => {
      if (shouldUseMockData()) {
        return await mockApiService.user.uploadAvatar(file);
      }

      try {
        const response = await httpClient.upload(API_ENDPOINTS.USER.AVATAR, file);
        return response;
      } catch (error) {
        console.error('Upload avatar API error:', error);
        return {
          success: false,
          message: '头像上传失败',
        };
      }
    },
  },

  // 搭子需求相关API
  demands: {
    // 获取所有需求
    getAll: async (filters = {}) => {
      if (shouldUseMockData()) {
        return await mockApiService.demands.getAll();
      }

      try {
        const response = await httpClient.get(API_ENDPOINTS.DEMANDS.LIST, filters);
        return response;
      } catch (error) {
        console.error('Get demands API error:', error);
        return {
          success: false,
          message: '获取需求列表失败',
        };
      }
    },

    // 根据ID获取需求详情
    getById: async (demandId) => {
      if (shouldUseMockData()) {
        return await mockApiService.demands.getById(demandId);
      }

      try {
        const response = await httpClient.get(`${API_ENDPOINTS.DEMANDS.LIST}/${demandId}`);
        return response;
      } catch (error) {
        console.error('Get demand by ID API error:', error);
        return {
          success: false,
          message: '获取需求详情失败',
        };
      }
    },

    // 创建新需求
    create: async (demand) => {
      if (shouldUseMockData()) {
        return await mockApiService.demands.create(demand);
      }

      try {
        const response = await httpClient.post(API_ENDPOINTS.DEMANDS.CREATE, demand);
        return response;
      } catch (error) {
        console.error('Create demand API error:', error);
        return {
          success: false,
          message: '发布需求失败',
        };
      }
    },

    // 更新需求
    update: async (demandId, demandData) => {
      if (shouldUseMockData()) {
        return await mockApiService.demands.update(demandId, demandData);
      }

      try {
        const response = await httpClient.put(API_ENDPOINTS.DEMANDS.UPDATE, demandData, { id: demandId });
        return response;
      } catch (error) {
        console.error('Update demand API error:', error);
        return {
          success: false,
          message: '更新需求失败',
        };
      }
    },

    // 删除需求
    delete: async (demandId) => {
      if (shouldUseMockData()) {
        return await mockApiService.demands.delete(demandId);
      }

      try {
        const response = await httpClient.delete(API_ENDPOINTS.DEMANDS.DELETE, { id: demandId });
        return response;
      } catch (error) {
        console.error('Delete demand API error:', error);
        return {
          success: false,
          message: '删除需求失败',
        };
      }
    },

    // 搜索需求
    search: async (query, filters = {}) => {
      if (shouldUseMockData()) {
        return await mockApiService.demands.search(query, filters);
      }

      try {
        const response = await httpClient.get(API_ENDPOINTS.DEMANDS.SEARCH, { query, ...filters });
        return response;
      } catch (error) {
        console.error('Search demands API error:', error);
        return {
          success: false,
          message: '搜索需求失败',
        };
      }
    },

    // 智能匹配
    match: async (demand) => {
      if (shouldUseMockData()) {
        return await mockApiService.demands.match(demand);
      }

      try {
        const response = await httpClient.post(API_ENDPOINTS.DEMANDS.MATCH, demand);
        return response;
      } catch (error) {
        console.error('Match demands API error:', error);
        return {
          success: false,
          message: '智能匹配失败',
        };
      }
    },
  },

  // 搭子关系相关API
  partners: {
    // 获取用户的搭子关系
    getPartners: async (userId) => {
      if (shouldUseMockData()) {
        return await mockApiService.partners.getPartners(userId);
      }

      try {
        const response = await httpClient.get(API_ENDPOINTS.PARTNERS.LIST, { userId });
        return response;
      } catch (error) {
        console.error('Get partners API error:', error);
        return {
          success: false,
          message: '获取搭子列表失败',
        };
      }
    },

    // 发送搭子邀请
    sendInvitation: async (fromUserId, toUserId, demandId) => {
      if (shouldUseMockData()) {
        return await mockApiService.partners.sendInvitation(fromUserId, toUserId, demandId);
      }

      try {
        const response = await httpClient.post(API_ENDPOINTS.PARTNERS.INVITE, {
          fromUserId,
          toUserId,
          demandId,
        });
        return response;
      } catch (error) {
        console.error('Send invitation API error:', error);
        return {
          success: false,
          message: '发送邀请失败',
        };
      }
    },

    // 接受搭子邀请
    acceptInvitation: async (invitationId) => {
      if (shouldUseMockData()) {
        return await mockApiService.partners.acceptInvitation(invitationId);
      }

      try {
        const response = await httpClient.post(API_ENDPOINTS.PARTNERS.ACCEPT, { invitationId });
        return response;
      } catch (error) {
        console.error('Accept invitation API error:', error);
        return {
          success: false,
          message: '接受邀请失败',
        };
      }
    },

    // 拒绝搭子邀请
    rejectInvitation: async (invitationId) => {
      if (shouldUseMockData()) {
        return await mockApiService.partners.rejectInvitation(invitationId);
      }

      try {
        const response = await httpClient.post(API_ENDPOINTS.PARTNERS.REJECT, { invitationId });
        return response;
      } catch (error) {
        console.error('Reject invitation API error:', error);
        return {
          success: false,
          message: '拒绝邀请失败',
        };
      }
    },

    // 移除搭子
    removePartner: async (partnerId) => {
      if (shouldUseMockData()) {
        return await mockApiService.partners.removePartner(partnerId);
      }

      try {
        const response = await httpClient.delete(API_ENDPOINTS.PARTNERS.REMOVE, { partnerId });
        return response;
      } catch (error) {
        console.error('Remove partner API error:', error);
        return {
          success: false,
          message: '移除搭子失败',
        };
      }
    },
  },

  // 聊天相关API
  chat: {
    // 获取聊天记录
    getMessages: async (userId1, userId2, page = 1, limit = 50) => {
      if (shouldUseMockData()) {
        return await mockApiService.chat.getMessages(userId1, userId2);
      }

      try {
        const response = await httpClient.get(API_ENDPOINTS.CHAT.MESSAGES, {
          userId1,
          userId2,
          page,
          limit,
        });
        return response;
      } catch (error) {
        console.error('Get messages API error:', error);
        return {
          success: false,
          message: '获取聊天记录失败',
        };
      }
    },

    // 发送消息
    sendMessage: async (fromUserId, toUserId, content, type = 'text') => {
      if (shouldUseMockData()) {
        return await mockApiService.chat.sendMessage(fromUserId, toUserId, content);
      }

      try {
        const response = await httpClient.post(API_ENDPOINTS.CHAT.SEND, {
          fromUserId,
          toUserId,
          content,
          type,
        });
        return response;
      } catch (error) {
        console.error('Send message API error:', error);
        return {
          success: false,
          message: '发送消息失败',
        };
      }
    },

    // 获取聊天房间列表
    getRooms: async (userId) => {
      if (shouldUseMockData()) {
        return await mockApiService.chat.getRooms(userId);
      }

      try {
        const response = await httpClient.get(API_ENDPOINTS.CHAT.ROOMS, { userId });
        return response;
      } catch (error) {
        console.error('Get chat rooms API error:', error);
        return {
          success: false,
          message: '获取聊天房间失败',
        };
      }
    },
  },

  // 评分相关API
  ratings: {
    // 提交评分
    submitRating: async (raterId, targetId, rating) => {
      if (shouldUseMockData()) {
        return await mockApiService.ratings.submitRating(raterId, targetId, rating);
      }

      try {
        const response = await httpClient.post(API_ENDPOINTS.RATINGS.SUBMIT, {
          raterId,
          targetId,
          rating,
        });
        return response;
      } catch (error) {
        console.error('Submit rating API error:', error);
        return {
          success: false,
          message: '评分提交失败',
        };
      }
    },

    // 获取用户评分
    getUserRatings: async (userId) => {
      if (shouldUseMockData()) {
        return await mockApiService.ratings.getUserRatings(userId);
      }

      try {
        const response = await httpClient.get(API_ENDPOINTS.RATINGS.USER_RATINGS, { userId });
        return response;
      } catch (error) {
        console.error('Get user ratings API error:', error);
        return {
          success: false,
          message: '获取用户评分失败',
        };
      }
    },
  },

  // 通知相关API
  notifications: {
    // 获取通知列表
    getList: async (userId, page = 1, limit = 20) => {
      if (shouldUseMockData()) {
        return await mockApiService.notifications.getList(userId);
      }

      try {
        const response = await httpClient.get(API_ENDPOINTS.NOTIFICATIONS.LIST, {
          userId,
          page,
          limit,
        });
        return response;
      } catch (error) {
        console.error('Get notifications API error:', error);
        return {
          success: false,
          message: '获取通知列表失败',
        };
      }
    },

    // 标记通知为已读
    markAsRead: async (notificationId) => {
      if (shouldUseMockData()) {
        return await mockApiService.notifications.markAsRead(notificationId);
      }

      try {
        const response = await httpClient.post(API_ENDPOINTS.NOTIFICATIONS.MARK_READ, {
          notificationId,
        });
        return response;
      } catch (error) {
        console.error('Mark notification as read API error:', error);
        return {
          success: false,
          message: '标记通知失败',
        };
      }
    },

    // 删除通知
    delete: async (notificationId) => {
      if (shouldUseMockData()) {
        return await mockApiService.notifications.delete(notificationId);
      }

      try {
        const response = await httpClient.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE, {
          id: notificationId,
        });
        return response;
      } catch (error) {
        console.error('Delete notification API error:', error);
        return {
          success: false,
          message: '删除通知失败',
        };
      }
    },
  },

  // 地图相关API
  location: {
    // 更新用户位置
    updateLocation: async (userId, latitude, longitude, address) => {
      if (shouldUseMockData()) {
        return await mockApiService.location.updateLocation(userId, latitude, longitude, address);
      }

      try {
        const response = await httpClient.post(API_ENDPOINTS.LOCATION.UPDATE, {
          userId,
          latitude,
          longitude,
          address,
        });
        return response;
      } catch (error) {
        console.error('Update location API error:', error);
        return {
          success: false,
          message: '更新位置失败',
        };
      }
    },

    // 获取搭子位置
    getFriendsLocations: async (userId) => {
      if (shouldUseMockData()) {
        return await mockApiService.location.getFriendsLocations(userId);
      }

      try {
        const response = await httpClient.get(API_ENDPOINTS.LOCATION.FRIENDS, { userId });
        return response;
      } catch (error) {
        console.error('Get friends locations API error:', error);
        return {
          success: false,
          message: '获取搭子位置失败',
        };
      }
    },

    // 获取附近的需求
    getNearbyDemands: async (latitude, longitude, radius = 5000) => {
      if (shouldUseMockData()) {
        return await mockApiService.location.getNearbyDemands(latitude, longitude, radius);
      }

      try {
        const response = await httpClient.get(API_ENDPOINTS.LOCATION.NEARBY, {
          latitude,
          longitude,
          radius,
        });
        return response;
      } catch (error) {
        console.error('Get nearby demands API error:', error);
        return {
          success: false,
          message: '获取附近需求失败',
        };
      }
    },
  },
};

export default realApiService;
