import { motion } from 'framer-motion'
import Avatar from '@/components/atoms/Avatar'
import Text from '@/components/atoms/Text'
import Card from '@/components/atoms/Card'

const EmployeeTable = ({ employees, loading, onEdit }) => {
  return (
    <Card className="overflow-hidden p-0" animate={false}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                  <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-16"></div></td>
                  <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-20"></div></td>
                </tr>
              ))
            ) : (
              employees?.map((employee) => (
                <motion.tr
                  key={employee?.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        initials={`${employee?.firstName?.[0] || ''}${employee?.lastName?.[0] || ''}`}
                        size="medium"
                      />
                      <div>
                        <Text variant="p" className="font-medium text-gray-900">
                          {employee?.firstName} {employee?.lastName}
                        </Text>
                        <Text variant="small" className="text-gray-500">{employee?.email}</Text>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Text variant="body" className="!text-gray-900">{employee?.position}</Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text variant="body" className="!text-gray-900">{employee?.department}</Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text variant="body" className="!text-gray-900">{employee?.location}</Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text variant="status" className={`
                      ${employee?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    `}>
                      {employee?.status}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onEdit(employee)}
                      className="text-primary hover:text-primary-dark font-medium text-sm"
                    >
                      Edit
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default EmployeeTable