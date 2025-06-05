import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns'
import { toast } from 'react-toastify'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Icon from '@/components/atoms/Icon'
import Modal from '@/components/molecules/Modal'
import CalendarHeader from '@/components/molecules/CalendarHeader'
import CalendarGrid from '@/components/molecules/CalendarGrid'
import TimeTracker from '@/components/molecules/TimeTracker'
import AttendanceRecord from '@/components/molecules/AttendanceRecord'
import AttendanceForm from '@/components/molecules/AttendanceForm'
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
        <Button onClick={handleAddRecord} iconName="Plus">
          Add Record
        </Button>
      </div>

      {/* Time Tracker */}
      <TimeTracker
        currentClockIn={currentClockIn}
        onClockIn={handleClockIn}
        onClockOut={handleClockOut}
      />

      {/* Calendar */}
      <Card>
        <CalendarHeader
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          className="mb-6"
        />
        
        <CalendarGrid
          currentDate={currentDate}
          selectedDate={selectedDate}
          attendanceRecords={attendanceRecords}
          onDayClick={handleDateClick}
        />
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
                <AttendanceRecord
                  key={record.id}
                  record={record}
                  employeeName={getEmployeeName(record.employeeId)}
                  onEdit={handleEditRecord}
                  onDelete={handleDeleteRecord}
                />
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
        <AttendanceForm
          formData={formData}
          employees={employees}
          isEditing={!!editingRecord}
          onSubmit={handleSubmitRecord}
          onCancel={() => setShowRecordModal(false)}
          onChange={setFormData}
        />
      </Modal>
    </div>
  )
}

export default AttendanceCalendar