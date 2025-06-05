import leaveRequestData from '../mockData/leaveRequest.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let leaveRequests = [...leaveRequestData]

const leaveRequestService = {
  async getAll() {
    await delay(250)
    return [...leaveRequests]
  },

  async getById(id) {
    await delay(200)
    const request = leaveRequests.find(req => req.id === id)
    return request ? {...request} : null
  },

  async create(requestData) {
    await delay(400)
    const newRequest = {
      ...requestData,
      id: Date.now(),
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    }
    leaveRequests.push(newRequest)
    return {...newRequest}
  },

  async update(id, requestData) {
    await delay(300)
    const index = leaveRequests.findIndex(req => req.id === id)
    if (index !== -1) {
      leaveRequests[index] = { ...leaveRequests[index], ...requestData }
      return {...leaveRequests[index]}
    }
    throw new Error('Leave request not found')
  },

  async delete(id) {
    await delay(250)
    const index = leaveRequests.findIndex(req => req.id === id)
    if (index !== -1) {
      leaveRequests.splice(index, 1)
      return true
    }
    throw new Error('Leave request not found')
  }
}

export default leaveRequestService