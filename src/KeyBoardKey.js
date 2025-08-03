import React from 'react';

class KeyBoardKey extends React.Component {
   constructor(props) {
        super(props);
        this.handleSelectedLetter = this.handleSelectedLetter.bind(this);
   }

   handleSelectedLetter(e) {
        /*
        e.preventDefault();
    
        let letterIndex = this.props.pickedWord.indexOf(e.target.dataset.keyValue);
    
        if (letterIndex > 0) {
            alert('letter exist!');
        } else {
            alert('letter doesnt exist!');
        }*/

        this.props.onSelectedLetter(e.target.dataset.keyValue)
    }
    
    render() {
        let className = 'keyboard-key';
        if (this.props.status) {
            className += ' ' + this.props.status;
        }
        return (
            <button className={className} onClick={(e) => this.handleSelectedLetter(e)} data-key-value={this.props.keyValue}>
                {this.props.keyValue}
            </button>
        )
    }
}

export default KeyBoardKey;