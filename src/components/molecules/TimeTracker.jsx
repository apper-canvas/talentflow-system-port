import { format, parseISO } from 'date-fns'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import TimeDisplay from '@/components/atoms/TimeDisplay'

const TimeTracker = ({ 
  currentClockIn, 
  onClockIn, 
  onClockOut,
  className = '',
  ...props 
}) => {
  return (
    <div className={className} {...props}>
      {/* Action Buttons */}
      <div className="flex items-center space-x-3 mb-6">
        {currentClockIn ? (
          <Button variant="clock-out" onClick={onClockOut} iconName="Clock">
            Clock Out
          </Button>
        ) : (
          <Button variant="clock-in" onClick={onClockIn} iconName="Clock">
            Clock In
          </Button>
        )}
      </div>

      {/* Current Status */}
      {currentClockIn && (
        <Card variant="time-tracking">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="h4">Currently Working</Text>
              <Text variant="body">
                Clocked in at {format(parseISO(currentClockIn.clockIn), 'h:mm a')}
              </Text>
            </div>
            <div className="text-right">
              <TimeDisplay 
                time={new Date()} 
                variant="time-large"
                format="h:mm:ss a"
              />
              <Text variant="small">Current Time</Text>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default TimeTracker