import './App.css';
import 'normalize.css';
import React from 'react';
import GameBoard from './GameBoard.js';
import KeyBoard from './KeyBoard.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleSelectedLetter = this.handleSelectedLetter.bind(this);
    this.checkEntry = this.checkEntry.bind(this);

    var getGamesArray = function(start, end) {
      i = 0;
      for(var arr=[], dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
        i++;  

        var games = {
          id: i, 
          date: new Date(dt)
        }

        arr.push(JSON.stringify(games));
      }

      return arr;
    };

    var gamesList = getGamesArray(
      new Date("2022-04-28"),
      new Date("2022-05-02")
    );

    alert('hello');

    //daylist.map((v) => console.log(v.toString()));
    
    gamesList.map(function(game){
      console.log(game);
    });
    
    let usedWords = [];

    const words = [
      'meth', 'beer', 'sexy', 'shit'
    ];

    let pickedWord = getRandomWord();

    const keys1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];

    const keys2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',];

    const keys3 = ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫'];

    let maxRows = 5;
    let maxCols = 4;
    let gameRows = [];
    let gameRowTiles = [];

    for (var i = 0; i < maxRows; i++) {
      gameRows.push(i);
      let row = [null, null, null, null];
      gameRowTiles.push(row);
    }

    function getRandomWord() {
      let word = words[Math.floor(Math.random() * words.length)];
      usedWords.push(word);

      return word;
    }

    let guesses = 0;

    let guessedWords = [];

    let currentRow = 0;

    let currentCol = 0;

    this.state = {
      words: words,
      usedWords: usedWords,
      pickedWord: pickedWord,
      keys1: keys1,
      keys2: keys2,
      keys3: keys3,
      gameRows: gameRows,
      guesses: guesses,
      guessedWords: guessedWords,
      currentRow: currentRow,
      currentCol: currentCol,
      gameRowTiles: gameRowTiles,
      maxRows: maxRows,
      maxCols: maxCols
    }
  }

  checkEntry() {
    let currentRow = this.state.currentRow;

    let tiles = document.querySelectorAll(
      `[data-current-row="${currentRow}"]`
    );

    let win = false;

    let playerWord = this.state.gameRowTiles[currentRow].join('');
    let wordOfTheDay = this.state.pickedWord;
    let guessedWords = this.state.guessedWords;
    
    let guesses = this.state.guesses;

    if (
        (playerWord === wordOfTheDay) && 
        (playerWord.length === this.state.maxCols)
      ) {
       
      let cssClass = 'valid';

      tiles.forEach((tile, i) => {
        setTimeout(function() {
          tile.classList.add(cssClass)
        }, i * 650);  
      });

      win = true;
      
    } else if (
      (playerWord !== wordOfTheDay) && 
      (playerWord.length === this.state.maxCols)
    ) {
      tiles.forEach((tile, i) => {
          let cssClass = '';

          let playerWordArray = playerWord.split('');
          let wordOfTheDayArray = wordOfTheDay.split('');
          let letterEntry = wordOfTheDayArray[Number(tile.dataset.currentCol) - 1];
          
          console.log(wordOfTheDayArray.includes(`${tile.dataset.currentLetter}`));

          if (letterEntry === tile.dataset.currentLetter) {
            cssClass = 'valid';
          } else if (letterEntry !== tile.dataset.currentLetter && !wordOfTheDayArray.includes(`${tile.dataset.currentLetter}`)) {
            cssClass = 'invalid';
          } else if (wordOfTheDayArray.includes(`${tile.dataset.currentLetter}`)) {
            cssClass = 'close';
          }

          setTimeout(function() {
            tile.classList.add(cssClass)
          }, i * 650);
      });


    } else if (playerWord.length !== this.state.maxCols) {
       
    } else if (guesses === this.state.maxCols) {
      
    }

    guessedWords.push(playerWord); 
      
    this.setState({
      guesses: guesses + 1, 
      currentRow: currentRow + 1, 
      currentCol: 0,
      guessedWords: guessedWords
    });

  } // checkEntry();

  handleSelectedLetter(selectedLetter) {
    let gameRowTiles = this.state.gameRowTiles;
    let nextCol = this.state.currentCol;
    let enterKey = this.state.keys3[0];
    let deleteKey = this.state.keys3[this.state.keys3.length - 1];
    let guesses = this.state.guesses;
    let maxRows = this.state.maxRows;

    
    if ((selectedLetter !== enterKey) && (selectedLetter !== deleteKey)) {
      if (nextCol <= (this.state.maxCols - 1)) {
        nextCol += 1;
        gameRowTiles[this.state.currentRow][nextCol] = selectedLetter;

        this.setState({
          gameRowTiles: gameRowTiles,
          currentCol: nextCol
        });
      } else {
        //
      }
    } else if ((selectedLetter === enterKey) && (guesses < maxRows)) {
      this.checkEntry();
      
    } else if ((selectedLetter === deleteKey) && (this.state.currentCol > 0)) {
      gameRowTiles[this.state.currentRow][nextCol] = '';
      
      this.setState({
        gameRowTiles: gameRowTiles, 
        currentCol: nextCol - 1
      });
    } else if (guesses === maxRows) {
      alert('Sorry, you did not get todays Polkl, please try again tomorrow');
      // display today's word here!
    }

    
  }

  render() {
    return (
      <div className="container">
        <header className="site-header">
          <h1 className="site-name">Polkl</h1>
          <p>A wordle-like game about Polk County, FL - home to the finest of Floridians!</p>
          <div><div className="letter">Word of the Day: </div>{this.state.pickedWord}</div>
          <div><div className="letter">Guesed word: </div>{this.state.gameRowTiles[this.state.currentRow].join('')}</div>
           
          <div><div className="letter">Guesses:</div> {this.state.guesses}</div>
          <div><div className="letter">guessed words: {this.state.guessedWords.join(',')}</div></div>
        </header>
        <GameBoard
          gameRows={this.state.gameRows}
          gameRowTiles={this.state.gameRowTiles}
        />
        <KeyBoard
          key1={this.state.keys1}
          key2={this.state.keys2}
          key3={this.state.keys3}
          onSelectedLetter={this.handleSelectedLetter}
        />

      </div>
    );
  }
}

export default App;
