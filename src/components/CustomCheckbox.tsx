import type { FC } from "react";
import { cn } from "../utils/cn";
import { Check } from "lucide-react";

type CustomCheckboxProps = {
	checked: boolean;
	onChange: (domain: string) => void;
	domain: string;
};
export const CustomCheckbox: FC<CustomCheckboxProps> = ({
	checked,
	onChange,
	domain,
}) => {
	return (
		<div
			onKeyUp={() => onChange(domain)}
			onClick={() => onChange(domain)}
			className={cn(
				"h-4 w-4 rounded-sm border cursor-pointer mr-2 flex items-center justify-center transition-all",
				checked
					? "bg-accent border-accent"
					: "bg-d-secondary border-d-secondary",
			)}
		>
			{checked && (
				<span>
					<Check className="w-4 h-4" />
				</span>
			)}
		</div>
	);
};
