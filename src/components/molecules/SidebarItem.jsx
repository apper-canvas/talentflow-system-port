import { motion } from 'framer-motion'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'

const SidebarItem = ({ item, active, onClick }) => {
  const isActive = active === item.id && item.active
  const variant = isActive ? 'sidebar-active' : 'sidebar-inactive'
  const iconClass = isActive ? 'text-white' : ''

  return (
    <Button
      key={item.id}
      onClick={() => onClick(item.id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 text-left`}
      disabled={!item.active}
      variant={variant}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon name={item.icon} className={`w-5 h-5 ${iconClass}`} />
      <Text variant="body" className="font-medium !text-inherit !text-sm">
        {item.label}
      </Text>
      {item.comingSoon && (
        <span className="ml-auto text-xs bg-accent text-white px-2 py-1 rounded-full">
          Soon
        </span>
      )}
    </Button>
  )
}

export default SidebarItem