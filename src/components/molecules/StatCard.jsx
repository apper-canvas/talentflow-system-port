import { motion } from 'framer-motion'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'

const StatCard = ({ title, value, icon, color, trend, description, index, loading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-card p-6 hover:shadow-soft transition-shadow duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Text variant="p" className="text-sm font-medium text-gray-600">
            {title}
          </Text>
          <div className="flex items-baseline space-x-2 mt-2">
            <Text variant="h1">{loading ? '...' : value}</Text>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              {trend}
            </span>
          </div>
          <Text variant="small" className="mt-1">
            {description}
          </Text>
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon name={icon} className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard