import { Button } from "@/components/ui/button";
import logo from '../../../../assets/basma.svg';

export default function InvitationStep({ companyName, onAccept }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 text-center">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 pb-8 sm:pb-12">
        <div className="flex items-center justify-center w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] rounded-lg bg-[linear-gradient(360deg,#C2E7F5_0%,#87C7D4_4.33%,#56ACB9_30.29%,#138893_82.69%)]">
          <img src={logo} alt="بصمة" className="w-7 h-7 sm:w-8 sm:h-8 brightness-[14.5]" />
        </div>
        <span className="text-2xl sm:text-3xl font-bold text-card-foreground">بصمة</span>
      </div>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
        تمت دعوتك للانضمام الى شركة {companyName}
      </h2>
      <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-6 sm:mb-8 ">
       تمت إضافتك كأحد مسؤولي الموارد البشرية في {companyName} على نظام بصمة.   </p>

      <Button
        onClick={onAccept}
        className="w-full py-3 bg-primary h-10 sm:h-12 hover:bg-primary/90 text-primary-foreground rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 active:scale-95"
      >
        قبول الدعوة
      </Button>

      <p className="mt-4 sm:mt-6 text-[11px] sm:text-xs text-muted-foreground text-center leading-relaxed">
       <strong> انتهت صلاحية الرابط؟</strong>
        <br />
        يرجى التواصل مع مسؤول النظام لإعادة إرسال الدعوة.
      </p>
    </div>
  );
}
