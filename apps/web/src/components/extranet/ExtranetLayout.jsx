import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/extranet/AppSidebar';

export default function ExtranetLayout({ children }) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-12 items-center gap-2 border-b border-border px-3">
					<SidebarTrigger />
					<span className="text-sm text-muted-foreground">SWU-VISION Extranet</span>
				</header>
				<div className="flex-1 overflow-auto p-6">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
