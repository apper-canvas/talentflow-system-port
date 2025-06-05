import { motion, AnimatePresence } from 'framer-motion'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'

const Modal = ({ isOpen, onClose, title, children, footerContent, className = '' }) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={`bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <Text variant="h3">{title}</Text>
                <Button onClick={onClose} variant="ghost" className="p-2">
                  <Icon name="X" className="w-5 h-5 text-gray-500" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {children}
            </div>

            {footerContent && (
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 px-6 py-4">
                {footerContent}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal