import type { ReactNode, FC } from "react";
import { cn } from "../utils/cn";

type ContainerProps = {
	children: ReactNode;
	className?: string;
};

export const Container: FC<ContainerProps> = ({ children, className }) => {
	return (
		<div className={cn("max-w-7xl mx-auto box-content px-1", className)}>
			{children}
		</div>
	);
};
