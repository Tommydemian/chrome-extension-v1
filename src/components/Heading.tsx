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
		<div className="flex justify-between py-4 items-center border-b border-[#ffffff0d]">
			<div>
				<h1 className="text-lg text-left font-semibold">{headingTitle}</h1>
				<p className="text-d-secondary">{headingSubtitle}</p>
			</div>
			{children}
		</div>
	);
};
