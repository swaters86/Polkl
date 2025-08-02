import './App.css';
import 'normalize.css';
import React from 'react';
import GameBoard from './GameBoard.js';
import KeyBoard from './KeyBoard.js';

class App extends React.Component {
  // Helper to get today's key
  getTodayKey() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString().split('T')[0];
  }

  // Helper to get/set attempts for today
  getAttemptsForToday() {
    const todayKey = this.getTodayKey();
    const attempts = JSON.parse(localStorage.getItem('dailyAttempts') || '{}');
    return attempts[todayKey] || 0;
  }

  incrementAttemptsForToday() {
    const todayKey = this.getTodayKey();
    let attempts = JSON.parse(localStorage.getItem('dailyAttempts') || '{}');
    attempts[todayKey] = (attempts[todayKey] || 0) + 1;
    localStorage.setItem('dailyAttempts', JSON.stringify(attempts));
    return attempts[todayKey];
  }

  resetAttemptsForToday() {
    const todayKey = this.getTodayKey();
    let attempts = JSON.parse(localStorage.getItem('dailyAttempts') || '{}');
    attempts[todayKey] = 0;
    localStorage.setItem('dailyAttempts', JSON.stringify(attempts));
  }
  constructor(props) {
    super(props);
    this.handleSelectedLetter = this.handleSelectedLetter.bind(this);
    this.checkEntry = this.checkEntry.bind(this);
    this.saveUserStats = this.saveUserStats.bind(this);
    this.fetchUserStats = this.fetchUserStats.bind(this);

    this.state = { 
      showModal: false, 
      showResultsButton: false ,
      userStats:    this.fetchUserStats() || [],
      showHistory:  false,
      showTriesModal: false,
      triesMessage: '',
      triesLeft: 3 - this.getAttemptsForToday(),
    };

    // either bind…
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);

    this.handleShowHistory = this.handleShowHistory.bind(this);
    this.handleHideHistory = this.handleHideHistory.bind(this);
  
    // Static start date for the game series
    const staticStartDate = '2025-08-02'; // MM-DD-YYYY (8/2/25)
    const words = ['loud', 'coke', 'test', 'deer'];

    // Generate a static mapping of dates to words based on the static start date and word list
    function getGamesListFromWords(startDate, wordsArr) {
      const games = [];
      const current = new Date(startDate);
      current.setHours(0, 0, 0, 0);
      for (let i = 0; i < wordsArr.length; i++) {
        games.push({
          id: i + 1,
          date: current.toISOString().split('T')[0],
          word: wordsArr[i]
        });
        current.setDate(current.getDate() + 1);
      }
      return games;
    }

    // This array will always be the same for a given word list and start date
    const gamesList = getGamesListFromWords(staticStartDate, words);

    // get today in ISO format
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = today.toISOString().split('T')[0];

    let currentGame = 0;
    let pickedWord = '';

    const todayGame = gamesList.find(g => g.date === todayKey);

    if (todayGame) {
      currentGame = todayGame.id;
      pickedWord   = todayGame.word;
    } else if (gamesList.length) {
      // fallback to the first entry
      currentGame = gamesList[0].id;
      pickedWord  = gamesList[0].word;
    }

    // now `currentGame` and `pickedWord` are always defined
    console.log({ currentGame, pickedWord });
    
    //console.log('user stats is:', this.fetchUserStats());
    
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

    /*
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
      showResultsButton: false,
      shareText: '',
    }
      */
    Object.assign(this.state, {
        words:           words,
        usedWords:       usedWords,
        pickedWord:      pickedWord,
        currentGame:     currentGame,
        keys1:           keys1,
        keys2:           keys2,
        keys3:           keys3,
        gameRows:        gameRows,
        guesses:         guesses,
        guessedWords:    guessedWords,
        currentRow:      currentRow,
        currentCol:      currentCol,
        gameRowTiles:    gameRowTiles,
        maxRows:         maxRows,
        maxCols:         maxCols,
        showModal:       false,
        showResultsButton: false,
        shareText:       '',
        // <— note: we no longer clobber userStats or showHistory
      });
  }

  /*
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
    */

  saveUserStats(gameId, won, guessedWords) {
    const stat = {
      gameId,
      won,
      guessedWords,
      word: this.state.pickedWord    // <— save it too!
    };

    const userStats = this.fetchUserStats() || [];
    userStats.push(stat);
    localStorage.setItem('userStats', JSON.stringify(userStats));

    // also mirror into React state
    this.setState({ userStats });
  }

  fetchUserStats() {
    let userStats = JSON.parse(localStorage.getItem('userStats'));
    return userStats;
  }

  checkEntry() {
    // Check if user has maxed out tries for today
    if (this.getAttemptsForToday() >= 3) {
      this.setState({
        showTriesModal: true,
        triesMessage: 'Sorry, you have reached the maximum of 3 tries for today. Please try again tomorrow.'
      });
      return;
    }
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

      // Increment attempts for today
      const tries = this.incrementAttemptsForToday();
      this.setState({ triesLeft: 3 - tries });

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
          showResultsButton: true,
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
      // do nothing, incomplete word
      return;
    }

    guessedWords.push(playerWord);

    // If this was the last guess (loss), record the loss and show modal after tile animation
    if (guesses + 1 === this.state.maxRows && playerWord !== wordOfTheDay) {
      // Increment attempts for today
      const tries = this.incrementAttemptsForToday();
      this.setState({ triesLeft: 3 - tries });
      this.saveUserStats(this.state.currentGame, false, guessedWords);
      setTimeout(() => {
        this.setState({
          guesses: guesses + 1,
          currentRow: currentRow + 1,
          currentCol: 0,
          guessedWords: guessedWords,
          gameOver: true,
          showModal: true,
          showResultsButton: true,
          shareText: this.generateShareText(guessedWords, wordOfTheDay, this.state.maxCols),
        });
      }, tiles.length * 650);
      return;
    }

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

  handleShowModal() {
    this.setState({ showModal: true });
  }

  handleHideModal() {
    this.setState({ showModal: false });
  }

  handleShowHistory() {
    this.setState({ showHistory: true });
  }
  handleHideHistory() {
    this.setState({ showHistory: false });
  }

  render() {
        {/* TRIES MODAL */}
        {this.state.showTriesModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Limit Reached</h2>
              <p>{this.state.triesMessage}</p>
              <button onClick={() => this.setState({ showTriesModal: false })}>Close</button>
            </div>
          </div>
        )}
    return (
      <div className="container">
        <header className="site-header">
          <h1 className="site-name">Polkl</h1>
          <p>A wordle-like game about Polk County, FL - home to the finest of Floridians!</p>

          {this.state.showResultsButton && !this.state.showModal && (
            <button onClick={this.handleShowModal}>
              Results
            </button>
          )}


          {/* only once any results exist, and when no other modal is open */}
          {this.state.userStats.length > 0 &&
            !this.state.showModal &&
            !this.state.showHistory && (
              <>
                <button onClick={this.handleShowHistory}>
                  View History
                </button>
                {/* Show Retry button only if last game was a loss, the board is not currently being played, and tries remain */}
                {(() => {
                  const gw = this.state.guessedWords;
                  const lastGuess = gw[gw.length - 1];
                  const isLoss =
                    gw.length === this.state.maxRows &&
                    lastGuess !== this.state.pickedWord;
                  if (isLoss && this.state.triesLeft > 0) {
                    return (
                      <button
                        style={{ marginLeft: '10px', background: '#4caf50', color: 'white' }}
                        onClick={() => {
                          // Remove tile coloring classes from all tiles
                          const classesToRemove = ['valid', 'invalid', 'close'];
                          const tiles = document.querySelectorAll('[data-current-row]');
                          tiles.forEach(tile => {
                            classesToRemove.forEach(cls => tile.classList.remove(cls));
                          });
                          // Reset the gameboard for retry
                          let resetTiles = [];
                          for (let i = 0; i < this.state.maxRows; i++) {
                            resetTiles.push([null, null, null, null]);
                          }
                          this.setState({
                            showModal: false,
                            guesses: 0,
                            guessedWords: [],
                            currentRow: 0,
                            currentCol: 0,
                            gameRowTiles: resetTiles,
                            gameOver: false,
                            shareText: '',
                          });
                        }}
                      >
                        Retry ({this.state.triesLeft} left today)
                      </button>
                    );
                  }
                  return null;
                })()}
              </>
            )}

          {/*
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
          <div><div className="letter">Guessed Words: {this.state.guessedWords.join(',')}</div></div>
          */}
        </header>

        {this.state.triesLeft === 0 ? (
          <div style={{textAlign: 'center', margin: '2em', fontSize: '1.3em', color: '#b71c1c'}}>
            <strong>You maxed out your number of tries. Please try again tomorrow.</strong>
          </div>
        ) : this.state.guessedWords[this.state.guessedWords.length - 1] === this.state.pickedWord ? (
          <div style={{textAlign: 'center', margin: '2em', fontSize: '1.3em', color: '#388e3c'}}>
            <strong>Congratulations! You solved today's word. Please come back tomorrow for a new game.</strong>
          </div>
        ) : (
          <>
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
          </>
        )}

        {/* RESULTS MODAL */}
        {this.state.showModal && (
          <div className="modal-overlay">
            <div className="modal">
              {this.state.guessedWords[this.state.guessedWords.length - 1] === this.state.pickedWord ? (
                <>
                  <h2>Congratulations!</h2>
                  <p>You guessed today's word!</p>
                </>
              ) : (
                <>
                  <h2>Sorry!</h2>
                  <p>Sorry you didn't guess today's word, but you can try again.</p>
                </>
              )}
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
              {this.state.guessedWords[this.state.guessedWords.length - 1] !== this.state.pickedWord && (
                <>
                  {this.state.triesLeft > 0 && (
                    <button
                      style={{ marginLeft: '10px', background: '#4caf50', color: 'white' }}
                      onClick={() => {
                        // Remove tile coloring classes from all tiles
                        const classesToRemove = ['valid', 'invalid', 'close'];
                        const tiles = document.querySelectorAll('[data-current-row]');
                        tiles.forEach(tile => {
                          classesToRemove.forEach(cls => tile.classList.remove(cls));
                        });
                        // Reset the gameboard for retry
                        let resetTiles = [];
                        for (let i = 0; i < this.state.maxRows; i++) {
                          resetTiles.push([null, null, null, null]);
                        }
                        this.setState({
                          showModal: false,
                          guesses: 0,
                          guessedWords: [],
                          currentRow: 0,
                          currentCol: 0,
                          gameRowTiles: resetTiles,
                          gameOver: false,
                          shareText: '',
                        });
                      }}
                    >
                      Retry ({this.state.triesLeft} left today)
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* HISTORY MODAL */}
        {this.state.showHistory && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Results History</h2>
              <ul className="history-list">
                {this.state.userStats.map((stat, i) => {
                  // generate share text on the fly
                  const txt = this.generateShareText(
                    stat.guessedWords,
                    stat.word,
                    this.state.maxCols
                  );

                  return (
                    <li key={i}>
                      <strong>Game #{stat.gameId}:</strong>{' '}
                      {stat.won ? 'Win' : 'Loss'} in {stat.guessedWords.length} guess
                      {stat.guessedWords.length > 1 ? 'es' : ''}.
                      <button
                        style={{ marginLeft: '8px' }}
                        onClick={() => {
                          navigator.clipboard.writeText(txt);
                          alert('Copied!');
                        }}
                      >
                        Copy Share
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button onClick={this.handleHideHistory}>Close</button>
            </div>
          </div>
        )}
        <footer className="site-footer">
          <p>Made in Florida by <a href="https://stevenwaters.com">Steven Waters</a></p>
        </footer>
      </div>
    );
  }
}

export default App;
