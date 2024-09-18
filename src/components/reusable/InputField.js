const FormInput = ({
    label,
    name,
    type,
    value,
    onChange,
    required,
    autoComplete,
    autoCorrect,
    autoCapitalize,
    className = "",
    ...props
  }) => {
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          autoCorrect={autoCorrect}
          autoCapitalize={autoCapitalize}
          className={`mt-3 block w-full rounded-md border-gray-300 h-[50px] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${className} border-[2px]`}
          {...props}
        />
      </div>
    );
  };
  
  export default FormInput;