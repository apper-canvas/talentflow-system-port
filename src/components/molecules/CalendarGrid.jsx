import { startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns'
import Text from '@/components/atoms/Text'
import CalendarDay from '@/components/atoms/CalendarDay'

const CalendarGrid = ({ 
  currentDate,
  selectedDate,
  attendanceRecords = [],
  onDayClick,
  className = '',
  ...props 
}) => {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getAttendanceForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return attendanceRecords.filter(record => record.date === dateStr)
  }

  return (
    <div className={className} {...props}>
      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center">
            <Text variant="calendar-header">{day}</Text>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells for days before month start */}
        {Array.from({ length: getDay(monthStart) }).map((_, index) => (
          <div key={index} className="h-24"></div>
        ))}
        
        {/* Month days */}
        {monthDays.map(day => (
          <CalendarDay
            key={day.toISOString()}
            day={day}
            attendance={getAttendanceForDate(day)}
            isSelected={selectedDate && day.toDateString() === selectedDate.toDateString()}
            onClick={onDayClick}
          />
        ))}
      </div>
    </div>
  )
}

export default CalendarGrid