import Label from './Label'

const Select = ({
  label,
  id,
  value,
  onChange,
  options,
  className = '',
  required = false,
  placeholder = 'Select an option',
  ...props
}) => {
  const selectClasses = `w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${className}`

  return (
    <div>
      {label && (
        <Label htmlFor={id} className="mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={selectClasses}
        {...props}
      >
        <option value="" disabled={required && !value}>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select