

import image from '@/assets/login-img.png';
import logo from '@/assets/basma.svg';

const LoginPhotoPanel = () => {
    return (
        <div className="hidden md:flex md:w-1/2 bg-card p-5">
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <img
                    src={image}
                    alt="بصمة"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/50 to-primary/95" />
                {/* Logo badge */}
                <div className="absolute top-6 right-6 flex items-center gap-2">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-background">
                        <img src={logo} alt="بصمة" className="w-8 h-8" />
                    </div>
                    <span className="text-2xl font-bold text-white">بصمة</span>
                </div>
                {/* Headline + copy */}
                <div className="absolute bottom-0 inset-x-0 p-8">
                    <h2 className="text-2xl font-bold text-white mb-3 leading-snug">
                        إدارة مواردك البشرية في مكان واحد
                    </h2>
                    <p className="text-white/85 text-sm md:text-md leading-relaxed mb-6">
                        تابع الحضور والانصراف، وأدر الطلبات والرواتب والموظفين بسهولة من خلال منصة بصمة.
                    </p>
                    <div className="border-t border-white/20 pt-4 text-center mt-30 ">
                        <p className="text-white/70 text-sm md:text-md leading-relaxed">
                            بإنشاء حسابك، أنت توافق على{' '}
                            <span className="font-semibold text-white/90">شروط الاستخدام وسياسة الخصوصية</span>{' '}
                            الخاصة بالنظام.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPhotoPanel