import type { ReactNode } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type ResponsiveTabItem = {
	value: string;
	label: string;
	/** Optional trigger content for desktop tab list only */
	trigger?: ReactNode;
};

type ResponsiveTabsProps = {
	value: string;
	onValueChange: (value: string) => void;
	items: ResponsiveTabItem[];
	children: ReactNode;
	className?: string;
	listClassName?: string;
	selectPlaceholder?: string;
};

/**
 * Renders a tab list on `md+` and a full-width Select on small screens.
 */
export function ResponsiveTabs({
	value,
	onValueChange,
	items,
	children,
	className,
	listClassName,
	selectPlaceholder = "Section",
}: ResponsiveTabsProps) {
	return (
		<Tabs
			value={value}
			onValueChange={onValueChange}
			className={cn("w-full", className)}
		>
			<div className="mb-3 md:hidden">
				<Select
					value={value}
					onValueChange={(v) => {
						if (v != null) onValueChange(v);
					}}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder={selectPlaceholder} />
					</SelectTrigger>
					<SelectContent>
						{items.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<TabsList
				className={cn(
					"hidden h-auto w-full flex-wrap justify-start gap-1 md:flex",
					listClassName,
				)}
			>
				{items.map((item) => (
					<TabsTrigger
						key={item.value}
						value={item.value}
						className="shrink-0 data-[state=active]:shadow-sm"
					>
						{item.trigger ?? item.label}
					</TabsTrigger>
				))}
			</TabsList>

			{children}
		</Tabs>
	);
}
