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
  options = [],
  error,
  ...props
}) => {
  const baseInputClasses = `mt-3 block w-full hover:bg-gray-100 rounded-md border-gray-300 h-[50px] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${className} border-[2px] py-3 pr-4`;

  return (
    <div className="flex-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 whitespace-nowrap">
        {label}
      </label>
      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={baseInputClasses}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
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
          className={baseInputClasses}
          {...props}
        />
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormInput;