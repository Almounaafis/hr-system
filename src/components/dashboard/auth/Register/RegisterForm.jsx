import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormInput } from '@/shared/forms/FormInput';
import { PasswordInput } from '@/shared/forms/PasswordInput';
import { LoadingButton } from '@/shared/forms/LoadingButton';
import { Upload } from 'lucide-react';
import { COPANYTYPE } from '@/lib/constants';
import { TagInput } from '@/components/shared/TagInput';

export function RegisterForm({ onSubmit, loading, prefillData }) {
  const [branches, setBranches] = useState([]);
  const [logoFile, setLogoFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      name: prefillData?.name || '',
      email: prefillData?.email || '',
      password: '',
      company_name: '',
      company_type: '',
      job_title: '',
      branches: [],
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      branches: branches,
      logo: logoFile,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input type="hidden" {...register('branches')} />
      <FormInput
        name="name"
        label="الاسم"
        type="text"
        placeholder="ادخل اسمك"
        className="px-4 h-12 rounded-xl"
        error={errors.name?.message}
        register={register}
        rules={{
          required: 'الاسم مطلوب',
        }}
      />

      <FormInput
        name="job_title"
        label="المسمى الوظيفي"
        type="text"
        placeholder="ادخل المسمى الوظيفي"
        className="px-4 h-12 rounded-xl"
        error={errors.job_title?.message}
        register={register}
        rules={{
          required: 'المسمى الوظيفي مطلوب',
        }}
      />



      <FormInput
        name="company_name"
        label="اسم الشركة"
        type="text"
        placeholder="ادخل اسم الشركة"
        className="px-4 h-12 rounded-xl"
        error={errors.company_name?.message}
        register={register}
        rules={{
          required: 'اسم الشركة مطلوب',
        }}
      />

      <FormInput
        name="company_type"
        label="نوع الشركة"
        type="select"
        placeholder="ادخل نوع الشركة"
        className="px-4 h-12 rounded-xl"
        error={errors.company_type?.message}
        register={register}
        options={COPANYTYPE}
        rules={{
          required: 'نوع الشركة مطلوب',
        }}
      />
      <TagInput 
        tags={branches}
        setTags={setBranches}
        inputPlaceholder="ادخل اسم الفرع"
        label="الفروع"
      />
      <div className="">
        <label className="block text-sm font-medium mb-2">شعار الشركة</label>
        <div className="relative">
          <Upload className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setLogoFile(file);
              }
            }}
            className="px-4 w-full pl-12 h-12 pt-[12px] border border-input focus:border-primary focus:ring-primary rounded-xl file:ml-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 text-muted-foreground cursor-pointer"
          />
        </div>
      </div>


      <FormInput
        name="email"
        label="البريد الالكتروني"
        type="email"
        placeholder="ادخل بريدك الالكتروني"
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


      <PasswordInput
        name="password"
        label="كلمة المرور"
        placeholder="ادخل كلمة المرور"
        className="px-4 h-12 rounded-xl"
        error={errors.password?.message}
        register={register}
        rules={{
          required: 'كلمة المرور مطلوبة',
          minLength: { value: 6, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        }}
      />

      <LoadingButton
        type="submit"
        className="w-full h-12 rounded-xl font-medium md:col-span-2"
        loading={loading}
        loadingText="جاري التسجيل..."
      >
        تسجيل
      </LoadingButton>
    </form>
  );
}
