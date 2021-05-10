class PuzzleGame {
  constructor(selector, options = {}) {
    this.options = {
      row: 3, col: 3, size: 50, margin: 1, image: '',
      ...options,
    };
    this.container = document.querySelector(selector);
    const board = [];
    for (let i = 0; i < this.options.row; i++) {
      board[i] = [];
      for (let j = 0; j < this.options.col; j++) {
        board[i][j] = i * this.options.col + j + 1;
      }
    }
    board[this.options.row - 1][this.options.col - 1] = 0;

    this.puzzle = new Puzzle({
      board,
      row: this.options.row,
      col: this.options.col,
      size: this.options.size,
    });
  }

  render() {
    const { row, col, size } = this.options;
    const dom = this.puzzle.render((role, rect) => {
      const div = document.createElement('div');
      div.innerHTML = role;
      div.style.cssText = `
        border: ${this.options.margin}px solid #fff;
        box-sizing: border-box;
        height: 100%;
        background: url(${this.options.image});
        background-size: ${col * size}px ${row * size}px;
        background-position: ${-rect.left}px ${-rect.top}px;
      `
      return div;
    });

    this.container.innerHTML = '';
    this.container.appendChild(dom);
  }
}