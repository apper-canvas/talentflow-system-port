import { motion } from 'framer-motion'
import Avatar from '@/components/atoms/Avatar'
import Text from '@/components/atoms/Text'

const EmployeeCard = ({ employee, onClick }) => {
  const initials = `${employee?.firstName?.[0] || ''}${employee?.lastName?.[0] || ''}`

  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
      onClick={() => onClick(employee)}
    >
      <Avatar initials={initials} size="medium" />
      <div className="flex-1 min-w-0">
        <Text variant="p" className="font-medium text-gray-900 truncate">
          {employee?.firstName} {employee?.lastName}
        </Text>
        <Text variant="small" className="text-gray-500 truncate">{employee?.position}</Text>
      </div>
      <div className="text-right">
        <Text variant="status" className={`
          ${employee?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
        `}>
          {employee?.status}
        </Text>
      </div>
    </motion.div>
  )
}

export default EmployeeCard