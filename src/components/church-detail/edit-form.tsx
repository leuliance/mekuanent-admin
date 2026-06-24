import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { LOCALES } from "@/stores/locale-store";
import { FieldError } from "./field-error";
import { SectionCard } from "./section-card";

export function EditForm({
	form,
}: {
	// biome-ignore lint/suspicious/noExplicitAny: TanStack Form typing with dynamic field names
	form: any;
}) {
	return (
		<div className="space-y-6">
			{/* Name & Language */}
			<SectionCard title="Church Name *">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<form.Field name="name">
						{(field: {
							state: { value: string; meta: { errors: unknown[] } };
							handleChange: (v: string) => void;
							handleBlur: () => void;
						}) => (
							<div className="space-y-1.5">
								<Label className="text-xs">Name *</Label>
								<Input
									placeholder="Church name"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
								/>
								<FieldError errors={field.state.meta.errors} />
							</div>
						)}
					</form.Field>
					<form.Field name="language">
						{(field: {
							state: { value: string };
							handleChange: (v: string) => void;
						}) => (
							<div className="space-y-1.5">
								<Label className="text-xs">Language *</Label>
								<Select
									value={field.state.value}
									onValueChange={(value) => field.handleChange(value || "en")}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{LOCALES.map((loc) => (
											<SelectItem key={loc.value} value={loc.value}>
												{loc.nativeLabel}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}
					</form.Field>
				</div>
			</SectionCard>

			{/* Basic Information */}
			<SectionCard title="Basic Information">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<form.Field name="category">
						{(field: {
							state: { value: string };
							handleChange: (v: string) => void;
						}) => (
							<div className="space-y-1.5">
								<Label className="text-xs">Category *</Label>
								<Select
									value={field.state.value}
									onValueChange={(value) => field.handleChange(value || "")}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="church">Church</SelectItem>
										<SelectItem value="monastery">Monastery</SelectItem>
										<SelectItem value="female-monastery">
											Female Monastery
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						)}
					</form.Field>
					<form.Field name="phone_number">
						{(field: {
							state: { value: string; meta: { errors: unknown[] } };
							handleChange: (v: string) => void;
							handleBlur: () => void;
						}) => (
							<div className="space-y-1.5">
								<Label className="text-xs">Phone Number *</Label>
								<Input
									placeholder="+251..."
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
								/>
								<FieldError errors={field.state.meta.errors} />
							</div>
						)}
					</form.Field>
					<form.Field name="email">
						{(field: {
							state: { value: string };
							handleChange: (v: string) => void;
						}) => (
							<div className="space-y-1.5">
								<Label className="text-xs">Email</Label>
								<Input
									type="email"
									placeholder="email@example.com"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
							</div>
						)}
					</form.Field>
					<form.Field name="website">
						{(field: {
							state: { value: string };
							handleChange: (v: string) => void;
						}) => (
							<div className="space-y-1.5">
								<Label className="text-xs">Website</Label>
								<Input
									placeholder="https://..."
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
							</div>
						)}
					</form.Field>
					<form.Field name="founded_year">
						{(field: {
							state: { value: string };
							handleChange: (v: string) => void;
						}) => (
							<div className="space-y-1.5">
								<Label className="text-xs">Founded Year</Label>
								<Input
									type="number"
									placeholder="1900"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
							</div>
						)}
					</form.Field>
				</div>
			</SectionCard>

			{/* Description */}
			<SectionCard title="Description *">
				<form.Field name="description">
					{(field: {
						state: { value: string; meta: { errors: unknown[] } };
						handleChange: (v: string) => void;
					}) => (
						<div className="space-y-1.5">
							<RichTextEditor
								value={field.state.value}
								onChange={(html) => field.handleChange(html)}
								placeholder="Describe the church..."
							/>
							<FieldError errors={field.state.meta.errors} />
						</div>
					)}
				</form.Field>
			</SectionCard>

			{/* Location */}
			<SectionCard title="Location">
				<div className="grid grid-cols-1 gap-3">
					<form.Field name="city">
						{(field: {
							state: { value: string };
							handleChange: (v: string) => void;
						}) => (
							<div className="space-y-1.5">
								<Label className="text-xs">City</Label>
								<Input
									placeholder="City"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
							</div>
						)}
					</form.Field>
					<form.Field name="address">
						{(field: {
							state: { value: string };
							handleChange: (v: string) => void;
						}) => (
							<div className="space-y-1.5">
								<Label className="text-xs">Address</Label>
								<Input
									placeholder="Address"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
							</div>
						)}
					</form.Field>
					<form.Field name="country">
						{(field: {
							state: { value: string };
							handleChange: (v: string) => void;
						}) => (
							<div className="space-y-1.5">
								<Label className="text-xs">Country</Label>
								<Input
									placeholder="Country"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
							</div>
						)}
					</form.Field>
				</div>
			</SectionCard>
		</div>
	);
}
