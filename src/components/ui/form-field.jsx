import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const FormFieldContext = React.createContext({
  name: "",
  error: null,
  touched: false,
})

const FormField = React.forwardRef(({ className, name, error, touched, children, ...props }, ref) => {
  return (
    <FormFieldContext.Provider value={{ name, error, touched }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    </FormFieldContext.Provider>
  )
})
FormField.displayName = "FormField"

const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  const { name } = React.useContext(FormFieldContext)
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium inline-block leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        // error && "text-destructive",
        className
      )}
      htmlFor={name}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef(({ type = "text", options, className, ...props }, ref) => {
  const { name, error, touched } = React.useContext(FormFieldContext)

  const inputClassName = cn(
    "w-full",
    error && touched && "border-destructive focus:border-destructive focus:ring-destructive",
    className
  )

  const selectContent = React.useMemo(() => {
    if (type === "select" && options) {
      return (
        <SelectContent>
          {options.map((option) => {
            const value = typeof option === 'string' ? option : option.value;
            const label = typeof option === 'string' ? option : option.label;
            return (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            );
          })}
        </SelectContent>
      )
    }
    return null
  }, [type, options])

  if (type === "select" && options) {
    const { onChange, onBlur, ref: registerRef, ...restProps } = props
    return (
      <Select
        {...restProps}
        onValueChange={(value) => {
          onChange({ target: { value, name } })
        }}
        onOpenChange={(open) => {
          // react-hook-form's onBlur (from register) reads event.target,
          // so it must be called with a synthetic event, never bare.
          if (!open && onBlur) onBlur({ target: { name, value: props.value } })
        }}
      >
        <SelectTrigger type="button" className={inputClassName} ref={registerRef}>
  <SelectValue placeholder={props.placeholder} />
</SelectTrigger>
        {selectContent}
      </Select>
    )
  }
  
  if (type === "textarea") {
    return (
      <Textarea
        id={name}
        name={name}
        className={inputClassName}
        ref={ref}
        {...props}
      />
    )
  }
  
  return (
    <Input
      id={name}
      name={name}
      type={type}
      className={inputClassName}
      ref={ref}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormMessage = React.forwardRef(({ className, ...props }, ref) => {
  const { error } = React.useContext(FormFieldContext);
  if (!error) return null;

  return (
    <p ref={ref} className={cn("text-sm font-medium text-destructive", className)} {...props}>
      {error}
    </p>
  );
});
FormMessage.displayName = "FormMessage"

const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

export {
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
}