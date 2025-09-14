import React, { useState } from "react";

// 评分显示组件
const RatingDisplay = ({ ratings }) => {
  if (!ratings) return null;
  
  const { totalRating, experience, reliability } = ratings;
  
  return (
    <div className="rating-display">
      <div className="rating-item">
        <span className="rating-label">综合评分:</span>
        <span className="rating-stars">{'⭐'.repeat(Math.round(totalRating))}</span>
        <span className="rating-number">{totalRating.toFixed(1)}</span>
      </div>
      <div className="rating-item">
        <span className="rating-label">体验:</span>
        <span className="rating-stars">{'⭐'.repeat(Math.round(experience))}</span>
        <span className="rating-number">{experience.toFixed(1)}</span>
      </div>
      <div className="rating-item">
        <span className="rating-label">诚信度:</span>
        <span className="rating-stars">{'⭐'.repeat(Math.round(reliability))}</span>
        <span className="rating-number">{reliability.toFixed(1)}</span>
      </div>
    </div>
  );
};

// 聊天弹窗组件
const ChatModal = ({ isOpen, demand, onClose, onSendMessage }) => {
  const [message, setMessage] = useState('');
  
  if (!isOpen) return null;
  
  const handleSend = () => {
    if (message.trim() && demand) {
      onSendMessage(demand.id, message.trim());
      setMessage('');
    }
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>与 {demand.author} 聊天</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="chat-preview">
            <p><strong>活动:</strong> {demand.type}</p>
            <p><strong>时间:</strong> {demand.time}</p>
            <p><strong>地点:</strong> {demand.location}</p>
            {demand.desc && <p><strong>描述:</strong> {demand.desc}</p>}
          </div>
          <div className="chat-input-area">
            <input
              type="text"
              placeholder="输入消息..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="chat-input"
            />
            <button className="send-btn" onClick={handleSend}>发送</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CommunityList({ demands, selectedId, onViewDetails, onAddFriend, onSendMessage }) {
  const [selectedDemand, setSelectedDemand] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  
  // 点击卡片处理
  const handleCardClick = (demand) => {
    setSelectedDemand(demand);
    onViewDetails(demand);
  };
  
  // 处理聊天按钮点击
  const handleChatClick = (e, demand) => {
    e.stopPropagation(); // 阻止事件冒泡
    setSelectedDemand(demand);
    setShowChatModal(true);
  };
  
  // 处理加为搭子按钮点击
  const handleAddFriendClick = (e, demand) => {
    e.stopPropagation(); // 阻止事件冒泡
    onAddFriend(demand);
    // 可以添加成功提示
    alert(`已向 ${demand.author} 发送搭子请求`);
  };
  
  return (
    <div className="community-list">
      {demands.length === 0 ? (
        <div className="empty-state">
          <p>暂无社区需求</p>
        </div>
      ) : (
        <div className="demand-cards-container">
          {demands.map((demand) => (
            <div
              key={demand.id}
              className={`community-card ${selectedId === demand.id ? "selected" : ""}`}
              onClick={() => handleCardClick(demand)}
            >
              <div className="card-header">
                <div className="activity-type">
                  <strong>{demand.type}</strong>
                </div>
                <div className="card-actions">
                  <button 
                    className="action-btn chat-btn"
                    onClick={(e) => handleChatClick(e, demand)}
                    title="发送消息"
                  >
                    💬
                  </button>
                  <button 
                    className="action-btn add-friend-btn"
                    onClick={(e) => handleAddFriendClick(e, demand)}
                    title="加为搭子"
                  >
                    👥
                  </button>
                </div>
              </div>
              
              <div className="card-content">
                <div className="user-info">
                  <span className="username">👤 {demand.author}</span>
                </div>
                
                <div className="activity-details">
                  <div className="detail-item">
                    <span className="detail-icon">⏰</span>
                    <span className="detail-text">{demand.time}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span className="detail-text">{demand.location}</span>
                  </div>
                </div>
                
                {demand.desc && (
                  <div className="activity-description">
                    {demand.desc}
                  </div>
                )}
                
                {/* 显示评分信息 */}
                {demand.ratings && demand.ratings.totalRating > 0 && (
                  <RatingDisplay ratings={demand.ratings} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 聊天弹窗 */}
      <ChatModal
        isOpen={showChatModal}
        demand={selectedDemand}
        onClose={() => setShowChatModal(false)}
        onSendMessage={onSendMessage}
      />
    </div>
  );
}