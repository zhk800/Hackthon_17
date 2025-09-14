import React, { useState, useEffect } from 'react';
import './ApiConfigModal.css';

const ApiConfigModal = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState({
    useRealAPI: false,
    baseURL: 'http://localhost:3001/api',
    timeout: 10000,
  });

  useEffect(() => {
    if (isOpen) {
      // 加载当前配置
      const savedConfig = JSON.parse(localStorage.getItem('api_config') || '{}');
      setConfig({
        useRealAPI: savedConfig.useRealAPI || false,
        baseURL: savedConfig.baseURL || 'http://localhost:3001/api',
        timeout: savedConfig.timeout || 10000,
      });
    }
  }, [isOpen]);

  const handleSave = () => {
    // 保存配置到localStorage
    localStorage.setItem('api_config', JSON.stringify(config));
    
    // 通知父组件配置已更新
    if (window.apiService && window.apiService.config) {
      window.apiService.config.setMode(config.useRealAPI);
      window.apiService.config.setBaseURL(config.baseURL);
    }
    
    onClose();
    
    // 显示成功消息
    alert('API配置已保存！页面将刷新以应用新配置。');
    window.location.reload();
  };

  const handleReset = () => {
    setConfig({
      useRealAPI: false,
      baseURL: 'http://localhost:3001/api',
      timeout: 10000,
    });
  };

  const handlePreset = (preset) => {
    switch (preset) {
      case 'development':
        setConfig({
          useRealAPI: false,
          baseURL: 'http://localhost:3001/api',
          timeout: 10000,
        });
        break;
      case 'production':
        setConfig({
          useRealAPI: true,
          baseURL: 'https://api.findpartner.com/api',
          timeout: 15000,
        });
        break;
      case 'test':
        setConfig({
          useRealAPI: false,
          baseURL: 'http://test-api.findpartner.com/api',
          timeout: 8000,
        });
        break;
      default:
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="api-config-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>API配置</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="config-section">
            <h4>API模式</h4>
            <div className="radio-group">
              <label className="radio-item">
                <input
                  type="radio"
                  name="apiMode"
                  checked={!config.useRealAPI}
                  onChange={() => setConfig({ ...config, useRealAPI: false })}
                />
                <span>模拟数据模式</span>
                <small>使用本地存储的模拟数据，适合开发和演示</small>
              </label>
              <label className="radio-item">
                <input
                  type="radio"
                  name="apiMode"
                  checked={config.useRealAPI}
                  onChange={() => setConfig({ ...config, useRealAPI: true })}
                />
                <span>真实API模式</span>
                <small>连接到真实的后端API服务器</small>
              </label>
            </div>
          </div>

          <div className="config-section">
            <h4>API设置</h4>
            <div className="form-group">
              <label htmlFor="baseURL">API基础URL</label>
              <input
                type="text"
                id="baseURL"
                value={config.baseURL}
                onChange={(e) => setConfig({ ...config, baseURL: e.target.value })}
                placeholder="http://localhost:3001/api"
              />
            </div>
            <div className="form-group">
              <label htmlFor="timeout">请求超时时间 (毫秒)</label>
              <input
                type="number"
                id="timeout"
                value={config.timeout}
                onChange={(e) => setConfig({ ...config, timeout: parseInt(e.target.value) })}
                min="1000"
                max="30000"
              />
            </div>
          </div>

          <div className="config-section">
            <h4>快速配置</h4>
            <div className="preset-buttons">
              <button
                className="preset-btn"
                onClick={() => handlePreset('development')}
              >
                开发环境
              </button>
              <button
                className="preset-btn"
                onClick={() => handlePreset('test')}
              >
                测试环境
              </button>
              <button
                className="preset-btn"
                onClick={() => handlePreset('production')}
              >
                生产环境
              </button>
            </div>
          </div>

          <div className="config-section">
            <h4>当前状态</h4>
            <div className="status-info">
              <p><strong>API模式:</strong> {config.useRealAPI ? '真实API' : '模拟数据'}</p>
              <p><strong>基础URL:</strong> {config.baseURL}</p>
              <p><strong>超时时间:</strong> {config.timeout}ms</p>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleReset}>
            重置
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiConfigModal;
