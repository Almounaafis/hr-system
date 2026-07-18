import { Switch } from "./Switch";

export function ToggleRow({ label, checked, onCheckedChange }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
      <span className="text-[12px] md:text-xl text-foreground">{label}</span>
    </div>
  );
}
