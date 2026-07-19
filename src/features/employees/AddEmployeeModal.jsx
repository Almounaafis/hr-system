import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Users, Briefcase, Paperclip, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { DatePicker } from "@/components/shared/forms/DatePicker";
import { employmentTypes } from "./mockData";
import { LoadingButton } from "@/components/shared/forms/LoadingButton";
import FormInput from "@/components/shared/forms/FormInput";

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return "";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

export function AddEmployeeModal({
  open,
  onOpenChange,
  editingEmployee,
  onConfirm,
  onCancel,
  departmentsList = [],
  branchesList = [],
  loading = false,
}) {
  const [documents, setDocuments] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      nationalId: '',
      jobTitle: '',
      department: '',
      branch: '',
      directManager: '',
      employmentType: '',
      dateOfAppointment: '',
      salary: '',
    },
  });

  // Reset form when editingEmployee changes
  useEffect(() => {
    if (editingEmployee) {
      setValue('name', editingEmployee.name || '');
      setValue('email', editingEmployee.email || '');
      setValue('phone', editingEmployee.phone || '');
      setValue('address', editingEmployee.address || '');
setValue('jobTitle', editingEmployee.jobTitle || '');
setValue('employmentType', editingEmployee.employmentType || editingEmployee.employment_type || '');
      setValue('department', editingEmployee.department || '');
      setValue('branch', editingEmployee.branch || '');
      setValue('nationalId', editingEmployee.national_id || editingEmployee.nationalId || '');
      setValue('directManager', editingEmployee.direct_manager || editingEmployee.directManager || '');
      setValue('salary', editingEmployee.salary || '');
     if (editingEmployee.hire_date || editingEmployee.dateOfAppointment) {
  const d = new Date(editingEmployee.hire_date || editingEmployee.dateOfAppointment);
  if (!isNaN(d)) setValue('dateOfAppointment', d.toISOString().split('T')[0]); // ← string
}
      if (editingEmployee.birth_date || editingEmployee.dateOfBirth) {
        const d = new Date(editingEmployee.birth_date || editingEmployee.dateOfBirth);
        if (!isNaN(d)) setValue('dateOfBirth', d.toISOString().split('T')[0]);
      }

      // Load existing documents
      if (editingEmployee.documents && editingEmployee.documents.length > 0) {
        const existingDocs = editingEmployee.documents.map((doc) => ({
          id: doc.id,
          name: doc.file_name,
          size: doc.file_size,
          existing: true,
          url: doc.file_url,
        }));
        setDocuments(existingDocs);
      }
    } else {
      reset();
      setDocuments([]);
    }
  }, [editingEmployee, setValue, reset]);

  const watchDateOfBirth = watch('dateOfBirth');
  const watchDateOfAppointment = watch('dateOfAppointment');
  const watchDepartment = watch('department');
  const watchBranch = watch('branch');
  const watchEmploymentType = watch('employmentType');

  const handleDocumentsUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newDocs = files.map((file) => ({
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      size: file.size,
      file,
    }));

    setDocuments([...documents, ...newDocs]);
    e.target.value = "";
  };

  const handleRemoveDocument = (id) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

 const handleFormSubmit = (data) => {
  const formData = {
    ...data,
    job_title: data.jobTitle,
    employment_type: data.employmentType,
    national_id: data.nationalId,
    direct_manager: data.directManager,
    documents,
  };
  onConfirm(formData);
};

  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="left">
      <SheetContent className="!max-w-[590px] gap-2 overflow-y-auto">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <SheetTitle className="text-xl font-bold text-gray-900">
  {editingEmployee ? "تعديل موظف" : "اضافة موظف"}
</SheetTitle>
          {/* Personal Details Section */}
          <div className="mb-3 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">التفاصيل الشخصية</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <FormInput
                name="name"
                label="الاسم"
                type="text"
                placeholder="ادخل الاسم كامل"
                className="px-4 h-12 rounded-xl"
                error={errors.name?.message}
                register={register}
                rules={{ required: 'الاسم مطلوب' }}
              />
              <FormInput
                name="email"
                label="البريد الإلكتروني"
                type="email"
                placeholder="ادخل البريد الإلكتروني"
                className="px-4 h-12 rounded-xl"
                error={errors.email?.message}
                register={register}
                rules={{
                  required: 'البريد الإلكتروني مطلوب',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'البريد الإلكتروني غير صالح',
                  },
                }}
              />
              <FormInput
                name="phone"
                label="رقم الهاتف"
                type="text"
                placeholder="ادخل رقم الهاتف"
                className="px-4 h-12 rounded-xl"
                error={errors.phone?.message}
                register={register}
                rules={{ required: 'رقم الهاتف مطلوب' }}
              />
              <FormInput
                name="address"
                label="العنوان"
                type="text"
                placeholder="ادخل العنوان"
                className="px-4 h-12 rounded-xl"
                error={errors.address?.message}
                register={register}
              />
              <DatePicker
                name="dateOfBirth"
                label="تاريخ الميلاد"
                placeholder="اختر تاريخ الميلاد"
                register={register}
                value={watchDateOfBirth}
                onChange={(date) => setValue('dateOfBirth', date, { shouldValidate: true })}
              />
              <FormInput
                name="nationalId"
                label="الرقم القومي"
                type="text"
                placeholder="ادخل الرقم القومي"
                className="px-4 h-12 rounded-xl"
                error={errors.nationalId?.message}
                register={register}
              />
            </div>
          </div>

          {/* Job Details Section */}
          <div className="my-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Briefcase className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">التفاصيل الوظيفية</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <FormInput
  name="jobTitle"
  label="المسمى الوظيفي"
  type="text"
  placeholder="ادخل المسمى الوظيفي"
  className="px-4 h-12 rounded-xl"
  error={errors.jobTitle?.message}
  register={register}
