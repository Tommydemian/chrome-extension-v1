import type { FC, ReactNode } from "react";

type FooterProps = {
	children: ReactNode;
};

export const Footer: FC<FooterProps> = ({ children }) => {
	return (
		<footer className="h-12 flex text-sm items-center justify-center border bg-secondary border-border-200 w-full fixed bottom-0">
			{children}
		</footer>
	);
};
