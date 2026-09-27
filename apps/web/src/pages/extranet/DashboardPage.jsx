import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

function StatCard({ label, value, hint }) {
	return (
		<Card>
			<CardHeader className="pb-2">
				<CardDescription>{label}</CardDescription>
				<CardTitle className="text-2xl">{value}</CardTitle>
			</CardHeader>
			{hint ? (
				<CardContent className="pt-0 text-xs text-muted-foreground">{hint}</CardContent>
			) : null}
		</Card>
	);
}

export default function DashboardPage() {
	const { profile, currentOrganization, currentRole, memberships, hasRole } = useAuth();
	const [enabledModuleCount, setEnabledModuleCount] = useState(null);
	const [auditLogs, setAuditLogs] = useState(null);
	const [auditError, setAuditError] = useState(null);

	const canReadAuditLogs = currentOrganization ? hasRole(['super_admin', 'direction']) : false;

	useEffect(() => {
		let isMounted = true;

		async function loadModuleCount() {
			let query = supabase.from('navigation_items').select('id', { count: 'exact', head: true }).eq('enabled', true);
			query = currentOrganization
				? query.or(`organization_id.is.null,organization_id.eq.${currentOrganization.id}`)
				: query.is('organization_id', null);

			const { count, error } = await query;
			if (!isMounted) return;
			if (error) {
				console.error('Failed to count navigation_items:', error.message);
				setEnabledModuleCount(0);
			} else {
				setEnabledModuleCount(count ?? 0);
			}
		}

		loadModuleCount();
		return () => {
			isMounted = false;
		};
	}, [currentOrganization]);

	useEffect(() => {
		if (!canReadAuditLogs || !currentOrganization) {
			setAuditLogs(null);
			return undefined;
		}

		let isMounted = true;

		async function loadAuditLogs() {
			const { data, error } = await supabase
				.from('audit_logs')
				.select('id, action, entity_type, entity_id, created_at')
				.eq('organization_id', currentOrganization.id)
				.order('created_at', { ascending: false })
				.limit(10);

			if (!isMounted) return;
			if (error) {
				setAuditError(error.message);
			} else {
				setAuditLogs(data ?? []);
			}
		}

		loadAuditLogs();
		return () => {
			isMounted = false;
		};
	}, [canReadAuditLogs, currentOrganization]);

	return (
		<div className="space-y-6">
			<Helmet>
				<title>Dashboard — SWU-VISION Extranet</title>
			</Helmet>

			<div>
				<h1 className="text-2xl font-semibold">Dashboard</h1>
				<p className="text-sm text-muted-foreground">
					Signed in as {profile?.email ?? '—'}
					{currentOrganization ? ` · ${currentOrganization.name}` : ''}
					{currentRole ? ` · ${currentRole.label}` : ''}
				</p>
			</div>

			{memberships.length === 0 ? (
				<Alert>
					<AlertTitle>No organization assigned yet</AlertTitle>
					<AlertDescription>
						Your account exists but has not been added to an organization. Ask a super admin or a member of
						direction to add you to one — most of the Extranet is empty until then.
					</AlertDescription>
				</Alert>
			) : null}

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<StatCard label="Organization" value={currentOrganization?.name ?? '—'} />
				<StatCard label="Role" value={currentRole?.label ?? '—'} />
				<StatCard
					label="Enabled modules"
					value={enabledModuleCount ?? '…'}
					hint="Modules turned on for this organization in navigation_items."
				/>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Recent activity</CardTitle>
					<CardDescription>
						{canReadAuditLogs
							? 'Latest audit log entries for this organization.'
							: 'Visible to Direction and Super Admin only.'}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{!canReadAuditLogs ? (
						<p className="text-sm text-muted-foreground">You do not have permission to view audit logs.</p>
					) : auditError ? (
						<Alert variant="destructive">
							<AlertDescription>{auditError}</AlertDescription>
						</Alert>
					) : auditLogs === null ? (
						<p className="text-sm text-muted-foreground">Loading…</p>
					) : auditLogs.length === 0 ? (
						<p className="text-sm text-muted-foreground">No activity recorded yet.</p>
					) : (
						<ul className="divide-y divide-border text-sm">
							{auditLogs.map((log) => (
								<li key={log.id} className="flex items-center justify-between py-2">
									<span>
										{log.action}
										{log.entity_type ? ` · ${log.entity_type}` : ''}
									</span>
									<span className="text-xs text-muted-foreground">
										{new Date(log.created_at).toLocaleString()}
									</span>
								</li>
							))}
						</ul>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
