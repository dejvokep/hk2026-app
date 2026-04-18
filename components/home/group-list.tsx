import {SWRFacade} from "@/components/swr-facade";
import useSWRFetch from "@/lib/hook/use-swr-fetch";
import {Group} from "@/lib/types";
import GroupCard from "@/components/home/group-card";
import Container from "@/components/container";
import {Plus} from "lucide-react";

export default function GroupList() {
    return <div className={"pt-[100px] space-y-2.5"}>
        <p className={"text-ligr font-bold pl-3"}>My groups</p>
        <div className={"space-y-5"}>
            <SWRFacade res={useSWRFetch<Group[]>("/group/list")} success={groups => groups.filter(g => g.remaining || g.contributed).map(g => <GroupCard key={g._id} group={g}/>)}/>
            <Container className={"h-[180px] grid place-items-center bg-[rgba(22,21,26,0.5)] border-[1px] border-[rgba(22,21,26,1)] border-dashed"}>
                <div className={"text-ligr"}>
                    <Plus className={"size-4 mx-auto"}/>
                    <p className={"text-[12px]"}>Create new</p>
                </div>
            </Container>
        </div>
    </div>
}