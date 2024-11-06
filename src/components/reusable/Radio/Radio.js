import React from 'react';
import "./Radio.css"

const renderOptions = (options, onChange) => {
    return options.map(option => (
        <label className="radio" key={option.value}>
            <input
                type="radio"
                id={option.value}
                name="register-type"
                value={option.value}
                defaultChecked={option.defaultChecked}
                onChange={onChange}
            />
            <span className="name">{option.label}</span>
        </label>
    ));
}

export default function Radio({ options, onChange }) {
    return (
        <div className="radio-group">
            {renderOptions(options, onChange)}
        </div>
    );
}
