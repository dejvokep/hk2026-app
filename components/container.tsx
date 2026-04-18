import {ComponentProps, ReactNode} from "react";
import {cn} from "@/lib/utils";

export default function Container({children, className, ...props}: {children: ReactNode} & ComponentProps<"div">) {
    return <div className={cn("p-5 rounded-2xl bg-[#16151A]", className)} {...props}>{children}</div>;
}