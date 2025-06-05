import attendanceData from '../mockData/attendance.json'

// Simple delay utility
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock attendance service
const attendanceService = {
  async getAll() {
    await delay(300)
    return [...attendanceData]
  },

  async getById(id) {
    await delay(200)
    const record = attendanceData.find(item => item.id === id)
    if (!record) {
      throw new Error('Attendance record not found')
    }
    return { ...record }
  },

  async getByEmployee(employeeId) {
    await delay(250)
    return attendanceData
      .filter(record => record.employeeId === employeeId)
      .map(record => ({ ...record }))
  },

  async getByDateRange(startDate, endDate) {
    await delay(300)
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return attendanceData
      .filter(record => {
        const recordDate = new Date(record.date)
        return recordDate >= start && recordDate <= end
      })
      .map(record => ({ ...record }))
  },

  async create(attendanceData) {
    await delay(400)
    const newRecord = {
      id: Date.now(),
      ...attendanceData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // In a real app, this would persist to a database
    return { ...newRecord }
  },

  async update(id, updateData) {
    await delay(350)
    const existingRecord = attendanceData.find(item => item.id === id)
    if (!existingRecord) {
      throw new Error('Attendance record not found')
    }

    const updatedRecord = {
      ...existingRecord,
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    // In a real app, this would persist to a database
    return { ...updatedRecord }
  },

  async delete(id) {
    await delay(250)
    const recordIndex = attendanceData.findIndex(item => item.id === id)
    if (recordIndex === -1) {
      throw new Error('Attendance record not found')
    }

    // In a real app, this would remove from database
    return { success: true, id }
  },

  async clockIn(employeeId, timestamp = new Date()) {
    await delay(300)
    const newRecord = {
      id: Date.now(),
      employeeId,
      date: timestamp.toISOString().split('T')[0],
      clockIn: timestamp.toISOString(),
      status: 'working',
      createdAt: timestamp.toISOString(),
      updatedAt: timestamp.toISOString()
    }
    
    return { ...newRecord }
  },

  async clockOut(id, timestamp = new Date()) {
    await delay(300)
    const existingRecord = attendanceData.find(item => item.id === id)
    if (!existingRecord) {
      throw new Error('Attendance record not found')
    }

    const clockInTime = new Date(existingRecord.clockIn)
    const clockOutTime = new Date(timestamp)
    const totalMinutes = Math.floor((clockOutTime - clockInTime) / (1000 * 60))
    const totalHours = (totalMinutes / 60).toFixed(2)

    const updatedRecord = {
      ...existingRecord,
      clockOut: timestamp.toISOString(),
      totalHours: parseFloat(totalHours),
      status: 'present',
      updatedAt: timestamp.toISOString()
    }

    return { ...updatedRecord }
  }
}

export default attendanceService