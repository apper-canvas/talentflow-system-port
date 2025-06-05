import { motion } from 'framer-motion'
import Icon from './Icon'

const Button = ({
  children,
  onClick,
  className = '',
  variant = 'primary', // 'primary', 'secondary', 'danger', 'ghost', 'text'
  size = 'md', // 'sm', 'md', 'lg'
  iconName,
  iconClass = '',
  disabled = false,
  whileHover,
  whileTap,
  ...props
}) => {
const baseClasses = 'inline-flex items-center justify-center transition-all duration-200 font-medium rounded-xl'

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-card',
    secondary: 'bg-secondary hover:bg-secondary-dark text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300',
    text: 'bg-transparent hover:bg-gray-50 text-primary',
    'status-pending': 'bg-amber-100 text-amber-800',
    'status-approved': 'bg-green-100 text-green-800',
    'status-rejected': 'bg-red-100 text-red-800',
    'employee-status-active': 'bg-green-100 text-green-800',
    'employee-status-inactive': 'bg-gray-100 text-gray-800',
    'sidebar-active': 'bg-primary text-white shadow-card',
    'sidebar-inactive': 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    'clock-in': 'bg-green-500 hover:bg-green-600 text-white shadow-card',
    'clock-out': 'bg-red-500 hover:bg-red-600 text-white shadow-card',
    'break-start': 'bg-amber-500 hover:bg-amber-600 text-white',
    'break-end': 'bg-blue-500 hover:bg-blue-600 text-white',
    'attendance-present': 'bg-green-100 text-green-800 border border-green-200',
    'attendance-absent': 'bg-red-100 text-red-800 border border-red-200',
    'attendance-late': 'bg-amber-100 text-amber-800 border border-amber-200',
    'attendance-working': 'bg-blue-100 text-blue-800 border border-blue-200'
  }

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base'
  }

  const finalClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`

  return (
    <motion.button
      onClick={onClick}
      className={finalClasses}
      disabled={disabled}
      whileHover={whileHover}
      whileTap={whileTap}
      {...props}
    >
      {iconName && <Icon name={iconName} className={`mr-2 ${iconClass}`} />}
      {children}
    </motion.button>
  )
}

export default Button