/>
              <FormInput
                name="department"
                label="القسم"
                type="select"
                placeholder="اختر القسم"
                className="px-4 h-12 rounded-xl"
                error={errors.department?.message}
                register={register}
                value={watchDepartment}
                options={departmentsList.filter((d) => d !== "الكل").map((dept) => ({ value: dept, label: dept }))}
                rules={{ required: 'القسم مطلوب' }}
              />
              <FormInput
                name="branch"
                label="الفرع"
                type="select"
                placeholder="اختر الفرع"
                className="px-4 h-12 rounded-xl"
                error={errors.branch?.message}
                register={register}
                value={watchBranch}
                options={branchesList.map((branch) => ({
                  value: branch,
                  label: branch
                }))}
                rules={{ required: 'الفرع مطلوب' }}
              />
              <FormInput
                name="directManager"
                label="المدير المباشر"
                type="text"
                placeholder="ادخل المدير المباشر"
                className="px-4 h-12 rounded-xl"
                error={errors.directManager?.message}
                register={register}
              />
              <FormInput
                name="employmentType"
                label="نوع التوظيف"
                type="select"
                placeholder="اختر نوع التوظيف"
                className="px-4 h-12 rounded-xl"
                error={errors.employmentType?.message}
                register={register}
                value={watchEmploymentType}
                options={employmentTypes.map((type) => ({
                  value: type,
                  label: type === 'full_time' ? 'دوام كامل' :
                         type === 'part_time' ? 'دوام جزئي' :
                         type === 'contract' ? 'عقد' :
                         type === 'freelance' ? 'متعاقد' : type
                }))}
                rules={{ required: 'نوع التوظيف مطلوب' }}
              />
              <FormInput
                name="salary"
                label="الراتب"
                type="text"
                placeholder="ادخل الراتب"
                className="px-4 h-12 rounded-xl"
                error={errors.salary?.message}
                register={register}
              />
              <DatePicker
                name="dateOfAppointment"
                label="تاريخ التعيين"
                placeholder="اختر تاريخ التعيين"
                register={register}
                rules={{ required: 'تاريخ التعيين مطلوب' }}
                value={watchDateOfAppointment}
                onChange={(date) => setValue('dateOfAppointment', date, { shouldValidate: true })}
              />
            </div>
          </div>

          {/* Documents & Attachments Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-gray-700" />
              <h3 className="text-xl font-semibold text-gray-900">المستندات والمرفقات</h3>
            </div>

            <div className="flex items-center justify-between gap-3 mb-4 bg-[#EDF8FC] p-4 rounded-lg">

              <input
                type="file"
                multiple
                onChange={handleDocumentsUpload}
                className="hidden"
                id="documents-upload"
              />
              <label
                htmlFor="documents-upload"
                className="inline-flex shrink-0 items-center gap-2 px-4 py-2 text-lg font-medium rounded-lg cursor-pointer bg-[#CBE5E9] border border-[#56ACB9] text-[#3D7A83] hover:bg-[#EDF8FC]/70 transition-colors"
              >
                <Paperclip className="h-5 w-5" />
                ارفاق ملفات..
              </label>
              <p className="text-sm text-[#3D7A83]">
                ارفع المستندات المطلوبة أو أي ملفات إضافية خاصة بالموظف.
              </p>
            </div>

            {documents.length > 0 && (
              <div className="flex flex-col gap-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-[#CBE5E9] bg-background p-3"
                  >

                    <div className="flex flex-1 items-center gap-3 min-w-0">
                      <div className="shrink-0 bg-[#EEF7F8] p-2 rounded-sm">
                        <FileText className="h-8 w-8 text-[#3D7A83]" />
                      </div>
                      <div className="min-w-0 text-right">
                        <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(doc.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 ">
            <LoadingButton
              type="submit"
              className="flex-1 h-12 text-base gap-2 bg-[#4E9DA8] text-white hover:bg-[#4E9DA8]/80"
              loading={loading}
              loadingText="جاري الحفظ..."
            >
              تأكيد
            </LoadingButton>
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 text-base gap-2 border-gray-300 hover:bg-gray-50"
              onClick={onCancel}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}