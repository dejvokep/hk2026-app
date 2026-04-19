"use client"
import {useGroup} from "@/lib/hook/use-group";
import {SWRFacade} from "@/components/swr-facade";
import useSWRFetch from "@/lib/hook/use-swr-fetch";
import {Intent} from "@/lib/types";
import NewGroup from "@/components/new-group";
import {Avatar, AvatarGroup, AvatarImage} from "@/components/ui/avatar";
import GroupHeader from "@/components/group/group-header";
import {useUser} from "@/lib/hook/use-user";
import IntentList from "@/components/group/intent-list";
import Container from "@/components/container";
import {ArrowRight} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function Page() {
    const group = useGroup();

    return <main className={"p-4.5 relative mb-[110px]"}>
        <GroupHeader/>
        <div className={"space-y-10 pt-4"}>
            <Container className={"flex justify-between items-center py-4"}>
                <p>{(group.remaining || 0).toFixed(2)}€</p>
                <Link href={usePathname() + "/pay"}><Button className={"text-ligr gap-2"}>Pay all<ArrowRight className={"size-4"}/></Button></Link>
            </Container>
            <SWRFacade res={useSWRFetch<Intent[]>(`/intent/list?group=${group._id}`)} success={intents => <IntentList intents={intents}/>}/>
        </div>
    </main>
}

// <main>
//     <p>{JSON.stringify(group)}</p>
//     <SWRFacade res={useSWRFetch<Intent[]>(`/intent/list?group=${group._id}`)} success={intents => <p>{JSON.stringify(intents)}</p>}/>
// </main>