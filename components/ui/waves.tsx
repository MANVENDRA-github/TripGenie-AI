"use client";

import React, { useEffect, useRef } from "react";

type WavesProps = {
  lineColor?: string;
  backgroundColor?: string;
  waveSpeedX?: number;
  waveSpeedY?: number;
  waveAmpX?: number;
  waveAmpY?: number;
  friction?: number;
  tension?: number;
  maxCursorMove?: number;
  xGap?: number;
  yGap?: number;
};

export default function Waves({
  lineColor = "#2563EB",
  backgroundColor = "transparent",
  waveSpeedX = 0.02,
  waveSpeedY = 0.01,
  waveAmpX = 40,
  waveAmpY = 20,
  friction = 0.9,
  tension = 0.01,
  maxCursorMove = 120,
  xGap = 12,
  yGap = 36,
}: WavesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;
    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      targetMouseX = -1000;
      targetMouseY = -1000;
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      mouseX += (targetMouseX - mouseX) * tension;
      mouseY += (targetMouseY - mouseY) * tension;

      ctx.clearRect(0, 0, w, h);

      if (backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.15;

      const cols = Math.ceil(w / xGap) + 1;
      const rows = Math.ceil(h / yGap) + 1;

      for (let j = 0; j < rows; j++) {
        ctx.beginPath();
        for (let i = 0; i < cols; i++) {
          const x = i * xGap;
          const baseY = j * yGap;

          const waveX = Math.sin(x * 0.01 + time * waveSpeedX + j * 0.3) * waveAmpX;
          const waveY = Math.cos(x * 0.008 + time * waveSpeedY + j * 0.5) * waveAmpY;

          // Cursor interaction
          const dx = x - mouseX;
          const dy = baseY + waveY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let cursorEffect = 0;
          if (dist < maxCursorMove) {
            cursorEffect = (1 - dist / maxCursorMove) * 15;
          }

          const y = baseY + waveY + cursorEffect * Math.sign(dy || 1);

          if (i === 0) {
            ctx.moveTo(x + waveX, y);
          } else {
            ctx.lineTo(x + waveX, y);
          }
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      time += 1;
      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [lineColor, backgroundColor, waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, friction, tension, maxCursorMove, xGap, yGap]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
      }}
    />
  );
}
