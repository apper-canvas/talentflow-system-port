import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import SectionHeader from '@/components/molecules/SectionHeader'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import EmployeeTable from '@/components/organisms/EmployeeTable'
import EmployeeForm from '@/components/organisms/EmployeeForm'
import { employeeService, departmentService } from '@/services'

const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  useEffect(() => {
    const loadEmployeesAndDepartments = async () => {
      setLoading(true)
      try {
        const [employeesData, departmentsData] = await Promise.all([
          employeeService.getAll(),
          departmentService.getAll()
        ])
        setEmployees(employeesData || [])
        setFilteredEmployees(employeesData || [])
        setDepartments(departmentsData || [])
      } catch (err) {
        toast.error(err?.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    loadEmployeesAndDepartments()
  }, [])

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

  const openEmployeeModal = (employee = null) => {
    setSelectedEmployee(employee)
    setShowEmployeeModal(true)
  }

  const handleEmployeeModalClose = async () => {
    setShowEmployeeModal(false)
    // Reload employees after modal closes in case of update/create
    const updatedEmployees = await employeeService.getAll()
    setEmployees(updatedEmployees || [])
  }

  const uniqueRoles = [...new Set(employees?.map(emp => emp?.position).filter(Boolean))]

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Employee Directory"
        description="Manage your workforce and employee information"
        actions={
          <Button onClick={() => openEmployeeModal()} iconName="Plus">
            Add Employee
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          iconName="Search"
        />
        <Select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          options={departments?.map(dept => ({ value: dept?.name, label: dept?.name }))}
          placeholder="All Departments"
          className="pl-3" // Override default padding from Input for select
        />
        <Select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          options={uniqueRoles?.map(role => ({ value: role, label: role }))}
          placeholder="All Roles"
          className="pl-3" // Override default padding from Input for select
        />
      </div>

      <EmployeeTable
        employees={filteredEmployees}
        loading={loading}
        onEdit={openEmployeeModal}
      />

      <EmployeeForm
        isOpen={showEmployeeModal}
        onClose={handleEmployeeModalClose}
        selectedEmployee={selectedEmployee}
        employees={employees}
        departments={departments}
      />
    </div>
  )
}

export default EmployeeDirectory