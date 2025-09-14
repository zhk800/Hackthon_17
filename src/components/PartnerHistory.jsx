import React, { useState } from "react";

// 评分显示组件
const RatingDisplay = ({ ratings }) => {
  if (!ratings) return null;
  
  const { totalRating, experience, reliability, communication } = ratings;
  
  return (
    <div className="rating-summary">
      <div className="rating-overall">
        <span className="overall-score">{totalRating.toFixed(1)}</span>
        <span className="overall-stars">{'★'.repeat(Math.round(totalRating))}</span>
      </div>
      <div className="rating-details">
        <div className="rating-item">
          <span className="rating-label">体验:</span>
          <span className="rating-value">{experience.toFixed(1)}</span>
        </div>
        <div className="rating-item">
          <span className="rating-label">诚信度:</span>
          <span className="rating-value">{reliability.toFixed(1)}</span>
        </div>
        <div className="rating-item">
          <span className="rating-label">沟通:</span>
          <span className="rating-value">{communication.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default function PartnerHistory({ pastPartners }) {
  const [filterType, setFilterType] = useState('all'); // all, good, recent
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(null);
  
  // 过滤搭子历史
  const filteredPartners = pastPartners.filter(partner => {
    // 类型过滤
    if (filterType === 'good' && (!partner.ratings || partner.ratings.totalRating < 4)) {
      return false;
    }
    
    // 搜索过滤
    if (searchTerm && !(
      partner.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.location.toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      return false;
    }
    
    // 时间过滤
    if (filterType === 'recent') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return new Date(partner.time) >= oneMonthAgo;
    }
    
    return true;
  }).sort((a, b) => new Date(b.time) - new Date(a.time)); // 按时间降序排序
  
  // 查看搭子详情
  const handleViewDetails = (partner) => {
    setSelectedPartner(selectedPartner && selectedPartner.id === partner.id ? null : partner);
  };
  
  return (
    <div className="partner-history">
      {/* 筛选和搜索 */}
      <div className="history-filters">
        <div className="filter-options">
          <button 
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            全部
          </button>
          <button 
            className={`filter-btn ${filterType === 'good' ? 'active' : ''}`}
            onClick={() => setFilterType('good')}
          >
            好评搭子
          </button>
          <button 
            className={`filter-btn ${filterType === 'recent' ? 'active' : ''}`}
            onClick={() => setFilterType('recent')}
          >
            最近一个月
          </button>
        </div>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="搜索活动类型、搭子或地点..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      {/* 历史搭子列表 */}
      {filteredPartners.length === 0 ? (
        <div className="empty-history">
          <p>暂无历史搭子记录</p>
        </div>
      ) : (
        <div className="history-list">
          {filteredPartners.map((partner) => (
            <div key={partner.id} className="history-item">
              <div className="item-header" onClick={() => handleViewDetails(partner)}>
                <div className="item-main-info">
                  <div className="activity-type">{partner.type}</div>
                  <div className="partner-info">
                    <span className="partner-name">👤 {partner.author}</span>
                    <span className="partner-time">⏰ {new Date(partner.time).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
                
                {/* 评分摘要 */}
                {partner.ratings && (
                  <RatingDisplay ratings={partner.ratings} />
                )}
                
                <div className="expand-icon">
                  {selectedPartner && selectedPartner.id === partner.id ? '▼' : '▶'}
                </div>
              </div>
              
              {/* 展开详情 */}
              {selectedPartner && selectedPartner.id === partner.id && (
                <div className="item-details">
                  <div className="detail-row">
                    <strong>活动时间:</strong>
                    <span>{partner.time}</span>
                  </div>
                  <div className="detail-row">
                    <strong>活动地点:</strong>
                    <span>{partner.location}</span>
                  </div>
                  {partner.desc && (
                    <div className="detail-row">
                      <strong>活动描述:</strong>
                      <span>{partner.desc}</span>
                    </div>
                  )}
                  {partner.ratings && partner.ratings.comment && (
                    <div className="detail-row">
                      <strong>评价:</strong>
                      <span className="comment-text">{partner.ratings.comment}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* 统计信息 */}
      {filteredPartners.length > 0 && (
        <div className="history-stats">
          <div className="stat-item">
            <span className="stat-label">总搭子数:</span>
            <span className="stat-value">{filteredPartners.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">平均评分:</span>
            <span className="stat-value">
              {(
                filteredPartners.filter(p => p.ratings).reduce((sum, p) => sum + p.ratings.totalRating, 0) / 
                Math.max(1, filteredPartners.filter(p => p.ratings).length)
              ).toFixed(1)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}