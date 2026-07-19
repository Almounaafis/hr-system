import { Button } from '@/components/ui/button'
import { PenLine, Loader2 } from 'lucide-react'
import { useState } from 'react'

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import userInfoimg from "../assets/user-info.png"
import toast from "react-hot-toast"

import { useProfile } from '@/components/dashboard/profile/hooks/useProfile';
import FormInput from '@/shared/forms/FormInput';
import { DatePicker } from '@/shared/forms/DatePicker';

const READ_ONLY_CLASS = `
  h-12 px-4 rounded-xl text-right
  bg-transparent
  text-foreground
  border border-border
  cursor-not-allowed
  disabled:opacity-100`;

const MANAGER_ROLE = "manager";


const getInitialEditData = (user) => ({
  id: user.id,
  name: user.name || "",
  phone: user.phone || "",
  email: user.email || "",
  address: user.address || "",
  birth_date: user.birth_date || "",
  hire_date: user.hire_date || "",
  national_id: user.national_id || "",
  branch: user.branch || "",
  department: user.department || "",
  employee_code: user.employee_code || "",
});

const InfoField = ({ label, value }) => (
  <div>
    <p className="text-[#585959] font-bold text-lg">{label}</p>
    <p className="mt-2 text-xl">{value || "—"}</p>
  </div>
);

const SectionHeader = ({ title, description }) => (
  <div>
    <div className="flex items-center gap-7 mb-2">
      <img src={userInfoimg} className="w-10 h-10" alt="" />
      <p className="font-medium text-[#000] text-xl">{title}</p>
    </div>
    <p className="text-lg mb-5">{description}</p>
  </div>
);

const ReadOnlyInput = (props) => (
  <FormInput disabled readOnly className={READ_ONLY_CLASS} {...props} />
);

const Profile = () => {
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({});

  const user = profile || {};
  const isManager = user.role === MANAGER_ROLE;

  const imgBase =
    import.meta.env.VITE_API_BASE_URL ??
    import.meta.env.VITE_API_URL?.replace("/api", "") ??
    "";

  const profileSrc = user.profile_image_url ? `${imgBase}${user.profile_image_url}` : "";

  const handleEditClick = () => {
    setEditData(getInitialEditData(user));
    setIsEditDialogOpen(true);
  };

  const handleEditFieldChange = (field) => (e) => {
    setEditData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSaveEdit = async () => {
    try {
      await updateProfile(editData);
      setIsEditDialogOpen(false);
    } catch {
      toast.error("حدث خطأ أثناء تحديث الملف الشخصي");
    }
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditData({});
  };

  if (isLoading) {
    return (
      <section className="space-y-5">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <Card className="mt-5 px-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileSrc} alt={user.name || "Profile"} />
              <AvatarFallback>{user.name?.charAt(0) || "CN"}</AvatarFallback>
            </Avatar>

            <div>
              <p className="font-medium text-lg">{user.name || "—"}</p>
              <p className="text-[#585959] mt-1 text-sm">{user.job_title || user.role || "—"}</p>
            </div>
          </div>

          <Button className="h-[50px] w-[150px]" onClick={handleEditClick}>
            <PenLine className="w-5 h-5 mr-2" />
            <p>تعديل الملف</p>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {!isManager && <InfoField label="الفرع" value={user.branch} />}
          <InfoField label="البريد الإلكتروني" value={user.email} />
          <InfoField label="رقم الهاتف" value={user.phone} />
        </div>
      </Card>

      <Card className="px-4">
        <SectionHeader
          title="المعلومات الشخصية"
          description="بيانات هويتك الأساسية كما تظهر في النظام"
        />
        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ReadOnlyInput name="name" label="الاسم" type="text" value={user.name || ""} />
          <ReadOnlyInput name="email" label="البريد الإلكتروني" type="email" value={user.email || ""} />
          <ReadOnlyInput name="phone" label="رقم الجوال" type="tel" value={user.phone || ""} />
          <ReadOnlyInput
            name="birthDate"
            label="تاريخ الميلاد"
            type="date"
            dir="rtl"
            value={user.birth_date || ""}
          />
          <ReadOnlyInput name="address" label="العنوان" type="text" value={user.address || ""} />
          {!isManager && (
            <ReadOnlyInput
              name="nationalId"
              label="الرقم القومي"
              type="text"
              value={user.national_id || ""}
            />
          )}
        </form>
      </Card>

      <Card className="px-4">
        <SectionHeader
          title="معلومات الشركة"
          description="عرض وإدارة معلوماتك الوظيفية داخل المؤسسة."
        />
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyInput name="jobTitle" label="المسمى الوظيفي" type="text" value={user.job_title || ""} />

          {!isManager && (
            <ReadOnlyInput name="department" label="القسم" type="text" value={user.department || ""} />
          )}

          {!isManager && (
            <ReadOnlyInput
              name="employeeCode"
              label="الرقم الوظيفي"
              type="text"
              value={user.employee_code || ""}
            />
          )}

          <ReadOnlyInput name="hireDate" label="تاريخ الالتحاق" type="text" value={user.hire_date || ""} />
        </form>
      </Card>

      <Card className="px-4">
        <SectionHeader
          title="معلومات المؤسسة"
          description="البيانات العامة الخاصة بالشركة التابع لها."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoField label="اسم الشركة" value={user.company_name} />
          <InfoField label="نوع النشاط" value={user.company_type} />
          <InfoField label="الفروع" value={user.company_branches?.join("، ")} />
          <InfoField label="الأقسام" value={user.company_departments?.join("، ")} />
        </div>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>تعديل الملف الشخصي</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <FormInput
              name="name"
              label="الاسم"
              type="text"
              value={editData.name || ""}
              onChange={handleEditFieldChange("name")}
            />
            <FormInput
              name="phone"
              label="رقم الجوال"
              type="tel"
              value={editData.phone || ""}
              onChange={handleEditFieldChange("phone")}
            />
            <FormInput
              name="email"
              label="البريد الإلكتروني"
              type="email"
              value={editData.email || ""}
              onChange={handleEditFieldChange("email")}
            />
            <FormInput
              name="address"
              label="العنوان"
              type="text"
              value={editData.address || ""}
              onChange={handleEditFieldChange("address")}
            />
            <DatePicker
              label="تاريخ الميلاد"
              value={editData.birth_date || ""}
              onChange={(date) => setEditData((prev) => ({ ...prev, birth_date: date }))}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCancelEdit} disabled={isUpdating}>
              إلغاء
            </Button>
            <Button onClick={handleSaveEdit} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ التغييرات"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Profile;