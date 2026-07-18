import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import LoginPhotoPanel from '@/components/dashboard/auth/LoginPhotoPanel';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import { useCrud } from '@/hooks/useCrud';
import { VerifyHeader } from '@/components/dashboard/auth/Verify/VerifyHeader';
import { VerifyForm } from '@/components/dashboard/auth/Verify/VerifyForm';
import Cookies from 'js-cookie';

const OTP_LENGTH = 6;

export default function Verify() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [touched, setTouched] = useState(false);
    const [countdown, setCountdown] = useState(12);
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const setPendingEmail = useAuthStore((state) => state.setPendingEmail);
    const pendingEmail = useAuthStore((state) => state.pendingEmail);
    const isComplete = otp.length === OTP_LENGTH;

    const { createItem: verifyOtp, creating: loading } = useCrud({
        endpoint: '',
        useJsonPayload: true,
        onSuccess: handleVerifySuccess,
    });

    const { createItem: resendOtp } = useCrud({
        endpoint: '',
        useJsonPayload: true,
        onSuccess: handleResendSuccess,
    });

    function handleVerifySuccess(response) {
        const token = response?.data?.accessToken || response?.accessToken || response?.data?.token || response?.token;
        const userData = response?.data?.user || response?.user;

        if (!token) return console.warn('No token received');

        Cookies.set('authTokenBasma', token, {
            expires: 7,
            secure: true,
            sameSite: 'strict'
        });

        login({ user: userData, token });
        setPendingEmail(null);
        toast.success("تم التحقق بنجاح");
        navigate("/setup");
    }

    function handleResendSuccess() {
        setCountdown(12);
        toast.success('تم إرسال رمز التحقق الجديد');
    }

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleResend = () => {
        if (!pendingEmail) {
            toast.error('البريد الإلكتروني غير متوفر');
            return;
        }
        resendOtp({ endpoint: '/auth/resend-otp', body: { email: pendingEmail } });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched(true);
        if (!isComplete) {
            setError('يرجى إدخال رمز التحقق كاملاً');
            toast.error('يرجى إدخال رمز التحقق');
            return;
        }
        if (!pendingEmail) {
            toast.error('البريد الإلكتروني غير متوفر');
            return;
        }
        verifyOtp({ endpoint: '/auth/verify-otp/signup', body: { email: pendingEmail, otp } });
    };

    return (
        <div className="w-screen h-screen flex flex-col md:flex-row bg-card">
            <LoginPhotoPanel />

            <div className="w-full md:w-1/2 bg-card p-4 md:p-8  flex flex-col justify-center h-full max-w-[600px] mx-auto">
                <VerifyHeader />
                <VerifyForm
                    otp={otp}
                    setOtp={setOtp}
                    error={error}
                    setError={setError}
                    touched={touched}
                    loading={loading}
                    countdown={countdown}
                    onResend={handleResend}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
