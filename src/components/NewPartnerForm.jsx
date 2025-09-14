import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import './NewPartnerForm.css';

const NewPartnerForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    activityType: '',
    date: '',
    time: '',
    location: '',
    peopleCount: '',
    description: '',
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.activityType.trim()) {
      newErrors.activityType = '请选择活动类型';
    }
    if (!formData.date) {
      newErrors.date = '请选择日期';
    }
    if (!formData.time) {
      newErrors.time = '请选择时间';
    }
    if (!formData.location.trim()) {
      newErrors.location = '请输入地点';
    }
    if (!formData.peopleCount || formData.peopleCount < 2) {
      newErrors.peopleCount = '参与人数至少为2人';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // 格式化数据以便提交
      const formattedData = {
        ...formData,
        peopleCount: parseInt(formData.peopleCount),
        createdAt: new Date().toISOString(),
      };
      
      if (onSubmit) {
        onSubmit(formattedData);
      }
      
      // 重置表单
      setFormData({
        activityType: '',
        date: '',
        time: '',
        location: '',
        peopleCount: '',
        description: '',
      });
      
      alert('发布成功！正在为您寻找搭子...');
    }
  };
  
  const activityOptions = [
    '学习', '运动', '游戏', '美食', '旅行', '看电影', '逛展', '健身',
    '逛街', '爬山', '摄影', '手工', '读书会', '剧本杀', '唱K', '其他'
  ];
  
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  return (
    <div className="partner-form-container">
      <div className="form-header">
        <h2>发布搭子需求</h2>
        <p>快速找到志同道合的小伙伴一起参与活动</p>
      </div>
      
      <form className="partner-form" onSubmit={handleSubmit}>
        {/* 活动类型选择 */}
        <div className="form-section">
          <label htmlFor="activityType">活动类型 <span className="required">*</span></label>
          <div className="activity-type-grid">
            {activityOptions.map((activity) => (
              <button
                key={activity}
                type="button"
                className={`activity-type-card ${formData.activityType === activity ? 'selected' : ''}`}
                onClick={() => setFormData((prev) => ({ ...prev, activityType: activity }))}
              >
                {activity}
              </button>
            ))}
          </div>
          {errors.activityType && <div className="error-message">{errors.activityType}</div>}
        </div>
        
        {/* 日期和时间选择 */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">日期 <span className="required">*</span></label>
            <div className="date-time-picker">
              <Calendar className="picker-icon" size={18} />
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={getTodayDate()}
                className={errors.date ? 'error' : ''}
              />
            </div>
            {errors.date && <div className="error-message">{errors.date}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="time">时间 <span className="required">*</span></label>
            <div className="date-time-picker">
              <Clock className="picker-icon" size={18} />
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={errors.time ? 'error' : ''}
              />
            </div>
            {errors.time && <div className="error-message">{errors.time}</div>}
          </div>
        </div>
        
        {/* 地点选择 */}
        <div className="form-group">
          <label htmlFor="location">活动地点 <span className="required">*</span></label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="请输入活动地点"
            className={errors.location ? 'error' : ''}
          />
          {errors.location && <div className="error-message">{errors.location}</div>}
        </div>
        
        {/* 参与人数 */}
        <div className="form-group">
          <label htmlFor="peopleCount">期望人数 <span className="required">*</span></label>
          <input
            type="number"
            id="peopleCount"
            name="peopleCount"
            value={formData.peopleCount}
            onChange={handleChange}
            min="2"
            placeholder="请输入期望参与人数"
            className={errors.peopleCount ? 'error' : ''}
          />
          {errors.peopleCount && <div className="error-message">{errors.peopleCount}</div>}
        </div>
        
        {/* 补充说明 */}
        <div className="form-group">
          <label htmlFor="description">活动详情</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="请详细描述活动内容、要求等信息，帮助找到更合适的搭子..."
            rows="4"
            className="form-textarea"
          />
        </div>
        
        {/* 提交按钮 */}
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            发布需求
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPartnerForm;