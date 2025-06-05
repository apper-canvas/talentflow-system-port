import { motion } from 'framer-motion'

const Card = ({ children, className = '', animate = true, ...props }) => {
  const baseClasses = 'bg-white rounded-2xl shadow-card p-6'
  const finalClasses = `${baseClasses} ${className}`

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