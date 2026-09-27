import { supabase } from '@/lib/supabaseClient';

/**
 * Records an audit event via the `log_audit_event` RPC — the only path
 * into `audit_logs`. The actor and organization membership are derived
 * server-side from the caller's own session, so this can never be used
 * to write an entry on someone else's behalf.
 *
 * Failures are logged but never thrown: audit logging must not block the
 * user-facing action it is describing (a login must still succeed even
 * if, say, the network drops the audit write).
 */
export async function logAuditEvent({ organizationId = null, action, entityType = null, entityId = null, metadata = {} }) {
	if (!supabase) return;

	const { error } = await supabase.rpc('log_audit_event', {
		p_organization_id: organizationId,
		p_action: action,
		p_entity_type: entityType,
		p_entity_id: entityId,
		p_metadata: metadata,
	});

	if (error) {
		console.error(`Audit log failed for action "${action}":`, error.message);
	}
}
