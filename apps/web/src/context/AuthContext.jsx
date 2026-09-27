import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { logAuditEvent } from '@/lib/auditLog';

const AuthContext = createContext(null);

/**
 * Loads the signed-in user's profile plus every organization they belong
 * to (with the joined role). A user can have zero memberships right after
 * sign-up — that is a real, valid state (nobody has assigned them to an
 * organization yet), never treated as an error.
 */
async function loadProfileAndMemberships(userId) {
	const [{ data: profile, error: profileError }, { data: memberships, error: membershipError }] = await Promise.all([
		supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
		supabase
			.from('organization_members')
			.select('id, status, organization:organizations(id, name, slug, status), role:roles(id, key, label)')
			.eq('profile_id', userId)
			.eq('status', 'active'),
	]);

	if (profileError) throw profileError;
	if (membershipError) throw membershipError;

	return { profile: profile ?? null, memberships: memberships ?? [] };
}

export function AuthProvider({ children }) {
	const [session, setSession] = useState(null);
	const [profile, setProfile] = useState(null);
	const [memberships, setMemberships] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const hydrate = useCallback(async (nextSession) => {
		setSession(nextSession);

		if (!nextSession?.user) {
			setProfile(null);
			setMemberships([]);
			return;
		}

		try {
			const { profile: nextProfile, memberships: nextMemberships } = await loadProfileAndMemberships(
				nextSession.user.id,
			);
			setProfile(nextProfile);
			setMemberships(nextMemberships);
			setError(null);
		} catch (err) {
			setError(err);
		}
	}, []);

	useEffect(() => {
		if (!isSupabaseConfigured) {
			setLoading(false);
			return undefined;
		}

		let isMounted = true;

		supabase.auth.getSession().then(async ({ data }) => {
			if (!isMounted) return;
			await hydrate(data.session);
			if (isMounted) setLoading(false);
		});

		const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
			if (!isMounted) return;
			await hydrate(nextSession);
		});

		return () => {
			isMounted = false;
			subscription.subscription.unsubscribe();
		};
	}, [hydrate]);

	const signIn = useCallback(async (email, password) => {
		const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
		if (signInError) throw signInError;
		await logAuditEvent({ action: 'auth.login' });
	}, []);

	const signUp = useCallback(async (email, password, fullName) => {
		const { error: signUpError } = await supabase.auth.signUp({
			email,
			password,
			options: { data: { full_name: fullName } },
		});
		if (signUpError) throw signUpError;
	}, []);

	const currentOrganization = memberships[0]?.organization ?? null;
	const currentRole = memberships[0]?.role ?? null;

	const signOut = useCallback(async () => {
		// Log while the session is still valid — log_audit_event requires
		// an authenticated caller, so this must happen before signOut().
		await logAuditEvent({ organizationId: currentOrganization?.id ?? null, action: 'auth.logout' });
		await supabase.auth.signOut();
	}, [currentOrganization]);

	const refreshMemberships = useCallback(async () => {
		if (!session?.user) return;
		const { profile: nextProfile, memberships: nextMemberships } = await loadProfileAndMemberships(session.user.id);
		setProfile(nextProfile);
		setMemberships(nextMemberships);
	}, [session]);

	const updateProfile = useCallback(
		async (updates) => {
			if (!session?.user) return;
			const { error: updateError } = await supabase.from('profiles').update(updates).eq('id', session.user.id);
			if (updateError) throw updateError;
			await logAuditEvent({
				organizationId: currentOrganization?.id ?? null,
				action: 'profile.updated',
				entityType: 'profile',
				entityId: session.user.id,
				metadata: { fields: Object.keys(updates) },
			});
			await refreshMemberships();
		},
		[session, currentOrganization, refreshMemberships],
	);

	const hasRole = useCallback(
		(roleKeys, organizationId) => {
			const targetOrgId = organizationId ?? currentOrganization?.id;
			if (!targetOrgId) return false;
			return memberships.some((m) => m.organization?.id === targetOrgId && roleKeys.includes(m.role?.key));
		},
		[memberships, currentOrganization],
	);

	const value = useMemo(
		() => ({
			isSupabaseConfigured,
			loading,
			error,
			session,
			user: session?.user ?? null,
			profile,
			memberships,
			currentOrganization,
			currentRole,
			hasRole,
			signIn,
			signUp,
			signOut,
			refreshMemberships,
			updateProfile,
		}),
		[
			loading,
			error,
			session,
			profile,
			memberships,
			currentOrganization,
			currentRole,
			hasRole,
			signIn,
			signUp,
			signOut,
			refreshMemberships,
			updateProfile,
		],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return ctx;
}
