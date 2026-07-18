import { FormField, FormControl } from "@/components/ui/form-field";

export function StatBox({ value, onChange, label, unit }) {
  return (
    <div className="rounded-xl bg-[#EEF7F8] border border-[#CBE5E9] p-2 md:p-4 text-center">
      <p className="md:text-xl text-foreground mt-1">{label}</p>
      <FormField name={label} className="my-4">
        <FormControl
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="bg-background text-center md:font-bold"
        />
      </FormField>
      <p className="md:text-base text-muted-foreground">{unit}</p>
    </div>
  );
}
