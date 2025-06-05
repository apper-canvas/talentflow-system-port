import Text from '@/components/atoms/Text'

const SectionHeader = ({ title, description, actions }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
      <div>
        <Text variant="h3">{title}</Text>
        <Text variant="body" className="text-gray-600 text-sm">{description}</Text>
      </div>
      {actions && <div className="flex space-x-3">{actions}</div>}
    </div>
  )
}

export default SectionHeader