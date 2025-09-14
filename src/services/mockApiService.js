// 模拟API服务层，用于开发和测试
import { findSimilarDemands } from '../utils/similarityMatcher';

// 模拟延迟
const simulateDelay = (ms = 300) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// 模拟数据服务
export const mockApiService = {
  // 认证相关API
  auth: {
    // 用户登录
    login: async (username, password) => {
      try {
        await simulateDelay();
        
        // 模拟成功响应
        if (username && password) {
          const user = {
            id: `user_${Date.now()}`,
            username,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            createdAt: new Date().toISOString()
          };
          
          return {
            success: true,
            data: { user, token: `mock_token_${Date.now()}` }
          };
        }
        
        // 模拟失败响应
        return {
          success: false,
          message: '用户名或密码错误'
        };
      } catch (error) {
        console.error('Mock login error:', error);
        return {
          success: false,
          message: '网络错误，请稍后重试'
        };
      }
    },
    
    // 用户注册
    register: async (username, password, email) => {
      try {
        await simulateDelay(500);
        
        // 模拟成功响应
        if (username && password) {
          return {
            success: true,
            message: '注册成功',
            data: { token: `mock_token_${Date.now()}` }
          };
        }
        
        // 模拟失败响应
        return {
          success: false,
          message: '注册失败，请稍后重试'
        };
      } catch (error) {
        console.error('Mock register error:', error);
        return {
          success: false,
          message: '网络错误，请稍后重试'
        };
      }
    },
  },

  // 用户相关API
  user: {
    // 获取用户信息
    getProfile: async (userId) => {
      try {
        await simulateDelay();
        
        const user = {
          id: userId,
          username: '示例用户',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
          email: 'user@example.com',
          createdAt: new Date().toISOString()
        };
        
        return {
          success: true,
          data: user
        };
      } catch (error) {
        console.error('Mock get profile error:', error);
        return {
          success: false,
          message: '获取用户信息失败'
        };
      }
    },

    // 更新用户信息
    updateProfile: async (userData) => {
      try {
        await simulateDelay();
        
        return {
          success: true,
          message: '用户信息更新成功',
          data: userData
        };
      } catch (error) {
        console.error('Mock update profile error:', error);
        return {
          success: false,
          message: '更新用户信息失败'
        };
      }
    },

    // 上传头像
    uploadAvatar: async (file) => {
      try {
        await simulateDelay(1000);
        
        return {
          success: true,
          message: '头像上传成功',
          data: {
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
          }
        };
      } catch (error) {
        console.error('Mock upload avatar error:', error);
        return {
          success: false,
          message: '头像上传失败'
        };
      }
    },
  },
  
  // 搭子需求相关API
  demands: {
    // 获取所有需求
    getAll: async (filters = {}) => {
      try {
        await simulateDelay();
        
        // 从localStorage获取数据（模拟从服务器获取）
        const demands = JSON.parse(localStorage.getItem('findPartner_demands') || '[]');
        
        return {
          success: true,
          data: demands
        };
      } catch (error) {
        console.error('Mock get demands error:', error);
        return {
          success: false,
          message: '获取需求列表失败'
        };
      }
    },

    // 根据ID获取需求详情
    getById: async (demandId) => {
      try {
        await simulateDelay();
        
        const demands = JSON.parse(localStorage.getItem('findPartner_demands') || '[]');
        const demand = demands.find(d => d.id === demandId);
        
        if (demand) {
          return {
            success: true,
            data: demand
          };
        } else {
          return {
            success: false,
            message: '需求不存在'
          };
        }
      } catch (error) {
        console.error('Mock get demand by ID error:', error);
        return {
          success: false,
          message: '获取需求详情失败'
        };
      }
    },
    
    // 创建新需求
    create: async (demand) => {
      try {
        await simulateDelay(400);
        
        // 获取现有需求
        const demands = JSON.parse(localStorage.getItem('findPartner_demands') || '[]');
        
        // 为新需求添加ID和创建时间
        const newDemand = {
          ...demand,
          id: `demand_${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: 'active'
        };
        
        // 添加到列表
        demands.push(newDemand);
        
        // 保存到localStorage（模拟保存到服务器）
        localStorage.setItem('findPartner_demands', JSON.stringify(demands));
        
        return {
          success: true,
          data: newDemand
        };
      } catch (error) {
        console.error('Mock create demand error:', error);
        return {
          success: false,
          message: '发布需求失败'
        };
      }
    },

    // 更新需求
    update: async (demandId, demandData) => {
      try {
        await simulateDelay();
        
        const demands = JSON.parse(localStorage.getItem('findPartner_demands') || '[]');
        const demandIndex = demands.findIndex(d => d.id === demandId);
        
        if (demandIndex !== -1) {
          demands[demandIndex] = { ...demands[demandIndex], ...demandData };
          localStorage.setItem('findPartner_demands', JSON.stringify(demands));
          
          return {
            success: true,
            data: demands[demandIndex]
          };
        }
        
        return {
          success: false,
          message: '需求不存在'
        };
      } catch (error) {
        console.error('Mock update demand error:', error);
        return {
          success: false,
          message: '更新需求失败'
        };
      }
    },
    
    // 删除需求
    delete: async (demandId) => {
      try {
        await simulateDelay();
        
        // 获取现有需求
        let demands = JSON.parse(localStorage.getItem('findPartner_demands') || '[]');
        
        // 过滤掉要删除的需求
        demands = demands.filter(d => d.id !== demandId);
        
        // 保存到localStorage
        localStorage.setItem('findPartner_demands', JSON.stringify(demands));
        
        return {
          success: true,
          message: '需求删除成功'
        };
      } catch (error) {
        console.error('Mock delete demand error:', error);
        return {
          success: false,
          message: '删除需求失败'
        };
      }
    },

    // 搜索需求
    search: async (query, filters = {}) => {
      try {
        await simulateDelay();
        
        const demands = JSON.parse(localStorage.getItem('findPartner_demands') || '[]');
        let filteredDemands = demands;
        
        // 简单的搜索逻辑
        if (query) {
          filteredDemands = demands.filter(demand => 
            demand.type.toLowerCase().includes(query.toLowerCase()) ||
            demand.desc.toLowerCase().includes(query.toLowerCase()) ||
            demand.location.toLowerCase().includes(query.toLowerCase())
          );
        }
        
        return {
          success: true,
          data: filteredDemands
        };
      } catch (error) {
        console.error('Mock search demands error:', error);
        return {
          success: false,
          message: '搜索需求失败'
        };
      }
    },

    // 智能匹配
    match: async (demand) => {
      try {
        await simulateDelay(600);
        
        const demands = JSON.parse(localStorage.getItem('findPartner_demands') || '[]');
        const similarDemands = findSimilarDemands(demand, demands, 30);
        
        return {
          success: true,
          data: similarDemands
        };
      } catch (error) {
        console.error('Mock match demands error:', error);
        return {
          success: false,
          message: '智能匹配失败'
        };
      }
    },
  },
  
  // 搭子关系相关API
  partners: {
    // 获取用户的搭子关系
    getPartners: async (userId) => {
      try {
        await simulateDelay();
        
        // 模拟获取用户的搭子关系
        const pendingFriends = JSON.parse(localStorage.getItem('findPartner_pendingFriends') || '[]');
        const acceptedFriends = JSON.parse(localStorage.getItem('findPartner_acceptedFriends') || '[]');
        
        return {
          success: true,
          data: {
            pending: pendingFriends,
            accepted: acceptedFriends
          }
        };
      } catch (error) {
        console.error('Mock get partners error:', error);
        return {
          success: false,
          message: '获取搭子列表失败'
        };
      }
    },
    
    // 发送搭子邀请
    sendInvitation: async (fromUserId, toUserId, demandId) => {
      try {
        await simulateDelay();
        
        // 模拟发送搭子邀请
        return {
          success: true,
          message: '邀请已发送'
        };
      } catch (error) {
        console.error('Mock send invitation error:', error);
        return {
          success: false,
          message: '发送邀请失败'
        };
      }
    },
    
    // 接受搭子邀请
    acceptInvitation: async (invitationId) => {
      try {
        await simulateDelay();
        
        // 模拟接受搭子邀请
        return {
          success: true,
          message: '已成功添加为搭子'
        };
      } catch (error) {
        console.error('Mock accept invitation error:', error);
        return {
          success: false,
          message: '接受邀请失败'
        };
      }
    },
    
    // 拒绝搭子邀请
    rejectInvitation: async (invitationId) => {
      try {
        await simulateDelay();
        
        // 模拟拒绝搭子邀请
        return {
          success: true,
          message: '已拒绝邀请'
        };
      } catch (error) {
        console.error('Mock reject invitation error:', error);
        return {
          success: false,
          message: '拒绝邀请失败'
        };
      }
    },

    // 移除搭子
    removePartner: async (partnerId) => {
      try {
        await simulateDelay();
        
        // 模拟移除搭子
        return {
          success: true,
          message: '搭子移除成功'
        };
      } catch (error) {
        console.error('Mock remove partner error:', error);
        return {
          success: false,
          message: '移除搭子失败'
        };
      }
    },
  },
  
  // 聊天相关API
  chat: {
    // 获取聊天记录
    getMessages: async (userId1, userId2) => {
      try {
        await simulateDelay();
        
        // 从localStorage获取聊天记录
        const chatKey = `findPartner_chat_${userId1}_${userId2}`;
        const messages = JSON.parse(localStorage.getItem(chatKey) || '[]');
        
        return {
          success: true,
          data: messages
        };
      } catch (error) {
        console.error('Mock get messages error:', error);
        return {
          success: false,
          message: '获取聊天记录失败'
        };
      }
    },
    
    // 发送消息
    sendMessage: async (fromUserId, toUserId, content) => {
      try {
        await simulateDelay(200);
        
        // 创建新消息
        const newMessage = {
          id: `msg_${Date.now()}`,
          from: fromUserId,
          to: toUserId,
          content,
          timestamp: new Date().toISOString(),
          read: false
        };
        
        // 保存到localStorage
        const chatKey1 = `findPartner_chat_${fromUserId}_${toUserId}`;
        const chatKey2 = `findPartner_chat_${toUserId}_${fromUserId}`;
        
        const messages1 = JSON.parse(localStorage.getItem(chatKey1) || '[]');
        const messages2 = JSON.parse(localStorage.getItem(chatKey2) || '[]');
        
        messages1.push(newMessage);
        messages2.push(newMessage);
        
        localStorage.setItem(chatKey1, JSON.stringify(messages1));
        localStorage.setItem(chatKey2, JSON.stringify(messages2));
        
        return {
          success: true,
          data: newMessage
        };
      } catch (error) {
        console.error('Mock send message error:', error);
        return {
          success: false,
          message: '发送消息失败'
        };
      }
    },

    // 获取聊天房间列表
    getRooms: async (userId) => {
      try {
        await simulateDelay();
        
        // 模拟聊天房间列表
        const rooms = [
          {
            id: 'room_1',
            name: '羽毛球搭子群',
            lastMessage: '明天见！',
            timestamp: new Date().toISOString(),
            unreadCount: 2
          }
        ];
        
        return {
          success: true,
          data: rooms
        };
      } catch (error) {
        console.error('Mock get chat rooms error:', error);
        return {
          success: false,
          message: '获取聊天房间失败'
        };
      }
    },
  },
  
  // 评分相关API
  ratings: {
    // 提交评分
    submitRating: async (raterId, targetId, rating) => {
      try {
        await simulateDelay();
        
        // 模拟提交评分
        const ratings = JSON.parse(localStorage.getItem('findPartner_ratings') || '[]');
        
        ratings.push({
          id: `rating_${Date.now()}`,
          raterId,
          targetId,
          rating,
          createdAt: new Date().toISOString()
        });
        
        localStorage.setItem('findPartner_ratings', JSON.stringify(ratings));
        
        return {
          success: true,
          message: '评分提交成功'
        };
      } catch (error) {
        console.error('Mock submit rating error:', error);
        return {
          success: false,
          message: '评分提交失败'
        };
      }
    },
    
    // 获取用户评分
    getUserRatings: async (userId) => {
      try {
        await simulateDelay();
        
        // 模拟获取用户评分
        const ratings = JSON.parse(localStorage.getItem('findPartner_ratings') || '[]');
        const userRatings = ratings.filter(r => r.targetId === userId);
        
        return {
          success: true,
          data: userRatings
        };
      } catch (error) {
        console.error('Mock get user ratings error:', error);
        return {
          success: false,
          message: '获取用户评分失败'
        };
      }
    },
  },

  // 通知相关API
  notifications: {
    // 获取通知列表
    getList: async (userId) => {
      try {
        await simulateDelay();
        
        // 模拟通知列表
        const notifications = [
          {
            id: 'notif_1',
            type: 'invitation',
            title: '新的搭子邀请',
            message: '有人邀请您一起打羽毛球',
            timestamp: new Date().toISOString(),
            read: false
          }
        ];
        
        return {
          success: true,
          data: notifications
        };
      } catch (error) {
        console.error('Mock get notifications error:', error);
        return {
          success: false,
          message: '获取通知列表失败'
        };
      }
    },

    // 标记通知为已读
    markAsRead: async (notificationId) => {
      try {
        await simulateDelay();
        
        return {
          success: true,
          message: '通知已标记为已读'
        };
      } catch (error) {
        console.error('Mock mark notification as read error:', error);
        return {
          success: false,
          message: '标记通知失败'
        };
      }
    },

    // 删除通知
    delete: async (notificationId) => {
      try {
        await simulateDelay();
        
        return {
          success: true,
          message: '通知删除成功'
        };
      } catch (error) {
        console.error('Mock delete notification error:', error);
        return {
          success: false,
          message: '删除通知失败'
        };
      }
    },
  },

  // 地图相关API
  location: {
    // 更新用户位置
    updateLocation: async (userId, latitude, longitude, address) => {
      try {
        await simulateDelay();
        
        // 模拟更新位置
        const location = {
          userId,
          latitude,
          longitude,
          address,
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem(`findPartner_location_${userId}`, JSON.stringify(location));
        
        return {
          success: true,
          message: '位置更新成功',
          data: location
        };
      } catch (error) {
        console.error('Mock update location error:', error);
        return {
          success: false,
          message: '更新位置失败'
        };
      }
    },

    // 获取搭子位置
    getFriendsLocations: async (userId) => {
      try {
        await simulateDelay();
        
        // 模拟搭子位置数据
        const locations = [
          {
            userId: 'friend_1',
            latitude: 31.2304,
            longitude: 121.4737,
            address: '上海交通大学',
            timestamp: new Date().toISOString()
          }
        ];
        
        return {
          success: true,
          data: locations
        };
      } catch (error) {
        console.error('Mock get friends locations error:', error);
        return {
          success: false,
          message: '获取搭子位置失败'
        };
      }
    },

    // 获取附近的需求
    getNearbyDemands: async (latitude, longitude, radius = 5000) => {
      try {
        await simulateDelay();
        
        const demands = JSON.parse(localStorage.getItem('findPartner_demands') || '[]');
        
        return {
          success: true,
          data: demands
        };
      } catch (error) {
        console.error('Mock get nearby demands error:', error);
        return {
          success: false,
          message: '获取附近需求失败'
        };
      }
    },
  },
};

export default mockApiService;
