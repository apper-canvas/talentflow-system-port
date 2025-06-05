const Text = ({ children, className = '', variant = 'body', ...props }) => {
  const baseClasses = 'text-gray-900'

  const variantClasses = {
    h1: 'text-xl font-bold',
    h2: 'text-2xl font-bold',
    h3: 'text-lg font-semibold',
    h4: 'text-base font-semibold',
    body: 'text-sm text-gray-600',
    small: 'text-xs text-gray-500',
    status: 'inline-flex px-2 py-1 text-xs font-medium rounded-full',
    link: 'text-primary hover:text-primary-dark font-medium text-sm'
  }

  const Tag = variant.startsWith('h') ? variant : 'p'

  return (
    <Tag className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </Tag>
  )
}

export default Text