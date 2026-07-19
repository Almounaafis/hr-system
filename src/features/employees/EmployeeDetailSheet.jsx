import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  Edit, Trash2, X, Users, Phone, Mail, Calendar,
  MapPin, Briefcase, FileText, Loader2, Download
} from "lucide-react";
import { formatJoinDate } from "./utils";
import { formatDate } from "@/features/requests/lib/helpers";
import api from "@/lib/axios";
import { useCrud } from "@/hooks/useCrud";
import { PayrollDetails } from "../Payroll/PayrollDetails";
// import toast from "react-hot-toast";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 min-w-0">
      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm sm:text-[15px] text-foreground font-medium break-words leading-snug">
          {value}
        </p>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, bgColor, iconColor, title }) {
  return (
    <div className="flex items-center gap-2 mb-3 sm:mb-4">
      <div className={`p-2 sm:p-3 ${bgColor} rounded-lg flex-shrink-0`}>
        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${iconColor}`} />
      </div>
      <h3 className="text-sm sm:text-xl font-semibold text-foreground">{title}</h3>
    </div>
  );
}

// ── Download button ──────────────────────────────────────────────────────────
function DocumentDownloadButton({ empId, doc }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await api.get(
        `/employees/${empId}/documents/${doc.id}/download`,
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", doc.file_name || "document");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download document:", error);
      // toast.error("حدث خطأ أثناء تحميل الملف");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-primary flex-shrink-0"
      onClick={handleDownload}
      disabled={downloading}
    >
      {downloading ? (
        <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin text-primary" />
      ) : (
        <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      )}
    </Button>
  );
}

// ── Delete document button ────────────────────────────────────────────────────
function DocumentDeleteButton({ empId, doc, onDeleted }) {
  const { deleteItem, deleting } = useCrud({
    queryKey: ["employee", empId],
    endpoint: `/employees/${empId}`,
  });

  const handleDelete = async () => {
    try {
      await deleteItem(`/employees/${empId}/documents/${doc.id}`);
      onDeleted?.(doc.id);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
      onClick={handleDelete}
      disabled={deleting}
    >
      {deleting ? (
        <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin text-destructive" />
      ) : (
        <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      )}
    </Button>
  );
}

export function EmployeeDetailSheet({ selectedEmployee, onClose, onDelete, onEdit }) {
  const [activeTab, setActiveTab] = useState("details");

  const {
    data: employeeData,
    isLoading,
    refetch,
    deleteItem,
    deleting,
  } = useCrud({
    queryKey: ['employee', selectedEmployee?.id || selectedEmployee],
    endpoint: selectedEmployee ? `/employees/${selectedEmployee.id || selectedEmployee}` : '',
    enabled: !!selectedEmployee,
  });

  useEffect(() => {
    if (selectedEmployee) {
      refetch();
    }
  }, [selectedEmployee, refetch]);

  const data = employeeData?.data || employeeData;


  const handleDeleteEmployee = async () => {
    const empId = data?.id || selectedEmployee?.id || selectedEmployee;
    if (!empId) return;
    try {
      await deleteItem(`/employees/${empId}`);
      onDelete?.(empId);
      onClose?.();
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  if (!selectedEmployee) return null;

  const displayData = data ? {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    position: data.job_title || '',
    department: data.department || '',
    branch: data.branch || '',
    status: data.is_active ? 'active' : 'inactive',
    hire_date: data.hire_date || new Date(),
    photo: data.profile_image_url || null,
    avatar: data.name ? data.name.charAt(0).toUpperCase() : 'E',
    avatarBg: 'bg-blue-100',
    avatarColor: 'text-blue-600',
    nationalId: data.national_id || '',
    birthDate: data.birth_date || '',
    address: data.address || '',
    direct_manager: data.direct_manager || '',
    employment_type: data.employment_type || '',
  } : selectedEmployee;

  const empId = data?.id || selectedEmployee?.id || selectedEmployee;

  const tabs = [
    { id: "details", label: "التفاصيل" },
    { id: "payroll", label: "كشوف المرتبات" },
    { id: "contracts", label: "العقود" },
  ];

  return (
    <Sheet open={!!selectedEmployee} onOpenChange={onClose} side="left">
      <SheetContent className="!max-w-full sm:!max-w-[550px] w-full overflow-y-auto p-0">
        <SheetTitle className="sr-only">تفاصيل الموظف</SheetTitle>

        {isLoading ? (
          <div className="flex items-center justify-center h-full py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <div className="bg-gradient-to-r from-[#E8F5F3] to-[#F0F9FF] px-2 py-4 md:p-4 sm:p-6">
              <div className="flex items-center mt-4 md:mt-6 gap-2 justify-between ">
                <div className="flex items-center gap-3 sm:gap-4 ">
                  <div className="h-13 w-13 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-full bg-background shadow-sm">
                    {displayData.photo ? (
                      <img
                        src={displayData.photo}
                        alt={displayData.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className={`flex h-full w-full items-center justify-center text-base sm:text-xl font-semibold ${displayData.avatarBg} ${displayData.avatarColor}`}
                      >
                        {displayData.avatar}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm sm:text-xl font-bold text-foreground truncate">
                      {displayData.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                      {displayData.position}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    variant="ghost" size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 bg-background border border-border text-muted-foreground hover:text-foreground"
                    onClick={() => onEdit?.(displayData)}
                  >
                    <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 bg-background border border-border text-muted-foreground hover:text-destructive"
                    onClick={handleDeleteEmployee}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-3 sm:gap-6 border-b border-border px-3 sm:px-6 pt-3 sm:pt-4 pb-0 overflow-x-auto scrollbar-none">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap text-sm sm:text-lg font-medium pb-3 border-b-2 transition-colors flex-shrink-0 ${activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Details Tab ── */}
            {activeTab === "details" && (
              <div className="px-3 sm:px-6  space-y-6 sm:space-y-8">
                <div>
                  <SectionHeader
                    icon={Users}
                    bgColor="bg-blue-50"
                    iconColor="text-blue-600"
                    title="التفاصيل الشخصية"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <InfoRow icon={Mail} label="البريد الإلكتروني" value={displayData.email} />
                    <InfoRow icon={Phone} label="رقم الهاتف" value={displayData.phone} />
                    <InfoRow icon={Calendar} label="تاريخ الميلاد" value={formatDate(displayData.birthDate)} />
                    <InfoRow icon={MapPin} label="العنوان" value={displayData.address} />
                    <InfoRow icon={Briefcase} label="الرقم القومي" value={displayData.nationalId} />
                  </div>
                </div>

                <div>
                  <SectionHeader
                    icon={Briefcase}
                    bgColor="bg-green-50"
                    iconColor="text-green-600"
                    title="التفاصيل الوظيفية"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <InfoRow icon={Briefcase} label="القسم" value={displayData.department} />
                    <InfoRow icon={MapPin} label="الفرع" value={displayData.branch} />
                    <InfoRow icon={Users} label="المدير المباشر" value={displayData.direct_manager} />
                    <InfoRow icon={Calendar} label="نوع التوظيف" value={displayData.employment_type} />
                    <InfoRow icon={Calendar} label="تاريخ التعيين" value={formatJoinDate(displayData.hire_date)} />
                  </div>
                </div>
              </div>
            )}

            {/* ── Payroll Tab ── */}
            {activeTab === "payroll" && (
              <div className="px-3 sm:px-6">
                <SectionHeader
                  icon={Briefcase}
                  bgColor="bg-orange-50"
                  iconColor="text-orange-600"
                  title="كشوف المرتبات"
                />
                <PayrollDetails employee={data} className="space-y-4" />
              </div>
            )}

            {/* ── Contracts Tab ── */}
            {activeTab === "contracts" && (
              <div className="px-3 sm:px-6">
                <SectionHeader
                  icon={FileText}
                  bgColor="bg-purple-50"
                  iconColor="text-purple-600"
                  title="تفاصيل العقود"
                />

                <div className="space-y-2 sm:space-y-3">
                  {data?.documents && data.documents.length > 0 ? (
                    data.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex md:items-center justify-between p-2 sm:p-4 border border-border bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 sm:gap-3 min-w-0">
                          <div className="p-2 sm:p-3 bg-background rounded-lg flex-shrink-0">
                            <FileText className="h-4 w-4 sm:h-6 sm:w-6 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-lg font-medium text-[#101011] truncate">{doc.file_name}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {(doc.file_size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                          <DocumentDownloadButton empId={empId} doc={doc} />
                          <DocumentDeleteButton
                            empId={empId}
                            doc={doc}
                            onDeleted={() => refetch()}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      لا توجد مستندات
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}