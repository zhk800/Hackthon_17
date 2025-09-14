import React, { useState } from "react";

// 创建自定义的月份、日期、小时选项
const generateOptions = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const months = generateOptions(1, 12);
const days = generateOptions(1, 31);
const hours = generateOptions(0, 23);
const minutes = [0, 15, 30, 45];

// 获取当前时间的默认值
const now = new Date();
const defaultMonth = now.getMonth() + 1;
const defaultDay = now.getDate();
const defaultHour = now.getHours() + 1;
const defaultMinute = 0;

const locationOptions = [
  { id: 'sjtu_minhang', name: '上海交通大学闵行校区' },
  { id: 'sjtu_xuhui', name: '上海交通大学徐汇校区' },
  { id: 'sjtu_qibao', name: '上海交通大学七宝校区' },
  { id: 'sjtu_zhangjiang', name: '上海交通大学张江校区' },
  { id: 'other', name: '其他地点' }
];

export default function PartnerForm({ onSubmit }) {
  const [form, setForm] = useState({
    type: "",
    date: {
      month: defaultMonth,
      day: defaultDay
    },
    time: {
      start: {
        hour: defaultHour,
        minute: defaultMinute
      },
      end: {
        hour: defaultHour + 1,
        minute: defaultMinute
      }
    },
    location: 'sjtu_minhang',
    customLocation: '',
    desc: "",
    tags: []
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'location' && value === 'other') {
      setForm({ ...form, location: value, customLocation: '' });
    } else {
      setForm({ ...form, [name]: value });
    }
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleDateChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      date: {
        ...prev.date,
        [field]: parseInt(value)
      }
    }));
  };

  const handleTimeChange = (field, subfield, value) => {
    setForm(prev => ({
      ...prev,
      time: {
        ...prev.time,
        [field]: {
          ...prev.time[field],
          [subfield]: parseInt(value)
        }
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // 验证活动类型
    if (!form.type.trim()) {
      newErrors.type = "请输入活动类型";
    } else if (form.type.trim().length < 2) {
      newErrors.type = "活动类型至少2个字符";
    }
    
    // 验证时间范围
    const startTime = new Date(
      now.getFullYear(),
      form.date.month - 1,
      form.date.day,
      form.time.start.hour,
      form.time.start.minute
    );
    
    const endTime = new Date(
      now.getFullYear(),
      form.date.month - 1,
      form.date.day,
      form.time.end.hour,
      form.time.end.minute
    );
    
    if (startTime < new Date()) {
      newErrors.time = "开始时间不能早于当前时间";
    }
    
    if (endTime <= startTime) {
      newErrors.time = "结束时间必须晚于开始时间";
    }
    
    // 验证地点
    if (form.location === 'other' && !form.customLocation.trim()) {
      newErrors.location = "请输入具体地点";
    } else if (form.location === 'other' && form.customLocation.trim().length < 2) {
      newErrors.location = "地点至少2个字符";
    }
    
    // 验证描述
    if (form.desc && form.desc.length > 200) {
      newErrors.desc = "描述不能超过200个字符";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      // 格式化提交数据
      const submitData = {
        type: form.type.trim(),
        time: `${form.date.month}月${form.date.day}日 ${form.time.start.hour}:${form.time.start.minute.toString().padStart(2, '0')}-${form.time.end.hour}:${form.time.end.minute.toString().padStart(2, '0')}`,
        location: form.location === 'other' ? form.customLocation.trim() : locationOptions.find(loc => loc.id === form.location)?.name,
        desc: form.desc.trim()
      };
      
      await onSubmit(submitData);
      
      // 重置表单
      setForm({
        type: "",
        date: {
          month: defaultMonth,
          day: defaultDay
        },
        time: {
          start: {
            hour: defaultHour,
            minute: defaultMinute
          },
          end: {
            hour: defaultHour + 1,
            minute: defaultMinute
          }
        },
        location: 'sjtu_minhang',
        customLocation: '',
        desc: ""
      });
      setErrors({});
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="partner-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3>活动信息</h3>
        
        <div className="form-group">
          <label>活动类型</label>
          <input
            name="type"
            placeholder="如：羽毛球、电影、学习小组、跑步..."
            value={form.type}
            onChange={handleChange}
            className={errors.type ? "error" : ""}
          />
          {errors.type && <span className="error-message">{errors.type}</span>}
        </div>
        
        <div className="form-group">
          <label>活动时间</label>
          <div className="time-picker">
            <select 
              value={form.date.month} 
              onChange={(e) => handleDateChange('month', e.target.value)}
            >
              {months.map(month => <option key={month} value={month}>{month}月</option>)}
            </select>
            
            <span className="date-separator">/</span>
            
            <select 
              value={form.date.day} 
              onChange={(e) => handleDateChange('day', e.target.value)}
            >
              {days.map(day => <option key={day} value={day}>{day}日</option>)}
            </select>
            
            <div className="time-range">
              <select 
                value={form.time.start.hour} 
                onChange={(e) => handleTimeChange('start', 'hour', e.target.value)}
                className="hour-select"
              >
                {hours.map(hour => <option key={hour} value={hour}>{hour}</option>)}
              </select>
              <span>:</span>
              <select 
                value={form.time.start.minute} 
                onChange={(e) => handleTimeChange('start', 'minute', e.target.value)}
                className="minute-select"
              >
                {minutes.map(minute => <option key={minute} value={minute}>{minute.toString().padStart(2, '0')}</option>)}
              </select>
              
              <span className="time-separator">至</span>
              
              <select 
                value={form.time.end.hour} 
                onChange={(e) => handleTimeChange('end', 'hour', e.target.value)}
                className="hour-select"
              >
                {hours.map(hour => <option key={hour} value={hour}>{hour}</option>)}
              </select>
              <span>:</span>
              <select 
                value={form.time.end.minute} 
                onChange={(e) => handleTimeChange('end', 'minute', e.target.value)}
                className="minute-select"
              >
                {minutes.map(minute => <option key={minute} value={minute}>{minute.toString().padStart(2, '0')}</option>)}
              </select>
            </div>
          </div>
          {errors.time && <span className="error-message">{errors.time}</span>}
        </div>
        
        <div className="form-group">
          <label>活动地点</label>
          <select 
            name="location"
            value={form.location} 
            onChange={handleChange}
            className={errors.location ? "error" : ""}
          >
            {locationOptions.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
          </select>
          
          {form.location === 'other' && (
            <input
              name="customLocation"
              placeholder="请输入具体地点"
              value={form.customLocation}
              onChange={handleChange}
              className={errors.location ? "error other-location" : "other-location"}
            />
          )}
          {errors.location && <span className="error-message">{errors.location}</span>}
        </div>
      </div>
      
      <div className="form-section">
        <h3>补充说明</h3>
        
        <div className="form-group">
          <label>详细描述（可选）</label>
          <textarea
            name="desc"
            placeholder="描述一下您的活动内容、期望的搭子类型等信息..."
            value={form.desc}
            onChange={handleChange}
            className={errors.desc ? "error" : ""}
          />
          {errors.desc && <span className="error-message">{errors.desc}</span>}
          <div className="char-count">{form.desc.length}/200</div>
        </div>
      </div>
      
      <button type="submit" disabled={isSubmitting} className="submit-btn">
        {isSubmitting ? "发布中..." : "发布搭子需求"}
      </button>
    </form>
  );
}