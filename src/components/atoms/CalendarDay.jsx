import { motion } from 'framer-motion'
import { format, isToday, isSameDay } from 'date-fns'
import Text from './Text'
import StatusBadge from './StatusBadge'

const CalendarDay = ({ 
  day, 
  attendance = [], 
  isSelected = false,
  onClick,
  className = '',
  ...props 
}) => {
  const hasAttendance = attendance.length > 0

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`
        h-24 p-2 border rounded-lg cursor-pointer transition-all
        ${isToday(day) ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}
        ${isSelected ? 'bg-primary/10 border-primary' : ''}
        ${className}
      `}
      onClick={() => onClick?.(day)}
      {...props}
    >
      <div className="flex flex-col h-full">
        <Text 
          variant="calendar-day" 
          className={isToday(day) ? 'text-primary font-bold' : ''}
        >
          {format(day, 'd')}
        </Text>
        
        {hasAttendance && (
          <div className="flex-1 mt-1 space-y-1">
            {attendance.slice(0, 2).map(record => (
              <StatusBadge 
                key={record.id}
                status={record.status}
                size="xs"
                className="text-center"
              />
            ))}
            {attendance.length > 2 && (
              <div className="text-xs text-gray-500 text-center">
                +{attendance.length - 2} more
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default CalendarDay