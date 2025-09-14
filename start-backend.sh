#!/bin/bash

# 寻找搭子后端API快速启动脚本

echo "🚀 启动寻找搭子后端API服务..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js，请先安装Node.js"
    echo "   下载地址: https://nodejs.org/"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到npm，请先安装npm"
    exit 1
fi

# 进入后端目录
cd backend-example

# 检查package.json是否存在
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 未找到package.json文件"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

# 检查是否安装成功
if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

# 启动服务
echo "🎯 启动API服务..."
echo "📍 服务地址: http://localhost:3001"
echo "🔗 健康检查: http://localhost:3001/api/health"
echo ""
echo "📝 测试账号:"
echo "   用户名: demo_user"
echo "   密码: password"
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

npm start
