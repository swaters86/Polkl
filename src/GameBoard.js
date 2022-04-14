import React from 'react';


class GameBoard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="game-board">
                {this.props.gameRows.map(i => {
                    return (
                        <div className="game-board-row" key={i}>

                            <div className="game-row-tile"
                                data-current-row={i}
                                data-current-col={1}
                                data-current-letter={this.props.gameRowTiles[i][1]}>
                                <div className="game-row-tile-inner">
                                    <div className="front">
                                        <div className="letter">{this.props.gameRowTiles[i][1]}</div>
                                    </div>
                                    <div className="back">
                                        <div className="letter">{this.props.gameRowTiles[i][1]}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="game-row-tile"
                                data-current-row={i}
                                data-current-col={2}
                                data-current-letter={this.props.gameRowTiles[i][2]}>
                                <div className="game-row-tile-inner">
                                    <div className="front">
                                        <div className="letter">{this.props.gameRowTiles[i][2]}</div>
                                    </div>
                                    <div className="back">
                                        <div className="letter">{this.props.gameRowTiles[i][2]}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="game-row-tile"
                                data-current-row={i}
                                data-current-col={3}
                                data-current-letter={this.props.gameRowTiles[i][3]}>
                                <div className="game-row-tile-inner">
                                    <div className="front">
                                        <div className="letter">{this.props.gameRowTiles[i][3]}</div>
                                    </div>
                                    <div className="back">
                                        <div className="letter">{this.props.gameRowTiles[i][3]}</div>
                                    </div>
                                </div>
                            </div>


                            <div className="game-row-tile"
                                data-current-row={i}
                                data-current-col={4}
                                data-current-letter={this.props.gameRowTiles[i][4]}>
                                <div className="game-row-tile-inner">
                                    <div className="front">
                                        <div className="letter">{this.props.gameRowTiles[i][4]}</div>
                                    </div>
                                    <div className="back">
                                        <div className="letter">{this.props.gameRowTiles[i][4]}</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        
                    )
                })}
            </div>
        );
    }
}

export default GameBoard;