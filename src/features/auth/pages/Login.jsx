import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import logger from '@/lib/logger';
import { useCrud } from '@/hooks/useCrud';
import { setAccessToken, setRefreshToken } from '@/lib/axios';
import LoginPhotoPanel from '@/features/auth/LoginPhotoPanel';
import { LoginHeader } from '@/features/auth/Login/LoginHeader';
import { LoginForm } from '@/features/auth/Login/LoginForm';
import { SocialLogin } from '@/features/auth/Login/SocialLogin';
import { RegisterLink } from '@/features/auth/Login/RegisterLink';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const { createItem, creating: loading } = useCrud({
    endpoint: '',
    useJsonPayload: true,
    onSuccess: handleLoginSuccess,
    disableSuccessToast: true,
  });

  function handleLoginSuccess(response) {
    const token =
      response?.data?.accessToken ||
      response?.accessToken ||
      response?.data?.token ||
      response?.token;
    const refreshToken = response?.data?.refreshToken || response?.refreshToken;
    const user = response?.data?.user || response?.user;
    const requiresOTP = response?.data?.requiresOTP || response?.requiresOTP || false;

    if (user?.role === 'employee') {
      toast.error('عفواً، لا يمكنك الدخول. هذا النظام مخصص لإدارة الموارد البشرية والمديرين فقط.');
      return;
    }

    if (!token) return logger.warn('No token received');

    setAccessToken(token);
    if (refreshToken) setRefreshToken(refreshToken);

    login({ user, token, requiresOTP });
    toast.success(response?.message || 'تم تسجيل الدخول بنجاح');

    if (requiresOTP) {
      navigate('/otp');
    } else {
      navigate('/dashboard');
    }
  }

  const onSubmit = async (data) => {
    try {
      await createItem({ endpoint: '/auth/login', body: data });
    } catch {
      // تم التعامل مع رسالة الخطأ عبر useCrud (handleError)
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-card">
      <LoginPhotoPanel />
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 max-w-[600px] mx-auto">
        <LoginHeader />
        <LoginForm onSubmit={onSubmit} loading={loading} />
        <SocialLogin />
        <RegisterLink />
      </div>
    </div>
  );
}