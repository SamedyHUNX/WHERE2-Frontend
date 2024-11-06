import React from 'react';
import './Form.css';

export default function Form({ title, children }) {
    return (
        <div className="atom-form">
            <p className="title">{ title }</p>
            { children }
        </div>
    );
}