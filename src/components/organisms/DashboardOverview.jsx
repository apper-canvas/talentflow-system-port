import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import StatCard from '@/components/molecules/StatCard'
import EmployeeCard from '@/components/molecules/EmployeeCard'
import LeaveRequestCard from '@/components/molecules/LeaveRequestCard'
import EmployeeForm from '@/components/organisms/EmployeeForm'
import Icon from '@/components/atoms/Icon'
import { employeeService, leaveRequestService, departmentService } from '@/services'
const DashboardOverview = ({ stats, loadingStats, setStats }) => {
  const [employees, setEmployees] = useState([])
  const [leaveRequests, setLeaveRequests] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      try {
        const [employeesData, leaveRequestsData, departmentsData] = await Promise.all([
          employeeService.getAll(),
          leaveRequestService.getAll(),
          departmentService.getAll()
        ])
        setEmployees(employeesData || [])
        setLeaveRequests(leaveRequestsData || [])
        setDepartments(departmentsData || [])
      } catch (err) {
        toast.error(err?.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

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

        // Update main stats
        const activeLeaves = updatedRequests?.filter(request =>
          request?.status === 'approved' &&
          new Date(request?.endDate) >= new Date()
        )?.length || 0

        const pendingRequests = updatedRequests?.filter(request =>
          request?.status === 'pending'
        )?.length || 0

        setStats(prev => ({
          ...prev,
          activeLeaves,
          pendingRequests
        }))
      }
    } catch (err) {
      toast.error('Failed to update leave request')
    } finally {
      setLoading(false)
    }
  }

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

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: 'Users',
      color: 'bg-primary',
      trend: '+12%',
      description: 'Active workforce'
    },
    {
      title: 'On Leave Today',
      value: stats.activeLeaves,
      icon: 'Calendar',
      color: 'bg-secondary',
      trend: '3 new',
      description: 'Current absences'
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: 'Clock',
      color: 'bg-accent',
      trend: 'Review needed',
      description: 'Awaiting approval'
    },
    {
      title: 'Departments',
      value: stats.totalDepartments,
      icon: 'Building2',
      color: 'bg-purple-500',
      trend: '2 new roles',
      description: 'Active departments'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={stat.title} {...stat} index={index} loading={loadingStats} />
        ))}
      </div>

      {/* Recent Activity and Pending Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Employee Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Employees</h3>
            <Icon name="Users" className="w-5 h-5 text-gray-400" />
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
              employees?.slice(0, 5).map((employee) => (
                <EmployeeCard
                  key={employee?.id}
                  employee={employee}
                  onClick={() => openEmployeeModal(employee)}
                />
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
            <Icon name="Clock" className="w-5 h-5 text-accent" />
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
              leaveRequests?.filter(req => req?.status === 'pending').slice(0, 5).map((request) => {
                const employee = employees?.find(emp => emp?.id === request?.employeeId)
                return (
                  <LeaveRequestCard
                    key={request?.id}
                    request={request}
                    employee={employee}
                    onApprove={(id) => handleLeaveAction(id, 'approved')}
                    onReject={(id) => handleLeaveAction(id, 'rejected')}
                    loading={loading}
                  />
                )
              })
            )}
          </div>
        </motion.div>
      </div>
      <EmployeeForm
        isOpen={showEmployeeModal}
        onClose={handleEmployeeModalClose}
        selectedEmployee={selectedEmployee}
        employees={employees}
        departments={departments}
      />
    </motion.div>
  )
}

export default DashboardOverview