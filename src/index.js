import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.handleClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    render() {
      return (
          <div className="board">
              {this.props.squares.map((item, index) =>
                  <Square key={index}
                    value={this.props.squares[index]}
                    handleClick={this.props.handleClick.bind(this, index)} />)}
        </div>
      );
    }
}

class Game extends React.Component {

    state = {
        history: [{ squares: Array(9).fill(null) }],
        stepNumber: 0,
        xIsNext: true,
        positions: [null],
    }

    handleClick = (i) => {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1]
        const squares = current.squares.map(sq => sq)
        if (squares[i] != null || calculateWinner(squares) != null) { return }
        squares[i] = this.state.xIsNext ? 'X' : 'O'

        const positions = this.state.positions

        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            positions: positions.concat(getCoordinates(i))
        })
    }

    goTo = (step) => {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2 === 0) ? true : false
        })
    }

    render() {
        console.log(this.state.history.map(his => his.squares))
        const history = this.state.history;
        const current = history[this.state.stepNumber]
        let winner = calculateWinner(current.squares)
        const positions = this.state.positions.slice(0, this.state.stepNumber + 1)

        const moves = history.map((step, move) => {
            const buttonText = move ?
                'Go to move number ' + move + ` in (${positions[move] ? positions[move] : ''})` :
                'Start the game';
            return (
                <li key={move}>
                    <button className={move === this.state.stepNumber ? 'active' : 'inactive'} onClick={() => this.goTo(move)}>{buttonText}</button>
                </li>
            )
        })

        let status;
        if (winner) { status = 'Winner: ' + winner }
        else { status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O') }

        return (
            <div className="game">
            <div className="game-board">
                <Board squares={current.squares} handleClick={this.handleClick}/>
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
            </div>
        );
    }
}

function getCoordinates(i) {
    let column;
    if (i % 3 === 0) { column = 1 } else if (i % 3 === 1) { column = 2 } else { column = 3 }
    let row;
    if (i < 3) { row = 1 } else if (i > 2 && i < 6) { row = 2 } else { row = 3 }
    return `${column}, ${row}`
}

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  // ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
