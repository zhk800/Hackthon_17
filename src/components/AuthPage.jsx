import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import './AuthPage.css';

export default function AuthPage({ onLogin, mode, onSwitchToRegister, onSwitchToLogin, onBackToMain }) {
  const [showLogin, setShowLogin] = useState(mode === 'login');

  useEffect(() => {
    setShowLogin(mode === 'login');
  }, [mode]);

  return (
    <div className="auth-page">
      <div className="auth-header">
        <button className="back-btn" onClick={onBackToMain}>
          ← 返回主界面
        </button>
        <div className="auth-mode-indicator">
          {showLogin ? '登录' : '注册'}
        </div>
      </div>
      <div className="auth-left">
        <div className="auth-brand">
          <h1>搭子</h1>
          <p>找到志同道合的伙伴</p>
        </div>
        <div className="auth-features">
          <div className="feature-item">
            <h3>轻松匹配</h3>
            <p>根据兴趣、时间、地点快速找到合适的搭子</p>
          </div>
          <div className="feature-item">
            <h3>即时聊天</h3>
            <p>与搭子实时沟通，计划活动细节</p>
          </div>
          <div className="feature-item">
            <h3>活动记录</h3>
            <p>记录每一次活动经历，分享精彩瞬间</p>
          </div>
        </div>
      </div>
      <div className="auth-right">
        {showLogin ? (
          <Login 
            onLogin={onLogin} 
            onSwitchRegister={onSwitchToRegister} 
          />
        ) : (
          <Register 
            onSwitchLogin={onSwitchToLogin} 
          />
        )}
      </div>
    </div>
  );
}