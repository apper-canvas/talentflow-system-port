const StatusBadge = ({ 
  status, 
  children,
  size = 'sm',
  className = '',
  ...props 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800'
      case 'absent': return 'bg-red-100 text-red-800'
      case 'late': return 'bg-amber-100 text-amber-800'
      case 'working': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const sizeClasses = {
    xs: 'text-xs px-1 py-0.5',
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2 py-1'
  }

  return (
    <span 
      className={`
        ${getStatusColor(status)} 
        ${sizeClasses[size]} 
        rounded-full font-medium
        ${className}
      `} 
      {...props}
    >
      {children || status}
    </span>
  )
}

export default StatusBadge