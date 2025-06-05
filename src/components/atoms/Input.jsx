import Icon from './Icon'

const Input = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  className = '',
  placeholder,
  required = false,
  iconName,
  iconClass = '',
  ...props
}) => {
  const inputClasses = `w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${className}`

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {iconName && (
          <Icon
            name={iconName}
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${iconClass}`}
          />
        )}
{type === 'textarea' ? (
          <textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`${inputClasses} ${iconName ? 'pl-10' : ''} min-h-[80px] resize-y`}
            {...props}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`${inputClasses} ${iconName ? 'pl-10' : ''}`}
            {...props}
          />
        )}
      </div>
    </div>
  )
}
export default Input