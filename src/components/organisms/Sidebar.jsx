import { motion } from 'framer-motion'
import Icon from '@/components/atoms/Icon'
import Avatar from '@/components/atoms/Avatar'
import Text from '@/components/atoms/Text'
import SidebarItem from '@/components/molecules/SidebarItem'

const Sidebar = ({ sidebarItems, activeSection, setActiveSection }) => {
  return (
    <motion.div
      initial={{ x: -240 }}
      animate={{ x: 0 }}
      className="w-60 bg-white shadow-soft border-r border-gray-200 flex flex-col fixed h-screen z-20 lg:relative lg:z-0"
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Avatar size="medium" iconName="Users" className="bg-gradient-to-br from-primary to-primary-dark" iconClass="text-white w-6 h-6" />
          <div>
            <Text variant="h3" className="!text-xl font-bold">TalentFlow</Text>
            <Text variant="small">HR Management</Text>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            active={activeSection}
            onClick={setActiveSection}
          />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3 px-4 py-3">
          <Avatar size="small" iconName="User" />
          <div className="flex-1 min-w-0">
            <Text variant="p" className="text-sm font-medium text-gray-900 truncate">HR Admin</Text>
            <Text variant="small">Administrator</Text>
          </div>
          <Icon name="Settings" className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
      </div>
    </motion.div>
  )
}

export default Sidebar