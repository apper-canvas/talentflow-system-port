import departmentData from '../mockData/department.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let departments = [...departmentData]

const departmentService = {
  async getAll() {
    await delay(200)
    return [...departments]
  },

  async getById(id) {
    await delay(150)
    const department = departments.find(dept => dept.id === id)
    return department ? {...department} : null
  },

  async create(departmentData) {
    await delay(350)
    const newDepartment = {
      ...departmentData,
      id: Date.now(),
      employeeCount: 0
    }
    departments.push(newDepartment)
    return {...newDepartment}
  },

  async update(id, departmentData) {
    await delay(300)
    const index = departments.findIndex(dept => dept.id === id)
    if (index !== -1) {
      departments[index] = { ...departments[index], ...departmentData }
      return {...departments[index]}
    }
    throw new Error('Department not found')
  },

  async delete(id) {
    await delay(250)
    const index = departments.findIndex(dept => dept.id === id)
    if (index !== -1) {
      departments.splice(index, 1)
      return true
    }
    throw new Error('Department not found')
  }
}

export default departmentService