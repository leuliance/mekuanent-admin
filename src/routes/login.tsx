import { useForm } from "@tanstack/react-form";
import {
	createFileRoute,
	redirect,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import { Church, Loader2 } from "lucide-react";
import { useState } from "react";
import { loginAdmin } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/lib/validations/auth";

export const Route = createFileRoute("/login")({
	beforeLoad: async ({ context }) => {
		// Redirect to dashboard if already logged in
		if (context.user) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: LoginPage,
});

function LoginPage() {
	const router = useRouter();
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onChange: loginSchema,
		},
		onSubmit: async ({ value }) => {
			setIsLoading(true);
			setError(null);
			try {
				await loginAdmin({ data: value });
				await router.invalidate();
				await navigate({ to: "/dashboard" });
			} catch (err) {
				setError(err instanceof Error ? err.message : "Login failed");
			}
			setIsLoading(false);
		},
	});

	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4">
			<div className="w-full max-w-md">
				<div className="bg-card border rounded-2xl p-6 sm:p-8 shadow-xl">
					{/* Logo and Title */}
					<div className="text-center mb-8">
						<div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4">
							<Church className="w-8 h-8 text-white" />
						</div>
						<h1 className="text-2xl font-bold text-foreground">
							Mekuanent Admin
						</h1>
						<p className="text-muted-foreground mt-2">
							Sign in to manage your church platform
						</p>
					</div>

					{/* Error Message */}
					{error && (
						<div className="mb-6 p-4 bg-destructive/10 border border-destructive/40 rounded-lg">
							<p className="text-destructive text-sm text-center">{error}</p>
						</div>
					)}

					{/* Login Form */}
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="space-y-6"
					>
						{/* Email Field */}
						<form.Field name="email">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="admin@example.com"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
									/>
									{field.state.meta.errors.length > 0 && (
										<p className="text-destructive text-sm">
											{typeof field.state.meta.errors[0] === "string"
												? field.state.meta.errors[0]
												: field.state.meta.errors[0]?.message}
										</p>
									)}
								</div>
							)}
						</form.Field>

						{/* Password Field */}
						<form.Field name="password">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										type="password"
										placeholder="Enter your password"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
									/>
									{field.state.meta.errors.length > 0 && (
										<p className="text-destructive text-sm">
											{typeof field.state.meta.errors[0] === "string"
												? field.state.meta.errors[0]
												: field.state.meta.errors[0]?.message}
										</p>
									)}
								</div>
							)}
						</form.Field>

						{/* Submit Button */}
						<Button
							type="submit"
							disabled={isLoading}
							className="w-full bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/25"
						>
							{isLoading ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Signing in...
								</>
							) : (
								"Sign In"
							)}
						</Button>
					</form>
				</div>

				{/* Footer */}
				<p className="text-center text-muted-foreground text-sm mt-6">
					Mekuanent Church Management Platform
				</p>
			</div>
		</div>
	);
}
