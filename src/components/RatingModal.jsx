import React, { useState } from "react";

// 星级评分组件
const StarRating = ({ value, onChange, max = 5, label }) => {
  const [hoverValue, setHoverValue] = useState(0);
  const displayValue = hoverValue || value;
  
  return (
    <div className="star-rating">
      <label>{label}</label>
      <div className="stars">
        {Array.from({ length: max }).map((_, i) => (
          <span
            key={i}
            className={`star ${displayValue >= i + 1 ? 'filled' : ''}`}
            onClick={() => onChange(i + 1)}
            onMouseEnter={() => setHoverValue(i + 1)}
            onMouseLeave={() => setHoverValue(0)}
          >
            ★
          </span>
        ))}
        <span className="rating-value">{displayValue}.0</span>
      </div>
    </div>
  );
};

export default function RatingModal({ isOpen, partner, onClose, onSubmit }) {
  const [ratings, setRatings] = useState({
    experience: 5,    // 体验评分
    reliability: 5,   // 诚信度评分
    communication: 5, // 沟通能力评分
  });
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!isOpen || !partner) return null;
  
  // 计算综合评分
  const totalRating = (ratings.experience + ratings.reliability + ratings.communication) / 3;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...ratings,
        totalRating,
        comment: comment.trim()
      });
      alert('评分提交成功！');
    } catch (error) {
      console.error('评分提交失败:', error);
      alert('评分提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    // 重置评分和评论
    setRatings({
      experience: 5,
      reliability: 5,
      communication: 5,
    });
    setComment('');
    onClose();
  };
  
  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>为搭子评分</h3>
          <button className="close-btn" onClick={handleCancel}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="partner-info">
            <h4>{partner.type} - {partner.author}</h4>
            <p>活动时间：{partner.time}</p>
            <p>活动地点：{partner.location}</p>
          </div>
          
          <form className="rating-form" onSubmit={handleSubmit}>
            <div className="rating-section">
              <StarRating
                value={ratings.experience}
                onChange={(value) => setRatings({ ...ratings, experience: value })}
                label="体验评分"
              />
              
              <StarRating
                value={ratings.reliability}
                onChange={(value) => setRatings({ ...ratings, reliability: value })}
                label="诚信度评分"
              />
              
              <StarRating
                value={ratings.communication}
                onChange={(value) => setRatings({ ...ratings, communication: value })}
                label="沟通能力评分"
              />
              
              <div className="total-rating">
                <strong>综合评分: </strong>
                <span className="total-score">{totalRating.toFixed(1)}</span>
                <span className="total-stars">{'★'.repeat(Math.round(totalRating))}</span>
              </div>
            </div>
            
            <div className="comment-section">
              <label>评价（可选）</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="分享您与这位搭子的体验和感受..."
                maxLength={200}
              />
              <div className="char-count">{comment.length}/200</div>
            </div>
            
            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                取消
              </button>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? '提交中...' : '提交评分'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}