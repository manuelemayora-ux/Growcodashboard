"use client";

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

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
  const supabase = createClient();

  return useQuery({
    queryKey: ['tenant-profile'],
    queryFn: async () => {
      // 1. Get auth user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error(authError?.message || 'Not authenticated');

      // 2. Get user profile from db
      const { data: profile, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', user.id)
        .maybeSingle();

      if (dbError) throw dbError;

      // 3. Fallback/Auto-onboarding if profile doesn't exist yet (e.g. testing)
      if (!profile) {
        console.log("No profile found for authenticated user, trying to auto-create or return default");
        
        // Let's check if there is an existing tenant, or create one for testing
        const { data: tenants } = await supabase.from('tenants').select('*').limit(1);
        let tenantId = tenants?.[0]?.id;

        if (!tenantId) {
          // Create dummy tenant for testing
          const { data: newTenant, error: tErr } = await supabase
            .from('tenants')
            .insert({ name: 'Óptica Principal', slug: 'optica-principal-' + Date.now().toString().slice(-4) })
            .select()
            .single();
          if (tErr) throw tErr;
          tenantId = newTenant.id;
        }

        // Create user profile
        const { data: newProfile, error: uErr } = await supabase
          .from('users')
          .insert({
            tenant_id: tenantId,
            auth_id: user.id,
            email: user.email || '',
            role: 'owner',
            full_name: user.user_metadata?.full_name || 'Administrador',
          })
          .select()
          .single();

        if (uErr) throw uErr;
        return newProfile as UserProfile;
      }

      return profile as UserProfile;
    },
  });
}
