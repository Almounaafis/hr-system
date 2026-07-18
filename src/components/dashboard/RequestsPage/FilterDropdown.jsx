import { FormField, FormControl } from "@/components/ui/form-field";

export function FilterDropdown({ label, value, options, onChange }) {
  return (
    <FormField name={`filter-${label}`} className="relative">
      <FormControl
        type="select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={[
          { value: "all", label: label },
          ...options
        ]}
        className="h-10 text-sm"
      />
    </FormField>
  );
}
