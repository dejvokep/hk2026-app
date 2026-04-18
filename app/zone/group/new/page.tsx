"use client"
import NewGroup from "@/components/new-group";
import {SWRFacade} from "@/components/swr-facade";
import useSWRFetch from "@/lib/hook/use-swr-fetch";
import {User} from "@/lib/types";

export default function Page() {
    return <main>
        <NewGroup/>
    </main>
}