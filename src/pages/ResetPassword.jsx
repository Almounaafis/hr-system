import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '@/store/useAuthStore';
import { useCrud } from '@/hooks/useCrud';
import LoginPhotoPanel from '@/features/auth/LoginPhotoPanel';
import { ResetPasswordHeader } from '@/features/auth/ResetPassword/ResetPasswordHeader';
import { ResetPasswordForm } from '@/features/auth/ResetPassword/ResetPasswordForm';

export default function ResetPassword() {
  const navigate = useNavigate();
  const pendingEmail = useAuthStore((state) => state.pendingEmail);
  const setPendingEmail = useAuthStore((state) => state.setPendingEmail);

  useEffect(() => {
    if (!pendingEmail) {
      toast.error('يرجى طلب رمز التحقق أولاً');
      navigate('/forgot-password');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { createItem, creating: loading } = useCrud({
    endpoint: '',
    useJsonPayload: true,
    onSuccess: () => {
      setPendingEmail(null);
      // toast.success('تم إعادة تعيين كلمة المرور بنجاح. يرجى تسجيل الدخول باستخدام كلمة المرور الجديدة.');
      navigate('/login');
    },
  });

  const onSubmit = (data) => {
    if (!pendingEmail) {
      toast.error('البريد الإلكتروني غير متوفر');
      return;
    }
    createItem({
      endpoint: '/auth/reset-password',
      body: {
        email: pendingEmail,
        otp: data.otp,
        password: data.password,
        confirm_password: data.confirm_password,
      },
    });
  };

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-card">
      <LoginPhotoPanel />
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 max-w-[600px] mx-auto">
        <ResetPasswordHeader />
        <ResetPasswordForm onSubmit={onSubmit} loading={loading} prefillEmail={pendingEmail} />
      </div>
    </div>
  );
}
