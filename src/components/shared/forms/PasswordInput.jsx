import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FormField, FormLabel, FormControl, FormMessage } from '@/components/ui/form-field';

export function PasswordInput({
  label,
  name,
  error,
  register,
  rules,
  touched,
  className,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField name={name} error={error} touched={touched}>
      <FormLabel>{label}</FormLabel>
      <div className="relative">
        <FormControl
          type={showPassword ? 'text' : 'password'}
          className={`${className} pe-12`}
          {...register(name, rules)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <FormMessage />
    </FormField>
  );
}
