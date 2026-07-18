import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import { useCrud } from '@/hooks/useCrud';
import LoginPhotoPanel from '@/components/dashboard/auth/LoginPhotoPanel';
import { SetupHeader } from '@/components/dashboard/auth/Setup/SetupHeader';
import { SetupForm } from '@/components/dashboard/auth/Setup/SetupForm';

export default function Setup() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const { createItem, creating: loading } = useCrud({
    endpoint: '',
    useJsonPayload: true,
    onSuccess: handleSetupSuccess,
  });

  function handleSetupSuccess() {
    navigate('/dashboard');
  }

  const onSubmit = (data) => {
    if (!user) {
      navigate('/login');
      return;
    }
    const userId = user._id || user.id;
    if (!userId) {
      console.error('No user ID found in user object');
      navigate('/login');
      return;
    }
    const body = {
      departments: data.departments,
      hr_invites: data.hrTeam,
    };
    createItem({ endpoint: `/auth/manager/${userId}/setup`, body });
  };

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-card">
      <LoginPhotoPanel />
      <div className="w-full md:w-1/2 bg-card p-4 md:p-8 flex flex-col justify-center h-full max-w-[600px] mx-auto">
        <SetupHeader />
        <SetupForm onSubmit={onSubmit} loading={loading} />
      </div>
    </div>
  );
}
