import {Group} from "@/lib/types";
import Container from "@/components/container";
import {Avatar, AvatarGroup, AvatarImage} from "@/components/ui/avatar";
import ExclamationMark from "@/components/home/exclamation-mark";
import {useMemo} from "react";
import {formatDistanceToNow} from "date-fns";
import Link from "next/link";

export default function GroupCard({group}: {group: Group}) {
    const widget = useMemo(() => {
        if (group.due)
            return group.due < new Date().toISOString() ? <p className={"text-[#BF3333] text-[12px] flex items-center gap-1"}><ExclamationMark/>Past due</p>
                : <p className={"absolute top-0 right-0 text-[#D4C45A] text-[12px] flex items-center gap-1"}><ExclamationMark/>Due</p>

        return <div className={"text-[12px] text-right text-ligr"}>
            <p className={"font-bold"}>Last contributed</p>
            <p>{formatDistanceToNow(group.last!)}</p>
        </div>
    }, [group]);

    return <Container className={"h-[180px] flex flex-col justify-between"}>
        <Link href={`/zone/group/${group._id}`}><div className={"space-y-0.5 relative"}>
            <h2 className={"text-[24px]"}>{group.name}</h2>
            <div className={"flex gap-1 items-center"}>
                <AvatarGroup className={"*:data-[slot=avatar]:ring-0"}>
                    {group.users.slice(0, 4).map(user => <Avatar key={user._id} className={"ring-0 size-6"}>
                        <AvatarImage src={`/pfp/${user._id}.svg`} height={24} width={24}/>
                    </Avatar>)}
                </AvatarGroup>
                {group.users.length > 4 && <p className={"font-bold text-[12px] text-[#A4A6B3]"}>+{group.users.length - 4} more</p>}
            </div>
            <div className={"absolute top-0 right-0"}>
                {widget}
            </div>
        </div></Link>
        <div>
            {group.contributed && <p className={"font-medium text-ligr text-[12px]"}>Total contributed</p>}
            <p className={"text-[24px]"}>{group.remaining || group.contributed}€</p>
        </div>
    </Container>
}