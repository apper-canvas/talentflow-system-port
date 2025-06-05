import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'

const HeaderInfo = ({ activeSection, sidebarItems }) => {
  const getSectionTitle = () => {
    switch (activeSection) {
      case 'leave':
        return 'Leave Requests'
      default:
        return activeSection.charAt(0).toUpperCase() + activeSection.slice(1)
    }
  }

  const getSectionDescription = () => {
    switch (activeSection) {
      case 'dashboard':
        return "Welcome back! Here's what's happening with your team."
      case 'employees':
        return 'Manage your workforce and employee information.'
      case 'leave':
        return 'Review and manage employee leave requests.'
      default:
        return 'This feature is coming soon.'
    }
  }

  return (
    <div>
      <Text variant="h2" className="capitalize">
        {getSectionTitle()}
      </Text>
      <Text className="mt-1">
        {getSectionDescription()}
      </Text>
    </div>
  )
}

export default HeaderInfo