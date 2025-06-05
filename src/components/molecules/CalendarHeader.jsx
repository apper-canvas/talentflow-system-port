import { format, addMonths, subMonths } from 'date-fns'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'

const CalendarHeader = ({ 
  currentDate, 
  onDateChange,
  className = '',
  ...props 
}) => {
  const handlePrevious = () => {
    onDateChange(subMonths(currentDate, 1))
  }

  const handleNext = () => {
    onDateChange(addMonths(currentDate, 1))
  }

  return (
    <div className={`flex items-center justify-between ${className}`} {...props}>
      <Button 
        variant="ghost" 
        onClick={handlePrevious}
        iconName="ChevronLeft"
      >
        Previous
      </Button>
      
      <Text variant="h3">
        {format(currentDate, 'MMMM yyyy')}
      </Text>
      
      <Button 
        variant="ghost" 
        onClick={handleNext}
        iconName="ChevronRight"
      >
        Next
      </Button>
    </div>
  )
}

export default CalendarHeader