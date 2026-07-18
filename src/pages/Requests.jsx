import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { COLUMN_CONFIG } from "@/components/dashboard/RequestsPage/constants";
import { RequestColumn } from "@/components/dashboard/RequestsPage/RequestColumn";
import { RequestDetailSheet } from "@/components/dashboard/RequestsPage/RequestDetailSheet";
import {
  RewardCard,
  LeaveCard,
  PermissionCard,
  SalaryIncreaseCard,
  RemoteWorkCard,
  AdvanceCard,
} from "@/components/dashboard/RequestsPage/RequestCards";
import { useRequests, useReviewRequest, useDeleteRequest } from "@/hooks/useRequests";
import { useRequestFilters } from "../components/dashboard/RequestsPage/useRequestFilters";
import { RequestsToolbar } from "../components/dashboard/RequestsPage/RequestsToolbar";

export default function Requests() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedRequestKind, setSelectedRequestKind] = useState(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const {
    searchQuery, setSearchQuery,
    filterStatus, setFilterStatus,
    filterDepartment, setFilterDepartment,
    filterType, setFilterType,
    filterDate, setFilterDate,
  } = useRequestFilters();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: requestsData, isLoading, refetch } = useRequests({
    search: debouncedSearchQuery || undefined,
    request_type: filterType === "all" ? undefined : filterType,
    status: filterStatus === "all" ? undefined : filterStatus || undefined,
    department: filterDepartment === "all" ? undefined : filterDepartment || undefined,
    date: filterDate === "all" ? undefined : filterDate || undefined,
  });

  const { reviewRequest } = useReviewRequest();
  const { deleteRequest, isDeleting } = useDeleteRequest();

  const handleApprove = async (request) => {
    try {
      await reviewRequest(request.id, 'approved');
      await refetch();
      setSelectedRequest(null);
    } catch (error) {
      console.error("Failed to approve request:", error);
    }
  };

  const handleReject = async (request) => {
    try {
      await reviewRequest(request.id, 'rejected');
      await refetch();
      setSelectedRequest(null);
    } catch (error) {
      console.error("Failed to reject request:", error);
    }
  };

  const handleDelete = async (request) => {
    try {
      await deleteRequest(request.id);
      await refetch();
      setSelectedRequest(null);
    } catch (error) {
      console.error("Failed to delete request:", error);
    }
  };

  const handleView = (kind) => (request) => {
    setSelectedRequest(request);
    setSelectedRequestKind(kind);
  };


  const requests = requestsData?.requests || [];

  // Group requests by type
  const filteredReward = filterType === "all" || filterType === "bonus" ? requests.filter(r => r.request_type === "bonus") : [];
  const filteredLeave = filterType === "all" || filterType === "vacation" ? requests.filter(r => r.request_type === "vacation") : [];
  const filteredPermission = filterType === "all" || filterType === "permission" ? requests.filter(r => r.request_type === "permission") : [];
  const filteredSalaryIncrease = filterType === "all" || filterType === "salary_increase" ? requests.filter(r => r.request_type === "salary_increase") : [];
  const filteredRemoteWork = filterType === "all" || filterType === "remote_work" ? requests.filter(r => r.request_type === "remote_work") : [];
  const filteredAdvance = filterType === "all" || filterType === "advance" ? requests.filter(r => r.request_type === "advance") : [];

  const allDepartments = Array.from(new Set(requests.map((r) => r.employee?.department)));

  const columns = [
    { config: COLUMN_CONFIG.reward,         data: filteredReward,         kind: "reward",         Card: RewardCard         },
    { config: COLUMN_CONFIG.leave,          data: filteredLeave,          kind: "leave",          Card: LeaveCard          },
    { config: COLUMN_CONFIG.permission,     data: filteredPermission,     kind: "permission",     Card: PermissionCard     },
    { config: COLUMN_CONFIG.salaryIncrease, data: filteredSalaryIncrease, kind: "salaryIncrease", Card: SalaryIncreaseCard },
    { config: COLUMN_CONFIG.remoteWork,     data: filteredRemoteWork,     kind: "remoteWork",     Card: RemoteWorkCard     },
    { config: COLUMN_CONFIG.advance,        data: filteredAdvance,        kind: "advance",        Card: AdvanceCard        },
  ].filter((col) => col.data.length > 0);

 

  return (
    <Card className="space-y-6 p-4 sm:p-6 overflow-hidden">
      <RequestsToolbar
        searchQuery={searchQuery}         setSearchQuery={setSearchQuery}
        filterDate={filterDate}           setFilterDate={setFilterDate}
        filterType={filterType}           setFilterType={setFilterType}
        filterDepartment={filterDepartment} setFilterDepartment={setFilterDepartment}
        filterStatus={filterStatus}       setFilterStatus={setFilterStatus}
        allDepartments={allDepartments}
      />

      {/* Kanban — snaps column-by-column on mobile, free-scrolls on desktop */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground">جاري التحميل...</div>
        ) : columns.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            لا توجد طلبات مطابقة للفلاتر الحالية
          </div>
        ) : (
        <div className="flex gap-4 p-1 min-w-max snap-x snap-mandatory sm:snap-none">
          {columns.map(({ config, data, kind, Card: RequestCard }) => (
            <div key={kind} className="snap-start snap-always">
              <RequestColumn
                column={config}
                requests={data}
                onView={handleView(kind)}
                renderCard={(request, onView) => (
                  <RequestCard key={request.id} request={request} onView={onView} />
                )}
              />
            </div>
          ))}
        </div>
        )}
      </div>

      <RequestDetailSheet
        selectedRequest={selectedRequest}
        selectedRequestKind={selectedRequestKind}
        onClose={() => setSelectedRequest(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </Card>
  );
}