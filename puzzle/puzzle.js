class PuzzleGame {
  constructor(selector, options = { row: 4, col: 3, size: 20, margin: 2, image: '' }) {
    this.options = options;
    this.container = document.querySelector(selector);
    const board = [];
    for (let i = 0; i < options.row; i++) {
      board[i] = [];
      for (let j = 0; j < options.col; j++) {
        board[i][j] = i * options.col + j + 1;
      }
    }
    board[options.row - 1][options.col - 1] = 0;

    this.puzzle = new Puzzle({
      board,
      row: options.row,
      col: options.col,
      size: options.size,
    });
  }

  render() {
    const dom = this.puzzle.render((role) => {
      const div = document.createElement('div');
      div.innerHTML = role;
      div.style.border = `${this.options.margin}px solid #fff`;
      div.style.boxSizing = 'border-box';
      div.style.height = '100%';
      div.style.background = 'lightgray';
      return div;
    });

    this.container.innerHTML = '';
    this.container.appendChild(dom);
  }
}