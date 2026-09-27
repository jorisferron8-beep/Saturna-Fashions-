import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink px-4 text-center text-paper">
			<Helmet>
				<title>403 — Unauthorized</title>
			</Helmet>
			<h1 className="text-3xl font-semibold">403 — Unauthorized</h1>
			<p className="max-w-md text-sm text-paper/70">
				Your account does not have the role required to view this page.
			</p>
			<Button asChild>
				<Link to="/dashboard">Back to dashboard</Link>
			</Button>
		</div>
	);
}
