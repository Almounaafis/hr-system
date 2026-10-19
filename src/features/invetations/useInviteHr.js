import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { handleError, handleSuccess } from "@/lib/errorHandlers";


export function useInviteHr() {
    const { mutateAsync: inviteHr, isPending: isInviting } = useMutation({
        mutationFn: async ({ companyId, email }) => {
            if (!companyId) throw new Error("companyId is required");
            if (!email) throw new Error("email is required");
            const res = await api.post(
                `/auth/invite-hr/${companyId}`,
                { email },
                { headers: { "Content-Type": "application/json" } }
            );
            return res.data;
        },
        onSuccess: (response) => {
            handleSuccess(response, "تم إرسال الدعوة بنجاح");
        },
        onError: handleError,
    });

    return { inviteHr, isInviting };
}