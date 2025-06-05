import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'

const TabBar = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
      <div className="flex space-x-6 px-6">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 py-3 border-b-2 transition-colors duration-200 ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            variant="text"
            size="sm"
          >
            <Icon name={tab.icon} className="w-4 h-4" />
            <Text variant="body" className="font-medium !text-inherit !text-sm">{tab.label}</Text>
          </Button>
        ))}
      </div>
    </div>
  )
}

export default TabBar