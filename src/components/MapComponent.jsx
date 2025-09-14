import React, { useState, useEffect, useRef } from 'react';
import './MapComponent.css';

const MapComponent = ({ showUserLocation = true, friendsLocations = [], selectedLocation = null }) => {
  // 默认使用上海交通大学的位置作为模拟数据
  const defaultLocation = { lat: 31.028139, lng: 121.436028 };
  
  const [userLocation, setUserLocation] = useState(defaultLocation);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usingMockData, setUsingMockData] = useState(true);
  const mapCanvasRef = useRef(null);

  useEffect(() => {
    if (showUserLocation) {
      getUserLocation();
    } else {
      setLoading(false);
    }
  }, [showUserLocation]);

  const getUserLocation = () => {
    setLoading(true);
    setError('');
    
    if (!navigator.geolocation) {
      setError('您的浏览器不支持地理定位，正在使用模拟位置');
      setUsingMockData(true);
      setLoading(false);
      return;
    }

    const success = (position) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      setUsingMockData(false);
      setLoading(false);
    };

    const error = (err) => {
      const errorMessages = {
        1: '您拒绝了位置权限请求，正在使用模拟位置',
        2: '无法获取您的位置信息，正在使用模拟位置',
        3: '获取位置信息超时，正在使用模拟位置'
      };
      setError(errorMessages[err.code] || '无法获取您的位置，正在使用模拟位置');
      setUsingMockData(true);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    });
  };

  // 渲染模拟地图
  useEffect(() => {
    if (!mapCanvasRef.current || loading || !userLocation) return;

    const canvas = mapCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 设置画布大小
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制地图背景
    drawMapBackground(ctx, canvas);
    
    // 绘制地形画面
    drawTerrain(ctx, canvas);
    
    // 绘制道路
    drawRoads(ctx, canvas);
    
    // 绘制建筑物
    drawBuildings(ctx, canvas);
    
    // 绘制水域
    drawWaterBodies(ctx, canvas);
    
    // 绘制网格
    drawGrid(ctx, canvas);
    
    // 绘制用户位置
    if (userLocation) {
      drawUserMarker(ctx, canvas, userLocation, '您的位置');
    }
    
    // 绘制搭子位置
    friendsLocations.forEach((friend, index) => {
      drawFriendMarker(ctx, canvas, friend, index);
    });
    
    // 绘制选中的位置
    if (selectedLocation) {
      drawSelectedLocation(ctx, canvas, selectedLocation);
    }
    
    // 添加SJTU标志点
    drawSJTUMarker(ctx, canvas);
    
  }, [userLocation, loading, friendsLocations, selectedLocation]);
  
  // 绘制地图背景
  const drawMapBackground = (ctx, canvas) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  
  // 绘制地形
  const drawTerrain = (ctx, canvas) => {
    // 创建噪点地形
    const width = canvas.width;
    const height = canvas.height;
    
    // 绘制不同高度的地形区域
    for (let y = 0; y < height; y += 20) {
      for (let x = 0; x < width; x += 20) {
        // 随机地形高度
        const heightValue = Math.random();
        let color;
        
        if (heightValue < 0.2) {
          // 深色区域
          color = `rgba(22, 33, 62, ${0.6 + Math.random() * 0.2})`;
        } else if (heightValue < 0.6) {
          // 中等高度区域
          color = `rgba(25, 30, 60, ${0.4 + Math.random() * 0.2})`;
        } else {
          // 浅色区域
          color = `rgba(30, 35, 70, ${0.3 + Math.random() * 0.2})`;
        }
        
        // 绘制地形方块
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 20, 20);
      }
    }
  };
  
  // 绘制道路
  const drawRoads = (ctx, canvas) => {
    ctx.strokeStyle = 'rgba(100, 100, 120, 0.4)';
    ctx.lineWidth = 3;
    
    // 绘制主要道路
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    
    // 绘制次要道路
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(80, 80, 100, 0.3)';
    
    // 水平次要道路
    for (let i = 1; i <= 3; i++) {
      const y = (canvas.height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // 垂直次要道路
    for (let i = 1; i <= 3; i++) {
      const x = (canvas.width / 4) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
  };
  
  // 绘制建筑物
  const drawBuildings = (ctx, canvas) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // 绘制模拟建筑物
    for (let i = 0; i < 20; i++) {
      const radius = 100 + Math.random() * 80;
      const angle = (i / 20) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      const buildingWidth = 10 + Math.random() * 20;
      const buildingHeight = 15 + Math.random() * 30;
      
      // 建筑物颜色
      const color = `rgba(${100 + Math.random() * 20}, ${110 + Math.random() * 20}, ${140 + Math.random() * 20}, ${0.7 + Math.random() * 0.3})`;
      
      ctx.fillStyle = color;
      ctx.fillRect(x - buildingWidth / 2, y - buildingHeight, buildingWidth, buildingHeight);
      
      // 建筑物窗户
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      for (let w = 0; w < Math.floor(buildingWidth / 4); w++) {
        for (let h = 0; h < Math.floor(buildingHeight / 4); h++) {
          if (Math.random() > 0.5) {
            ctx.fillRect(x - buildingWidth / 2 + w * 4 + 1, y - buildingHeight + h * 4 + 1, 2, 2);
          }
        }
      }
    }
  };
  
  // 绘制水域
  const drawWaterBodies = (ctx, canvas) => {
    // 绘制简单的水域区域
    ctx.fillStyle = 'rgba(30, 60, 100, 0.2)';
    ctx.beginPath();
    ctx.arc(canvas.width * 0.3, canvas.height * 0.7, 60, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(canvas.width * 0.7, canvas.height * 0.3, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // 添加水波效果
    const time = Date.now() / 2000;
    ctx.strokeStyle = 'rgba(30, 60, 100, 0.3)';
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    ctx.arc(canvas.width * 0.3, canvas.height * 0.7, 65 + Math.sin(time) * 5, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(canvas.width * 0.7, canvas.height * 0.3, 45 + Math.cos(time) * 5, 0, Math.PI * 2);
    ctx.stroke();
  };

  // 绘制网格
  const drawGrid = (ctx, canvas) => {
    ctx.strokeStyle = 'rgba(91, 115, 255, 0.1)';
    ctx.lineWidth = 1;
    
    const gridSize = 30;
    
    // 垂直线
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // 水平线
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  // 绘制用户标记
  const drawUserMarker = (ctx, canvas, location, label) => {
    // 将经纬度映射到画布坐标 (这里使用简单的映射，实际应用中需要更复杂的映射)
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    
    // 绘制标记脉冲效果
    const pulseSize = 15 + Math.sin(Date.now() / 500) * 5;
    ctx.fillStyle = 'rgba(224, 32, 32, 0.2)';
    ctx.beginPath();
    ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制标记
    ctx.fillStyle = '#e02020';
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制标记边框
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 绘制标记点
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制标签
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, y - 20);
  };

  // 绘制搭子标记
  const drawFriendMarker = (ctx, canvas, friend, index) => {
    // 随机生成搭子位置（以用户为中心）
    const angle = (index * 45) * Math.PI / 180;
    const distance = 60 + (index % 3) * 30;
    const x = canvas.width / 2 + Math.cos(angle) * distance;
    const y = canvas.height / 2 + Math.sin(angle) * distance;
    
    // 绘制标记
    ctx.fillStyle = '#0070c0';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制标记边框
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 绘制标签
    ctx.fillStyle = '#fff';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(friend.author, x, y - 15);
    
    // 绘制连接线
    ctx.strokeStyle = 'rgba(0, 112, 192, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  // 绘制选中的位置
  const drawSelectedLocation = (ctx, canvas, location) => {
    // 简化的位置映射
    const x = canvas.width / 2 + (Math.random() - 0.5) * 100;
    const y = canvas.height / 2 + (Math.random() - 0.5) * 100;
    
    // 绘制圆形标记
    ctx.strokeStyle = '#F5A300';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.stroke();
    
    // 绘制脉冲效果
    const pulseSize = 20 + Math.sin(Date.now() / 300) * 5;
    ctx.strokeStyle = 'rgba(245, 163, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
    ctx.stroke();
    
    // 绘制标签
    ctx.fillStyle = '#F5A300';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(location, x, y - 25);
  };

  // 绘制SJTU标志点
  const drawSJTUMarker = (ctx, canvas) => {
    // 定位到地图右下角
    const x = canvas.width - 80;
    const y = canvas.height - 80;
    
    // 绘制圆形背景
    ctx.fillStyle = 'rgba(224, 32, 32, 0.2)';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制SJTU文字
    ctx.fillStyle = '#e02020';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SJTU', x, y);
    
    // 绘制边框
    ctx.strokeStyle = 'rgba(224, 32, 32, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.stroke();
  };

  // 在地图上添加模拟数据状态显示
  useEffect(() => {
    // 为了防止地图在初次加载时出现空白，可以添加一个小的延迟
    const timer = setTimeout(() => {
      if (mapCanvasRef.current && !loading && userLocation) {
        // 触发重绘
        const event = new Event('resize');
        window.dispatchEvent(event);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [userLocation, loading]);

  if (loading) {
    return (
      <div className="map-loading">
        <div className="loading-spinner"></div>
        <p>正在获取位置信息...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-error">
        <p>{error}</p>
        <button onClick={getUserLocation} className="retry-button">重试</button>
      </div>
    );
  }

  return (
    <div className="map-container">
      <canvas ref={mapCanvasRef} className="map-canvas" />
      <div className="map-controls">
        <button onClick={getUserLocation} className="control-button">
          📍 刷新位置
        </button>
        {userLocation && (
          <div className="location-info">
            <span>坐标: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
            {usingMockData && (
              <span style={{color: '#ff4d4f', fontSize: '0.7rem', display: 'block'}}>
                (模拟位置: 上海交通大学)
              </span>
            )}
          </div>
        )}
      </div>
      {error && (
        <div className="map-error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default MapComponent;