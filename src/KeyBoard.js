import React from 'react';
import KeyBoardKey from './KeyBoardKey.js';
        
class KeyBoard extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectedLetter = this.handleSelectedLetter.bind(this);
    }

    handleSelectedLetter(selectedLetter) {
        this.props.onSelectedLetter(selectedLetter)
    }
     
    render() {
        const { keyStatus = {} } = this.props;
        return (
        <div className="keyboard">
            <div className="keyboard-row">
                {this.props.key1.map(key1 => {
                    return (
                        <KeyBoardKey 
                            keyValue={key1} 
                            key={key1}
                            onSelectedLetter={this.handleSelectedLetter} 
                            status={keyStatus[key1]}
                        />
                    )
                })}
            </div>
            <div className="keyboard-row">
                {this.props.key2.map(key2 => {
                    return (
                        <KeyBoardKey 
                            keyValue={key2} 
                            key={key2} 
                            onSelectedLetter={this.handleSelectedLetter} 
                            status={keyStatus[key2]}
                        />
                    )
                })}
            </div>
            <div className="keyboard-row">
                {this.props.key3.map(key3 => {
                    return (
                        <KeyBoardKey
                            keyValue={key3}
                            key={key3}
                            onSelectedLetter={this.handleSelectedLetter} 
                            status={keyStatus[key3]}
                        />
                    )
                })}
            </div>
        </div>
        );
    }
  }

  export default KeyBoard;