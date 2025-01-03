import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export default function PopupResult({ open, close, result }) {
    return (
        <Popup open={open} closeOnDocumentClick onClose={close} position={"center"}>
            <div className="popup-result">
                <div className="header-close-button-container">
                    <button onClick={close}>
                        &times;
                    </button>
                </div>
                <div className="result-header">
                    <div className="header-title">
                        <h2>Final result</h2>
                    </div>
                </div>
                <div className="popup-result-content">
                    <p>Your score is: {result.score}/{result.max_score}</p>
                    <p>Your compliance is: {result.percent}%</p>
                </div>
            </div>
        </Popup>
    );
}
