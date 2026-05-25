"use client";

import { useQuery } from '@tanstack/react-query';

export interface UserProfile {
  id: string;
  tenant_id: string;
  auth_id: string;
  email: string;
  role: 'owner' | 'admin' | 'manager' | 'seller' | 'viewer';
  full_name: string;
  phone: string;
}

export function useTenant() {
  return useQuery({
    queryKey: ['tenant-profile'],
    queryFn: async () => {
      // Return a simulated user profile for local and Vercel use
      return {
        id: 'manuel-mayora-user-id',
        tenant_id: 'growco-tenant-id',
        auth_id: 'manuel-auth-id',
        email: 'manuel@growcoai.com',
        role: 'owner',
        full_name: 'Manuel Mayora',
        phone: '+503 7000-0000',
      } as UserProfile;
    },
  });
}
