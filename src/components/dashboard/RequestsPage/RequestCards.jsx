import { RequestCardShell, FieldPair } from "./SharedCardComponents";
import { formatDate } from "./helpers";

export function RewardCard({ request, onView }) {
  return (
    <RequestCardShell request={request} onView={onView}>
      <FieldPair
        rightLabel="من"
        rightValue={formatDate(request.start_date)}
        leftLabel="قيمة المكافأة"
        leftValue={`${request.amount || 0}`}
      />
    </RequestCardShell>
  );
}

export function LeaveCard({ request, onView }) {
  return (
    <RequestCardShell request={request} onView={onView}>
      <FieldPair
        rightLabel="من"
        rightValue={formatDate(request.start_date)}
        leftLabel="إلى"
        leftValue={formatDate(request.end_date)}
      />
    </RequestCardShell>
  );
}

export function PermissionCard({ request, onView }) {
  return (
    <RequestCardShell request={request} onView={onView}>
      <FieldPair
        rightLabel="تاريخ"
        rightValue={formatDate(request.start_date)}
        leftLabel="وقت"
        leftValue={`${request.duration_hours || 0} ساعات`}
      />
    </RequestCardShell>
  );
}

export function SalaryIncreaseCard({ request, onView }) {
  return (
    <RequestCardShell request={request} onView={onView}>
      <FieldPair
        rightLabel="تاريخ الطلب"
        rightValue={formatDate(request.start_date)}
        leftLabel="المبلغ / الزيادة"
        leftValue={`${request.amount || 0}`}
      />
    </RequestCardShell>
  );
}

export function RemoteWorkCard({ request, onView }) {
  return (
    <RequestCardShell request={request} onView={onView}>
      <FieldPair
        rightLabel="من"
        rightValue={formatDate(request.start_date)}
        leftLabel="إلى"
        leftValue={formatDate(request.end_date)}
      />
    </RequestCardShell>
  );
}

export function AdvanceCard({ request, onView }) {
  return (
    <RequestCardShell request={request} onView={onView}>
      <FieldPair
        rightLabel="من"
        rightValue={formatDate(request.start_date)}
        leftLabel="قيمة السلفة"
        leftValue={`${request.amount || 0}`}
      />
    </RequestCardShell>
  );
}
