# 寻找搭子后端API示例

这是一个简单的后端API示例，展示如何为"寻找搭子"应用提供后端服务。

## 🚀 快速开始

### 1. 安装依赖

```bash
cd backend-example
npm install
```

### 2. 启动服务

```bash
npm start
```

服务将在 http://localhost:3001 启动

### 3. 开发模式

```bash
npm run dev
```

使用nodemon自动重启服务

## 📋 功能特性

- ✅ 用户认证（登录、注册）
- ✅ 需求管理（CRUD操作）
- ✅ 搭子关系管理
- ✅ 聊天功能
- ✅ 评分系统
- ✅ JWT认证
- ✅ 密码加密
- ✅ CORS支持

## 🔧 API端点

### 认证
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/logout` - 用户登出

### 需求管理
- `GET /api/demands` - 获取所有需求
- `POST /api/demands` - 创建需求
- `PUT /api/demands/:id` - 更新需求
- `DELETE /api/demands/:id` - 删除需求
- `GET /api/demands/search` - 搜索需求
- `POST /api/demands/match` - 智能匹配

### 搭子关系
- `GET /api/partners` - 获取搭子列表
- `POST /api/partners/invite` - 发送邀请
- `POST /api/partners/accept` - 接受邀请
- `POST /api/partners/reject` - 拒绝邀请

### 聊天
- `GET /api/chat/messages` - 获取聊天记录
- `POST /api/chat/send` - 发送消息

### 评分
- `POST /api/ratings/submit` - 提交评分
- `GET /api/ratings/user/:userId` - 获取用户评分

## 🧪 测试

### 测试账号
- 用户名: `demo_user`
- 密码: `password`

### 使用curl测试

```bash
# 登录
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo_user","password":"password"}'

# 获取需求列表
curl -X GET http://localhost:3001/api/demands \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔒 安全特性

- JWT Token认证
- 密码bcrypt加密
- CORS跨域支持
- 输入验证
- 错误处理

## 📝 环境变量

创建 `.env` 文件：

```env
PORT=3001
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## 🚀 部署

### 使用PM2部署

```bash
npm install -g pm2
pm2 start server.js --name "find-partner-api"
pm2 save
pm2 startup
```

### 使用Docker部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 📚 扩展建议

1. **数据库集成**: 使用MongoDB或PostgreSQL替代内存存储
2. **实时通信**: 集成Socket.io支持实时聊天
3. **文件上传**: 支持头像和图片上传
4. **邮件服务**: 集成邮件通知功能
5. **缓存**: 使用Redis提高性能
6. **日志**: 集成Winston日志系统
7. **监控**: 添加健康检查和监控

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个后端示例！

## 📄 许可证

MIT License
