import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import { useCrud } from '@/hooks/useCrud';
import LoginPhotoPanel from '@/components/dashboard/auth/LoginPhotoPanel';
import { LoginHeader } from '@/components/dashboard/auth/Login/LoginHeader';
import { LoginForm } from '@/components/dashboard/auth/Login/LoginForm';
import { SocialLogin } from '@/components/dashboard/auth/Login/SocialLogin';
import { RegisterLink } from '@/components/dashboard/auth/Login/RegisterLink';
import Cookies from 'js-cookie';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const { createItem, creating: loading } = useCrud({
    endpoint: '',
    useJsonPayload: true,
    onSuccess: handleLoginSuccess,
  });

function handleLoginSuccess(response) {
    const token = response?.data?.accessToken || response?.accessToken || response?.data?.token || response?.token;
    const user = response?.data?.user || response?.user;
    const requiresOTP = response?.data?.requiresOTP || response?.requiresOTP || false;

    if (!token) return console.warn('No token received');

    Cookies.set('authTokenBasma', token, {
      expires: 7,
      secure: true,
      sameSite: 'strict'
    });

    login({ user, token, requiresOTP });

    if (requiresOTP) {
      navigate('/otp');
    } else {
      navigate('/dashboard');
    }
  }

  const onSubmit = (data) => createItem({ endpoint: '/auth/login', body: data });

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