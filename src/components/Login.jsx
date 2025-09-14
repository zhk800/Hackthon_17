import React, { useState, useEffect } from 'react';
import "./Auth.css";
import apiService from '../services/apiService';

export default function Login({ onLogin, onSwitchRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");


  // 自动填充记住的用户名
  useEffect(() => {
    const saved = localStorage.getItem("remember_username");
    if (saved) setUsername(saved);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("请填写完整信息");
      return;
    }
    try {
      const result = await apiService.auth.login(username, password);
      if (result.success) {
        if (remember) localStorage.setItem("remember_username", username);
        else localStorage.removeItem("remember_username");
        onLogin(result.user);
      } else {
        setError(result.message || "登录失败");
      }
    } catch (error) {
      setError("登录过程中发生错误，请稍后重试");
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-box">
      <h2>用户登录</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          type="text"
          placeholder="用户名"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoFocus
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <label className="remember-row">
          <input
            type="checkbox"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
          /> 记住用户名
        </label>
        <button type="submit">登录</button>
      </form>
      <div className="login-links">
        <span onClick={onSwitchRegister}>没有账号？注册</span>
      </div>
      {error && <div style={{ color: "#ff7875", marginTop: 8 }}>{error}</div>}
    </div>
  );
}