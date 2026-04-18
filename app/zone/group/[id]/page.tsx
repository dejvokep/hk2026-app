"use client"
import {useGroup} from "@/lib/hook/use-group";
import {SWRFacade} from "@/components/swr-facade";
import useSWRFetch from "@/lib/hook/use-swr-fetch";
import {Intent} from "@/lib/types";
import NewGroup from "@/components/new-group";

export default function Page() {
    const group = useGroup();

    return <main>
        <p>{JSON.stringify(group)}</p>
        <SWRFacade res={useSWRFetch<Intent[]>(`/intent/list?group=${group._id}`)} success={intents => <p>{JSON.stringify(intents)}</p>}/>
    </main>
}

// <main>
//     <p>{JSON.stringify(group)}</p>
//     <SWRFacade res={useSWRFetch<Intent[]>(`/intent/list?group=${group._id}`)} success={intents => <p>{JSON.stringify(intents)}</p>}/>
// </main>