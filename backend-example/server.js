// 简单的后端API示例
// 运行: node server.js
// 访问: http://localhost:3001

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 模拟数据库
let users = [
  {
    id: 'user_1',
    username: 'demo_user',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    email: 'demo@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    createdAt: new Date().toISOString()
  }
];

let demands = [
  {
    id: 'demand_1',
    type: '羽毛球',
    time: '周六下午14:00-16:00',
    location: '上海交通大学体育馆羽毛球场A区',
    desc: '水平一般，求搭子',
    author: 'demo_user',
    authorId: 'user_1',
    ratings: { experience: 4.5, reliability: 4.8, communication: 4.6 },
    totalRating: 4.6,
    createdAt: new Date().toISOString()
  }
];

let partners = [];
let messages = [];
let ratings = [];

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: '未提供认证token' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: '无效的token' });
    }
    req.user = user;
    next();
  });
};

// 认证相关API
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.json({ success: false, message: '用户名或密码错误' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.json({ success: false, message: '用户名或密码错误' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // 检查用户是否已存在
    if (users.find(u => u.username === username)) {
      return res.json({ success: false, message: '用户名已存在' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: `user_${Date.now()}`,
      username,
      password: hashedPassword,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    res.json({
      success: true,
      message: '注册成功',
      data: { token: jwt.sign({ id: newUser.id, username }, JWT_SECRET, { expiresIn: '7d' }) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: '登出成功' });
});

// 需求相关API
app.get('/api/demands', (req, res) => {
  res.json({ success: true, data: demands });
});

// 根据ID获取需求详情
app.get('/api/demands/:id', (req, res) => {
  try {
    const demandId = req.params.id;
    const demand = demands.find(d => d.id === demandId);
    
    if (demand) {
      res.json({ success: true, data: demand });
    } else {
      res.json({ success: false, message: '需求不存在' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: '获取需求详情失败' });
  }
});

app.post('/api/demands', authenticateToken, (req, res) => {
  try {
    const newDemand = {
      id: `demand_${Date.now()}`,
      ...req.body,
      author: req.user.username,
      authorId: req.user.id,
      createdAt: new Date().toISOString(),
      ratings: { experience: 0, reliability: 0, communication: 0 },
      totalRating: 0
    };

    demands.push(newDemand);
    res.json({ success: true, data: newDemand });
  } catch (error) {
    res.status(500).json({ success: false, message: '创建需求失败' });
  }
});

app.put('/api/demands/:id', authenticateToken, (req, res) => {
  try {
    const demandId = req.params.id;
    const demandIndex = demands.findIndex(d => d.id === demandId);
    
    if (demandIndex === -1) {
      return res.json({ success: false, message: '需求不存在' });
    }

    demands[demandIndex] = { ...demands[demandIndex], ...req.body };
    res.json({ success: true, data: demands[demandIndex] });
  } catch (error) {
    res.status(500).json({ success: false, message: '更新需求失败' });
  }
});

app.delete('/api/demands/:id', authenticateToken, (req, res) => {
  try {
    const demandId = req.params.id;
    const demandIndex = demands.findIndex(d => d.id === demandId);
    
    if (demandIndex === -1) {
      return res.json({ success: false, message: '需求不存在' });
    }

    demands.splice(demandIndex, 1);
    res.json({ success: true, message: '需求删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除需求失败' });
  }
});

app.get('/api/demands/search', (req, res) => {
  try {
    const { query } = req.query;
    let filteredDemands = demands;

    if (query) {
      filteredDemands = demands.filter(demand => 
        demand.type.toLowerCase().includes(query.toLowerCase()) ||
        demand.desc.toLowerCase().includes(query.toLowerCase()) ||
        demand.location.toLowerCase().includes(query.toLowerCase())
      );
    }

    res.json({ success: true, data: filteredDemands });
  } catch (error) {
    res.status(500).json({ success: false, message: '搜索失败' });
  }
});

app.post('/api/demands/match', (req, res) => {
  try {
    // 简单的匹配逻辑
    const { type, location } = req.body;
    const matches = demands.filter(demand => 
      demand.type === type || demand.location.includes(location)
    );

    res.json({ success: true, data: matches });
  } catch (error) {
    res.status(500).json({ success: false, message: '匹配失败' });
  }
});

// 搭子关系相关API
app.get('/api/partners', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const userPartners = partners.filter(p => 
      p.fromUserId === userId || p.toUserId === userId
    );

    res.json({
      success: true,
      data: {
        pending: userPartners.filter(p => p.status === 'pending'),
        accepted: userPartners.filter(p => p.status === 'accepted')
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取搭子列表失败' });
  }
});

app.post('/api/partners/invite', authenticateToken, (req, res) => {
  try {
    const { fromUserId, toUserId, demandId } = req.body;
    
    const invitation = {
      id: `invitation_${Date.now()}`,
      fromUserId,
      toUserId,
      demandId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    partners.push(invitation);
    res.json({ success: true, message: '邀请已发送' });
  } catch (error) {
    res.status(500).json({ success: false, message: '发送邀请失败' });
  }
});

app.post('/api/partners/accept', authenticateToken, (req, res) => {
  try {
    const { invitationId } = req.body;
    const invitation = partners.find(p => p.id === invitationId);
    
    if (invitation) {
      invitation.status = 'accepted';
      res.json({ success: true, message: '已成功添加为搭子' });
    } else {
      res.json({ success: false, message: '邀请不存在' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: '接受邀请失败' });
  }
});

app.post('/api/partners/reject', authenticateToken, (req, res) => {
  try {
    const { invitationId } = req.body;
    const invitation = partners.find(p => p.id === invitationId);
    
    if (invitation) {
      invitation.status = 'rejected';
      res.json({ success: true, message: '已拒绝邀请' });
    } else {
      res.json({ success: false, message: '邀请不存在' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: '拒绝邀请失败' });
  }
});

// 聊天相关API
app.get('/api/chat/messages', authenticateToken, (req, res) => {
  try {
    const { userId1, userId2 } = req.query;
    const userMessages = messages.filter(m => 
      (m.fromUserId === userId1 && m.toUserId === userId2) ||
      (m.fromUserId === userId2 && m.toUserId === userId1)
    );

    res.json({ success: true, data: userMessages });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取聊天记录失败' });
  }
});

app.post('/api/chat/send', authenticateToken, (req, res) => {
  try {
    const { fromUserId, toUserId, content, type = 'text' } = req.body;
    
    const message = {
      id: `msg_${Date.now()}`,
      fromUserId,
      toUserId,
      content,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };

    messages.push(message);
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: '发送消息失败' });
  }
});

// 评分相关API
app.post('/api/ratings/submit', authenticateToken, (req, res) => {
  try {
    const { raterId, targetId, rating } = req.body;
    
    const newRating = {
      id: `rating_${Date.now()}`,
      raterId,
      targetId,
      rating,
      createdAt: new Date().toISOString()
    };

    ratings.push(newRating);
    res.json({ success: true, message: '评分提交成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '评分提交失败' });
  }
});

app.get('/api/ratings/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userRatings = ratings.filter(r => r.targetId === userId);
    res.json({ success: true, data: userRatings });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取用户评分失败' });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API服务正常运行',
    timestamp: new Date().toISOString()
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: '服务器内部错误' 
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 后端API服务已启动`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`🔗 API文档: http://localhost:${PORT}/api/health`);
  console.log(`\n📝 测试账号:`);
  console.log(`   用户名: demo_user`);
  console.log(`   密码: password`);
});

module.exports = app;
