import { useState } from "react";

export const useRequestFilters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState("all");

  const matchesDateFilter = (dateStr) => {
    if (filterDate === "all") return true;
    
    const requestDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (filterDate === "today") {
      const checkDate = new Date(requestDate);
      checkDate.setHours(0, 0, 0, 0);
      return checkDate.getTime() === today.getTime();
    }
    
    if (filterDate === "week") {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      return requestDate >= weekStart && requestDate <= weekEnd;
    }
    
    if (filterDate === "month") {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);
      return requestDate >= monthStart && requestDate <= monthEnd;
    }
    
    return true;
  };

  const matchesCommonFilters = (request) => {
    const matchesSearch = request.employee.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    const matchesDepartment = filterDepartment === "all" || request.department === filterDepartment;
    const dateField = request.fromDate || request.date;
    const matchesDate = matchesDateFilter(dateField);
    return matchesSearch && matchesStatus && matchesDepartment && matchesDate;
  };

  return {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterDepartment,
    setFilterDepartment,
    filterType,
    setFilterType,
    filterDate,
    setFilterDate,
    matchesCommonFilters,
  };
};
