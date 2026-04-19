import {useGroup} from "@/lib/hook/use-group";
import {Avatar, AvatarGroup, AvatarImage} from "@/components/ui/avatar";

export default function GroupHeader() {
    const group = useGroup();

    return <div className={"flex justify-center py-[24px]"}>
        <div className={"space-y-0.5"}>
            <h2 className={"text-[16px] text-center"}>{group.name}</h2>
            <div className={"flex gap-1 items-center"}>
                <AvatarGroup className={"*:data-[slot=avatar]:ring-0"}>
                    {group.users.slice(0, 4).map(user => <Avatar key={user._id} className={"ring-0 size-6"}>
                        <AvatarImage src={`/pfp/${user._id}.svg`} height={24} width={24}/>
                    </Avatar>)}
                </AvatarGroup>
                {group.users.length > 4 && <p className={"font-bold text-[12px] text-[#A4A6B3]"}>+{group.users.length - 4} more</p>}
            </div>
        </div>
    </div>
}