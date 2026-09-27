import { useEffect } from 'react';

export default function RippleEffect() {
  useEffect(() => {
    const handlePointerDown = (e) => {
      const button = e.target.closest('button');
      if (!button || button.disabled) return;

      const rect = button.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      const corners = [
        [0, 0],
        [rect.width, 0],
        [0, rect.height],
        [rect.width, rect.height]
      ];
      const radius = Math.max(...corners.map(([cx, cy]) => Math.hypot(cx - offsetX, cy - offsetY)));

      const style = getComputedStyle(button);
      if (style.position === 'static') button.style.position = 'relative';
      if (style.overflow === 'visible') button.style.overflow = 'hidden';

      const span = document.createElement('span');
      span.className = 'ripple-span';
      span.style.width = `${radius * 2}px`;
      span.style.height = `${radius * 2}px`;
      span.style.left = `${offsetX - radius}px`;
      span.style.top = `${offsetY - radius}px`;
      button.appendChild(span);
      span.addEventListener('animationend', () => span.remove());
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  return null;
}
