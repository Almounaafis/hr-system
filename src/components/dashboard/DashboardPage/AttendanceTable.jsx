import { useState, useMemo, memo } from "react";
import { MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import Pagination from "@/shared/components/Pagination";
import TableShared from "@/shared/components/TableShared";
import { TableToolbar } from "@/pages/Attendance";
import { StatusPill } from "./StatusPill";

const AttendanceTableCard = memo(function AttendanceTableCard({ data, totalPages }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");
  const [date, setDate] = useState(null);

  // Filtering is local/mocked since only one page of real records exists.
  // Replace with server-side query params (search, sort, date, page) when wiring to a real API.
  const filteredRecords = useMemo(() => {
    let records = data;

    // Filter by search
    if (search.trim()) {
      records = records.filter((r) =>
        r.employeeName.toLowerCase().includes(search.trim().toLowerCase())
      );
    }

    // Sort by employee name
    if (sort === "asc") {
      records = [...records].sort((a, b) =>
        a.employeeName.localeCompare(b.employeeName, "ar")
      );
    } else {
      records = [...records].sort((a, b) =>
        b.employeeName.localeCompare(a.employeeName, "ar")
      );
    }

    return records; 
  }, [search, sort, data]);

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-border">
        <CardTitle className="text-lg sm:text-2xl font-semibold text-foreground">
          تسجيل الحضور
        </CardTitle>

        <div className="w-full sm:w-auto">
          <TableToolbar
            searchValue={search}
            onSearchChange={setSearch}
            sortValue={sort}
            onSortChange={setSort}
            dateValue={date}
            onDateChange={() => setDate((d) => d ?? "اليوم")}
          />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <TableShared
          columns={[
            {
              header: "",
              cellClassName: "py-3 px-2 w-8",
              render: (record) => (
                <Checkbox className="rounded border-border" aria-label={`تحديد ${record.employeeName}`} />
              )
            },
            {
              header: "الموظف",
              cellClassName: "py-3 px-2",
              render: (record) => (
                <div className="flex items-center gap-2.5">
                  <span className="text-xs text-muted-foreground">{record.id}</span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 ${record.avatarBg} ${record.avatarColor}`}
                  >
                    {record.avatarInitials}
                  </div>
                  <span className="text-sm text-foreground whitespace-nowrap">{record.employeeName}</span>
                </div>
              )
            },
            {
              header: "القسم",
              cellClassName: "py-3 px-2",
              render: (record) => (
                <Badge variant="secondary" className="rounded-md font-normal text-xs bg-muted text-foreground">
                  {record.department}
                </Badge>
              )
            },
            {
              header: "الحضور",
              cellClassName: "py-3 px-2 text-sm text-foreground",
              accessor: "checkIn"
            },
            {
              header: "الانصراف",
              cellClassName: "py-3 px-2 text-sm text-red-500",
              accessor: "checkOut"
            },
            {
              header: "ساعات العمل",
              cellClassName: "py-3 px-2 text-sm text-muted-foreground whitespace-nowrap",
              accessor: "hoursWorked"
            },
            {
              header: "الحالة",
              cellClassName: "py-3 px-2",
              render: (record) => <StatusPill status={record.status} />
            },
            {
              header: "",
              cellClassName: "py-3 px-2 text-left w-8",
              render: () => (
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              )
            }
          ]}
          data={filteredRecords}
        />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </CardContent>
    </Card>
  );
});

export default AttendanceTableCard;
