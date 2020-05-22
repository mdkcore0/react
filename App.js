// based on https://reactjs.org/tutorial/tutorial.html
import React from 'react';
import {Button, View, Text, FlatList} from 'react-native';
//import './index.css';

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
    if (squares[a] && squares[a] === squares[b] &&
        squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

const Square = (props) => {
  return (
    <Button
        title={props.value.toString()}
        onPress={props.onPress}
    />
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let temp = this.props.squares[i];
    return (
      <Square
        value = {this.props.squares[i]}
        onPress={() => this.props.onPress(i)}
      />
    );
  }

  render() {
    return (
        <View>
            <View style={{flexDirection:'row'}}>
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
            </View>
            <View style={{flexDirection:'row'}}>
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
            </View>
            <View style={{flexDirection:'row'}}>
                {this.renderSquare(6)}
                {this.renderSquare(7)}
                {this.renderSquare(8)}
            </View>
        </View>
    );
  }
}

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(''),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handlePress(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
        history: history.concat([{
            squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move
        ? 'Go to move #' + move
        : 'Go to game start';

      return (
          {id: move, title: desc}
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
        <View style={{flexDirection: 'row'}}>
            <Board
                squares = {current.squares}
                onPress = {(i) => this.handlePress(i)}
            />
            <View>
                <Text>{status}</Text>
                <FlatList
                    data = {moves}
                    keyExtractor = {item => item.id.toString()}
                    renderItem = {({item}) =>
                        <View style={{flexDirection: 'row'}}>
                            <Text>{item.id + 1}.</Text>
                            <Button
                                title = {item.title.toString()}
                                onPress = {() => this.jumpTo(item.id)}
                            />
                        </View>
                    }
                />
            </View>
        </View>
    );
  }
}
