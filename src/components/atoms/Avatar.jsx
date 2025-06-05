import ApperIcon from '@/components/ApperIcon'

const Avatar = ({ initials, src, alt, size = 'medium', className = '', iconName = 'User', iconClass = '', ...props }) => {
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-10 h-10 text-sm',
    large: 'w-12 h-12 text-base',
    xl: 'w-24 h-24 text-4xl'
  }

  const baseClasses = 'rounded-full flex items-center justify-center overflow-hidden flex-shrink-0'
  const finalClasses = `${baseClasses} ${sizeClasses[size]} ${className}`

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${finalClasses} object-cover`}
        {...props}
      />
    )
  }

  if (initials) {
    const bgColor = 'bg-gradient-to-br from-primary to-primary-dark'
    const textColor = 'text-white'
    return (
      <div className={`${finalClasses} ${bgColor} ${textColor}`} {...props}>
        <span className="font-medium">{initials}</span>
      </div>
    )
  }

  return (
    <div className={`${finalClasses} bg-gray-200`} {...props}>
      <ApperIcon name={iconName} className={`${iconClass || 'w-2/3 h-2/3 text-gray-600'}`} />
    </div>
  )
}

export default Avatar