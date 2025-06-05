import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Icon from '@/components/atoms/Icon'
import Avatar from '@/components/atoms/Avatar'
import Sidebar from '@/components/organisms/Sidebar'
import DashboardOverview from '@/components/organisms/DashboardOverview'
import EmployeeDirectory from '@/components/organisms/EmployeeDirectory'
import LeaveRequestList from '@/components/organisms/LeaveRequestList'
import AttendanceCalendar from '@/components/organisms/AttendanceCalendar'
import ComingSoonCard from '@/components/molecules/ComingSoonCard'
import { employeeService, leaveRequestService, departmentService } from '@/services'

const HomePage = () => {
  const [activeView, setActiveView] = useState('dashboard')
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeLeaves: 0,
    pendingRequests: 0,
    totalDepartments: 0
  })
  const [loadingStats, setLoadingStats] = useState(true)
  const [error, setError] = useState(null)
  const [activeSection, setActiveSection] = useState('dashboard')

  useEffect(() => {
    const loadStats = async () => {
      setLoadingStats(true)
      try {
        const [employees, leaveRequests, departments] = await Promise.all([
          employeeService.getAll(),
          leaveRequestService.getAll(),
          departmentService.getAll()
        ])

        const activeLeaves = leaveRequests?.filter(request =>
          request?.status === 'approved' &&
          new Date(request?.endDate) >= new Date()
        )?.length || 0

        const pendingRequests = leaveRequests?.filter(request =>
          request?.status === 'pending'
        )?.length || 0

        setStats({
          totalEmployees: employees?.length || 0,
          activeLeaves,
          pendingRequests,
          totalDepartments: departments?.length || 0
        })
      } catch (err) {
        setError(err?.message || 'Failed to load data')
        toast.error(err?.message || 'Failed to load dashboard stats')
      } finally {
        setLoadingStats(false)
      }
    }
    loadStats()
  }, [])

const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3', active: true },
    { id: 'employees', label: 'Employees', icon: 'Users', active: true },
    { id: 'leave', label: 'Leave Requests', icon: 'Calendar', active: true },
    { id: 'attendance', label: 'Time & Attendance', icon: 'Clock', active: true },
    { id: 'organization', label: 'Organization', icon: 'GitBranch', comingSoon: 'Q2 2024' },
    { id: 'documents', label: 'Documents', icon: 'FolderOpen', comingSoon: 'Launching Soon' },
    { id: 'performance', label: 'Performance', icon: 'Star', comingSoon: 'Coming Soon' },
    { id: 'reports', label: 'Reports', icon: 'TrendingUp', comingSoon: 'Under Construction' }
  ]

  const currentComingSoonEta = sidebarItems.find(item => item.id === activeSection)?.comingSoon

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        sidebarItems={sidebarItems}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 ml-60">
        {/* Header */}
<header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-800">
                  {sidebarItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Icon name="Bell" className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
                </div>
                <Avatar size="small" iconName="User" className="bg-primary" iconClass="text-white w-5 h-5" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {activeSection === 'dashboard' && (
            <DashboardOverview
              stats={stats}
              loadingStats={loadingStats}
              setStats={setStats}
            />
          )}

          {activeSection === 'employees' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-card p-6"
            >
              <EmployeeDirectory />
            </motion.div>
          )}

          {activeSection === 'leave' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-card p-6"
            >
              <LeaveRequestList setDashboardStats={setStats} />
            </motion.div>
          )}

          {activeSection === 'attendance' && (
            <ComingSoonCard eta="Feature in Development - Calendar Widget & Time Tracking Interface Coming Soon!" />
          )}

          {!['dashboard', 'employees', 'leave', 'attendance'].includes(activeSection) && (
            <ComingSoonCard eta={currentComingSoonEta} />
          )}
</main>
      </div>
    </div>
  )
}

export default HomePage