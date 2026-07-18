import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '@/store/useAuthStore';
import { useCrud } from '@/hooks/useCrud';
import LoginPhotoPanel from '@/components/dashboard/auth/LoginPhotoPanel';
import { ForgotPasswordHeader } from '@/components/dashboard/auth/ForgotPassword/ForgotPasswordHeader';
import { ForgotPasswordForm } from '@/components/dashboard/auth/ForgotPassword/ForgotPasswordForm';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const setPendingEmail = useAuthStore((state) => state.setPendingEmail);
  const [emailValue, setEmailValue] = useState('');

  const { createItem, creating: loading } = useCrud({
    endpoint: '',
    useJsonPayload: true,
    onSuccess: () => {
      setPendingEmail(emailValue);
      navigate('/reset-password');
    },
  });

  const onSubmit = (data) => {
    setEmailValue(data.email);
    createItem({ endpoint: '/auth/forgot-password', body: data });
  };

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-card">
      <LoginPhotoPanel />
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 max-w-[600px] mx-auto">
        <ForgotPasswordHeader />
        <ForgotPasswordForm onSubmit={onSubmit} loading={loading} />
      </div>
    </div>
  );
}
