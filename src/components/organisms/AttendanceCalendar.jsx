import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getDay, addMonths, subMonths, parseISO } from 'date-fns'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import Icon from '@/components/atoms/Icon'
import Modal from '@/components/molecules/Modal'
import FormField from '@/components/molecules/FormField'
import { attendanceService, employeeService } from '@/services'

const AttendanceCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showTimeTracker, setShowTimeTracker] = useState(false)
  const [showRecordModal, setShowRecordModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [currentClockIn, setCurrentClockIn] = useState(null)

  const [formData, setFormData] = useState({
    employeeId: '',
    date: '',
    clockIn: '',
    clockOut: '',
    breakDuration: 60,
    notes: ''
  })

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  useEffect(() => {
    loadData()
  }, [currentDate])

  const loadData = async () => {
    setLoading(true)
    try {
      const [attendanceData, employeeData] = await Promise.all([
        attendanceService.getByDateRange(monthStart, monthEnd),
        employeeService.getAll()
      ])
      
      setAttendanceRecords(attendanceData || [])
      setEmployees(employeeData || [])
      
      // Check for any currently clocked in records
      const workingRecord = attendanceData?.find(record => record.status === 'working')
      setCurrentClockIn(workingRecord || null)
      
    } catch (err) {
      setError(err?.message || 'Failed to load attendance data')
      toast.error(err?.message || 'Failed to load attendance data')
    } finally {
      setLoading(false)
    }
  }

  const getAttendanceForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return attendanceRecords.filter(record => record.date === dateStr)
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
    setShowTimeTracker(true)
  }

  const handleClockIn = async () => {
    try {
      const timestamp = new Date()
      const record = await attendanceService.clockIn(1, timestamp) // Default to employee 1 for demo
      
      setCurrentClockIn(record)
      setAttendanceRecords(prev => [...prev, record])
      toast.success('Clocked in successfully!')
      
    } catch (err) {
      toast.error(err?.message || 'Failed to clock in')
    }
  }

  const handleClockOut = async () => {
    if (!currentClockIn) {
      toast.error('No active clock-in record found')
      return
    }

    try {
      const timestamp = new Date()
      const updatedRecord = await attendanceService.clockOut(currentClockIn.id, timestamp)
      
      setCurrentClockIn(null)
      setAttendanceRecords(prev => 
        prev.map(record => record.id === currentClockIn.id ? updatedRecord : record)
      )
      toast.success(`Clocked out successfully! Total hours: ${updatedRecord.totalHours}`)
      
    } catch (err) {
      toast.error(err?.message || 'Failed to clock out')
    }
  }

  const handleAddRecord = () => {
    setEditingRecord(null)
    setFormData({
      employeeId: '',
      date: format(selectedDate, 'yyyy-MM-dd'),
      clockIn: '',
      clockOut: '',
      breakDuration: 60,
      notes: ''
    })
    setShowRecordModal(true)
  }

  const handleEditRecord = (record) => {
    setEditingRecord(record)
    setFormData({
      employeeId: record.employeeId,
      date: record.date,
      clockIn: record.clockIn ? format(parseISO(record.clockIn), "HH:mm") : '',
      clockOut: record.clockOut ? format(parseISO(record.clockOut), "HH:mm") : '',
      breakDuration: record.breakDuration || 60,
      notes: record.notes || ''
    })
    setShowRecordModal(true)
  }

  const handleSubmitRecord = async (e) => {
    e.preventDefault()
    if (!formData.employeeId || !formData.date) {
      toast.error('Please fill in required fields')
      return
    }

    try {
      const recordData = {
        ...formData,
        employeeId: parseInt(formData.employeeId),
        breakDuration: parseInt(formData.breakDuration),
        clockIn: formData.clockIn ? `${formData.date}T${formData.clockIn}:00.000Z` : null,
        clockOut: formData.clockOut ? `${formData.date}T${formData.clockOut}:00.000Z` : null
      }

      if (recordData.clockIn && recordData.clockOut) {
        const clockInTime = new Date(recordData.clockIn)
        const clockOutTime = new Date(recordData.clockOut)
        const totalMinutes = Math.floor((clockOutTime - clockInTime) / (1000 * 60)) - recordData.breakDuration
        recordData.totalHours = Math.max(0, totalMinutes / 60)
        recordData.status = clockInTime.getHours() > 9 ? 'late' : 'present'
      } else if (!recordData.clockIn && !recordData.clockOut) {
        recordData.status = 'absent'
      } else {
        recordData.status = 'working'
      }

      let result
      if (editingRecord) {
        result = await attendanceService.update(editingRecord.id, recordData)
        setAttendanceRecords(prev => 
          prev.map(record => record.id === editingRecord.id ? result : record)
        )
        toast.success('Attendance record updated successfully!')
      } else {
        result = await attendanceService.create(recordData)
        setAttendanceRecords(prev => [...prev, result])
        toast.success('Attendance record created successfully!')
      }

      setShowRecordModal(false)
    } catch (err) {
      toast.error(err?.message || 'Failed to save attendance record')
    }
  }

  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm('Are you sure you want to delete this attendance record?')) {
      return
    }

    try {
      await attendanceService.delete(recordId)
      setAttendanceRecords(prev => prev.filter(record => record.id !== recordId))
      toast.success('Attendance record deleted successfully!')
    } catch (err) {
      toast.error(err?.message || 'Failed to delete attendance record')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800'
      case 'absent': return 'bg-red-100 text-red-800'
      case 'late': return 'bg-amber-100 text-amber-800'
      case 'working': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId)
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Text variant="h2">Time & Attendance</Text>
          <Text variant="body">Track employee attendance and working hours</Text>
        </div>
        <div className="flex items-center space-x-3">
          {currentClockIn ? (
            <Button variant="clock-out" onClick={handleClockOut} iconName="Clock">
              Clock Out
            </Button>
          ) : (
            <Button variant="clock-in" onClick={handleClockIn} iconName="Clock">
              Clock In
            </Button>
          )}
          <Button onClick={handleAddRecord} iconName="Plus">
            Add Record
          </Button>
        </div>
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
              <Text variant="time-large">
                {format(new Date(), 'h:mm:ss a')}
              </Text>
              <Text variant="small">Current Time</Text>
            </div>
          </div>
        </Card>
      )}

      {/* Calendar */}
      <Card>
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            iconName="ChevronLeft"
          >
            Previous
          </Button>
          
          <Text variant="h3">
            {format(currentDate, 'MMMM yyyy')}
          </Text>
          
          <Button 
            variant="ghost" 
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            iconName="ChevronRight"
          >
            Next
          </Button>
        </div>

        {/* Days of Week */}
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
          {monthDays.map(day => {
            const dayAttendance = getAttendanceForDate(day)
            const hasAttendance = dayAttendance.length > 0
            
            return (
              <motion.div
                key={day.toISOString()}
                whileHover={{ scale: 1.02 }}
                className={`
                  h-24 p-2 border rounded-lg cursor-pointer transition-all
                  ${isToday(day) ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}
                  ${isSameDay(day, selectedDate) ? 'bg-primary/10 border-primary' : ''}
                `}
                onClick={() => handleDateClick(day)}
              >
                <div className="flex flex-col h-full">
                  <Text variant="calendar-day" className={isToday(day) ? 'text-primary font-bold' : ''}>
                    {format(day, 'd')}
                  </Text>
                  
                  {hasAttendance && (
                    <div className="flex-1 mt-1 space-y-1">
                      {dayAttendance.slice(0, 2).map(record => (
                        <div
                          key={record.id}
                          className={`text-xs px-1 py-0.5 rounded text-center ${getStatusColor(record.status)}`}
                        >
                          {record.status}
                        </div>
                      ))}
                      {dayAttendance.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{dayAttendance.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </Card>

      {/* Time Tracker Modal */}
      <Modal
        isOpen={showTimeTracker}
        onClose={() => setShowTimeTracker(false)}
        title={`Attendance for ${format(selectedDate, 'MMMM d, yyyy')}`}
      >
        <div className="space-y-4">
          {getAttendanceForDate(selectedDate).length > 0 ? (
            <div className="space-y-3">
              {getAttendanceForDate(selectedDate).map(record => (
                <Card key={record.id} variant="attendance-record">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Text variant="h4">{getEmployeeName(record.employeeId)}</Text>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        {record.clockIn && (
                          <div>
                            <Text variant="small">Clock In</Text>
                            <Text variant="time">{format(parseISO(record.clockIn), 'h:mm a')}</Text>
                          </div>
                        )}
                        {record.clockOut && (
                          <div>
                            <Text variant="small">Clock Out</Text>
                            <Text variant="time">{format(parseISO(record.clockOut), 'h:mm a')}</Text>
                          </div>
                        )}
                        {record.totalHours && (
                          <div>
                            <Text variant="small">Total Hours</Text>
                            <Text variant="time">{record.totalHours}h</Text>
                          </div>
                        )}
                        {record.breakDuration && (
                          <div>
                            <Text variant="small">Break Time</Text>
                            <Text variant="time">{record.breakDuration}min</Text>
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
                        onClick={() => handleEditRecord(record)}
                        iconName="Edit"
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteRecord(record.id)}
                        iconName="Trash2"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Icon name="Calendar" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <Text variant="h4" className="text-gray-500">No attendance records</Text>
              <Text variant="body">No attendance records found for this date.</Text>
              <Button className="mt-4" onClick={handleAddRecord} iconName="Plus">
                Add Record
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Add/Edit Record Modal */}
      <Modal
        isOpen={showRecordModal}
        onClose={() => setShowRecordModal(false)}
        title={editingRecord ? 'Edit Attendance Record' : 'Add Attendance Record'}
      >
        <form onSubmit={handleSubmitRecord} className="space-y-4">
          <FormField
            label="Employee"
            type="select"
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            options={[
              { value: '', label: 'Select employee...' },
              ...employees.map(emp => ({
                value: emp.id,
                label: `${emp.firstName} ${emp.lastName}`
              }))
            ]}
            required
          />

          <FormField
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Clock In"
              type="time"
              value={formData.clockIn}
              onChange={(e) => setFormData({ ...formData, clockIn: e.target.value })}
            />

            <FormField
              label="Clock Out"
              type="time"
              value={formData.clockOut}
              onChange={(e) => setFormData({ ...formData, clockOut: e.target.value })}
            />
          </div>

          <FormField
            label="Break Duration (minutes)"
            type="number"
            value={formData.breakDuration}
            onChange={(e) => setFormData({ ...formData, breakDuration: e.target.value })}
            min="0"
            max="480"
          />

          <FormField
            label="Notes"
            type="textarea"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Optional notes about this attendance record..."
          />

          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={() => setShowRecordModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingRecord ? 'Update' : 'Create'} Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AttendanceCalendar