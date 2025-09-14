import React, { useState, useEffect } from "react";
import NewPartnerForm from "./components/NewPartnerForm";
import NewCommunityList from "./components/NewCommunityList";
import Friends from "./components/Friends";
import AuthPage from "./components/AuthPage";
import TechBackground from "./components/TechBackground";
import TabSystem from "./components/TabSystem";
import MatchModal from "./components/MatchModal";
import MapComponent from "./components/MapComponent";
import RatingModal from "./components/RatingModal";
import Notification from "./components/Notification";
import ApiConfigModal from "./components/ApiConfigModal";
import { findSimilarDemands } from "./utils/similarityMatcher";
import notificationService from './services/notificationService';
import apiService from './services/apiService';
import "./App.css";

// 数据持久化工具函数
const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('保存数据失败:', error);
  }
};

const loadFromLocalStorage = (key, defaultValue = []) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error('加载数据失败:', error);
    return defaultValue;
  }
};

function App() {
  // 用户认证状态
  const [user, setUser] = useState(() => loadFromLocalStorage('findPartner_user', null));
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  // 通知功能状态
  const [notifications, setNotifications] = useState([]);

  // 匹配功能状态
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchResults, setMatchResults] = useState([]);
  const [pendingDemand, setPendingDemand] = useState(null);
  
  // 评分功能状态
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRatingPartner, setSelectedRatingPartner] = useState(null);
  
  // API配置状态
  const [showApiConfigModal, setShowApiConfigModal] = useState(false);
  
  // 选项卡状态
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  
  // 修复未定义的状态
  const [friends, setFriends] = useState([]);
  
  // 检查是否使用真实API
  const isUsingRealAPI = () => {
    const config = JSON.parse(localStorage.getItem('api_config') || '{}');
    return config.useRealAPI === true;
  };

  // 通用的搭子数据丰富化函数
  const enrichPartnersWithDemandInfo = async (partnerList) => {
    const enrichedPartners = [];
    const currentUserId = user.id || user.userId;
    
    for (const partner of partnerList) {
      try {
        // 获取需求详情
        const demandResult = await apiService.demands.getById(partner.demandId);
        if (demandResult.success && demandResult.data) {
          const demand = demandResult.data;
          
          // 确定要显示的搭子信息
          let partnerInfo = {};
          if (partner.fromUserId === currentUserId) {
            // 当前用户是邀请发送者，显示被邀请者信息
            partnerInfo = {
              author: `用户_${partner.toUserId.slice(-4)}`, // 简化显示
              authorId: partner.toUserId
            };
          } else {
            // 当前用户是被邀请者，显示邀请发送者信息
            partnerInfo = {
              author: demand.author || '匿名用户',
              authorId: demand.authorId
            };
          }
          
          enrichedPartners.push({
            ...partner,
            type: demand.type || demand.activityType || '未知活动',
            time: demand.time || '待定',
            location: demand.location || '待定',
            desc: demand.desc || demand.description || '暂无描述',
            ...partnerInfo
          });
        } else {
          // 如果获取需求详情失败，使用基本信息
          let partnerInfo = {};
          if (partner.fromUserId === currentUserId) {
            partnerInfo = {
              author: `用户_${partner.toUserId.slice(-4)}`,
              authorId: partner.toUserId
            };
          } else {
            partnerInfo = {
              author: '匿名用户',
              authorId: partner.fromUserId
            };
          }
          
          enrichedPartners.push({
            ...partner,
            type: '未知活动',
            time: '待定',
            location: '待定',
            desc: '暂无描述',
            ...partnerInfo
          });
        }
      } catch (error) {
        console.error('获取需求详情失败:', error);
        let partnerInfo = {};
        if (partner.fromUserId === currentUserId) {
          partnerInfo = {
            author: `用户_${partner.toUserId.slice(-4)}`,
            authorId: partner.toUserId
          };
        } else {
          partnerInfo = {
            author: '匿名用户',
            authorId: partner.fromUserId
          };
        }
        
        enrichedPartners.push({
          ...partner,
          type: '未知活动',
          time: '待定',
          location: '待定',
          desc: '暂无描述',
          ...partnerInfo
        });
      }
    }
    return enrichedPartners;
  };

  // 从本地存储加载数据，根据API模式决定是否加载测试数据
  const [demands, setDemands] = useState(() => {
    const savedDemands = loadFromLocalStorage('findPartner_demands', []);
    const config = JSON.parse(localStorage.getItem('api_config') || '{}');
    
    // 如果使用真实API，返回空数组，稍后从API加载
    if (config.useRealAPI === true) {
      return [];
    }
    
    // 如果使用模拟API且没有保存的数据，返回测试数据
    if (config.useRealAPI !== true && savedDemands.length === 0) {
      return [
        {
          id: 1,
          type: "羽毛球",
          time: "周六下午14:00-16:00",
          location: "上海交通大学体育馆羽毛球场A区",
          desc: "水平一般，求搭子",
          author: "示例用户1",
          ratings: { experience: 4.5, reliability: 4.8, communication: 4.6 },
          totalRating: 4.6
        },
        {
          id: 2,
          type: "电影",
          time: "今晚20:00",
          location: "徐汇区星轶IMAX影城8号厅",
          desc: "想看《奥本海默》，一起讨论",
          author: "示例用户2",
          ratings: { experience: 4.2, reliability: 4.3, communication: 4.0 },
          totalRating: 4.2
        },
        {
          id: 3,
          type: "篮球",
          time: "周日上午10:00-12:00",
          location: "闵行校区北区篮球场",
          desc: "3v3比赛，缺一个人",
          author: "篮球爱好者",
          ratings: { experience: 4.7, reliability: 4.5, communication: 4.4 },
          totalRating: 4.5
        },
        {
          id: 4,
          type: "学习小组",
          time: "每天晚上19:00-21:00",
          location: "图书馆三楼自习室",
          desc: "期末复习，组队学习",
          author: "学霸小明",
          ratings: { experience: 4.8, reliability: 4.9, communication: 4.7 },
          totalRating: 4.8
        }
      ];
    }
    
    return savedDemands;
  });
  
  // 搭子状态管理
  const [pendingFriends, setPendingFriends] = useState(() => loadFromLocalStorage('findPartner_pendingFriends', []));
  const [acceptedFriends, setAcceptedFriends] = useState(() => loadFromLocalStorage('findPartner_acceptedFriends', []));
  const [partnerHistory, setPartnerHistory] = useState(() => loadFromLocalStorage('findPartner_partnerHistory', []));
  const [activePartners, setActivePartners] = useState(() => loadFromLocalStorage('findPartner_activePartners', []));
  
  // 位置信息状态管理
  const [friendsLocations, setFriendsLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // 聊天记录以用户id为key
  const [chatLogs, setChatLogs] = useState(() => loadFromLocalStorage('findPartner_chatLogs', {}));
  
  // 选中的用户/需求
  const [selectedUserId, setSelectedUserId] = useState(null);

  // 数据持久化
  useEffect(() => {
    saveToLocalStorage('findPartner_user', user);
  }, [user]);

  // 在真实API模式下加载数据
  useEffect(() => {
    const loadDataFromAPI = async () => {
      if (isUsingRealAPI()) {
        try {
          console.log('正在从API加载数据...');
          // 加载需求数据
          const demandsResult = await apiService.demands.getAll();
          console.log('需求数据加载结果:', demandsResult);
          if (demandsResult.success && demandsResult.data) {
            setDemands(demandsResult.data);
            console.log('已设置需求数据:', demandsResult.data);
          }
          
          // 如果有用户登录，加载用户相关数据
          if (user) {
            const partnersResult = await apiService.partners.getPartners(user.id || user.userId);
            if (partnersResult.success && partnersResult.data) {
              // 处理搭子数据 - 后端返回 {pending: [...], accepted: [...]}
              const partners = partnersResult.data;
              
              // 使用通用函数为邀请数据添加需求详情
              
              const enrichedPending = await enrichPartnersWithDemandInfo(partners.pending || []);
              const enrichedAccepted = await enrichPartnersWithDemandInfo(partners.accepted || []);
              
              setPendingFriends(enrichedPending);
              setAcceptedFriends(enrichedAccepted);
              setActivePartners(enrichedAccepted); // 已接受的搭子也是活跃的
              setPartnerHistory([]); // 暂时为空，后续可以添加历史记录功能
            }
          }
        } catch (error) {
          console.error('加载API数据失败:', error);
        }
      }
    };

    loadDataFromAPI();
  }, [user]); // 移除isUsingRealAPI依赖，因为它是一个函数

  // 监听API配置变化，重新加载数据
  useEffect(() => {
    const handleStorageChange = () => {
      if (isUsingRealAPI()) {
        // 清空当前数据，重新从API加载
        setDemands([]);
        setPendingFriends([]);
        setAcceptedFriends([]);
        setActivePartners([]);
        setPartnerHistory([]);
        
        // 重新加载数据
        const loadDataFromAPI = async () => {
          try {
            console.log('API配置已更改，重新加载数据...');
            const demandsResult = await apiService.demands.getAll();
            if (demandsResult.success && demandsResult.data) {
              setDemands(demandsResult.data);
              console.log('已重新设置需求数据:', demandsResult.data);
            }
          } catch (error) {
            console.error('重新加载API数据失败:', error);
          }
        };
        
        loadDataFromAPI();
      }
    };

    // 监听localStorage变化
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    saveToLocalStorage('findPartner_demands', demands);
  }, [demands]);

  useEffect(() => {
    saveToLocalStorage('findPartner_pendingFriends', pendingFriends);
  }, [pendingFriends]);

  useEffect(() => {
    saveToLocalStorage('findPartner_acceptedFriends', acceptedFriends);
  }, [acceptedFriends]);

  useEffect(() => {
    saveToLocalStorage('findPartner_partnerHistory', partnerHistory);
  }, [partnerHistory]);

  useEffect(() => {
    saveToLocalStorage('findPartner_activePartners', activePartners);
  }, [activePartners]);

  useEffect(() => {
    saveToLocalStorage('findPartner_chatLogs', chatLogs);
  }, [chatLogs]);

  const handlePartnerSubmit = async (form) => {
    // 确保用户已登录
    if (!user) {
      notificationService.show('请先登录后再发布需求', 'error', 3000);
      setShowAuthPage(true);
      return;
    }

    const newDemand = { 
      ...form, 
      id: Date.now(),
      author: user.username,
      authorId: user.id || user.userId, // 添加用户ID
      createdAt: new Date().toISOString(),
      ratings: { experience: 0, reliability: 0, communication: 0 },
      totalRating: 0,
      ratingCount: 0
    };
    
    try {
      // 如果使用真实API，先进行智能匹配
      if (isUsingRealAPI()) {
        // 先进行智能匹配
        const matchResult = await apiService.demands.match(newDemand);
        if (matchResult.success && matchResult.data && matchResult.data.length > 0) {
          // 有相似需求，显示匹配弹窗
          setPendingDemand(newDemand);
          setMatchResults(matchResult.data);
          setShowMatchModal(true);
        } else {
          // 没有相似需求，直接发布到社区
          const result = await apiService.demands.create(newDemand);
          if (result.success) {
            // 从API获取更新后的需求列表
            const demandsResult = await apiService.demands.getAll();
            if (demandsResult.success) {
              setDemands(demandsResult.data || []);
              notificationService.show('需求发布成功！', 'success', 3000);
            }
          } else {
            notificationService.show(result.message || '需求发布失败', 'error', 3000);
          }
        }
        return;
      }
      
      // 使用模拟API时的处理
      // 搜索相似需求
      const similarDemands = findSimilarDemands(newDemand, demands, 30);
      
      if (similarDemands.length > 0) {
        // 有相似需求，显示匹配弹窗
        setPendingDemand(newDemand);
        setMatchResults(similarDemands);
        setShowMatchModal(true);
      } else {
        // 没有相似需求，直接发布到社区
        setDemands([newDemand, ...demands]);
        notificationService.show('需求发布成功！', 'success', 3000);
      }
    } catch (error) {
      console.error('发布需求失败:', error);
      notificationService.show('发布需求时发生错误，请稍后重试', 'error', 3000);
    }
  };
  
  // 处理搭子邀请
  const handleAddFriend = async (partner) => {
    // 确保用户已登录
    if (!user) {
      notificationService.show('请先登录后再添加搭子', 'error', 3000);
      setShowAuthPage(true);
      return;
    }

    if (!pendingFriends.some(f => f.id === partner.id)) {
      try {
        // 如果使用真实API，通过API发送邀请
        if (isUsingRealAPI()) {
          const result = await apiService.partners.sendInvitation(
            user.id || user.userId, 
            partner.authorId || partner.id, 
            partner.id
          );
          if (result.success) {
            notificationService.show('搭子邀请发送成功！', 'success', 3000);
            // 重新加载搭子数据
            const partnersResult = await apiService.partners.getPartners(user.id || user.userId);
            if (partnersResult.success && partnersResult.data) {
              const partners = partnersResult.data;
              
              // 使用通用函数为邀请数据添加需求详情
              
              const enrichedPending = await enrichPartnersWithDemandInfo(partners.pending || []);
              const enrichedAccepted = await enrichPartnersWithDemandInfo(partners.accepted || []);
              
              setPendingFriends(enrichedPending);
              setAcceptedFriends(enrichedAccepted);
            }
          } else {
            notificationService.show(result.message || '发送邀请失败', 'error', 3000);
          }
        } else {
          // 使用模拟API时的处理
          setPendingFriends([...pendingFriends, { ...partner, status: 'pending' }]);
          notificationService.show('搭子邀请发送成功！', 'success', 3000);
        }
      } catch (error) {
        console.error('发送搭子邀请失败:', error);
        notificationService.show('发送邀请时发生错误，请稍后重试', 'error', 3000);
      }
    }
  };
  
  // 接受搭子邀请
  const handleAcceptFriend = async (partnerId) => {
    const partner = pendingFriends.find(f => f.id === partnerId);
    if (partner) {
      // 检查权限：只有被邀请者(toUserId)可以同意邀请
      const currentUserId = user.id || user.userId;
      if (partner.toUserId !== currentUserId) {
        notificationService.show('您没有权限处理此邀请', 'error', 3000);
        return;
      }
      
      try {
        if (isUsingRealAPI()) {
          // 调用API接受邀请
          const result = await apiService.partners.acceptInvitation(partnerId);
          if (result.success) {
            notificationService.show('已成功添加为搭子！', 'success', 3000);
            // 重新加载搭子数据
            const partnersResult = await apiService.partners.getPartners(user.id || user.userId);
            if (partnersResult.success && partnersResult.data) {
              const partners = partnersResult.data;
              
              // 使用通用函数为邀请数据添加需求详情
              
              const enrichedPending = await enrichPartnersWithDemandInfo(partners.pending || []);
              const enrichedAccepted = await enrichPartnersWithDemandInfo(partners.accepted || []);
              
              setPendingFriends(enrichedPending);
              setAcceptedFriends(enrichedAccepted);
            }
          } else {
            notificationService.show(result.message || '接受邀请失败', 'error', 3000);
          }
        } else {
          // 模拟API模式
          setAcceptedFriends([...acceptedFriends, { ...partner, status: 'accepted', startDate: new Date().toISOString() }]);
          setPendingFriends(pendingFriends.filter(f => f.id !== partnerId));
          setActivePartners([...activePartners, { ...partner, status: 'active' }]);
        }
      } catch (error) {
        console.error('接受邀请失败:', error);
        notificationService.show('接受邀请时发生错误，请稍后重试', 'error', 3000);
      }
    }
  };
  
  // 拒绝搭子邀请
  const handleRejectFriend = async (partnerId) => {
    const partner = pendingFriends.find(f => f.id === partnerId);
    if (partner) {
      // 检查权限：只有被邀请者(toUserId)可以拒绝邀请
      const currentUserId = user.id || user.userId;
      if (partner.toUserId !== currentUserId) {
        notificationService.show('您没有权限处理此邀请', 'error', 3000);
        return;
      }
    }
    
    try {
      if (isUsingRealAPI()) {
        // 调用API拒绝邀请
        const result = await apiService.partners.rejectInvitation(partnerId);
        if (result.success) {
          notificationService.show('已拒绝邀请', 'info', 3000);
          // 重新加载搭子数据
          const partnersResult = await apiService.partners.getPartners(user.id || user.userId);
          if (partnersResult.success && partnersResult.data) {
            const partners = partnersResult.data;
            
            // 为邀请数据添加需求详情
            const enrichPartnersWithDemandInfo = async (partnerList) => {
              const enrichedPartners = [];
              for (const partner of partnerList) {
                try {
                  // 获取需求详情
                  const demandResult = await apiService.demands.getById(partner.demandId);
                  if (demandResult.success && demandResult.data) {
                    const demand = demandResult.data;
                    enrichedPartners.push({
                      ...partner,
                      type: demand.type || demand.activityType || '未知活动',
                      time: demand.time || '待定',
                      location: demand.location || '待定',
                      desc: demand.desc || demand.description || '暂无描述',
                      author: demand.author || '匿名用户',
                      authorId: demand.authorId
                    });
                  } else {
                    // 如果获取需求详情失败，使用基本信息
                    enrichedPartners.push({
                      ...partner,
                      type: '未知活动',
                      time: '待定',
                      location: '待定',
                      desc: '暂无描述',
                      author: '匿名用户'
                    });
                  }
                } catch (error) {
                  console.error('获取需求详情失败:', error);
                  enrichedPartners.push({
                    ...partner,
                    type: '未知活动',
                    time: '待定',
                    location: '待定',
                    desc: '暂无描述',
                    author: '匿名用户'
                  });
                }
              }
              return enrichedPartners;
            };
            
            const enrichedPending = await enrichPartnersWithDemandInfo(partners.pending || []);
            const enrichedAccepted = await enrichPartnersWithDemandInfo(partners.accepted || []);
            
            setPendingFriends(enrichedPending);
            setAcceptedFriends(enrichedAccepted);
          }
        } else {
          notificationService.show(result.message || '拒绝邀请失败', 'error', 3000);
        }
      } else {
        // 模拟API模式
        setPendingFriends(pendingFriends.filter(f => f.id !== partnerId));
      }
    } catch (error) {
      console.error('拒绝邀请失败:', error);
      notificationService.show('拒绝邀请时发生错误，请稍后重试', 'error', 3000);
    }
  };
  
  // 结束搭子关系
  const handleEndPartner = (partnerId) => {
    const partner = acceptedFriends.find(f => f.id === partnerId);
    if (partner) {
      // 从已接受列表中移除
      setAcceptedFriends(acceptedFriends.filter(f => f.id !== partnerId));
      // 从活跃搭子中移除
      setActivePartners(activePartners.filter(f => f.id !== partnerId));
      // 添加到历史记录
      setPartnerHistory([...partnerHistory, { ...partner, endDate: new Date().toISOString() }]);
      // 显示评分弹窗
      setSelectedRatingPartner(partner);
      setShowRatingModal(true);
    }
  };
  
  // 提交评分
  const handleSubmitRating = (ratings) => {
    if (selectedRatingPartner) {
      // 更新用户的评分
      const updatedDemands = demands.map(demand => {
        if (demand.author === selectedRatingPartner.author) {
          const currentRatings = demand.ratings || { experience: 0, reliability: 0, communication: 0 };
          const currentCount = demand.ratingCount || 0;
          
          // 计算平均分
          const newExperience = (currentRatings.experience * currentCount + ratings.experience) / (currentCount + 1);
          const newReliability = (currentRatings.reliability * currentCount + ratings.reliability) / (currentCount + 1);
          const newCommunication = (currentRatings.communication * currentCount + ratings.communication) / (currentCount + 1);
          const newTotalRating = (newExperience + newReliability + newCommunication) / 3;
          
          return {
            ...demand,
            ratings: { experience: newExperience, reliability: newReliability, communication: newCommunication },
            totalRating: newTotalRating,
            ratingCount: currentCount + 1
          };
        }
        return demand;
      });
      
      setDemands(updatedDemands);
      setShowRatingModal(false);
      setSelectedRatingPartner(null);
    }
  };
  
  // 发送消息
  const handleSendMessage = async (userId, msg) => {
    if (!userId) return;
    
    // 确保用户已登录
    if (!user) {
      notificationService.show('请先登录后再发送消息', 'error', 3000);
      setShowAuthPage(true);
      return;
    }

    try {
      // 如果使用真实API，通过API发送消息
      if (isUsingRealAPI()) {
        const result = await apiService.chat.sendMessage(
          user.id || user.userId,
          userId,
          msg,
          'text'
        );
        if (result.success) {
          // 更新本地聊天记录
          setChatLogs((prev) => ({
            ...prev,
            [userId]: [...(prev[userId] || []), {
              from: user.username,
              text: msg,
              timestamp: Date.now()
            }],
          }));
        } else {
          notificationService.show(result.message || '发送消息失败', 'error', 3000);
        }
      } else {
        // 使用模拟API时的处理
        setChatLogs((prev) => ({
          ...prev,
          [userId]: [...(prev[userId] || []), {
            from: user.username,
            text: msg,
            timestamp: Date.now()
          }],
        }));
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      notificationService.show('发送消息时发生错误，请稍后重试', 'error', 3000);
    }
  };
  
  // 查看需求/用户详情
  const handleViewDetails = (item) => {
    setSelectedUserId(item.id);
  };

  // 用户认证处理函数
  const handleLogin = (userData) => {
    // 确保用户数据包含ID
    const userWithId = {
      ...userData,
      id: userData.id || userData.userId || Date.now(), // 确保有ID
      userId: userData.id || userData.userId || Date.now()
    };
    setUser(userWithId);
    setShowAuthPage(false);
    notificationService.show(`欢迎回来，${userWithId.username}！`, 'success', 3000);
  };

  const handleLogout = async () => {
    try {
      // 如果使用真实API，调用登出API
      if (isUsingRealAPI()) {
        await apiService.auth.logout();
      }
      
      // 清理本地状态
      setUser(null);
      setSelectedUserId(null);
      setDemands([]);
      setPendingFriends([]);
      setAcceptedFriends([]);
      setPartnerHistory([]);
      setActivePartners([]);
      setChatLogs({});
      setFriendsLocations([]);
      
      notificationService.show('已成功登出', 'success', 3000);
    } catch (error) {
      console.error('登出失败:', error);
      // 即使API调用失败，也要清理本地状态
      setUser(null);
      setSelectedUserId(null);
      notificationService.show('已登出（本地）', 'info', 3000);
    }
  };

  const handleSwitchToRegister = () => {
    setAuthMode('register');
  };

  const handleSwitchToLogin = () => {
    setAuthMode('login');
  };

  const handleBackToMain = () => {
    setShowAuthPage(false);
  };

  // 匹配结果处理函数
  const handleSelectMatch = (match, action = 'chat') => {
    if (action === 'addFriend') {
      // 直接添加为搭子
      if (!pendingFriends.some((f) => f.id === match.id)) {
        setPendingFriends([...pendingFriends, { ...match, status: 'pending' }]);
      }
    } else {
      // 选择聊天
      setSelectedUserId(match.id);
    }
    
    // 关闭匹配弹窗
    setShowMatchModal(false);
    setMatchResults([]);
    setPendingDemand(null);
    
    // 切换到搭子列表选项卡
    setActiveTabIndex(1);
  };

  const handlePublishToCommunity = async () => {
    if (pendingDemand) {
      try {
        if (isUsingRealAPI()) {
          // 真实API模式：通过API发布需求
          const result = await apiService.demands.create(pendingDemand);
          if (result.success) {
            // 从API获取更新后的需求列表
            const demandsResult = await apiService.demands.getAll();
            if (demandsResult.success) {
              setDemands(demandsResult.data || []);
              notificationService.show('需求发布成功！', 'success', 3000);
            }
          } else {
            notificationService.show(result.message || '需求发布失败', 'error', 3000);
          }
        } else {
          // 模拟API模式：直接添加到本地状态
          setDemands([pendingDemand, ...demands]);
          notificationService.show('需求发布成功！', 'success', 3000);
        }
      } catch (error) {
        console.error('发布需求失败:', error);
        notificationService.show('发布需求时发生错误，请稍后重试', 'error', 3000);
      }
    }
    
    // 关闭匹配弹窗
    setShowMatchModal(false);
    setMatchResults([]);
    setPendingDemand(null);
  };

  const handleCloseMatchModal = () => {
    setShowMatchModal(false);
    setMatchResults([]);
    setPendingDemand(null);
  };

  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
    setSelectedRatingPartner(null);
  };

  const handleCloseApiConfigModal = () => {
    setShowApiConfigModal(false);
  };

  // 数据管理功能
  const clearAllData = () => {
    if (window.confirm('确定要清空所有数据吗？此操作不可恢复！')) {
      setDemands([]);
      setPendingFriends([]);
      setAcceptedFriends([]);
      setPartnerHistory([]);
      setActivePartners([]);
      setChatLogs({});
      setSelectedUserId(null);
    }
  };

  const exportData = () => {
    const data = {
      demands,
      friends,
      chatLogs,
      exportTime: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `findPartner_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.demands) setDemands(data.demands);
        if (data.friends) setFriends(data.friends);
        if (data.chatLogs) setChatLogs(data.chatLogs);
        alert('数据导入成功！');
      } catch (error) {
        alert('数据格式错误，导入失败！');
      }
    };
    reader.readAsText(file);
  };

  // 选项卡配置
  const tabs = [
    { label: "寻找搭子", icon: "👥", color: "#5b73ff" },
    { label: "社区广场", icon: "🌐", color: "#8b5cf6" },
    { label: "我的搭子", icon: "🤝", color: "#10b981" },
    { label: "进行中", icon: "⏱️", color: "#f59e0b" },
    { label: "历史记录", icon: "📋", color: "#ef4444" },
    { label: "地图", icon: "🗺️", color: "#3b82f6" }
  ];

  // 定期更新搭子位置信息（模拟实时更新）
  useEffect(() => {
    if (acceptedFriends.length > 0) {
      const timer = setInterval(() => {
        // 模拟位置更新
        setFriendsLocations(acceptedFriends.map(friend => ({ ...friend })));
      }, 10000); // 每10秒更新一次
      
      return () => clearInterval(timer);
    }
  }, [acceptedFriends]);

  // 当选中需求时，在地图上显示其位置
  useEffect(() => {
    const selectedItem = demands.find((d) => d.id === selectedUserId);
    if (selectedItem) {
      setSelectedLocation(selectedItem.location);
    }
  }, [selectedUserId, demands]);

  // 通知功能相关
  useEffect(() => {
    // 添加通知回调
    const handleNotification = (notification) => {
      if (notification.closed) {
        // 关闭通知
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      } else {
        // 添加新通知
        setNotifications(prev => [...prev, notification]);
      }
    };

    notificationService.addNotifyCallback(handleNotification);

    // 组件卸载时移除回调
    return () => {
      notificationService.removeNotifyCallback(handleNotification);
    };
  }, []);

  // 关闭通知的处理函数
  // 当用户登录时，根据API模式决定是否添加模拟数据
  useEffect(() => {
    if (user && acceptedFriends.length === 0 && pendingFriends.length === 0) {
      // 只有在使用模拟API时才添加测试数据
      if (!isUsingRealAPI()) {
        // 添加一些模拟的搭子数据，用于展示地图功能
        const mockPendingFriends = [
          {
            id: 101,
            type: "羽毛球",
            time: "周六下午14:00-16:00",
            location: "上海交通大学体育馆羽毛球场A区",
            desc: "水平不错，一起打球！",
            author: "SJTU羽协",
            ratings: { experience: 4.7, reliability: 4.8, communication: 4.6 },
            totalRating: 4.7,
            status: 'pending'
          }
        ];
        
        const mockAcceptedFriends = [
          {
            id: 102,
            type: "学习小组",
            time: "每天晚上19:00-21:00",
            location: "图书馆三楼自习室",
            desc: "期末复习，组队学习",
            author: "学霸小明",
            ratings: { experience: 4.9, reliability: 4.9, communication: 4.8 },
            totalRating: 4.9,
            status: 'accepted',
            startDate: new Date(Date.now() - 7*24*60*60*1000).toISOString()
          },
          {
            id: 103,
            type: "跑步",
            time: "每周一三五早上6:30",
            location: "思源湖北岸",
            desc: "早起跑步，呼吸新鲜空气",
            author: "运动达人",
            ratings: { experience: 4.5, reliability: 4.6, communication: 4.4 },
            totalRating: 4.5,
            status: 'accepted',
            startDate: new Date(Date.now() - 3*24*60*60*1000).toISOString()
          }
        ];
        
        const mockHistory = [
          {
            id: 104,
            type: "电影",
            time: "上周五晚上20:00",
            location: "徐汇区星轶IMAX影城",
            desc: "一起看《奥本海默》",
            author: "电影爱好者",
            ratings: { experience: 4.8, reliability: 4.7, communication: 4.9 },
            totalRating: 4.8,
            status: 'ended',
            startDate: new Date(Date.now() - 10*24*60*60*1000).toISOString(),
            endDate: new Date(Date.now() - 9*24*60*60*1000).toISOString()
          }
        ];
        
        // 延迟设置模拟数据，确保界面已经渲染
        setTimeout(() => {
          setPendingFriends(mockPendingFriends);
          setAcceptedFriends(mockAcceptedFriends);
          setPartnerHistory(mockHistory);
          setFriendsLocations(mockAcceptedFriends);
          
          // 显示欢迎通知
          notificationService.show('欢迎使用搭子平台！我们已为您添加了一些模拟数据，请查看地图功能和搭子列表。', 'success', 5000);
        }, 500);
      } else {
        // 使用真实API时，显示不同的欢迎消息
        setTimeout(() => {
          notificationService.show('欢迎使用搭子平台！您已连接到真实API，可以开始寻找真实的搭子了。', 'success', 5000);
        }, 500);
      }
    }
  }, [user, acceptedFriends.length, pendingFriends.length]);

  const handleCloseNotification = (notificationId) => {
    notificationService.close(notificationId);
  };

  // 显示认证界面
  if (showAuthPage) {
    return (
      <div className="app-container dark">
        <div className="auth-container">
          <AuthPage 
            mode={authMode}
            onLogin={handleLogin}
            onSwitchToRegister={handleSwitchToRegister}
            onSwitchToLogin={handleSwitchToLogin}
            onBackToMain={handleBackToMain}
          />
        </div>
      </div>
    );
  }

  const tabContents = [
    <div key="partner-form" className="tab-content-wrapper">
      <NewPartnerForm onSubmit={handlePartnerSubmit} />
    </div>,
    <div key="community-list" className="tab-content-wrapper">
      <NewCommunityList onAddPartner={handleAddFriend} demands={demands} currentUser={user} />
    </div>,
    <div key="friends" className="tab-content-wrapper">
      <h2 className="tab-title">我的搭子</h2>
      <p className="tab-description">管理您的搭子请求和已接受的搭子</p>
      <div className="friends-sections">
        <div className="friends-section">
          <h3>待添加 ({pendingFriends.length})</h3>
          <Friends 
            list={pendingFriends}
            onAccept={handleAcceptFriend}
            onReject={handleRejectFriend}
            type="pending"
            onViewDetails={handleViewDetails}
          />
        </div>
        <div className="friends-section">
          <h3>已添加 ({acceptedFriends.length})</h3>
          <Friends 
            list={acceptedFriends}
            onEnd={handleEndPartner}
            type="accepted"
            onViewDetails={handleViewDetails}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>,
    <div key="active-partners" className="tab-content-wrapper">
      <h2 className="tab-title">正在搭</h2>
      <p className="tab-description">查看您当前正在进行的搭子活动</p>
      <div className="timeline">
        {activePartners.length > 0 ? (
          activePartners.map((partner, index) => (
            <div key={partner.id} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>{partner.type} - {partner.author}</h4>
                <p className="timeline-time">开始时间: {new Date(partner.startDate).toLocaleString()}</p>
                <p>地点: {partner.location}</p>
                <p>描述: {partner.desc}</p>
                {partner.ratings && (
                  <div className="rating-info">
                    <p>综合评分: {'⭐'.repeat(Math.round(partner.totalRating))}</p>
                    <p>体验: {'⭐'.repeat(Math.round(partner.ratings.experience))}</p>
                    <p>诚信度: {'⭐'.repeat(Math.round(partner.ratings.reliability))}</p>
                  </div>
                )}
                <button onClick={() => handleEndPartner(partner.id)}>结束搭子</button>
              </div>
            </div>
          ))
        ) : (
          <div className="timeline-placeholder">暂无正在进行的搭子活动</div>
        )}
      </div>
    </div>,
    <div key="history" className="tab-content-wrapper">
      <h2 className="tab-title">历史记录</h2>
      <p className="tab-description">查看您以往的搭子活动记录</p>
      <div className="history-list">
        {partnerHistory.length > 0 ? (
          partnerHistory.map((partner) => (
            <div key={partner.id} className="history-item">
              <div className="history-header">
                <strong>{partner.type}</strong>
                <span className="history-author">by {partner.author}</span>
              </div>
              <div className="history-time">
                {new Date(partner.startDate).toLocaleDateString()} 至 {new Date(partner.endDate).toLocaleDateString()}
              </div>
              <div className="history-details">
                {partner.location}
              </div>
              {partner.desc && <div className="history-desc">{partner.desc}</div>}
              {partner.ratings && (
                <div className="rating-info">
                  <p>综合评分: {'⭐'.repeat(Math.round(partner.totalRating))}</p>
                  <p>体验: {'⭐'.repeat(Math.round(partner.ratings.experience))}</p>
                  <p>诚信度: {'⭐'.repeat(Math.round(partner.ratings.reliability))}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="history-placeholder">暂无历史记录</div>
        )}
      </div>
    </div>,
    <div key="map" className="tab-content-wrapper">
      <h2 className="tab-title">地图定位</h2>
      <p className="tab-description">实时查看您的位置和已匹配搭子的位置信息</p>
      <MapComponent 
        showUserLocation={true}
        friendsLocations={friendsLocations}
        selectedLocation={selectedLocation}
      />
      <div className="map-info">
        <h3>📍 地图功能说明</h3>
        <p>• 红色标记表示您的当前位置</p>
        <p>• 蓝色标记表示您的搭子位置</p>
        <p>• 橙色标记表示您当前选中的活动位置</p>
        <p>• SJTU标记表示上海交通大学校区位置</p>
      </div>
    </div>
  ];



  return (
      <div className="app-container dark">
        <TechBackground />
        <div className="app-content">
          {/* 渲染通知组件 */}
          {notifications.map(notification => (
            <Notification
              key={notification.id}
              message={notification.message}
              type={notification.type}
              duration={notification.duration}
              onClose={() => handleCloseNotification(notification.id)}
            />
          ))}
        <div className="header">
          <div className="logo-section">
            <h1 className="app-title">
              <span className="logo-icon">🚀</span>
              寻找搭子
            </h1>
            <p className="app-subtitle">科技感社交平台</p>
          </div>
          <div className="header-actions">
            {user ? (
              <div className="user-info">
                <div className="user-status">
                  <span className="user-avatar">👤</span>
                  <div className="user-details">
                    <span className="welcome-text">欢迎，{user.username}</span>
                    <span className="user-id">ID: {user.id || user.userId}</span>
                    <span className="api-mode">
                      {isUsingRealAPI() ? '🌐 真实API' : '🔧 模拟API'}
                    </span>
                  </div>
                </div>
                <button className="data-btn" onClick={handleLogout}>退出登录</button>
              </div>
            ) : (
              <div className="login-prompt">
                <button className="data-btn primary" onClick={() => {
                  setAuthMode('login');
                  setShowAuthPage(true);
                }}>登录</button>
                <span className="login-hint">请先登录以使用完整功能</span>
              </div>
            )}
            <div className="data-management">
              <button className="data-btn" onClick={() => setShowApiConfigModal(true)}>API配置</button>
              <button className="data-btn" onClick={exportData}>导出数据</button>
              <label className="data-btn">
                导入数据
                <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
              </label>
              <button className="data-btn danger" onClick={clearAllData}>清空数据</button>
            </div>
          </div>
        </div>
        
        <div className="main-content">
          <TabSystem 
            tabs={tabs}
            activeTabIndex={activeTabIndex}
            onTabChange={setActiveTabIndex}
          >
            {tabContents}
          </TabSystem>
        </div>
      </div>
      
      {/* 匹配结果弹窗 */}
      <MatchModal
        isOpen={showMatchModal}
        matches={matchResults}
        onClose={handleCloseMatchModal}
        onSelectMatch={handleSelectMatch}
        onPublishToCommunity={handlePublishToCommunity}
      />
      
      {/* 评分弹窗 */}
      <RatingModal
        isOpen={showRatingModal}
        partner={selectedRatingPartner}
        onClose={handleCloseRatingModal}
        onSubmit={handleSubmitRating}
      />
      
      {/* API配置弹窗 */}
      <ApiConfigModal
        isOpen={showApiConfigModal}
        onClose={handleCloseApiConfigModal}
      />
    </div>
  );
}

export default App;