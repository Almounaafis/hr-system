import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useState } from "react";
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import imgHour from "../assets/hour-work.png";
import imgLate from "../assets/late-img.png";
import imgAttend from "../assets/attend.png";
import imgPlus from "../assets/plus.png";
import { Badge } from "@/components/ui/badge"
import { useParams } from 'react-router-dom';
import { Attendancelog } from '@/features/attendance/Attendancelog';
import { useEmployeeAttendance } from '@/features/employees/hooks/useEmployeeAttendance';
import { FormInput } from '@/components/shared/forms/FormInput';

const EmployeeAttendance = () => {
    const { id } = useParams();
    const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth() + 1));

    const { data: attendanceData, isLoading: attendanceLoading, refetch } = useEmployeeAttendance(id, { month: selectedMonth });

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
        refetch();
    };


    // Extract employee info from the first attendance record
    const employee = attendanceData?.records?.[0]?.employee || {};

    const stats = attendanceData?.stats || {};

    return (
        <section>
            <div className="flex items-center flex-col md:flex-row justify-between mt-3 md:mt-0">
                <div className="flex  gap-3">
                    <p className="text-muted-foreground mt-1 text-sm mb-3 md:mb-0"> الموظفين</p>
                    <span className="text-muted-foreground mt-1 text-sm"> / </span>
                    <p className="text-primary mt-1 text-sm">    سجل الحضور   </p>
                </div>

                <div className="flex gap-3">
                    <FormInput
                        name="month"
                        type="select"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        options={[
                            { value: '1', label: 'يناير' },
                            { value: '2', label: 'فبراير' },
                            { value: '3', label: 'مارس' },
                            { value: '4', label: 'أبريل' },
                            { value: '5', label: 'مايو' },
                            { value: '6', label: 'يونيو' },
                            { value: '7', label: 'يوليو' },
                            { value: '8', label: 'أغسطس' },
                            { value: '9', label: 'سبتمبر' },
                            { value: '10', label: 'أكتوبر' },
                            { value: '11', label: 'نوفمبر' },
                            { value: '12', label: 'ديسمبر' },
                        ]}
                        placeholder="اختر الشهر"
                        className="min-w-[150px] bg-white"
                    />
                    <Button className="flex items-center px-5  gap-1.5 h-10">
                        <Download className="w-5 h-5" />
                        طباعة
                    </Button>
                </div>

            </div>
            {
                attendanceLoading ? <div className="p-4 text-center text-muted-foreground">جاري التحميل...</div> : (
                    <>
                        <Card className="mt-5 px-4" >

                            <div className="flex justify-between">
                                <div className="flex gap-2 md:items-center md:gap-4">
                                    <Avatar
                                        className="h-15 w-15 md:h-24 md:w-24"
                                    >
                                        <AvatarImage src={employee.profile_image_url} alt={employee.name} />
                                        <AvatarFallback>{employee.name?.charAt(0) || "E"}</AvatarFallback>
                                    </Avatar>

                                    <div>
                                        <p className=" font-medium   md:text-lg">   {employee.name || "—"}     </p>
                                        <p className="text-[#585959] mt-1 text-xs md:text-sm">   {employee.job_title || "—"}     </p>
                                    </div>
                                </div>

                                <Badge
                                    className="flex items-center gap-1.5 px-3 h-7"
                                    style={{
                                        backgroundColor: "#bef8c293",
                                        color: "#26BF66",
                                        border: "none",
                                        borderRadius: "6px",
                                    }}
                                >
                                    ID: {employee.employee_code || "—"}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:mt-5">
                                <div className="flex items-center gap-2 mt-5">
                                    <img src={imgHour} alt="present" className="h-7 w-7  md:h-12 md:w-12" />
                                    <div>
                                        <p className="font-bold md:text-2xl">{stats.total_work_hours || 0}</p>
                                        <p className="text-[#585959] mt-1 text-xs md:text-sm">ساعات العمل</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-5">
                                    <img src={imgLate} alt="present" className="h-7 w-7  md:h-12 md:w-12" />
                                    <div>
                                        <p className="font-bold md:text-2xl">{stats.total_late_days || 0}</p>
                                        <p className="text-[#585959] mt-1 text-xs md:text-sm">أيام التأخير</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-5">
                                    <img src={imgAttend} alt="present" className="h-7 w-7  md:h-12 md:w-12" />
                                    <div>
                                        <p className="font-bold md:text-2xl">{stats.total_absent_days || 0}</p>
                                        <p className="text-[#585959] mt-1 text-xs md:text-sm">أيام الغياب</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-5">
                                    <img src={imgPlus} alt="present" className="h-7 w-7  md:h-12 md:w-12" />
                                    <div>
                                        <p className="font-bold md:text-2xl">{stats.total_overtime_hours || 0}</p>
                                        <p className="text-[#585959] mt-1 text-xs md:text-sm">ساعات إضافية</p>
                                    </div>
                                </div>
                            </div>

                        </Card>
                        <Attendancelog employeeId={id} month={selectedMonth} />
                    </>
                )}

        </section >
    )
}

export default EmployeeAttendance