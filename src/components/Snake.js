import React, { Component } from 'react';
import Score from './Score';
import Controls from './Controls';
import Utils from './Utils';
import R from 'ramda';

class Snake extends Component {
    constructor(props) {
        super(props);

        this.state = {
            board: '',
            gameStatus: false,
            snakeCoords: [
                [ Utils.random(0, this.props.boardSize) , Utils.random(0, this.props.boardSize) ]
            ],
            foodCoords: [],
            currentDirection: {
                x: 1,
                y: 0
            }
        };
    }

    resetGame() {
        this.setState({
            board: '',
            snakeLength: 1,
            gameStatus: false,
            snakeCoords: [
                [ Utils.random(0, this.props.boardSize) , Utils.random(0, this.props.boardSize) ]
            ],
            foodCoords: [],
            currentDirection: {
                x: 1,
                y: 0
            }
        });
    }

    pauseGame() {
        this.setState({ gameStatus: !this.state.gameStatus });
    }

    _decideDirection(code) {
        // Decide direction.
        switch (code) {
            case this.props.keys.left:
                // Going up or down
                if (this.state.currentDirection.x === 0){
                    this.setState({
                        currentDirection: {
                            x: -1,
                            y: 0
                        }
                    });
                }
                break;
            case this.props.keys.up:
                // Going left or right
                if (this.state.currentDirection.y === 0){
                    this.setState({
                        currentDirection: {
                            x: 0,
                            y: -1
                        }
                    });
                }
                break;
            case this.props.keys.right:
                // Going up or down
                if (this.state.currentDirection.x === 0){
                    this.setState({
                        currentDirection: {
                            x: 1,
                            y: 0
                        }
                    });
                }
                break;
            case this.props.keys.down:
                // Going left or right
                if (this.state.currentDirection.y === 0){
                    this.setState({
                        currentDirection: {
                            x: 0,
                            y: 1
                        }
                    });
                }
                break;
            default:
                return;
        }
    }

    _slither(grow = false) {
        let new_snake = this.state.snakeCoords;

        if (new_snake.length === 1) {
            const grow_index = grow ? 1 : 0;
            new_snake[grow_index] = [
                R.mathMod(R.add(new_snake[0][0], this.state.currentDirection.x), this.props.boardSize),
                R.mathMod(R.add(new_snake[0][1], this.state.currentDirection.y),  this.props.boardSize),
            ];
        }
        else {
            // Remove tail.
            if (grow === false) {
                new_snake.shift();
            }

            // Calculate new head.
            const head = new_snake[new_snake.length - 1];
            let new_head = [
                R.mathMod((head[0] + this.state.currentDirection.x), this.props.boardSize),
                R.mathMod((head[1] + this.state.currentDirection.y), this.props.boardSize),
            ];

            // Add new head.
            new_snake.push(new_head);
        }

        this.setState({
           snakeCoords: new_snake
        });

        // TODO: Set timeout to move again.
    }

    gameOver() {
        alert('Game over');
    }

    _checkCollision() {
        const collision = (R.uniq(this.state.snakeCoords).length !== this.state.snakeCoords.length);
        if (collision) {
            this.gameOver();
            this.resetGame();
        }
    }

    _drawSnake() {
        const s = this.state.snakeCoords.map((coord) => this._drawCell(coord, this.props.snakeColor));
        return s.join('');
    }

    _drawFood() {
        return this._drawCell(this.state.foodCoords, this.props.foodColor);
    }

    _drawCell(coord, color) {
        const wh = 100 / this.props.boardSize;
        let newCell =
            '<div style="width: ' + wh + '%; ' +
                'height: ' + wh + '%; ' +
                'background: ' + color + '; ' +
                'border: 1px solid #999;' +
                'position: absolute; ' +
                'top: ' + coord[1]*wh + '%; ' +
                'left: ' + coord[0]*wh + '%; ' +
            '"></div>';

        return newCell;
    }

    _putFood() {
        let food = null;
        let placed = false;
        let possibilities = R.range(0, this.props.boardSize * this.props.boardSize - 1);
        do {
            // Random index within the existing possibilities.
            const index = Utils.random(0, possibilities.length - 1);

            // Take the item out so that we don't choose it again in this try.
            food = possibilities.splice(index, 1);

            // Convert to coords on the board.
            food = [
                Math.floor(food / this.props.boardSize),
                food % this.props.boardSize
            ];

            // Is it part of the snake?
            if (R.findIndex(R.equals(food), this.state.snakeCoords) !== 1) {
                this.setState({ foodCoords: food });
                placed = true;
            }
        } while (!placed);
    }

    _gotFood() {
        // Is there any food on the board?
        if (this.state.foodCoords.length === 0) {
            this._putFood();
        }
        else {
            // Is the head where the food is?
            const head = this.state.snakeCoords[this.state.snakeCoords.length - 1];
            if (R.equals(head, this.state.foodCoords)) {
                // Put food in different position.
                this._putFood();

                // And grow.
                return true;
            }
        }

        // No food reached.
        return false;
    }

    moveSnake(e) {
        if (this.state.gameStatus) {
            // Game logic.
            this._decideDirection(e.keyCode);
            this._slither(this._gotFood());

            // Drawing logic.
            const foodMarkup = this._drawFood();
            const snakeMarkup = this._drawSnake();
            this.setState({ board: foodMarkup + snakeMarkup });

            // Logic: inform of collision after drawing the current state.
            this._checkCollision();
        }

        //console.log(this.state);
    }

    getMarkup() {
        return { __html: this.state.board };
    }

    render() {
        return (
            <div tabIndex={0} onKeyDown={this.moveSnake.bind(this)}>
                <Score length={this.state.snakeCoords.length} />
                <div className="Snake square" dangerouslySetInnerHTML={this.getMarkup()}>
                </div>
                <Controls
                    gamePaused={this.state.gameStatus}
                    newGame={this.resetGame.bind(this)}
                    pauseGame={this.pauseGame.bind(this)}
                />
            </div>
        );
    }
}

Snake.defaultProps = {
    snakeColor: 'yellowgreen',
    foodColor: 'red',
    boardSize: 20,
    keys: {
        left: 37,
        up: 38,
        right: 39,
        down: 40
    }
};

export default Snake;