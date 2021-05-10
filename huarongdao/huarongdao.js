const ROLES = [
  {name: '空白', role: 0},
  {name: '士兵', role: 1, background: 'lightgray'},
  {name: '士兵', role: 2, background: 'lightgray'},
  {name: '士兵', role: 3, background: 'lightgray'},
  {name: '士兵', role: 4, background: 'lightgray'},
  {name: '关羽', role: 5, background: 'lightblue'},
  {name: '赵云', role: 6, background: 'lightcyan'},
  {name: '马超', role: 7, background: 'lightgreen'},
  {name: '张飞', role: 8, background: 'lightpink'},
  {name: '黄忠', role: 9, background: 'lightsalmon'},
  {name: '曹操', role: 10, background: 'lightyellow'},
];

class HuaRongDao {
  constructor(selector, options = { size: 100, margin: 2 }) {
    this.options = options;
    this.container = document.querySelector(selector);
    this.board = [
      [8, 10, 10, 9],
      [8, 10, 10, 9],
      [6, 5,  5,  7],
      [6, 2,  3,  7],
      [1, 0,  0,  4],
    ];
  }

  move(role, [row, col]) {
    const sourcePoints = this.getRolePoints(role);
    const targetPoints = sourcePoints.map(p => [p[0] + row, p[1] + col]);

    if (targetPoints.find(p => !this.board[p[0]] || typeof this.board[p[0]][p[1]] === 'undefined' || (this.board[p[0]][p[1]] && this.board[p[0]][p[1]] !== role))) {
      return;
    }

    sourcePoints.forEach(p => this.board[p[0]][p[1]] = 0);
    targetPoints.forEach(p => this.board[p[0]][p[1]] = role);

    return targetPoints.length === 4 && targetPoints[0][0] === 3 && targetPoints[0][1] === 1; // 逃脱成功
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

  handleTouchStart(e, role, type) {
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
      if (this.move(role, [row, col])) {
        console.log('>>>', '逃脱成功');
        alert('逃脱成功');
        window.location.reload();
      }
      this.update(role);
      e.target.removeEventListener(`${type}move`, handleTouchMove);
    };
    e.target.addEventListener(`${type}move`, handleTouchMove);
  }

  createRole(role) {
    const points = this.getRolePoints(role.role);
    const div = document.createElement('div');
    const s = points[0];
    const e = points[points.length - 1];
    div.setAttribute('data-role', role.role);
    div.style.cssText = `
      background: ${role.background};
      position: absolute;
      left: ${s[1] * this.options.size}px;
      top: ${s[0] * this.options.size}px;
      width: ${(e[1] - s[1] + 1) * this.options.size}px;
      height: ${(e[0] - s[0] + 1) * this.options.size}px;
      transition: top .3s, left .3s;
      border: ${this.options.margin}px solid #fff;
      box-sizing: border-box;
      user-select: none;
      text-align: center;
    `;
    div.addEventListener('touchstart', (e) => this.handleTouchStart(e, role.role, 'touch'));
    div.addEventListener('mousedown', (e) => this.handleTouchStart(e, role.role, 'mouse'));
    div.innerHTML = role.name;
    return div;
  }

  render() {
    const div = document.createElement('div');
    div.style.cssText = `
      position: relative;
      width: ${this.options.size * 4}px;
      height: ${this.options.size * 5}px;
    `;

    for (let i = 1; i < ROLES.length; i++) {
      const roleEle = this.createRole(ROLES[i]);
      div.appendChild(roleEle);
    }

    this.container.innerHTML = '';
    this.container.appendChild(div);
  }

  update(role) {
    const points = this.getRolePoints(role);
    const s = points[0];
    const roleEle = document.querySelector(`[data-role="${role}"]`);
    roleEle.style.left = `${s[1] * this.options.size}px`;
    roleEle.style.top = `${s[0] * this.options.size}px`;
  }
}