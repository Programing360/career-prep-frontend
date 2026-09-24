import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import type { UserRole } from '@/types/auth';

// ==========================================
// TYPES (mirror the backend invitation contracts)
// ==========================================

/** Payload for POST /invitations (admin only) */
export interface SendInvitationPayload {
  email: string;
  role: 'admin' | 'moderator';
}

export interface SendInvitationResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    email: string;
    role: UserRole;
  };
  /** Development-only convenience fields */
  devInviteToken?: string;
  devInviteUrl?: string;
}

/** Response from GET /invitations/verify/:token */
export interface VerifyInvitationResponse {
  success: boolean;
  data: {
    valid: boolean;
    email: string;
    role: 'admin' | 'moderator';
  };
}

/** Payload for POST /invitations/accept */
export interface AcceptInvitationPayload {
  token: string;
  password: string;
}

// ==========================================
// INVITATION API METHODS
// ==========================================

/**
 * Send a staff invitation email (Admin only).
 * POST /api/v1/invitations
 */
export async function sendInvitation(
  payload: SendInvitationPayload
): Promise<SendInvitationResponse> {
  const { data } = await api.post<SendInvitationResponse>(
    API_ENDPOINTS.INVITATIONS.BASE,
    payload
  );
  return data;
}

/**
 * Verify an invitation token before showing the accept form.
 * GET /api/v1/invitations/verify/:token
 */
export async function verifyInvitationToken(
  token: string
): Promise<VerifyInvitationResponse> {
  const { data } = await api.get<VerifyInvitationResponse>(
    API_ENDPOINTS.INVITATIONS.VERIFY(encodeURIComponent(token))
  );
  return data;
}

/**
 * Accept the invitation and set the staff member's password.
 * POST /api/v1/invitations/accept
 */
export async function acceptInvitation(
  payload: AcceptInvitationPayload
): Promise<{ success: boolean; message?: string }> {
  const { data } = await api.post<{ success: boolean; message?: string }>(
    API_ENDPOINTS.INVITATIONS.ACCEPT,
    payload
  );
  return data;
}
