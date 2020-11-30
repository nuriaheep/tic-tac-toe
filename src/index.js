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

    renderSquare(i) {
        return <Square value={this.props.squares[i]} handleClick={this.props.handleClick.bind(this, i)}/>;
    }

    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
}

class Game extends React.Component {

    state = {
        history: [{ squares: Array(9).fill(null) }],
        stepNumber: 0,
        xIsNext: true,
    }

    handleClick = (i) => {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1]
        const squares = current.squares.map(sq => sq)
        if (squares[i] != null || calculateWinner(squares) != null) { return }
        squares[i] = this.state.xIsNext ? 'X' : 'O'

        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
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

        const moves = history.map((step, move) => {
            const buttonText = move ?
                'Go to move number ' + move :
                'Start the game';
            return (
                <li key={move}>
                    <button onClick={() => this.goTo(move)}>{buttonText}</button>
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
