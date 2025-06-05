import Text from './Text'

const TimeDisplay = ({ 
  time, 
  variant = 'time', 
  format = 'h:mm a',
  className = '',
  ...props 
}) => {
  if (!time) return null

  const formatTime = (timeValue) => {
    if (typeof timeValue === 'string' && timeValue.includes('h')) {
      return timeValue // Already formatted (e.g., "8.5h")
    }
    
    if (typeof timeValue === 'object' && timeValue instanceof Date) {
      return timeValue.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: format.includes('a')
      })
    }
    
    return timeValue
  }

  return (
    <Text variant={variant} className={className} {...props}>
      {formatTime(time)}
    </Text>
  )
}

export default TimeDisplay