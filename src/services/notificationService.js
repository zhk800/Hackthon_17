// 通知服务，用于管理应用中的通知

// 通知队列
let notifications = [];
// 通知回调函数
let notifyCallbacks = [];

// 通知服务对象
export const notificationService = {
  // 添加通知回调函数
  addNotifyCallback: (callback) => {
    if (typeof callback === 'function' && !notifyCallbacks.includes(callback)) {
      notifyCallbacks.push(callback);
    }
  },
  
  // 移除通知回调函数
  removeNotifyCallback: (callback) => {
    notifyCallbacks = notifyCallbacks.filter(cb => cb !== callback);
  },
  
  // 显示通知
  show: (message, type = 'info', duration = 3000, id = null) => {
    // 生成唯一ID（如果没有提供）
    const notificationId = id || `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 创建通知对象
    const notification = {
      id: notificationId,
      message,
      type,
      duration,
      timestamp: Date.now()
    };
    
    // 添加到队列
    notifications.push(notification);
    
    // 通知所有回调函数
    notifyCallbacks.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Notification callback error:', error);
      }
    });
    
    // 返回通知ID，以便可以手动关闭通知
    return notificationId;
  },
  
  // 关闭特定通知
  close: (notificationId) => {
    notifications = notifications.filter(n => n.id !== notificationId);
    
    // 通知所有回调函数
    notifyCallbacks.forEach(callback => {
      try {
        callback({ id: notificationId, closed: true });
      } catch (error) {
        console.error('Notification callback error:', error);
      }
    });
  },
  
  // 关闭所有通知
  closeAll: () => {
    const currentNotifications = [...notifications];
    notifications = [];
    
    // 通知所有回调函数
    notifyCallbacks.forEach(callback => {
      try {
        currentNotifications.forEach(notification => {
          callback({ id: notification.id, closed: true });
        });
      } catch (error) {
        console.error('Notification callback error:', error);
      }
    });
  },
  
  // 获取所有通知
  getAll: () => {
    return [...notifications];
  },
  
  // 显示成功通知
  success: (message, duration = 3000) => {
    return notificationService.show(message, 'success', duration);
  },
  
  // 显示错误通知
  error: (message, duration = 5000) => {
    return notificationService.show(message, 'error', duration);
  },
  
  // 显示警告通知
  warning: (message, duration = 4000) => {
    return notificationService.show(message, 'warning', duration);
  },
  
  // 显示信息通知
  info: (message, duration = 3000) => {
    return notificationService.show(message, 'info', duration);
  }
};

export default notificationService;