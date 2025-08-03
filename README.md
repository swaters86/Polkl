# Feature List 
Display grid - done
Display Keyboard  - done
type in letters  - done
delete letters - done 
check letters for valid, invalid, and close - done
add tile fliping animation - done 
add share feature
keep track of stats in cache
don't allow play in same day 
check if the word exists in the word list
add dark theme 
make it dynamic so users can save their own title , word list, grid settings, and other information
make columns dynamic (a map statement should generate them using a state variable)
make it so you can't play again after maxing out your guesses
need to shake row if word doesn't exist in list
add animation for when a word is valid

# bugs 
maxing out guests causes the board to go blank when displaying the guest word
it's possible to make guess without completing all of the letters 
it's possible to random enter in 4 letters . need to check against a master list of 4 letter words.
it's possible to start entering letters while an entry is being checked 


# Code to use to show game progress
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