import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Modal from '@/components/molecules/Modal'
import TabBar from '@/components/molecules/TabBar'
import FormField from '@/components/molecules/FormField'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import { employeeService } from '@/services'

const EmployeeForm = ({ isOpen, onClose, selectedEmployee, employees, departments }) => {
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
  const [activeTab, setActiveTab] = useState('personal')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedEmployee) {
      setEmployeeForm(selectedEmployee)
    } else {
      resetForm()
    }
  }, [selectedEmployee, isOpen])

  const resetForm = () => {
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
    setActiveTab('personal')
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setEmployeeForm(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
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
      onClose() // Close modal and trigger data reload in parent
      resetForm()
    } catch (err) {
      toast.error('Failed to save employee')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: 'User' },
    { id: 'job', label: 'Job Details', icon: 'Briefcase' },
    { id: 'emergency', label: 'Emergency', icon: 'Phone' }
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
      className="max-h-[90vh] overflow-hidden"
      footerContent={
        <>
          <Button onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : (selectedEmployee ? 'Update' : 'Create')}
          </Button>
        </>
      }
    >
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]"> {/* Adjusted max-h */}
        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="First Name"
              id="firstName"
              value={employeeForm.firstName}
              onChange={handleChange}
              required
            />
            <FormField
              label="Last Name"
              id="lastName"
              value={employeeForm.lastName}
              onChange={handleChange}
              required
            />
            <FormField
              label="Email"
              id="email"
              type="email"
              value={employeeForm.email}
              onChange={handleChange}
              required
            />
            <FormField
              label="Phone"
              id="phone"
              type="tel"
              value={employeeForm.phone}
              onChange={handleChange}
            />
          </div>
        )}

        {activeTab === 'job' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Employee ID"
              id="employeeId"
              value={employeeForm.employeeId}
              onChange={handleChange}
            />
            <FormField
              label="Position"
              id="position"
              value={employeeForm.position}
              onChange={handleChange}
              required
            />
            <FormField
              label="Department"
              id="department"
              type="select"
              value={employeeForm.department}
              onChange={handleChange}
              options={departments?.map(dept => ({ value: dept?.name, label: dept?.name }))}
              placeholder="Select Department"
              required
            />
            <FormField
              label="Location"
              id="location"
              value={employeeForm.location}
              onChange={handleChange}
            />
            <FormField
              label="Hire Date"
              id="hireDate"
              type="date"
              value={employeeForm.hireDate}
              onChange={handleChange}
            />
            <FormField
              label="Status"
              id="status"
              type="select"
              value={employeeForm.status}
              onChange={handleChange}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]}
            />
          </div>
        )}

        {activeTab === 'emergency' && (
          <div className="space-y-4">
            <Text variant="body" className="text-gray-600">
              Emergency contact information will be available in future updates.
            </Text>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Text variant="small" className="text-gray-500">Coming soon: Emergency contact management</Text>
            </div>
          </div>
        )}
      </form>
    </Modal>
  )
}

export default EmployeeForm