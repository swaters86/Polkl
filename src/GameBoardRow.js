import React from 'react';
import GameBoardRowTile  from './GameBoardRowTile.js';

class GameBoardRow extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="game-board-row">
                <GameBoardRowTile 
                    rowNumber={this.props.rowNumber} 
                    colNumber="1" 
                    currentRow={this.props.currentRow} 
                    currentCol={this.props.currentCol} 
                    pickedLetters={this.props.pickedLetters}
                    gameRowTiles={this.props.gameRowTiles}
                    currentLetter={this.props.currentLetter}
                />
                <GameBoardRowTile 
                    rowNumber={this.props.rowNumber} 
                    colNumber="2" 
                    currentRow={this.props.currentRow} 
                    currentCol={this.props.currentCol} 
                    pickedLetters={this.props.pickedLetters}
                    gameRowTiles={this.props.gameRowTiles}
                    currentLetter={this.props.currentLetter}
                />
                <GameBoardRowTile 
                    rowNumber={this.props.rowNumber} 
                    colNumber="3" 
                    currentRow={this.props.currentRow} 
                    currentCol={this.props.currentCol} 
                    pickedLetters={this.props.pickedLetters}
                    gameRowTiles={this.props.gameRowTiles}
                    currentLetter={this.props.currentLetter}
                />
                <GameBoardRowTile 
                    rowNumber={this.props.rowNumber} 
                    colNumber="4" 
                    currentRow={this.props.currentRow} 
                    currentCol={this.props.currentCol} 
                    pickedLetters={this.props.pickedLetters}
                    gameRowTiles={this.props.gameRowTiles}
                    currentLetter={this.props.currentLetter}
                />
            </div>
        )
    }
}

export default GameBoardRow;

