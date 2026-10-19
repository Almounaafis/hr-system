// @/features/companies/CompanyFormFields.jsx
import { useRef, useState } from "react";
import { X, Plus, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, FormLabel } from "@/components/ui/form-field";
import FormInput from "@/components/shared/forms/FormInput";
import { TIMEZONE_OPTIONS, COMPANY_TYPE_SUGGESTIONS } from "./constants";

/**
 * Dynamic string-array input (chips + inline "add" field).
 * Used for both branches and departments.
 */
export function TagListField({ label, value = [], onChange, placeholder }) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    if (!value.includes(v)) onChange([...value, v]);
    setDraft("");
  };

  const remove = (index) => onChange(value.filter((_, i) => i !== index));

  return (
    <div>
      <p className="text-sm font-medium text-foreground mb-2">{label}</p>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs"
            >
              {tag}
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          className="flex-1 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <Button type="button" variant="outline" onClick={add} className="shrink-0 gap-1">
          <Plus className="h-3.5 w-3.5" />
          إضافة
        </Button>
      </div>
    </div>
  );
}

/**
 * Image file picker with preview. Value is a File | null.
 * `existingUrl` shows the current server file as a fallback preview.
 */
export function ImagePickerField({
  label,
  value,
  onChange,
  existingUrl,
  accept = "image/*",
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(existingUrl || null);

  const handlePick = () => inputRef.current?.click();

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(file);
    setPreview(URL.createObjectURL(file));
  };

  const clear = () => {
    onChange(null);
    setPreview(existingUrl || null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <p className="text-sm font-medium text-foreground mb-2">{label}</p>

      <div className="flex items-center gap-3">
        <div className="h-16 w-16 rounded-lg border border-border bg-muted overflow-hidden flex items-center justify-center shrink-0">
          {preview ? (
            <img src={preview} alt="preview" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handlePick} className="gap-1.5">
              <Upload className="h-3.5 w-3.5" />
              {value ? "تغيير" : "اختيار"}
            </Button>
            {value && (
              <Button type="button" variant="ghost" size="sm" onClick={clear} className="text-muted-foreground">
                إزالة
              </Button>
            )}
          </div>
          {value && (
            <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">
              {value.name}
            </p>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

/**
 * Thin wrappers around the existing FormInput component for consistency.
 */
export function TextField({ name, label, register, rules, error, placeholder, type = "text" }) {
  return (
    <FormInput
      name={name}
      type={type}
      label={label}
      register={register}
      rules={rules}
      error={error}
      touched={!!error}
      placeholder={placeholder}
      className="text-sm"
    />
  );
}

export function SelectField({ name, label, register, rules, error, options, disabled }) {
  return (
    <FormInput
      name={name}
      type="select"
      label={label}
      register={register}
      rules={rules}
      error={error}
      touched={!!error}
      options={options}
      disabled={disabled}
      className="text-sm"
    />
  );
}