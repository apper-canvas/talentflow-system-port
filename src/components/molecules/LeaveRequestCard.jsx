import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Icon from '@/components/atoms/Icon'
import Avatar from '@/components/atoms/Avatar'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'

const LeaveRequestCard = ({ request, employee, onApprove, onReject, loading }) => {
  const initials = `${employee?.firstName?.[0] || ''}${employee?.lastName?.[0] || ''}`
  const statusVariant = {
    pending: 'status-pending',
    approved: 'status-approved',
    rejected: 'status-rejected'
  }[request?.status] || ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-card p-6 hover:shadow-soft transition-shadow duration-200"
    >
      <div className="flex items-center space-x-3 mb-4">
        <Avatar initials={initials} size="medium" />
        <div className="flex-1 min-w-0">
          <Text variant="p" className="font-medium text-gray-900 truncate">
            {employee?.firstName} {employee?.lastName}
          </Text>
          <Text variant="small" className="text-gray-500 truncate">{employee?.position}</Text>
        </div>
        <Text variant="status" className={statusVariant}>
          {request?.status}
        </Text>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" className="w-4 h-4 text-gray-400" />
          <Text variant="body">
            {format(new Date(request?.startDate || new Date()), 'MMM dd')} -{' '}
            {format(new Date(request?.endDate || new Date()), 'MMM dd, yyyy')}
          </Text>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Clock" className="w-4 h-4 text-gray-400" />
          <Text variant="body" className="capitalize">{request?.type} leave</Text>
        </div>
        {request?.reason && (
          <div className="flex items-start space-x-2">
            <Icon name="MessageSquare" className="w-4 h-4 text-gray-400 mt-0.5" />
            <Text variant="body" className="line-clamp-2">{request?.reason}</Text>
          </div>
        )}
      </div>

      {request?.status === 'pending' && (
        <div className="flex space-x-2 mt-4">
          <Button
            onClick={() => onApprove(request?.id)}
            variant="secondary"
            className="flex-1"
            iconName="Check"
            disabled={loading}
          >
            Approve
          </Button>
          <Button
            onClick={() => onReject(request?.id)}
            variant="danger"
            className="flex-1"
            iconName="X"
            disabled={loading}
          >
            Reject
          </Button>
        </div>
      )}

      {request?.status !== 'pending' && (
        <div className="mt-4 p-3 rounded-lg bg-gray-50">
          <div className="flex items-center space-x-2">
            <Icon
              name={request?.status === 'approved' ? 'CheckCircle' : 'XCircle'}
              className={`w-4 h-4 ${request?.status === 'approved' ? 'text-green-500' : 'text-red-500'}`}
            />
            <Text variant="body">
              {request?.status === 'approved' ? 'Approved' : 'Rejected'} by{' '}
              {request?.approvedBy || 'HR Admin'}
            </Text>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default LeaveRequestCard