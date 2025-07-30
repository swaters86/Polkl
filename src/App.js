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
    this.saveUserStats = this.saveUserStats.bind(this);
    this.fetchUserStats = this.fetchUserStats.bind(this);

    const words = [
      'meth', 'beer', 'sexy', 'shit'
    ];

    var getGamesArray = function(start, end) {
      i = 0;
      for(var arr=[], dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
        i++;  

        var games = {
          id: i, 
          date: new Date(dt).toLocaleDateString(),
          word: words[i-1]
        }

        arr.push(games);
      }

      return arr;
    };

    var gamesList = getGamesArray(
      new Date("07-26-2025"),
      new Date("07-29-2025")
    );

    let todayDate = new Date(Date.now()).toLocaleDateString(); 

    let currentGame = 0;
    let pickedWord = '';
    gamesList.map(function(game) {
      console.log(game);
      if (game.date === todayDate) {
        currentGame = game.id;
        pickedWord = game.word;
      }
    });

    this.saveUserStats(currentGame, true, ['push', 'dear', 'meth']);

    console.log('user stats is:', this.fetchUserStats());
    
    let usedWords = [];

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

    let guesses = 0;

    let guessedWords = [];

    let currentRow = 0;

    let currentCol = 0;

    this.state = {
      words: words,
      usedWords: usedWords,
      pickedWord: pickedWord,
      currentGame: currentGame,
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
      maxCols: maxCols,
      showModal: false,
      shareText: '',
    }
  }

  saveUserStats(gameId, won, guessedWords) {
    let stat = {
      gameId: gameId,
      won: won, 
      guessedWords: guessedWords
    }

    let userStats = this.fetchUserStats() != undefined ? this.fetchUserStats() : [];

    userStats.push(stat);

    localStorage.setItem('userStats', JSON.stringify(userStats));
  }

  fetchUserStats() {
    let userStats = JSON.parse(localStorage.getItem('userStats'));
    return userStats;
  }

  checkEntry() {
    let currentRow = this.state.currentRow;

    let tiles = document.querySelectorAll(
      `[data-current-row="${currentRow}"]`
    );

    let playerWord = this.state.gameRowTiles[currentRow].join('');
    let wordOfTheDay = this.state.pickedWord;
    let guessedWords = this.state.guessedWords;
    
    let guesses = this.state.guesses;

    // If guessed word = word of the day and meets character length
    if ( 
        (playerWord === wordOfTheDay) && 
        (playerWord.length === this.state.maxCols)
      ) {
      let newGuessedWords = [...guessedWords, playerWord];
      let newGuesses = guesses + 1;
      let cssClass = 'valid';

      tiles.forEach((tile, i) => {
        setTimeout(function() {
          tile.classList.add(cssClass)
        }, i * 650);
      });

      // Show modal after last tile flips
      setTimeout(() => {
        const shareText = this.generateShareText(newGuessedWords, wordOfTheDay, this.state.maxCols);
        this.saveUserStats(this.state.currentGame, true, newGuessedWords);
        this.setState({
          guessedWords: newGuessedWords,
          guesses: newGuesses,
          gameOver: true,
          showModal: true,
          shareText: shareText,
        });
      }, tiles.length * 650);

      return;
      
    // If guessed word != the word of the day but still meets character length (still valid guess)
    } else if (
      (playerWord !== wordOfTheDay) && 
      (playerWord.length === this.state.maxCols)
    ) {
      tiles.forEach((tile, i) => {
          let cssClass = '';

          let wordOfTheDayArray = wordOfTheDay.split('');
          let letterEntry = wordOfTheDayArray[Number(tile.dataset.currentCol) - 1];

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

    // guessed word doesn't meet character length (less than number of columns/tiles available)
    } else if (playerWord.length !== this.state.maxCols) {

    // TODO: verify if this should be tis.state.maxRows
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
      this.saveUserStats(this.state.currentGame, false, this.state.guessedWords);
    }

    
  }

  generateShareText(guessedWords, pickedWord, maxCols) {
    // Wordle-style coloring logic
    let grid = guessedWords.map(word => {
      let wordArr = pickedWord.split('');
      let guessArr = word.split('');
      let status = Array(maxCols).fill('⬛');
      let used = Array(maxCols).fill(false);

      // First pass: correct position
      for (let i = 0; i < maxCols; i++) {
        if (guessArr[i] === wordArr[i]) {
          status[i] = '🟩';
          used[i] = true;
        }
      }
      // Second pass: correct letter, wrong position
      for (let i = 0; i < maxCols; i++) {
        if (status[i] === '🟩') continue;
        for (let j = 0; j < maxCols; j++) {
          if (!used[j] && guessArr[i] === wordArr[j]) {
            status[i] = '🟨';
            used[j] = true;
            break;
          }
        }
      }
      return status.join('');
    }).join('\n');
    return `Polkl ${guessedWords.length}/${this.state.maxRows}\n${grid}\nPlay: ${window.location.href}`;
  }

  render() {
    return (
      <div className="container">
        <header className="site-header">
          <h1 className="site-name">Polkl</h1>
          <p>A wordle-like game about Polk County, FL - home to the finest of Floridians!</p>
          <div><div className="letter">Word of the Day: </div>{this.state.pickedWord}</div>
          <div>
            <div className="letter">Guesed word: </div>
            {
              this.state.currentRow < this.state.gameRowTiles.length &&
              this.state.gameRowTiles[this.state.currentRow]
                ? this.state.gameRowTiles[this.state.currentRow].join('')
                : ''
            }
          </div>
          <div><div className="letter">Current Game</div> {this.state.currentGame}</div>
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
        {this.state.showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Congratulations!</h2>
              <p>You guessed today's word!</p>
              <textarea
                readOnly
                value={this.state.shareText}
                style={{ width: '100%', height: '80px' }}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(this.state.shareText);
                  alert('Copied to clipboard!');
                }}
              >
                Copy Result
              </button>
              <a
                href={`sms:&body=${encodeURIComponent(this.state.shareText)}`}
                style={{ marginLeft: '10px' }}
              >
                Share via SMS
              </a>
              <button
                style={{ marginLeft: '10px' }}
                onClick={() => this.setState({ showModal: false })}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
