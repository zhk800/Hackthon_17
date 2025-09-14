import React, { useState } from "react";

// 搭子卡片组件
const PartnerCard = ({ partner, type, onAccept, onDecline, onRemove, onChat }) => {
  return (
    <div className="partner-card">
      <div className="card-header">
        <div className="activity-type">
          <strong>{partner.type}</strong>
        </div>
        {type === 'pending' && (
          <div className="status-badge pending">待接受</div>
        )}
        {type === 'active' && (
          <div className="status-badge active">已添加</div>
        )}
      </div>
      
      <div className="card-content">
        <div className="user-info">
          <span className="username">👤 {partner.author}</span>
        </div>
        
        <div className="activity-details">
          <div className="detail-item">
            <span className="detail-icon">⏰</span>
            <span className="detail-text">{partner.time}</span>
          </div>
          <div className="detail-item">
            <span className="detail-icon">📍</span>
            <span className="detail-text">{partner.location}</span>
          </div>
        </div>
        
        {partner.desc && (
          <div className="activity-description">
            {partner.desc}
          </div>
        )}
        
        <div className="card-actions">
          {type === 'pending' ? (
            <>
              <button className="action-btn accept-btn" onClick={() => onAccept(partner.id)}>
                接受
              </button>
              <button className="action-btn decline-btn" onClick={() => onDecline(partner.id)}>
                拒绝
              </button>
            </>
          ) : (
            <>
              <button className="action-btn chat-btn" onClick={() => onChat(partner)}>
                聊天
              </button>
              <button className="action-btn remove-btn" onClick={() => onRemove(partner.id)}>
                移除
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// 聊天弹窗组件
const ChatModal = ({ isOpen, partner, onClose, onSendMessage }) => {
  const [message, setMessage] = useState('');
  
  if (!isOpen) return null;
  
  const handleSend = () => {
    if (message.trim() && partner) {
      onSendMessage(partner.id, message.trim());
      setMessage('');
    }
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>与 {partner.author} 聊天</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="chat-preview">
            <p><strong>活动:</strong> {partner.type}</p>
            <p><strong>时间:</strong> {partner.time}</p>
            <p><strong>地点:</strong> {partner.location}</p>
            {partner.desc && <p><strong>描述:</strong> {partner.desc}</p>}
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

export default function Friends({ list, onAccept, onReject, onEnd, onViewDetails, onSendMessage, type }) {
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  
  // 处理聊天按钮点击
  const handleChatClick = (partner) => {
    setSelectedPartner(partner);
    setShowChatModal(true);
  };
  
  return (
    <div className="friends-container">
      {/* 搭子列表 */}
      <div className="friends-list">
        {list.length === 0 ? (
          <div className="empty-state">
            <p>暂无{type === 'pending' ? '待添加' : '已添加'}的搭子</p>
          </div>
        ) : (
          <div className="partner-cards-container">
            {list.map((partner) => (
              <PartnerCard
                key={partner.id}
                partner={partner}
                type={type}
                onAccept={onAccept}
                onDecline={onReject}
                onRemove={onEnd}
                onChat={(p) => handleChatClick(p)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* 聊天弹窗 */}
      <ChatModal
        isOpen={showChatModal}
        partner={selectedPartner}
        onClose={() => setShowChatModal(false)}
        onSendMessage={onSendMessage}
      />
    </div>
  );
}