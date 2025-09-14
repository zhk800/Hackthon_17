import React, { useState } from "react";

export default function DemandForm({ onSubmit }) {
  const [form, setForm] = useState({
    type: "",
    time: "",
    location: "",
    desc: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.type.trim()) {
      newErrors.type = "请输入活动类型";
    } else if (form.type.trim().length < 2) {
      newErrors.type = "活动类型至少2个字符";
    }
    
    if (!form.time.trim()) {
      newErrors.time = "请输入活动时间";
    }
    
    if (!form.location.trim()) {
      newErrors.location = "请输入活动地点";
    } else if (form.location.trim().length < 2) {
      newErrors.location = "地点至少2个字符";
    }
    
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
      await onSubmit(form);
      setForm({ type: "", time: "", location: "", desc: "" });
      setErrors({});
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="demand-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          name="type"
          placeholder="活动类型（如打球/吃饭）"
          value={form.type}
          onChange={handleChange}
          className={errors.type ? "error" : ""}
        />
        {errors.type && <span className="error-message">{errors.type}</span>}
      </div>
      
      <div className="form-group">
        <input
          name="time"
          placeholder="时间"
          value={form.time}
          onChange={handleChange}
          className={errors.time ? "error" : ""}
        />
        {errors.time && <span className="error-message">{errors.time}</span>}
      </div>
      
      <div className="form-group">
        <input
          name="location"
          placeholder="地点"
          value={form.location}
          onChange={handleChange}
          className={errors.location ? "error" : ""}
        />
        {errors.location && <span className="error-message">{errors.location}</span>}
      </div>
      
      <div className="form-group">
        <textarea
          name="desc"
          placeholder="补充说明（可选，最多200字）"
          value={form.desc}
          onChange={handleChange}
          className={errors.desc ? "error" : ""}
        />
        {errors.desc && <span className="error-message">{errors.desc}</span>}
        <div className="char-count">{form.desc.length}/200</div>
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "发布中..." : "发布"}
      </button>
    </form>
  );
}