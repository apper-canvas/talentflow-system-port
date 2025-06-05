import Button from '@/components/atoms/Button'
import FormField from './FormField'

const AttendanceForm = ({ 
  formData, 
  employees = [],
  isEditing = false,
  onSubmit, 
  onCancel,
  onChange,
  className = '',
  ...props 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.(e)
  }

  const handleFieldChange = (field, value) => {
    onChange?.({ ...formData, [field]: value })
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`} {...props}>
      <FormField
        label="Employee"
        type="select"
        value={formData.employeeId}
        onChange={(e) => handleFieldChange('employeeId', e.target.value)}
        options={[
          { value: '', label: 'Select employee...' },
          ...employees.map(emp => ({
            value: emp.id,
            label: `${emp.firstName} ${emp.lastName}`
          }))
        ]}
        required
      />

      <FormField
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) => handleFieldChange('date', e.target.value)}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Clock In"
          type="time"
          value={formData.clockIn}
          onChange={(e) => handleFieldChange('clockIn', e.target.value)}
        />

        <FormField
          label="Clock Out"
          type="time"
          value={formData.clockOut}
          onChange={(e) => handleFieldChange('clockOut', e.target.value)}
        />
      </div>

      <FormField
        label="Break Duration (minutes)"
        type="number"
        value={formData.breakDuration}
        onChange={(e) => handleFieldChange('breakDuration', e.target.value)}
        min="0"
        max="480"
      />

      <FormField
        label="Notes"
        type="textarea"
        value={formData.notes}
        onChange={(e) => handleFieldChange('notes', e.target.value)}
        placeholder="Optional notes about this attendance record..."
      />

      <div className="flex justify-end space-x-3">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update' : 'Create'} Record
        </Button>
      </div>
    </form>
  )
}

export default AttendanceForm