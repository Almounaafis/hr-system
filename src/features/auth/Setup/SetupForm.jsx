import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormInput } from '@/components/shared/forms/FormInput';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import { Plus, X } from 'lucide-react';
import { TagInput } from '@/components/shared/TagInput';

export function SetupForm({ onSubmit, loading }) {
  const [departments, setDepartments] = useState([]);
  const [hrTeam, setHrTeam] = useState([{ email: '', branch: '' }]);

  const {
    handleSubmit,
  } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      departments: [],
      hrTeam: [{ email: '', branch: '' }],
    },
  });

  const addHrMember = () => {
    setHrTeam([...hrTeam, { email: '', branch: '' }]);
  };

  const removeHrMember = (index) => {
    setHrTeam(hrTeam.filter((_, i) => i !== index));
  };

  const updateHrMember = (index, field, value) => {
    const updated = [...hrTeam];
    updated[index][field] = value;
    setHrTeam(updated);
  };

  const handleFormSubmit = () => {
    onSubmit({
      departments,
      hrTeam,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Departments Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">أنشئ أقسام شركتك</h3>
        
        <TagInput 
          tags={departments}
          setTags={setDepartments}
          inputPlaceholder="ادخل اسم القسم"
          label="الأقسام"
        />
      </div>

      {/* HR Team Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">إضافة فريق الموارد البشرية</h3>
        <p className="text-sm text-muted-foreground">أضف مسؤولي الموارد البشرية الذين سيكون لهم صلاحيات إدارة النظام</p>
        
        {hrTeam.map((member, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            <div>
              <FormInput
                label="البريد الإلكتروني"
                type="email"
                placeholder="example@company.com"
                className="px-4 h-12 rounded-xl"
                value={member.email}
                onChange={(e) => updateHrMember(index, 'email', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">أدخل البريد الإلكتروني لمسؤول الموارد البشرية</p>
            </div>

            <div className="relative">
              <FormInput
                label="الفرع"
                type="text"
                placeholder="مثال: الرياض، جدة، دبي"
                className="px-4 h-12 rounded-xl"
                value={member.branch}
                onChange={(e) => updateHrMember(index, 'branch', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">أدخل اسم الفرع أو الموقع الذي يديره هذا المسؤول</p>
              {hrTeam.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeHrMember(index)}
                  className="absolute left-0 top-0 text-destructive hover:text-destructive/80"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addHrMember}
          className="text-primary hover:text-primary/80 font-medium flex items-center gap-2"
        >
          <Plus size={18} />
          إضافة مسؤول آخر
        </button>
      </div>

      <LoadingButton
        type="submit"
        className="w-full h-12 rounded-xl font-medium"
        loading={loading}
        loadingText="جاري الإعداد..."
      >
        تسجيل وارسال دعوة
      </LoadingButton>
    </form>
  );
}
