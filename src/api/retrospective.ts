import { API_ENDPOINTS } from './config';
import type { ApiResponse } from './types/common';
import type {
  GuideRetrospectiveRequest,
  GuideRetrospectiveResult,
  RefineRetrospectiveRequest,
  RefineRetrospectiveResult,
} from './types/retrospective';

export async function refineRetrospective(
  request: RefineRetrospectiveRequest
): Promise<ApiResponse<RefineRetrospectiveResult>> {
  const response = await fetch(`${API_ENDPOINTS.RETROSPECTIVE.REFINE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  console.log(response);

  return response.json();
}

export async function guideRetrospective(
  request: GuideRetrospectiveRequest
): Promise<ApiResponse<GuideRetrospectiveResult>> {
  const response = await fetch(`${API_ENDPOINTS.RETROSPECTIVE.GUIDE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  return response.json();
}
