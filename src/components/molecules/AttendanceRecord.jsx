import { format, parseISO } from 'date-fns'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import StatusBadge from '@/components/atoms/StatusBadge'
import TimeDisplay from '@/components/atoms/TimeDisplay'

const AttendanceRecord = ({ 
  record, 
  employeeName,
  onEdit, 
  onDelete,
  className = '',
  ...props 
}) => {
  return (
    <Card variant="attendance-record" className={className} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <Text variant="h4">{employeeName}</Text>
            <StatusBadge status={record.status} />
          </div>
          
          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
            {record.clockIn && (
              <div>
                <Text variant="small">Clock In</Text>
                <TimeDisplay 
                  time={parseISO(record.clockIn)} 
                  variant="time"
                />
              </div>
            )}
            {record.clockOut && (
              <div>
                <Text variant="small">Clock Out</Text>
                <TimeDisplay 
                  time={parseISO(record.clockOut)} 
                  variant="time"
                />
              </div>
            )}
            {record.totalHours && (
              <div>
                <Text variant="small">Total Hours</Text>
                <TimeDisplay 
                  time={`${record.totalHours}h`} 
                  variant="time"
                />
              </div>
            )}
            {record.breakDuration && (
              <div>
                <Text variant="small">Break Time</Text>
                <TimeDisplay 
                  time={`${record.breakDuration}min`} 
                  variant="time"
                />
              </div>
            )}
          </div>
          
          {record.notes && (
            <Text variant="small" className="mt-2 text-gray-600">
              {record.notes}
            </Text>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(record)}
            iconName="Edit"
          />
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete?.(record.id)}
            iconName="Trash2"
          />
        </div>
      </div>
    </Card>
  )
}

export default AttendanceRecord