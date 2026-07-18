import { useCrud } from './useCrud';

export function useAttendance(filters = {}) {
  const { year, month, page, limit, search, status } = filters;

  const queryParams = new URLSearchParams();
  if (year) queryParams.append('year', year);
  if (month) queryParams.append('month', month);
  if (page) queryParams.append('page', page);
  if (limit) queryParams.append('limit', limit);
  if (search) queryParams.append('search', search);
  if (status) queryParams.append('status', status);

  const queryString = queryParams.toString();
  const endpoint = `/attendance${queryString ? `?${queryString}` : ''}`;

  const crud = useCrud({
    queryKey: ["attendance", filters],
    endpoint,
    enabled: true,
    staleTime: 300000,
    select: (data) => {
      const responseData = data?.data || data;
      const records = responseData?.records ?? [];
      const total = responseData?.total ?? records.length;
      const currentLimit = limit || 10;
      const totalPages = Math.max(1, Math.ceil(total / currentLimit));

      return { records, total, totalPages };
    },
  });

  return { ...crud };
}