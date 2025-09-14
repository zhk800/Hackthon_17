import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, MapPin, Calendar, Users, Star } from 'lucide-react';
import './NewCommunityList.css';

// 评分显示组件
const RatingDisplay = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        size={16}
        fill={i <= rating ? '#FFD700' : 'none'}
        className="rating-star"
      />
    );
  }
  return (
    <div className="rating-container">
      <div className="stars">{stars}</div>
      <span className="rating-number">{rating}</span>
    </div>
  );
};

// 聊天弹窗组件
const ChatModal = ({ isOpen, partner, onClose, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (message.trim() && partner && onSendMessage) {
      const newMessage = {
        id: Date.now(),
        content: message,
        sender: 'me',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      onSendMessage(partner.id, message);
      setMessage('');

      // 模拟对方回复
      setTimeout(() => {
        const replyMessage = {
          id: Date.now() + 1,
          content: `谢谢你的消息，我对${partner.activityType}很感兴趣！`,
          sender: 'partner',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, replyMessage]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen || !partner) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="partner-info">
            <img src={partner.avatar || 'https://via.placeholder.com/40'} alt={partner.name} className="partner-avatar" />
            <div className="partner-details">
              <h3>{partner.name}</h3>
              <div className="activity-type">{partner.activityType}</div>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div className="message-content">{msg.content}</div>
              <div className="message-time">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="empty-chat">
              <p>开始与 {partner.name} 聊天吧！</p>
            </div>
          )}
        </div>
        
        <div className="chat-input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息..."
            className="chat-input"
          />
          <button onClick={handleSend} className="send-btn">发送</button>
        </div>
      </div>
    </div>
  );
};

const NewCommunityList = ({ onAddPartner, demands = [], currentUser = null }) => {
  const [communityPosts, setCommunityPosts] = useState([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // 根据传入的demands数据更新社区帖子
  useEffect(() => {
    if (demands && demands.length > 0) {
      // 将demands数据转换为社区帖子格式
      const posts = demands.map(demand => ({
        id: demand.id,
        name: demand.author || demand.username || demand.name || '匿名用户',
        avatar: demand.avatar || `https://via.placeholder.com/80?text=${(demand.author || demand.username || '用').charAt(0)}`,
        activityType: demand.activityType || demand.type || demand.category || '其他',
        date: demand.date || new Date().toISOString().split('T')[0],
        time: demand.time || '19:00',
        location: demand.location || '待定',
        peopleCount: demand.peopleCount || 2,
        currentPeople: demand.currentPeople || 1,
        description: demand.description || demand.desc || demand.content || '暂无描述',
        rating: demand.totalRating || demand.rating || 4.5,
        tags: demand.tags || [demand.activityType || demand.type || '其他'],
        authorId: demand.authorId || demand.id, // 添加作者ID用于判断是否为自己的邀请
        createdAt: demand.createdAt
      }));
      setCommunityPosts(posts);
    } else {
      // 如果没有demands数据，使用空数组（真实API模式下）
      setCommunityPosts([]);
    }
  }, [demands]);

  const handleAddPartner = (partner) => {
    if (onAddPartner) {
      onAddPartner(partner);
      alert('已发送搭子请求！等待对方同意...');
    }
  };

  const handleChatClick = (partner) => {
    setSelectedPartner(partner);
    setShowChatModal(true);
  };

  const handleSendMessage = (partnerId, message) => {
    console.log(`发送消息给 ${partnerId}: ${message}`);
    // 实际项目中这里会调用API发送消息
  };

  const filterPosts = () => {
    if (activeTab === 'all') return communityPosts;
    return communityPosts.filter(post => post.activityType === activeTab);
  };

  const activityTypes = ['all', '学习', '运动', '游戏', '美食', '旅行'];

  return (
    <div className="community-container">
      <div className="community-header">
        <h2>社区广场</h2>
        <p>发现附近有趣的活动和志同道合的伙伴</p>
      </div>

      {/* 筛选标签 */}
      <div className="filter-tabs">
        {activityTypes.map((type) => (
          <button
            key={type}
            className={`filter-tab ${activeTab === type ? 'active' : ''}`}
            onClick={() => setActiveTab(type)}
          >
            {type === 'all' ? '全部' : type}
          </button>
        ))}
      </div>

      {/* 社区列表 */}
      <div className="community-list">
        {filterPosts().map((post) => (
          <div key={post.id} className="community-card">
            {/* 用户信息 */}
            <div className="user-info">
              <img src={post.avatar} alt={post.name} className="user-avatar" />
              <div className="user-details">
                <div className="user-name-rating">
                  <h3>{post.name}</h3>
                  <RatingDisplay rating={post.rating} />
                </div>
                <div className="activity-type">{post.activityType}</div>
              </div>
            </div>

            {/* 活动详情 */}
            <div className="activity-details">
              <p className="activity-description">{post.description}</p>
              
              <div className="activity-meta">
                <div className="meta-item">
                  <Calendar size={16} className="meta-icon" />
                  <span>{post.date} {post.time}</span>
                </div>
                <div className="meta-item">
                  <MapPin size={16} className="meta-icon" />
                  <span>{post.location}</span>
                </div>
                <div className="meta-item">
                  <Users size={16} className="meta-icon" />
                  <span>{post.currentPeople}/{post.peopleCount}</span>
                </div>
              </div>
            </div>

            {/* 标签 */}
            <div className="activity-tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>

            {/* 操作按钮 */}
            <div className="card-actions">
              <button 
                className="action-btn chat-btn"
                onClick={() => handleChatClick(post)}
              >
                <MessageCircle size={16} className="action-icon" />
                私聊
              </button>
              {currentUser && post.authorId && currentUser.id === post.authorId ? (
                <button 
                  className="action-btn own-post-btn"
                  disabled
                >
                  <Heart size={16} className="action-icon" />
                  自己的邀请
                </button>
              ) : (
                <button 
                  className="action-btn add-btn"
                  onClick={() => handleAddPartner(post)}
                >
                  <Heart size={16} className="action-icon" />
                  申请加入
                </button>
              )}
            </div>
          </div>
        ))}

        {filterPosts().length === 0 && (
          <div className="empty-state">
            <p>暂无相关活动，快来发布第一个吧！</p>
          </div>
        )}
      </div>

      {/* 聊天弹窗 */}
      <ChatModal
        isOpen={showChatModal}
        partner={selectedPartner}
        onClose={() => setShowChatModal(false)}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default NewCommunityList;