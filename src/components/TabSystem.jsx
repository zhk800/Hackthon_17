import React, { useState, useEffect } from 'react';
import './TabSystem.css';

const TabSystem = ({ children, tabs, activeTabIndex = 0, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(activeTabIndex);

  useEffect(() => {
    setActiveTab(activeTabIndex);
  }, [activeTabIndex]);

  // 生成动态样式
  const getButtonStyles = (tab, isActive) => {
    if (!tab.color || !isActive) return {};
    return {
      '--tab-color': tab.color
    };
  };

  return (
    <div className="tab-system">
      <div className="tab-header">
        {tabs.map((tab, index) => {
          const isActive = activeTab === index;
          const buttonStyles = getButtonStyles(tab, isActive);
          
          return (
            <button
              key={index}
              className={`tab-button ${isActive ? 'active' : ''}`}
              style={buttonStyles}
              onClick={() => {
                setActiveTab(index);
                if (onTabChange) onTabChange(index);
              }}
              title={tab.label}
            >
              <span className="tab-icon" style={isActive && tab.color ? { color: tab.color } : {}}>{tab.icon}</span>
              <span className="tab-label" style={isActive && tab.color ? { color: tab.color } : {}}>{tab.label}</span>
            </button>
          );
        })}
      </div>
      
      <div className="tab-content">
        <div className="tab-panel">
          {children[activeTab]}
        </div>
      </div>
    </div>
  );
};

export default TabSystem;
