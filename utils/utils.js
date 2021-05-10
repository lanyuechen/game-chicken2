function handleTouchStart(e, cb, type) {
  if (e.targetTouches) {  // 兼容touch/mouse事件
    e.preventDefault();
    e = e.targetTouches[0];
  }
  const x = e.clientX;
  const y = e.clientY;
  const handleTouchMove = (e) => {
    if (e.targetTouches) {
      e.preventDefault();
      e = e.targetTouches[0];
    }
    const row = Math.sign(parseInt((e.clientY - y) / 5));
    const col = row ? 0 : Math.sign(parseInt((e.clientX - x) / 5));
    if (!row && !col) {
      return;
    }
    cb([row, col]);
    e.target.removeEventListener(`${type}move`, handleTouchMove);
  };
  e.target.addEventListener(`${type}move`, handleTouchMove);
}

function addSlideListener(dom, cb) {
  dom.addEventListener('touchstart', (e) => handleTouchStart(e, cb, 'touch'));
  dom.addEventListener('mousedown', (e) => handleTouchStart(e, cb, 'mouse'));
}

