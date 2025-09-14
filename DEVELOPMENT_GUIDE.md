# 开发指南

## 🚀 快速开始

### 环境要求
- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器
- 现代浏览器（Chrome、Firefox、Safari、Edge）

### 安装步骤
```bash
# 克隆项目
git clone <repository-url>
cd find-parterner

# 安装依赖
npm install

# 启动开发服务器
npm start
```

## 📁 项目结构详解

```
find-parterner/
├── public/                 # 静态资源
│   ├── index.html         # HTML模板
│   ├── favicon.ico        # 网站图标
│   └── manifest.json      # PWA配置
├── src/                   # 源代码
│   ├── components/        # React组件
│   │   ├── DemandForm.jsx # 需求发布表单
│   │   ├── DemandList.jsx # 需求列表
│   │   ├── ChatBox.jsx    # 聊天组件
│   │   ├── Friends.jsx    # 搭子列表
│   │   ├── Login.jsx      # 登录组件
│   │   └── Register.jsx   # 注册组件
│   ├── App.js             # 主应用组件
│   ├── App.css            # 主样式文件
│   ├── index.js           # 应用入口
│   └── index.css          # 全局样式
├── package.json           # 项目配置
└── README.md              # 项目说明
```

## 🛠️ 开发规范

### 代码风格
- 使用2个空格缩进
- 使用单引号
- 组件名使用PascalCase
- 文件名使用PascalCase.jsx
- 变量名使用camelCase

### 组件开发规范
```javascript
// 1. 导入顺序
import React, { useState, useEffect } from 'react';
import './Component.css';

// 2. 组件定义
export default function ComponentName({ prop1, prop2, onEvent }) {
  // 3. 状态定义
  const [state, setState] = useState(initialValue);
  
  // 4. 副作用
  useEffect(() => {
    // 副作用逻辑
  }, [dependencies]);
  
  // 5. 事件处理函数
  const handleEvent = () => {
    // 处理逻辑
  };
  
  // 6. 渲染
  return (
    <div className="component">
      {/* JSX内容 */}
    </div>
  );
}
```

### CSS样式规范
```css
/* 1. 类名使用kebab-case */
.component-name {
  /* 2. 属性按字母顺序排列 */
  background: #191a1e;
  border-radius: 18px;
  color: #fff;
  padding: 32px 24px;
}

/* 3. 响应式设计 */
@media (max-width: 900px) {
  .component-name {
    padding: 18px 10px;
  }
}
```

## 🔧 开发工具配置

### VS Code推荐插件
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

### VS Code设置
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

## 🧪 测试指南

### 运行测试
```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm test -- --coverage

# 运行特定测试文件
npm test DemandForm.test.js
```

### 测试文件结构
```
src/
├── components/
│   ├── DemandForm.jsx
│   ├── DemandForm.test.js
│   └── ...
└── __tests__/
    └── App.test.js
```

### 测试示例
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import DemandForm from './DemandForm';

test('renders demand form', () => {
  const mockSubmit = jest.fn();
  render(<DemandForm onSubmit={mockSubmit} />);
  
  expect(screen.getByPlaceholderText('活动类型（如打球/吃饭）')).toBeInTheDocument();
});

test('submits form with valid data', () => {
  const mockSubmit = jest.fn();
  render(<DemandForm onSubmit={mockSubmit} />);
  
  fireEvent.change(screen.getByPlaceholderText('活动类型（如打球/吃饭）'), {
    target: { value: '羽毛球' }
  });
  
  fireEvent.click(screen.getByText('发布'));
  
  expect(mockSubmit).toHaveBeenCalledWith({
    type: '羽毛球',
    time: '',
    location: '',
    desc: ''
  });
});
```

## 🐛 调试指南

### 浏览器调试
1. 打开开发者工具 (F12)
2. 使用Console查看错误信息
3. 使用Network面板检查API请求
4. 使用React Developer Tools插件

### 常见问题解决

#### 1. 组件不更新
```javascript
// 问题：状态更新后组件不重新渲染
// 解决：确保使用函数式更新
setState(prevState => ({ ...prevState, newValue }));
```

#### 2. 事件处理问题
```javascript
// 问题：事件处理函数中的this指向
// 解决：使用箭头函数或bind
const handleClick = () => {
  // 处理逻辑
};
```

#### 3. 样式不生效
```css
/* 问题：CSS样式被覆盖
/* 解决：使用更具体的选择器或!important */
.component .specific-element {
  color: #fff !important;
}
```

## 📦 构建和部署

### 构建生产版本
```bash
# 构建优化版本
npm run build

# 构建文件将生成在build/目录
```

### 部署选项
1. **静态托管**: Netlify, Vercel, GitHub Pages
2. **云服务**: AWS S3, Google Cloud Storage
3. **传统服务器**: Nginx, Apache

### 环境变量配置
```bash
# .env文件
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=development
```

## 🔄 版本控制

### Git工作流
```bash
# 创建功能分支
git checkout -b feature/new-feature

# 提交更改
git add .
git commit -m "feat: add new feature"

# 推送分支
git push origin feature/new-feature

# 创建Pull Request
```

### 提交信息规范
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

## 🚀 性能优化

### 组件优化
```javascript
// 使用React.memo避免不必要的重渲染
const MemoizedComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});

// 使用useMemo缓存计算结果
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// 使用useCallback缓存函数
const handleClick = useCallback(() => {
  doSomething();
}, [dependency]);
```

### 代码分割
```javascript
// 懒加载组件
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// 使用Suspense包装
<Suspense fallback={<div>Loading...</div>}>
  <LazyComponent />
</Suspense>
```

## 📚 学习资源

### React官方文档
- [React官方文档](https://reactjs.org/docs)
- [React Hooks指南](https://reactjs.org/docs/hooks-intro.html)
- [Create React App文档](https://create-react-app.dev/)

### 推荐教程
- React官方教程
- React Router教程
- React Testing Library文档
- CSS Grid和Flexbox指南

---

遵循这个开发指南将帮助您高效地开发和维护这个项目。

