import React, { Component } from 'react';
import Score from './Score';
import Controls from './Controls';
import Utils from './Utils';
import R from 'ramda';

class Snake extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gameStatus: false,
            snakeCoords: [
                [ Utils.random(0, this.props.xSize) , Utils.random(0, this.props.ySize) ]
            ],
            foodCoords: [],
            currentDirection: {
                x: 1,
                y: 0
            }
        };

        console.log(this.state);
    }

    resetGame() {
        this.setState({
            snakeLength: 1,
            gameStatus: false,
            snakeCoords: [
                [ Utils.random(0, this.props.xSize) , Utils.random(0, this.props.ySize) ]
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
                (new_snake[0][0] + this.state.currentDirection.x) % this.props.xSize,
                (new_snake[0][1] + this.state.currentDirection.y) % this.props.ySize,
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
                (head[0] + this.state.currentDirection.x) % this.props.xSize,
                (head[1] + this.state.currentDirection.y) % this.props.ySize,
            ];

            // Add new head.
            new_snake.push(new_head);
        }

        this.setState({
           snakeCoords: new_snake
        });


        // Set timeout to move again.
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
        this.state.snakeCoords.map((coord) => this._drawCell(coord, this.props.snakeColor));
    }

    _drawFood() {
        this._drawCell(this.state.foodCoords, this.props.foodColor);
    }

    _drawCell(coord, color) {
        console.log(coord);
        console.log(color);
    }

    _putFood() {
        let food = null;
        let placed = false;
        let possibilities = R.range(0, this.props.xSize * this.props.xSize - 1);
        do {
            // Random index within the existing possibilities.
            const index = Utils.random(0, possibilities.length - 1);

            // Take the item out so that we don't choose it again in this try.
            food = possibilities.splice(index, 1);

            // Convert to coords on the board.
            food = [
                Math.floor(food / this.props.xSize),
                food % this.props.xSize
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
            if (head === this.state.foodCoords) {
                // Put food in different position.
                this._putFood();

                // And grow.
                return true;
            }
        }

        // No food reached.
        return false;
    }

    _cleanBoard() {
        console.log('Clean board');
    }

    moveSnake(e) {
        if (this.state.gameStatus) {
            // Game logic.
            this._decideDirection(e.keyCode);
            this._slither(this._gotFood());

            // Drawing logic.
            this._cleanBoard();
            this._drawFood();
            this._drawSnake();

            // Logic: inform of collision after drawing the current state.
            this._checkCollision();
        }
    }

    render() {
        return (
            <div tabIndex={0} onKeyDown={this.moveSnake.bind(this)}>
                <Score length={this.state.snakeCoords.length} />
                <div className="Snake square">

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
    xSize: 20,
    ySize: 20,
    keys: {
        left: 37,
        up: 38,
        right: 39,
        down: 40
    }
};

export default Snake;