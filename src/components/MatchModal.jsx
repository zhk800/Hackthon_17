import React from 'react';
import './MatchModal.css';

const MatchModal = ({ isOpen, matches, onClose, onSelectMatch, onPublishToCommunity }) => {
  if (!isOpen) return null;

  const getSimilarityLevel = (similarity) => {
    if (similarity >= 80) return { level: '极高', color: '#52c41a', icon: '🔥' };
    if (similarity >= 60) return { level: '高', color: '#1890ff', icon: '⭐' };
    if (similarity >= 40) return { level: '中等', color: '#faad14', icon: '👍' };
    if (similarity >= 30) return { level: '一般', color: '#fa8c16', icon: '👌' };
    return { level: '低', color: '#f5222d', icon: '👋' };
  };

  return (
    <div className="match-modal-overlay" onClick={onClose}>
      <div className="match-modal" onClick={(e) => e.stopPropagation()}>
        <div className="match-modal-header">
          <h2 className="match-modal-title">
            <span className="match-icon">🎯</span>
            找到相似需求
          </h2>
          <button className="match-modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="match-modal-content">
          <p className="match-modal-description">
            🎯 我们为您找到了 <strong>{matches.length}</strong> 个相似的需求！<br/>
            您可以选择其中一个进行交流，或者发布到社区让更多人看到。
          </p>
          
          <div className="match-list">
            {matches.map((match, index) => {
              const similarityInfo = getSimilarityLevel(match.similarity);
              return (
                <div key={match.id} className="match-item">
                  <div className="match-item-header">
                    <div className="match-rank">#{index + 1}</div>
                    <div className="match-similarity">
                      <span 
                        className="similarity-badge"
                        style={{ backgroundColor: similarityInfo.color }}
                      >
                        {similarityInfo.icon} {similarityInfo.level} {match.similarity}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="match-item-content">
                    <div className="match-type">
                      <strong>{match.type}</strong>
                      <span className="match-author">by {match.author || '匿名用户'}</span>
                    </div>
                    <div className="match-details">
                      <span className="match-time">⏰ {match.time}</span>
                      <span className="match-location">📍 {match.location}</span>
                    </div>
                    {match.desc && (
                      <div className="match-desc">{match.desc}</div>
                    )}
                  </div>
                  
                  <div className="match-actions">
                    <button 
                      className="match-btn primary"
                      onClick={() => onSelectMatch(match)}
                    >
                      💬 开始聊天
                    </button>
                    <button 
                      className="match-btn secondary"
                      onClick={() => onSelectMatch(match, 'addFriend')}
                    >
                      👥 直接搭成
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="match-modal-footer">
            <button 
              className="match-btn community"
              onClick={onPublishToCommunity}
            >
              🌐 发布到社区
            </button>
            <p className="match-footer-note">
              选择发布到社区后，您的需求将显示在"浏览需求"中供所有人查看
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchModal;

