import { useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';

export default function FormInput({ name="", placeholder="", value="", onChange, Util, shake, type }) {
    const inputRef = useRef(null);

    useEffect(() => {
        const inputElement = inputRef.current;

        const handleBlur = () => {
            if (!inputElement.value.trim()) {
                inputElement.parentElement.classList.add('shake');
            } else {
                inputElement.parentElement.classList.remove('shake');
            }
        };

        const handleInput = () => {
            if (inputElement.value.trim()) {
                inputElement.classList.add('not-empty');
            } else {
                inputElement.classList.remove('not-empty');
            }
        };

        inputElement.addEventListener('blur', handleBlur);
        inputElement.addEventListener('input', handleInput);
        inputElement.addEventListener('change', handleInput);

        // Initial check
        handleInput();

        return () => {
            inputElement.removeEventListener('blur', handleBlur);
            inputElement.removeEventListener('input', handleInput);
            inputElement.removeEventListener('change', handleInput);
        };
    }, []);

    return (
        <label className={`input-label ${shake ? 'shake' : ''}`}>
            <input
                className="input"
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder=" "
                required
                ref={inputRef}
            />
            <span>{placeholder}</span>
            {type === 'date' && <Calendar className="calendar-icon" />}
            {Util && <Util />}
        </label>
    );
}
