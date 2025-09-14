import React, { useState } from "react";
import RatingModal from "./RatingModal";

// 时间轴项组件
const TimelineItem = ({ data, isActive, onComplete }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`timeline-item ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="timeline-dot">
        {isActive ? (
          <span className="active-dot">●</span>
        ) : (
          <span className="inactive-dot">○</span>
        )}
      </div>
      
      <div className="timeline-content">
        <div className="timeline-time">{data.time}</div>
        <div className="timeline-text">{data.text}</div>
        {data.details && (
          <div className="timeline-details">{data.details}</div>
        )}
        
        {data.action && isActive && (
          <button 
            className="timeline-action-btn"
            onClick={onComplete}
          >
            {data.action}
          </button>
        )}
      </div>
    </div>
  );
};

export default function PartnerTimeline({ activePartners, onRatePartner }) {
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  
  // 生成时间轴数据
  const generateTimelineData = (partner) => {
    const now = new Date();
    const eventDate = new Date(partner.time);
    const timelineData = [];
    
    // 搭子请求发送
    timelineData.push({
      time: new Date(partner.createdAt).toLocaleString('zh-CN'),
      text: '发送搭子请求',
      details: `向 ${partner.author} 发送了搭子请求`
    });
    
    // 搭子请求接受
    timelineData.push({
      time: new Date(partner.acceptedAt || partner.createdAt).toLocaleString('zh-CN'),
      text: '搭子请求接受',
      details: `${partner.author} 接受了搭子请求`
    });
    
    // 活动进行中
    if (eventDate >= now) {
      timelineData.push({
        time: eventDate.toLocaleString('zh-CN'),
        text: '活动进行中',
        details: `与 ${partner.author} 的${partner.type}活动正在进行中`
      });
    } else {
      // 活动已结束
      timelineData.push({
        time: eventDate.toLocaleString('zh-CN'),
        text: '活动已结束',
        details: `与 ${partner.author} 的${partner.type}活动已结束`,
        action: '评价搭子'
      });
    }
    
    return timelineData;
  };
  
  // 处理完成搭子活动
  const handleCompletePartner = (partner) => {
    setSelectedPartner(partner);
    setShowRatingModal(true);
  };
  
  // 处理评分提交
  const handleRatingSubmit = async (ratingData) => {
    try {
      await onRatePartner(selectedPartner.id, ratingData);
      setShowRatingModal(false);
    } catch (error) {
      console.error('评分提交失败:', error);
    }
  };
  
  return (
    <div className="partner-timeline-container">
      {activePartners.length === 0 ? (
        <div className="empty-timeline">
          <p>暂无正在进行的搭子活动</p>
          <p className="empty-hint">去社区寻找搭子吧！</p>
        </div>
      ) : (
        <div className="timeline-list">
          {activePartners.map((partner) => {
            const timelineData = generateTimelineData(partner);
            const isCompleted = new Date(partner.time) < new Date();
            
            return (
              <div key={partner.id} className={`partner-timeline ${isCompleted ? 'completed' : ''}`}>
                <div className="timeline-header">
                  <h3>{partner.type} - {partner.author}</h3>
                  <div className="partner-info">
                    <span className="partner-time">⏰ {partner.time}</span>
                    <span className="partner-location">📍 {partner.location}</span>
                  </div>
                </div>
                
                <div className="timeline-items">
                  {timelineData.map((item, index) => (
                    <TimelineItem
                      key={index}
                      data={item}
                      isActive={index === timelineData.length - 1}
                      onComplete={item.action ? () => handleCompletePartner(partner) : undefined}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* 评分弹窗 */}
      <RatingModal
        isOpen={showRatingModal}
        partner={selectedPartner}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
      />
    </div>
  );
}