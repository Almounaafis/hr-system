import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCrud } from "@/hooks/useCrud";
import Stepper from "@/components/dashboard/auth/HrInvitaion/Stepper";
import InvitationStep from "@/components/dashboard/auth/HrInvitaion/InvitationStep";
import AccountSetupStep from "@/components/dashboard/auth/HrInvitaion/AccountSetupStep";

export default function HRInvitation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { createItem: acceptInvitation, creating: accepting } = useCrud({
    endpoint: '/auth/invite/accept/hr',
    enabled: false,
    useJsonPayload: true,
    onSuccess: handleAcceptSuccess,
  });

  function handleAcceptSuccess() {
    // Account activated successfully, redirect to login
    navigate('/login');
  }

  const [currentStep, setCurrentStep] = useState(1);
  const companyName = "المنافس";
  const steps = [
    { number: 1, label: "دعوة", description: "قبول الدعوة" },
    { number: 2, label: "الحساب", description: "إعداد الحساب" }
  ];

  const handleAcceptInvitation = () => {
    setCurrentStep(2);
  };

  const handleActivateAccount = (data) => {
    acceptInvitation({ body: data });
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col items-center justify-center p-4 sm:p-8"
    >
      <Stepper steps={steps} currentStep={currentStep} />

      {/* Enhanced Card */}
      <Card className="bg-card rounded-2xl max-w-[709px] w-full shadow-lg border border-border/50 backdrop-blur-sm mx-auto">

        <CardContent className="px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-10">
          {/* Step 1: Invitation */}
          {currentStep === 1 && (
            <InvitationStep
              companyName={companyName}
              onAccept={handleAcceptInvitation}
            />
          )}

          {/* Step 2: Account Setup */}
          {currentStep === 2 && (
            <AccountSetupStep
              onSubmit={handleActivateAccount}
              loading={accepting}
              email={searchParams.get('email') || ''}
              token={searchParams.get('token') || ''}
            />
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="mt-6 sm:mt-8 text-[11px] sm:text-xs text-muted-foreground">
        جميع الحقوق محفوظة © 2026 بصمة.
      </p>
    </div>
  );
}