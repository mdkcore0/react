// port based on https://reactjs.org/tutorial/tutorial.html
import React from 'react';
import {Button, View, Text, FlatList, StyleSheet, TouchableOpacity} from
    'react-native';

const styles = StyleSheet.create({
    body: {
        fontFamily: '"Century Gothic", Futura, sans-serif',
        fontSize: 14,
        margin: 20,
        flexDirection: 'row'
    },
    item: {
        flexDirection: 'row',
        paddingLeft: 30,
        alignItems: 'baseline',
    },
    boardRow: {
        flexDirection: 'row',
    },
    status: {
        marginBottom: 10
    },
    square: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#999',
        borderStyle: 'solid',
        fontSize: 24,
        fontWeight: 'bold',
        lineHeight: 34,
        height: 34,
        marginRight: -1,
        marginTop: -1,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        textAlign: 'center',
        width: 34
    },
    gameInfo: {
        marginLeft: 20
    }
});

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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }

  return null;
}

const Square = (props) => {
  return (
    // Button can't be styled :/
    <TouchableOpacity onPress={props.onPress}>
        <Text style={styles.square}>
            {props.value}
        </Text>
    </TouchableOpacity>
  );
};

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value = {this.props.squares[i]}
        onPress = {() => this.props.onPress(i)}
      />
    );
  }

  render() {
    return (
        <View>
            <View style={styles.boardRow}>
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

    if (calculateWinner(squares) || squares[i])
      return;

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
      const desc = move ? 'Go to move #' + move : 'Go to game start';

      return (
          {id: move, title: desc}
      );
    });

    let status;
    if (winner)
      status = 'Winner: ' + winner;
    else
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
        <View style={styles.body}>
            <View>
                <Board
                    squares = {current.squares}
                    onPress = {(i) => this.handlePress(i)}
                />
            </View>
            <View style={styles.gameInfo}>
                <Text style={styles.status}>{status}</Text>
                <FlatList
                    data = {moves}
                    keyExtractor = {item => item.id.toString()}
                    renderItem = {({item}) =>
                        <View style={styles.item}>
                            <Text>{item.id + 1}. </Text>
                            <Button
                                // text will be uppercase on android, see
                                // Square to how to create a custom button
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
