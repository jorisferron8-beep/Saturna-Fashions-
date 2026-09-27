import { createClient } from '@supabase/supabase-js';

/**
 * Browser-side Supabase client for the SWU-VISION Extranet.
 *
 * Only the public URL and anon/publishable key ever belong here — this
 * module runs in a public storefront's bundle. Every table it can reach
 * is protected by RLS; a service-role key must never be added to this
 * file or any other file under apps/web.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
	console.error(
		'MISSING INTEGRATION: Supabase\nREQUIRED: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (see apps/web/.env.example)',
	);
}

export const supabase = isSupabaseConfigured
	? createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: true,
			autoRefreshToken: true,
			detectSessionInUrl: true,
		},
	})
	: null;
