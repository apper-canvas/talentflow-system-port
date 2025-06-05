import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import SectionHeader from '@/components/molecules/SectionHeader'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import LeaveRequestCard from '@/components/molecules/LeaveRequestCard'
import Card from '@/components/atoms/Card'
import { leaveRequestService, employeeService } from '@/services'

const LeaveRequestList = ({ setDashboardStats }) => {
  const [leaveRequests, setLeaveRequests] = useState([])
  const [filteredLeaveRequests, setFilteredLeaveRequests] = useState([])
  const [employees, setEmployees] = useState([])
  const [leaveSearchTerm, setLeaveSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadLeaveData = async () => {
      setLoading(true)
      try {
        const [leaveData, employeesData] = await Promise.all([
          leaveRequestService.getAll(),
          employeeService.getAll()
        ])
        setLeaveRequests(leaveData || [])
        setFilteredLeaveRequests(leaveData || [])
        setEmployees(employeesData || [])
      } catch (err) {
        toast.error(err?.message || 'Failed to load leave data')
      } finally {
        setLoading(false)
      }
    }
    loadLeaveData()
  }, [])

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

        // Update dashboard stats if the setDashboardStats prop is provided
        if (setDashboardStats) {
          const activeLeaves = updatedRequests?.filter(req =>
            req?.status === 'approved' &&
            new Date(req?.endDate) >= new Date()
          )?.length || 0

          const pendingRequests = updatedRequests?.filter(req =>
            req?.status === 'pending'
          )?.length || 0

          setDashboardStats(prev => ({
            ...prev,
            activeLeaves,
            pendingRequests
          }))
        }
      }
    } catch (err) {
      toast.error('Failed to update leave request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Leave Requests"
        description="Review and manage employee leave requests"
        actions={
          <div className="flex space-x-3">
            <Input
              type="text"
              placeholder="Search requests..."
              value={leaveSearchTerm}
              onChange={(e) => setLeaveSearchTerm(e.target.value)}
              iconName="Search"
            />
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' }
              ]}
              placeholder="All Status"
              className="pl-3" // Override default padding from Input for select
            />
          </div>
        }
      />

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

      {filteredLeaveRequests?.length === 0 && !loading && (
        <Card className="p-12 text-center" animate={false}>
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Calendar" className="w-12 h-12 text-gray-400" />
          </div>
          <Text variant="h3" className="mb-2">No leave requests found</Text>
          <Text variant="body">No leave requests match your current filters.</Text>
        </Card>
      )}
    </div>
  )
}

export default LeaveRequestList