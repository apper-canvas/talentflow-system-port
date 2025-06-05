import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Label from '@/components/atoms/Label'

const FormField = ({ type = 'text', label, id, value, onChange, options, ...props }) => {
  if (type === 'select') {
    return (
      <Select
        label={label}
        id={id}
        value={value}
        onChange={onChange}
        options={options}
        {...props}
      />
    )
  }

  return (
    <Input
      label={label}
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      {...props}
    />
  )
}

export default FormField