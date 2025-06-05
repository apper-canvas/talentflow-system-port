import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'

const ComingSoonCard = ({ featureName, eta }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-card p-12 text-center"
    >
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="Zap" className="w-12 h-12 text-gray-400" />
      </div>
      <Text variant="h3" className="mb-2">Coming Soon</Text>
      <Text className="mb-6">
        This feature is currently under development and will be available soon.
      </Text>
      <div className="inline-flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-xl">
        <Icon name="Clock" className="w-4 h-4" />
        <Text variant="body" className="!text-white font-medium">
          {eta}
        </Text>
      </div>
    </motion.div>
  )
}

export default ComingSoonCard