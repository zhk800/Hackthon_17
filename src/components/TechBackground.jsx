import React, { useEffect, useRef, useState } from 'react';
import './TechBackground.css';

const TechBackground = () => {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: null, y: null });
  const [mouseMoving, setMouseMoving] = useState(false); // 追踪鼠标是否移动

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let lastMouseMoveTime = 0;

    // 设置画布大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 鼠标移动监听
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setMouseMoving(true);
      lastMouseMoveTime = Date.now();
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 定期检查鼠标是否停止移动
    const checkMouseStationary = () => {
      const now = Date.now();
      if (now - lastMouseMoveTime > 500) { // 500ms内未移动则视为静止
        setMouseMoving(false);
      }
      setTimeout(checkMouseStationary, 100);
    };

    checkMouseStationary();

    // 粒子系统
    const particles = [];
    const particleCount = 150;
    const jtuColors = ['#0054A6', '#F5A300', '#00A651', '#5b73ff'];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.size = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.pulse = Math.random() * Math.PI * 2;
        this.color = jtuColors[Math.floor(Math.random() * jtuColors.length)];
        // 上海交通大学特色粒子概率
        this.isJTU = Math.random() > 0.7; // 30%概率是特色粒子
        // 特殊类型粒子
        this.isTextParticle = Math.random() > 0.85; // 15%概率是文字粒子
        this.textChar = this.isTextParticle ? 'SJTU'[Math.floor(Math.random() * 4)] : '';
      }

      update() {
        // 鼠标引力效果
        if (mousePos.x !== null && Math.random() > 0.98) {
          const dx = mousePos.x - this.x;
          const dy = mousePos.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 200) {
            this.vx += (dx / distance) * 0.5;
            this.vy += (dy / distance) * 0.5;
          }
        }

        // 鼠标移动时粒子减速
        if (mouseMoving) {
          this.vx *= 0.95; // 减速因子
          this.vy *= 0.95;
        } else {
          // 鼠标静止时恢复正常速度范围
          const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          if (currentSpeed < 0.3) {
            // 添加小的随机速度
            this.vx += (Math.random() - 0.5) * 0.05;
            this.vy += (Math.random() - 0.5) * 0.05;
          }
        }

        this.x += this.vx;
        this.y += this.vy;
        this.pulse += 0.02;

        // 边界检测
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // 保持粒子在画布内
        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));

        // 速度限制
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 2) {
          this.vx = (this.vx / speed) * 2;
          this.vy = (this.vy / speed) * 2;
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity + Math.sin(this.pulse) * 0.2;
        
        if (this.isTextParticle) {
          // 绘制文字粒子（SJTU字母）
          ctx.fillStyle = this.color === '#F5A300' ? '#F5A300' : '#0054A6';
          ctx.font = `${this.size * 2 + 6}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(this.textChar, this.x, this.y);
        } else if (this.isJTU) {
          // 绘制交大特色形状（简化的三角形或星形）
          ctx.fillStyle = this.color === '#F5A300' ? '#F5A300' : '#0054A6';
          ctx.beginPath();
          const points = 5;
          for (let i = 0; i < points * 2; i++) {
            const angle = (i * Math.PI) / points - Math.PI / 2;
            const radius = this.size * (i % 2 === 0 ? 1 : 0.5);
            const x = this.x + Math.cos(angle) * radius;
            const y = this.y + Math.sin(angle) * radius;
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.closePath();
          ctx.fill();
        } else {
          // 绘制普通圆形粒子
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }
    }

    // 连接线系统
    class Connection {
      constructor(particle1, particle2) {
        this.p1 = particle1;
        this.p2 = particle2;
        this.distance = Math.sqrt(
          Math.pow(this.p1.x - this.p2.x, 2) + Math.pow(this.p1.y - this.p2.y, 2)
        );
      }

      draw() {
        if (this.distance < 150) {
          // 为特色粒子连接使用不同颜色
          const isJTUConnection = this.p1.isJTU || this.p2.isJTU;
          const color = isJTUConnection ? '#F5A300' : '#0054A6';
          
          ctx.save();
          ctx.globalAlpha = (150 - this.distance) / 150 * 0.25;
          ctx.strokeStyle = color;
          ctx.lineWidth = isJTUConnection ? 1.5 : 1;
          ctx.beginPath();
          ctx.moveTo(this.p1.x, this.p1.y);
          ctx.lineTo(this.p2.x, this.p2.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // 初始化粒子
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // 绘制交大标志性图形和文字
    const drawJtuLogo = () => {
      ctx.save();
      ctx.globalAlpha = 0.05;
      
      // 大圆形轮廓
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.25;
      
      // 绘制简化的交大校徽形状
      ctx.strokeStyle = '#F5A300';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // 绘制内部十字线
      ctx.beginPath();
      ctx.moveTo(centerX - radius * 0.7, centerY);
      ctx.lineTo(centerX + radius * 0.7, centerY);
      ctx.moveTo(centerX, centerY - radius * 0.7);
      ctx.lineTo(centerX, centerY + radius * 0.7);
      ctx.stroke();
      
      // 绘制四个方向的装饰线条
      const decorations = 4;
      for (let i = 0; i < decorations; i++) {
        const angle = (i * Math.PI) / 2;
        const x1 = centerX + Math.cos(angle) * radius * 0.8;
        const y1 = centerY + Math.sin(angle) * radius * 0.8;
        const x2 = centerX + Math.cos(angle) * radius;
        const y2 = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      
      ctx.restore();
      
      // 绘制上海交通大学文字和缩写
      ctx.save();
      ctx.globalAlpha = 0.03;
      
      // 绘制SJTU缩写
      ctx.fillStyle = '#0054A6';
      ctx.font = `${radius * 0.8}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SJTU', centerX, centerY);
      
      // 绘制上海交通大学文字（上方）
      ctx.fillStyle = '#F5A300';
      ctx.font = `${radius * 0.2}px Arial`;
      ctx.fillText('上海交通大学', centerX, centerY - radius * 0.6);
      
      // 绘制英文名称（下方）
      ctx.fillStyle = '#0054A6';
      ctx.font = `${radius * 0.15}px Arial`;
      ctx.fillText('SHANGHAI JIAO TONG UNIVERSITY', centerX, centerY + radius * 0.6);
      
      ctx.restore();
    };

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制背景标志
      drawJtuLogo();

      // 绘制粒子
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // 绘制连接线
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const connection = new Connection(particles[i], particles[j]);
          connection.draw();
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
        window.removeEventListener('resize', resizeCanvas);
        window.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationId);
      };
  }, [mousePos, mouseMoving]);

  return (
    <div className="tech-background">
      <canvas ref={canvasRef} className="tech-canvas" />
      <div className="tech-overlay" />
      {/* 交大特色装饰元素 */}
      <div className="jtu-emblem-left" />
      <div className="jtu-emblem-right" />
      {/* 上海交通大学文字元素 */}
      <div className="jtu-text-sjtu">SJTU</div>
      <div className="jtu-text-full">上海交通大学</div>
      <div className="jtu-text-en">SHANGHAI JIAO TONG UNIVERSITY</div>
    </div>
  );
};

export default TechBackground;

