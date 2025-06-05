import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { employeeService } from '../services'
import { leaveRequestService } from '../services'
import { departmentService } from '../services'

const Home = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeLeaves: 0,
    pendingRequests: 0,
    totalDepartments: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeSection, setActiveSection] = useState('dashboard')

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
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
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3', active: true },
    { id: 'employees', label: 'Employees', icon: 'Users', active: true },
    { id: 'leave', label: 'Leave Requests', icon: 'Calendar', active: true },
    { id: 'organization', label: 'Organization', icon: 'GitBranch', comingSoon: 'Q2 2024' },
    { id: 'documents', label: 'Documents', icon: 'FolderOpen', comingSoon: 'Launching Soon' },
    { id: 'attendance', label: 'Time & Attendance', icon: 'Clock', comingSoon: 'In Development' },
    { id: 'performance', label: 'Performance', icon: 'Star', comingSoon: 'Coming Soon' },
    { id: 'reports', label: 'Reports', icon: 'TrendingUp', comingSoon: 'Under Construction' }
  ]

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -240 }}
        animate={{ x: 0 }}
        className="w-60 bg-white shadow-soft border-r border-gray-200 flex flex-col fixed h-screen z-20 lg:relative lg:z-0"
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
              <ApperIcon name="Users" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">TalentFlow</h1>
              <p className="text-xs text-gray-500">HR Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                activeSection === item.id && item.active
                  ? 'bg-primary text-white shadow-card'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              } ${!item.active ? 'opacity-60' : ''}`}
              disabled={!item.active}
            >
              <ApperIcon name={item.icon} className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
              {item.comingSoon && (
                <span className="ml-auto text-xs bg-accent text-white px-2 py-1 rounded-full">
                  Soon
                </span>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 px-4 py-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">HR Admin</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <ApperIcon name="Settings" className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 ml-60">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 capitalize">
                  {activeSection === 'leave' ? 'Leave Requests' : activeSection}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {activeSection === 'dashboard' && 'Welcome back! Here's what's happening with your team.'}
                  {activeSection === 'employees' && 'Manage your workforce and employee information.'}
                  {activeSection === 'leave' && 'Review and manage employee leave requests.'}
                  {!['dashboard', 'employees', 'leave'].includes(activeSection) && 'This feature is coming soon.'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <ApperIcon name="Bell" className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
                </div>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {activeSection === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-card p-6 hover:shadow-soft transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <div className="flex items-baseline space-x-2 mt-2">
                          <p className="text-3xl font-bold text-gray-900">{loading ? '...' : stat.value}</p>
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            {stat.trend}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                        <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Main Feature */}
              <MainFeature />
            </motion.div>
          )}

          {activeSection === 'employees' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-card p-6"
            >
              <MainFeature section="employees" />
            </motion.div>
          )}

          {activeSection === 'leave' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-card p-6"
            >
              <MainFeature section="leave" />
            </motion.div>
          )}

          {!['dashboard', 'employees', 'leave'].includes(activeSection) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-card p-12 text-center"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ApperIcon name="Zap" className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600 mb-6">
                This feature is currently under development and will be available soon.
              </p>
              <div className="inline-flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-xl">
                <ApperIcon name="Clock" className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {sidebarItems.find(item => item.id === activeSection)?.comingSoon}
                </span>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Home