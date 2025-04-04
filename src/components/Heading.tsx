import { Container } from "./Container";
import type { FC, ReactNode } from "react";

type HeadingProps = {
	headingTitle: string;
	headingSubtitle: string;
	children?: ReactNode;
};

export const Heading: FC<HeadingProps> = ({
	headingSubtitle,
	headingTitle,
	children,
}) => {
	return (
		<div className="py-4 border-b border-border-200">
			<Container className="flex justify-between py-4 items-center">
				<div>
					<h1 className="text-lg text-left font-semibold">{headingTitle}</h1>
					<p className="text-d-secondary">{headingSubtitle}</p>
				</div>
				{children}
			</Container>
		</div>
	);
};
