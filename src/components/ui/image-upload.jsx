import * as React from "react"
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FormMessage } from "@/components/ui/form-field"

const ImageUpload = React.forwardRef(({ 
  className, 
  value, 
  onChange, 
  error, 
  touched,
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = "image/*",
  label = "رفع صورة",
  description = "اسحب الصورة هنا أو انقر للاختيار",
  ...props 
}, ref) => {
  const [preview, setPreview] = React.useState(null)
  const [dragActive, setDragActive] = React.useState(false)
  const inputRef = React.useRef(null)

  React.useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value)
      setPreview(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    } else if (typeof value === 'string') {
      setPreview(value)
    } else {
      setPreview(null)
    }
  }, [value])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0])
    }
  }

  const handleFiles = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح')
      return
    }

    // Validate file size
    if (file.size > maxSize) {
      alert(`حجم الصورة يجب أن يكون أقل من ${maxSize / 1024 / 1024}MB`)
      return
    }

    onChange(file)
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0])
    }
  }

  const handleRemove = () => {
    onChange(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className={cn("space-y-2", className)} ref={ref} {...props}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-all",
          dragActive ? "border-primary bg-primary/5" : "border-input hover:border-primary/50",
          error && touched ? "border-destructive" : "",
          preview ? "p-2" : "p-8"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                حذف
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleClick}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                تغيير
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center cursor-pointer min-h-[200px]"
            onClick={handleClick}
          >
            <div className={cn(
              "p-4 rounded-full mb-4 transition-colors",
              dragActive ? "bg-primary/10" : "bg-muted"
            )}>
              <ImageIcon className={cn(
                "h-8 w-8 transition-colors",
                dragActive ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">{description}</p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, GIF حتى {maxSize / 1024 / 1024}MB
            </p>
          </div>
        )}
        
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          {...props}
        />
      </div>
      
      {error && touched && (
        <FormMessage>{error}</FormMessage>
      )}
    </div>
  )
})

ImageUpload.displayName = "ImageUpload"

export { ImageUpload }
