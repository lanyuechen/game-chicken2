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

const STAGES = [
  {
    name: '横道立马',
    board: [
      [8, 10, 10, 9],
      [8, 10, 10, 9],
      [6, 5,  5,  7],
      [6, 2,  3,  7],
      [1, 0,  0,  4],
    ],
  },
]

class HuaRongDao {
  constructor(selector, options = { size: 100, margin: 2 }) {
    this.options = options;
    this.container = document.querySelector(selector);
    this.puzzle = new Puzzle({
      board: STAGES[0].board,
      row: 5,
      col: 4,
      size: options.size,
    });
  }

  render() {
    const dom = this.puzzle.render((role) => {
      const div = document.createElement('div');
      div.innerHTML = ROLES[role].name;
      div.style.border = `${this.options.margin}px solid #fff`;
      div.style.boxSizing = 'border-box';
      div.style.height = '100%';
      div.style.background = ROLES[role].background;
      return div;
    });

    this.container.innerHTML = '';
    this.container.appendChild(dom);
  }
}