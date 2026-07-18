import { useCrud } from './useCrud';

/**
 * Hook to fetch requests with filtering and pagination
 * @param {Object} filters - Optional filters (search, request_type, status, department, date, limit)
 * @returns {Object} Query result with requests data
 */
export function useRequests(filters = {}) {
  const { search, request_type, status, department, date, limit } = filters;

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (search) queryParams.append('search', search);
  if (request_type) queryParams.append('request_type', request_type);
  if (status) queryParams.append('status', status);
  if (department) queryParams.append('department', department);
  if (date) queryParams.append('date', date);
  if (limit) queryParams.append('limit', limit);

  const queryString = queryParams.toString();
  const endpoint = `/requests${queryString ? `?${queryString}` : ''}`;

  const crud = useCrud({
    queryKey: ["requests", filters],
    endpoint,
    enabled: true,
    staleTime: 300000, // 5 minutes
    select: (data) => {
      const responseData = data?.data || data;
      if (responseData?.requests) {
        return { requests: responseData.requests, total: responseData.total };
      }
      if (Array.isArray(responseData)) {
        return { requests: responseData, total: responseData.length };
      }
      return { requests: [], total: 0 };
    },
  });

  return {
    ...crud,
    data: crud.data,
  };
}

/**
 * Hook to review a request (approve/reject)
 * @returns {Object} Mutation functions for reviewing requests
 */
export function useReviewRequest() {
  const crud = useCrud({
    queryKey: ["review-request"],
    endpoint: "/requests",
  });

  const reviewRequest = async (requestId, status) => {
    return crud.updateItem({
      endpoint: `/requests/${requestId}/review`,
      body: { status },
      method: 'patch',
      skipId: true,
      useJsonPayload: true,
    });
  };

  return {
    reviewRequest,
    isReviewing: crud.updating, 
  };
}

/**
 * Hook to delete a request
 * @returns {Object} Mutation functions for deleting requests
 */
export function useDeleteRequest() {
  const crud = useCrud({
    queryKey: ["delete-request"],
    endpoint: "/requests",
  });

  const deleteRequest = async (requestId) => {
    return crud.deleteItem(`/requests/${requestId}`);
  };

  return {
    deleteRequest,
    isDeleting: crud.deleting,  
  };
}

/**
 * Hook to get request details by ID
 * @param {string} requestId - The request ID
 * @returns {Object} Query result with request details
 */
export function useRequestDetails(requestId) {
  const crud = useCrud({
    queryKey: ["request-details", requestId],
    endpoint: `/requests/${requestId}`,
    enabled: !!requestId,
    staleTime: 300000, // 5 minutes
    select: (data) => {
      const responseData = data?.data || data;
      return responseData;
    },
  });

  return {
    ...crud,
    data: crud.data,
  };
}
