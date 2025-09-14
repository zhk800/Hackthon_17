import React, { useState } from 'react';
import "./Auth.css";
import apiService from '../services/apiService';

export default function Register({ onSwitchLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!username || !password || !email) {
      setError("请填写完整信息");
      return;
    }
    try {
      const result = await apiService.auth.register(username, password, email);
      if (result.success) {
        setSuccess("注册成功，请登录！");
        setTimeout(() => onSwitchLogin(), 1000);
      } else {
        setError(result.message || "注册失败");
      }
    } catch (error) {
      setError("注册过程中发生错误，请稍后重试");
      console.error('Register error:', error);
    }
  };

  return (
    <div className="login-box">
      <h2>用户注册</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          type="text"
          placeholder="用户名"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoFocus
        />
        <input
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">注册</button>
      </form>
      <div className="login-links">
        <span onClick={onSwitchLogin}>已有账号？登录</span>
      </div>
      {error && <div style={{ color: "#ff7875", marginTop: 8 }}>{error}</div>}
      {success && <div style={{ color: "#52c41a", marginTop: 8 }}>{success}</div>}
    </div>
  );
}