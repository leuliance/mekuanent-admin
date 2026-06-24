import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { Matcher } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePicker({
	value,
	onChange,
	placeholder = "Pick a date",
	disabled,
	fromDate,
	toDate,
	className,
}: {
	value?: Date;
	onChange: (date: Date | undefined) => void;
	placeholder?: string;
	disabled?: boolean;
	/** Minimum selectable date (inclusive). */
	fromDate?: Date;
	/** Maximum selectable date (inclusive). */
	toDate?: Date;
	className?: string;
}) {
	const [open, setOpen] = useState(false);

	const disabledMatchers: Matcher[] = [];
	if (fromDate) disabledMatchers.push({ before: fromDate });
	if (toDate) disabledMatchers.push({ after: toDate });

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				render={
					<Button
						type="button"
						variant="outline"
						disabled={disabled}
						className={cn(
							"w-full justify-start text-left font-normal",
							!value && "text-muted-foreground",
							className,
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
						{value ? format(value, "MMM d, yyyy") : placeholder}
					</Button>
				}
			/>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={value}
					defaultMonth={value}
					captionLayout="dropdown"
					startMonth={new Date(2015, 0)}
					endMonth={new Date(2040, 11)}
					disabled={disabledMatchers.length ? disabledMatchers : undefined}
					onSelect={(d) => {
						onChange(d ?? undefined);
						setOpen(false);
					}}
				/>
			</PopoverContent>
		</Popover>
	);
}
