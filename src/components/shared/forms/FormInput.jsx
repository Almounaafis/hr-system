import { FormField, FormLabel, FormControl, FormMessage } from '@/components/ui/form-field';

export function FormInput({
  label,
  name,
  error,
  register,
  rules,
  touched,
  className,
  value,
  onChange,
  ...props
}) {
  // Support react-hook-form (register) AND keep `value` for controlled
  // inputs like Select, where the trigger needs an explicit value to
  // render the current/default selection.
  const controlProps = register
    ? { ...register(name, rules), value }
    : { value, onChange };

  return (
    <FormField name={name} error={error} touched={touched}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl
        {...controlProps}
        className={className}
        {...props}
      />
      <FormMessage />
    </FormField>
  );
}

export default FormInput;