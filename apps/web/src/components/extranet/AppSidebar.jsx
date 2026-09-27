import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
	LayoutDashboard,
	Building2,
	Package,
	ShoppingCart,
	Users,
	Boxes,
	BarChart3,
	Settings,
	LogOut,
	Circle,
} from 'lucide-react';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

const ICONS = {
	LayoutDashboard,
	Building2,
	Package,
	ShoppingCart,
	Users,
	Boxes,
	BarChart3,
	Settings,
};

/**
 * Loads navigation from `navigation_items` (global defaults where
 * organization_id is null, plus anything scoped to the user's org) and
 * renders only real, enabled, routed items as active links. Anything
 * without a route is shown disabled with a "Coming soon" badge — never a
 * fake working page.
 */
function useNavigationItems(organizationId) {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;

		async function load() {
			setLoading(true);
			let query = supabase
				.from('navigation_items')
				.select('*')
				.is('parent_id', null)
				.order('position', { ascending: true });

			query = organizationId
				? query.or(`organization_id.is.null,organization_id.eq.${organizationId}`)
				: query.is('organization_id', null);

			const { data, error } = await query;
			if (!isMounted) return;
			if (error) {
				console.error('Failed to load navigation_items:', error.message);
				setItems([]);
			} else {
				setItems(data ?? []);
			}
			setLoading(false);
		}

		load();
		return () => {
			isMounted = false;
		};
	}, [organizationId]);

	return { items, loading };
}

export default function AppSidebar() {
	const { profile, currentOrganization, currentRole, signOut } = useAuth();
	const { items } = useNavigationItems(currentOrganization?.id);
	const location = useLocation();

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<div className="flex items-center gap-2 px-2 py-1.5">
					<span className="text-sm font-semibold tracking-wide text-sidebar-foreground">SWU-VISION</span>
				</div>
				{currentOrganization ? (
					<p className="truncate px-2 text-xs text-sidebar-foreground/60">{currentOrganization.name}</p>
				) : null}
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Extranet</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => {
								const Icon = ICONS[item.icon] ?? Circle;
								const isImplemented = Boolean(item.route);
								const isActive = isImplemented && location.pathname === item.route;

								if (!isImplemented) {
									return (
										<SidebarMenuItem key={item.id}>
											<SidebarMenuButton disabled aria-disabled title={`${item.title} — coming soon`}>
												<Icon />
												<span>{item.title}</span>
											</SidebarMenuButton>
											<SidebarMenuBadge>Soon</SidebarMenuBadge>
										</SidebarMenuItem>
									);
								}

								return (
									<SidebarMenuItem key={item.id}>
										<SidebarMenuButton asChild isActive={isActive}>
											<Link to={item.route}>
												<Icon />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<div className="flex flex-col gap-1 px-2 py-1 text-xs text-sidebar-foreground/70">
					<span className="truncate font-medium text-sidebar-foreground">
						{profile?.full_name || profile?.email || '—'}
					</span>
					<span className="truncate">{currentRole?.label ?? 'No role assigned'}</span>
				</div>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton onClick={() => signOut()}>
							<LogOut />
							<span>Sign out</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
