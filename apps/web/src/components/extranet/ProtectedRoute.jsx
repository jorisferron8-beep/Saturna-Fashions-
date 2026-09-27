import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * Gates a route behind a real Supabase session, and optionally behind a
 * specific role within the user's current organization. Unauthenticated
 * users go to /login (with a return path); authenticated users missing a
 * required role go to /403 — never silently rendered as if authorized.
 */
export default function ProtectedRoute({ children, requireRole }) {
	const { loading, session, hasRole, isSupabaseConfigured } = useAuth();
	const location = useLocation();

	if (!isSupabaseConfigured) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-ink p-6 text-center text-paper">
				<p className="max-w-md text-sm text-paper/70">
					Supabase is not configured for this environment. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
					(see apps/web/.env.example).
				</p>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-ink text-paper">
				<p className="text-sm text-paper/70">Loading…</p>
			</div>
		);
	}

	if (!session) {
		return <Navigate to="/login" replace state={{ from: location.pathname }} />;
	}

	if (requireRole && !hasRole(requireRole)) {
		return <Navigate to="/403" replace />;
	}

	return children;
}
