import { motion } from 'framer-motion'

const Card = ({ children, className = '', animate = true, variant = 'default', ...props }) => {
  const baseClasses = 'bg-white rounded-2xl shadow-card'
  
  const variantClasses = {
    default: 'p-6',
    compact: 'p-4',
    'calendar-grid': 'p-2',
    'time-tracking': 'p-6 border-l-4 border-primary',
    'attendance-record': 'p-4 border border-gray-200 hover:border-primary transition-colors duration-200'
  }
  
  const finalClasses = `${baseClasses} ${variantClasses[variant]} ${className}`

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={finalClasses}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={finalClasses} {...props}>
      {children}
    </div>
  )
}

export default Card