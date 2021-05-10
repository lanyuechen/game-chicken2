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

class Puzzle {
  constructor({ board, row = 3, col = 3, size = 100 }) {
    this.board = board;
    this.row = row;
    this.col = col;
    this.size = size;

    this.container = document.createElement('div');
    this.container.style.cssText = `
      position: relative;
      width: ${size * col}px;
      height: ${size * row}px;
    `;
  }

  render(roleRender) {
    const roles = [];
    this.board.forEach(d => d.forEach(r => !roles.includes(r) && r !== 0 && roles.push(r)));
    for (let role of roles) {
      this.container.appendChild(this.createRole(role, roleRender));
    }

    return this.container;
  }

  createRole(role, roleRender) {
    const points = this.getRolePoints(role);
    const div = document.createElement('div');
    const s = points[0];
    const e = points[points.length - 1];
    const rect = {
      left: s[1] * this.size,
      top: s[0] * this.size,
      width: (e[1] - s[1] + 1) * this.size,
      height: (e[0] - s[0] + 1) * this.size,
    };
    div.setAttribute('data-role', role);
    div.style.cssText = `
      position: absolute;
      left: ${rect.left}px;
      top: ${rect.top}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      transition: top .3s, left .3s;
      user-select: none;
    `;
    div.appendChild(roleRender(role, rect));

    addSlideListener(div, ([row, col]) => {
      this.move(role, [row, col]);
      this.update(role);
    });
    return div;
  }

  update(role) {
    const points = this.getRolePoints(role);
    const s = points[0];
    const roleEle = this.container.querySelector(`[data-role="${role}"]`);
    roleEle.style.left = `${s[1] * this.size}px`;
    roleEle.style.top = `${s[0] * this.size}px`;
  }

  move(role, [row, col]) {
    const sourcePoints = this.getRolePoints(role);
    const targetPoints = sourcePoints.map(p => [p[0] + row, p[1] + col]);

    if (targetPoints.find(p => !this.board[p[0]] || typeof this.board[p[0]][p[1]] === 'undefined' || (this.board[p[0]][p[1]] && this.board[p[0]][p[1]] !== role))) {
      return;
    }

    sourcePoints.forEach(p => this.board[p[0]][p[1]] = 0);
    targetPoints.forEach(p => this.board[p[0]][p[1]] = role);
  }

  getRolePoints(role) {
    const sourcePoints = [];
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === role) {
          sourcePoints.push([i, j]);
        }
      }
    }
    return sourcePoints;
  }
}