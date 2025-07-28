// hooks/useSurveySummary.ts
import { useQuery } from '@tanstack/react-query';
import { fetchSurveySummary } from './api';

export const useSurveySummary = (businessUserId: string, role: string) => {
  return useQuery({
    queryKey: ['surveySummary', businessUserId, role],
    queryFn: () => fetchSurveySummary(businessUserId, role),
  });
};
