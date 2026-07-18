import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import { useCrud } from '@/hooks/useCrud';
import LoginPhotoPanel from '@/components/dashboard/auth/LoginPhotoPanel';
import { RegisterHeader } from '@/components/dashboard/auth/Register/RegisterHeader';
import { RegisterForm } from '@/components/dashboard/auth/Register/RegisterForm';
import { SocialLogin } from '@/components/dashboard/auth/Login/SocialLogin';
import { RegisterFooter } from '@/components/dashboard/auth/Register/RegisterFooter';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setPendingEmail = useAuthStore((state) => state.setPendingEmail);

  const { createItem, creating: loading } = useCrud({
    endpoint: '',
    useJsonPayload: false,
    onSuccess: handleRegisterSuccess,
  });

  function handleRegisterSuccess(response) {
    const email = response?.data?.email || response?.email;

    if (!email) return console.warn('No email received');

    setPendingEmail(email);
    navigate('/verify');
  }

  const profile = searchParams.get('profile');
  let profileData = null;
  
  if (profile) {
    try {
      profileData = JSON.parse(atob(profile));
    } catch (error) {
      console.error('Error decoding profile:', error);
    }
  }

  const onSubmit = (data) => {
    const body = {
      name: data.name,
      email: data.email,
      password: data.password,
      company_name: data.company_name,
      company_type: data.company_type,
      branches: data.branches,
      job_title: data.job_title,
      logo: data.logo,
      provider: profileData?.provider,
      provider_id: profileData?.provider_id,
      profile_image_url: profileData?.profile_image_url,
    };
    createItem({ endpoint: '/auth/manager/signup', body });
  };

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-card">
      <LoginPhotoPanel />
      <div className="w-full md:w-1/2 bg-card p-4 md:p-8  flex flex-col justify-center h-full max-w-[600px] mx-auto">
        <RegisterHeader />
        <RegisterForm 
          onSubmit={onSubmit} 
          loading={loading}
          prefillData={profileData ? {
            name: profileData.name || '',
            email: profileData.email || '',
          } : null}
        />
        <SocialLogin />
        <RegisterFooter />
      </div>
    </div>
  );
}
