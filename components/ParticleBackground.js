import { useEffect } from 'react';

export default function ParticleBackground() {
  useEffect(() => {
    const existing = document.getElementById('kv-particle-canvas');
    if (existing) existing.remove();

    const canvas = document.createElement('canvas');
    canvas.id = 'kv-particle-canvas';
    canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;background:radial-gradient(circle at center,#061a06,#0f0f0f);pointer-events:none;';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    const N = 80;
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    function Particle() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    Particle.prototype.update = function () {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.size > 0.2) this.size -= 0.0005;
      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    };
    Particle.prototype.draw = function () {
      ctx.save();
      ctx.fillStyle = `rgba(212,175,55,${this.opacity})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(212,175,55,0.3)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    for (let i = 0; i < N; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      const c = document.getElementById('kv-particle-canvas');
      if (c) c.remove();
    };
  }, []);

  return null;
}
