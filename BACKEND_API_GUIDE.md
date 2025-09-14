# 后端API集成指南

本文档说明如何将"寻找搭子"应用与真实的后端API集成。

## 🚀 快速开始

### 1. 启用真实API模式

在应用中点击"API配置"按钮，选择"真实API模式"，并配置您的后端API地址。

### 2. 后端API要求

您的后端需要实现以下API端点：

## 📋 API端点规范

### 认证相关

#### POST /api/auth/login
用户登录
```json
{
  "username": "string",
  "password": "string"
}
```

响应：
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "avatar": "string",
      "email": "string",
      "createdAt": "string"
    },
    "token": "string"
  }
}
```

#### POST /api/auth/register
用户注册
```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```

#### POST /api/auth/logout
用户登出

#### POST /api/auth/refresh
刷新token

### 用户相关

#### GET /api/user/profile?userId={userId}
获取用户信息

#### PUT /api/user/update
更新用户信息

#### POST /api/user/avatar
上传用户头像

### 需求相关

#### GET /api/demands
获取所有需求
查询参数：
- `type`: 活动类型
- `location`: 地点
- `page`: 页码
- `limit`: 每页数量

#### POST /api/demands
创建新需求
```json
{
  "type": "string",
  "time": "string",
  "location": "string",
  "desc": "string",
  "author": "string"
}
```

#### PUT /api/demands/:id
更新需求

#### DELETE /api/demands/:id
删除需求

#### GET /api/demands/search?query={query}
搜索需求

#### POST /api/demands/match
智能匹配需求
```json
{
  "type": "string",
  "time": "string",
  "location": "string",
  "desc": "string"
}
```

### 搭子关系相关

#### GET /api/partners?userId={userId}
获取用户的搭子关系

#### POST /api/partners/invite
发送搭子邀请
```json
{
  "fromUserId": "string",
  "toUserId": "string",
  "demandId": "string"
}
```

#### POST /api/partners/accept
接受搭子邀请

#### POST /api/partners/reject
拒绝搭子邀请

#### DELETE /api/partners/remove?partnerId={partnerId}
移除搭子

### 聊天相关

#### GET /api/chat/messages?userId1={userId1}&userId2={userId2}
获取聊天记录

#### POST /api/chat/send
发送消息
```json
{
  "fromUserId": "string",
  "toUserId": "string",
  "content": "string",
  "type": "text"
}
```

#### GET /api/chat/rooms?userId={userId}
获取聊天房间列表

### 评分相关

#### POST /api/ratings/submit
提交评分
```json
{
  "raterId": "string",
  "targetId": "string",
  "rating": {
    "experience": 5,
    "reliability": 4,
    "communication": 5
  }
}
```

#### GET /api/ratings/user/:userId
获取用户评分

### 通知相关

#### GET /api/notifications?userId={userId}
获取通知列表

#### POST /api/notifications/read
标记通知为已读

#### DELETE /api/notifications/:id
删除通知

### 地图相关

#### POST /api/location/update
更新用户位置
```json
{
  "userId": "string",
  "latitude": 31.2304,
  "longitude": 121.4737,
  "address": "string"
}
```

#### GET /api/location/friends?userId={userId}
获取搭子位置

#### GET /api/location/nearby?latitude={lat}&longitude={lng}&radius={radius}
获取附近的需求

## 🔧 技术实现

### 1. 后端技术栈建议

- **Node.js + Express** 或 **Python + FastAPI** 或 **Java + Spring Boot**
- **数据库**: MongoDB 或 PostgreSQL
- **认证**: JWT Token
- **文件存储**: AWS S3 或 本地存储
- **实时通信**: Socket.io 或 WebSocket

### 2. 数据库设计

#### 用户表 (users)
```sql
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE,
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 需求表 (demands)
```sql
CREATE TABLE demands (
  id VARCHAR(50) PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  time VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  author_id VARCHAR(50) NOT NULL,
  status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
);
```

#### 搭子关系表 (partners)
```sql
CREATE TABLE partners (
  id VARCHAR(50) PRIMARY KEY,
  from_user_id VARCHAR(50) NOT NULL,
  to_user_id VARCHAR(50) NOT NULL,
  demand_id VARCHAR(50) NOT NULL,
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_user_id) REFERENCES users(id),
  FOREIGN KEY (to_user_id) REFERENCES users(id),
  FOREIGN KEY (demand_id) REFERENCES demands(id)
);
```

#### 聊天消息表 (messages)
```sql
CREATE TABLE messages (
  id VARCHAR(50) PRIMARY KEY,
  from_user_id VARCHAR(50) NOT NULL,
  to_user_id VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  type ENUM('text', 'image', 'file') DEFAULT 'text',
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_user_id) REFERENCES users(id),
  FOREIGN KEY (to_user_id) REFERENCES users(id)
);
```

#### 评分表 (ratings)
```sql
CREATE TABLE ratings (
  id VARCHAR(50) PRIMARY KEY,
  rater_id VARCHAR(50) NOT NULL,
  target_id VARCHAR(50) NOT NULL,
  experience_rating INT CHECK (experience_rating >= 1 AND experience_rating <= 5),
  reliability_rating INT CHECK (reliability_rating >= 1 AND reliability_rating <= 5),
  communication_rating INT CHECK (communication_rating >= 1 AND communication_rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rater_id) REFERENCES users(id),
  FOREIGN KEY (target_id) REFERENCES users(id)
);
```

### 3. 环境变量配置

创建 `.env` 文件：
```env
# 数据库配置
DATABASE_URL=mongodb://localhost:27017/findpartner
# 或
DATABASE_URL=postgresql://username:password@localhost:5432/findpartner

# JWT配置
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# 服务器配置
PORT=3001
NODE_ENV=development

# 文件上传配置
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# 邮件配置（可选）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
```

### 4. 中间件示例

#### 认证中间件
```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: '未提供认证token' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: '无效的token' });
    }
    req.user = user;
    next();
  });
};
```

#### 错误处理中间件
```javascript
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '服务器内部错误',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

## 🚀 部署指南

### 1. Docker部署

创建 `Dockerfile`：
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

创建 `docker-compose.yml`：
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mongodb://mongo:27017/findpartner
    depends_on:
      - mongo
  
  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

### 2. 云服务部署

推荐使用以下云服务：
- **Heroku**: 简单快速
- **AWS EC2**: 灵活可控
- **Vercel**: 适合Node.js应用
- **Railway**: 现代化部署平台

## 📝 测试

### 1. API测试

使用Postman或curl测试API端点：

```bash
# 测试登录
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123456"}'

# 测试获取需求列表
curl -X GET http://localhost:3001/api/demands \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. 单元测试

```javascript
const request = require('supertest');
const app = require('./app');

describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'test',
        password: '123456'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });
});
```

## 🔒 安全考虑

1. **密码加密**: 使用bcrypt加密密码
2. **输入验证**: 验证所有输入数据
3. **SQL注入防护**: 使用参数化查询
4. **CORS配置**: 正确配置跨域请求
5. **Rate Limiting**: 限制API请求频率
6. **HTTPS**: 生产环境使用HTTPS

## 📚 更多资源

- [Express.js官方文档](https://expressjs.com/)
- [MongoDB官方文档](https://docs.mongodb.com/)
- [JWT认证指南](https://jwt.io/introduction)
- [RESTful API设计规范](https://restfulapi.net/)

---

**注意**: 这是一个完整的后端API集成指南。您可以根据实际需求调整API端点和数据结构。
