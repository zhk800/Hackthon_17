# 快速启动指南

## 🚀 最简单的启动方式

### 1. 纯前端模式（推荐新手）
```bash
# 安装依赖
npm install

# 启动应用
npm start

# 访问 http://localhost:3000
# 无需登录，直接体验所有功能
```

### 2. 完整模式（支持真实注册登录）
```bash
# 启动后端
chmod +x start-backend.sh
./start-backend.sh

# 启动前端（新终端窗口）
npm start

# 访问 http://localhost:3000
# 点击"API配置" → 勾选"使用真实API模式" → 保存
# 然后可以注册新用户或使用测试账号登录
```

## 🔑 测试账号
- 用户名：`demo_user`
- 密码：`password`

## ❗ 常见问题

### 无法登录注册？
1. 确保后端运行：`curl http://localhost:3001/api/health`
2. 确保配置了真实API模式
3. 检查浏览器控制台错误信息

### 端口被占用？
```bash
# 查看端口占用
lsof -i :3000 -i :3001

# 杀死进程
kill -9 <PID>
```

### 数据不显示？
1. 清除浏览器缓存
2. 检查API配置是否正确
3. 重新启动服务

## 📞 需要帮助？
查看完整文档：[README.md](./README.md)
