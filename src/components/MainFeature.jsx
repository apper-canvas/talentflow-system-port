import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import ApperIcon from './ApperIcon'
import { employeeService, leaveRequestService, departmentService } from '../services'

const MainFeature = ({ section = 'dashboard' }) => {
  // Employees section state
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [activeTab, setActiveTab] = useState('personal')

  // Leave requests state
  const [leaveRequests, setLeaveRequests] = useState([])
  const [filteredLeaveRequests, setFilteredLeaveRequests] = useState([])
  const [leaveSearchTerm, setLeaveSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  // Common state
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Employee form state
  const [employeeForm, setEmployeeForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    hireDate: '',
    status: 'active',
    managerId: '',
    location: '',
    employeeId: ''
  })

  // Load data based on section
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [employeesData, departmentsData] = await Promise.all([
          employeeService.getAll(),
          departmentService.getAll()
        ])
        setEmployees(employeesData || [])
        setFilteredEmployees(employeesData || [])
        setDepartments(departmentsData || [])

        if (section === 'leave') {
          const leaveData = await leaveRequestService.getAll()
          setLeaveRequests(leaveData || [])
          setFilteredLeaveRequests(leaveData || [])
        }
      } catch (err) {
        setError(err?.message || 'Failed to load data')
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [section])

  // Filter employees
  useEffect(() => {
    let filtered = employees || []
    
    if (searchTerm) {
      filtered = filtered.filter(emp => 
        `${emp?.firstName} ${emp?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp?.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (selectedDepartment) {
      filtered = filtered.filter(emp => emp?.department === selectedDepartment)
    }
    
    if (selectedRole) {
      filtered = filtered.filter(emp => emp?.position === selectedRole)
    }
    
    setFilteredEmployees(filtered)
  }, [searchTerm, selectedDepartment, selectedRole, employees])

  // Filter leave requests
  useEffect(() => {
    let filtered = leaveRequests || []
    
    if (leaveSearchTerm) {
      filtered = filtered.filter(request => {
        const employee = employees?.find(emp => emp?.id === request?.employeeId)
        const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : ''
        return employeeName.toLowerCase().includes(leaveSearchTerm.toLowerCase()) ||
               request?.type?.toLowerCase().includes(leaveSearchTerm.toLowerCase())
      })
    }
    
    if (selectedStatus) {
      filtered = filtered.filter(request => request?.status === selectedStatus)
    }
    
    setFilteredLeaveRequests(filtered)
  }, [leaveSearchTerm, selectedStatus, leaveRequests, employees])

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (selectedEmployee) {
        await employeeService.update(selectedEmployee.id, employeeForm)
        toast.success('Employee updated successfully')
      } else {
        await employeeService.create(employeeForm)
        toast.success('Employee created successfully')
      }
      
      // Reload employees
      const updatedEmployees = await employeeService.getAll()
      setEmployees(updatedEmployees || [])
      setShowEmployeeModal(false)
      resetEmployeeForm()
    } catch (err) {
      toast.error('Failed to save employee')
    } finally {
      setLoading(false)
    }
  }

  const handleLeaveAction = async (requestId, action) => {
    setLoading(true)
    try {
      const request = leaveRequests?.find(req => req?.id === requestId)
      if (request) {
        await leaveRequestService.update(requestId, { 
          ...request, 
          status: action,
          approvedBy: 'HR Admin'
        })
        
        const updatedRequests = await leaveRequestService.getAll()
        setLeaveRequests(updatedRequests || [])
        toast.success(`Leave request ${action}`)
      }
    } catch (err) {
      toast.error('Failed to update leave request')
    } finally {
      setLoading(false)
    }
  }

  const resetEmployeeForm = () => {
    setEmployeeForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      hireDate: '',
      status: 'active',
      managerId: '',
      location: '',
      employeeId: ''
    })
    setSelectedEmployee(null)
    setActiveTab('personal')
  }

  const openEmployeeModal = (employee = null) => {
    if (employee) {
      setSelectedEmployee(employee)
      setEmployeeForm(employee)
    } else {
      resetEmployeeForm()
    }
    setShowEmployeeModal(true)
  }

  // Get unique roles for filter
  const uniqueRoles = [...new Set(employees?.map(emp => emp?.position).filter(Boolean))]

  if (section === 'dashboard') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Employee Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Employees</h3>
            <ApperIcon name="Users" className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : (
              filteredEmployees?.slice(0, 5).map((employee) => (
                <motion.div
                  key={employee?.id}
                  whileHover={{ x: 4 }}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => openEmployeeModal(employee)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {employee?.firstName?.[0]}{employee?.lastName?.[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {employee?.firstName} {employee?.lastName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{employee?.position}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      employee?.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {employee?.status}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Pending Leave Requests */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Pending Requests</h3>
            <ApperIcon name="Clock" className="w-5 h-5 text-accent" />
          </div>
          
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            ) : (
              filteredLeaveRequests?.filter(req => req?.status === 'pending').slice(0, 5).map((request) => {
                const employee = employees?.find(emp => emp?.id === request?.employeeId)
                return (
                  <motion.div
                    key={request?.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border border-gray-200 rounded-xl hover:border-primary transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">
                        {employee?.firstName} {employee?.lastName}
                      </p>
                      <span className="bg-accent text-white px-2 py-1 text-xs font-medium rounded-full">
                        {request?.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {format(new Date(request?.startDate || new Date()), 'MMM dd')} - {format(new Date(request?.endDate || new Date()), 'MMM dd')}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleLeaveAction(request?.id, 'approved')}
                        className="flex-1 bg-secondary text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-secondary-dark transition-colors duration-200"
                        disabled={loading}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleLeaveAction(request?.id, 'rejected')}
                        className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors duration-200"
                        disabled={loading}
                      >
                        Reject
                      </button>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </motion.div>
      </div>
    )
  }

  if (section === 'employees') {
    return (
      <div className="space-y-6">
        {/* Header and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Employee Directory</h3>
            <p className="text-gray-600 text-sm">Manage your workforce and employee information</p>
          </div>
          <button
            onClick={() => openEmployeeModal()}
            className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl font-medium transition-colors duration-200"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Departments</option>
            {departments?.map(dept => (
              <option key={dept?.id} value={dept?.name}>{dept?.name}</option>
            ))}
          </select>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Roles</option>
            {uniqueRoles?.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-32"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-16"></div></td>
                      <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-20"></div></td>
                    </tr>
                  ))
                ) : (
                  filteredEmployees?.map((employee) => (
                    <motion.tr
                      key={employee?.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {employee?.firstName?.[0]}{employee?.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {employee?.firstName} {employee?.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{employee?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{employee?.position}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{employee?.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{employee?.location}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          employee?.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {employee?.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openEmployeeModal(employee)}
                          className="text-primary hover:text-primary-dark font-medium text-sm"
                        >
                          Edit
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Employee Modal */}
        <AnimatePresence>
          {showEmployeeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowEmployeeModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
                    </h3>
                    <button
                      onClick={() => setShowEmployeeModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <div className="flex space-x-6 px-6">
                    {[
                      { id: 'personal', label: 'Personal Info', icon: 'User' },
                      { id: 'job', label: 'Job Details', icon: 'Briefcase' },
                      { id: 'emergency', label: 'Emergency', icon: 'Phone' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 py-3 border-b-2 transition-colors duration-200 ${
                          activeTab === tab.id
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <ApperIcon name={tab.icon} className="w-4 h-4" />
                        <span className="font-medium text-sm">{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleEmployeeSubmit} className="p-6 max-h-96 overflow-y-auto">
                  {activeTab === 'personal' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={employeeForm.firstName}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, firstName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={employeeForm.lastName}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, lastName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={employeeForm.email}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={employeeForm.phone}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'job' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Employee ID
                        </label>
                        <input
                          type="text"
                          value={employeeForm.employeeId}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, employeeId: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Position *
                        </label>
                        <input
                          type="text"
                          required
                          value={employeeForm.position}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, position: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Department *
                        </label>
                        <select
                          required
                          value={employeeForm.department}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, department: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Select Department</option>
                          {departments?.map(dept => (
                            <option key={dept?.id} value={dept?.name}>{dept?.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={employeeForm.location}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, location: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hire Date
                        </label>
                        <input
                          type="date"
                          value={employeeForm.hireDate}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, hireDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={employeeForm.status}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, status: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {activeTab === 'emergency' && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Emergency contact information will be available in future updates.
                      </p>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Coming soon: Emergency contact management</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowEmployeeModal(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : (selectedEmployee ? 'Update' : 'Create')}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  if (section === 'leave') {
    return (
      <div className="space-y-6">
        {/* Header and Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Leave Requests</h3>
            <p className="text-gray-600 text-sm">Review and manage employee leave requests</p>
          </div>
          <div className="flex space-x-3">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={leaveSearchTerm}
                onChange={(e) => setLeaveSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Leave Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="flex space-x-2 mt-4">
                    <div className="h-8 bg-gray-200 rounded flex-1"></div>
                    <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            filteredLeaveRequests?.map((request) => {
              const employee = employees?.find(emp => emp?.id === request?.employeeId)
              return (
                <motion.div
                  key={request?.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-card p-6 hover:shadow-soft transition-shadow duration-200"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {employee?.firstName?.[0]}{employee?.lastName?.[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {employee?.firstName} {employee?.lastName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{employee?.position}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      request?.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      request?.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request?.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Calendar" className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {format(new Date(request?.startDate || new Date()), 'MMM dd')} - {format(new Date(request?.endDate || new Date()), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Clock" className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 capitalize">{request?.type} leave</span>
                    </div>
                    {request?.reason && (
                      <div className="flex items-start space-x-2">
                        <ApperIcon name="MessageSquare" className="w-4 h-4 text-gray-400 mt-0.5" />
                        <p className="text-sm text-gray-600 line-clamp-2">{request?.reason}</p>
                      </div>
                    )}
                  </div>

                  {request?.status === 'pending' && (
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handleLeaveAction(request?.id, 'approved')}
                        className="flex-1 bg-secondary hover:bg-secondary-dark text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                        disabled={loading}
                      >
                        <ApperIcon name="Check" className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleLeaveAction(request?.id, 'rejected')}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                        disabled={loading}
                      >
                        <ApperIcon name="X" className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}

                  {request?.status !== 'pending' && (
                    <div className="mt-4 p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name={request?.status === 'approved' ? 'CheckCircle' : 'XCircle'} 
                          className={`w-4 h-4 ${request?.status === 'approved' ? 'text-green-500' : 'text-red-500'}`} />
                        <span className="text-sm text-gray-600">
                          {request?.status === 'approved' ? 'Approved' : 'Rejected'} by {request?.approvedBy || 'HR Admin'}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })
          )}
        </div>

        {filteredLeaveRequests?.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Calendar" className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leave requests found</h3>
            <p className="text-gray-600">No leave requests match your current filters.</p>
          </div>
        )}
      </div>
    )
  }

  return null
}

export default MainFeature