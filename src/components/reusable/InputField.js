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
      <div className="flex-1">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 whitespace-nowrap">
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
          className={`mt-3 block w-full hover:bg-gray-100 rounded-md border-gray-300 h-[50px] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${className} border-[2px] p-3`}
          {...props}
        />
      </div>
    );
  };
  
  export default FormInput;