import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
	const { session, signIn, signUp, loading } = useAuth();
	const location = useLocation();
	const [mode, setMode] = useState('signIn');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [fullName, setFullName] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const [info, setInfo] = useState(null);

	if (!loading && session) {
		const from = location.state?.from || '/dashboard';
		return <Navigate to={from} replace />;
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		setSubmitting(true);
		setError(null);
		setInfo(null);

		try {
			if (mode === 'signIn') {
				await signIn(email, password);
			} else {
				await signUp(email, password, fullName);
				setInfo('Account created. Check your email if confirmation is required, then sign in.');
				setMode('signIn');
			}
		} catch (err) {
			setError(err.message || 'Authentication failed.');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-ink px-4 text-paper">
			<Helmet>
				<title>SWU-VISION Extranet — Sign in</title>
			</Helmet>
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>SWU-VISION Extranet</CardTitle>
					<CardDescription>{mode === 'signIn' ? 'Sign in to continue' : 'Create an account'}</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="space-y-4" onSubmit={handleSubmit}>
						{mode === 'signUp' ? (
							<div className="space-y-2">
								<Label htmlFor="fullName">Full name</Label>
								<Input
									id="fullName"
									value={fullName}
									onChange={(e) => setFullName(e.target.value)}
									required
								/>
							</div>
						) : null}
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								autoComplete="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
								minLength={6}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						{error ? (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						) : null}
						{info ? (
							<Alert>
								<AlertDescription>{info}</AlertDescription>
							</Alert>
						) : null}

						<Button type="submit" className="w-full" disabled={submitting}>
							{submitting ? 'Please wait…' : mode === 'signIn' ? 'Sign in' : 'Create account'}
						</Button>
					</form>

					<button
						type="button"
						className="mt-4 w-full text-center text-xs text-paper/60 underline-offset-4 hover:underline"
						onClick={() => {
							setError(null);
							setInfo(null);
							setMode((m) => (m === 'signIn' ? 'signUp' : 'signIn'));
						}}
					>
						{mode === 'signIn' ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
					</button>
				</CardContent>
			</Card>
		</div>
	);
}
