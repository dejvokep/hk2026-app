import ProfileIcon from "@/components/profile-icon";
import {Button} from "@/components/ui/button";
import {ArrowRight} from "lucide-react";
import Container from "@/components/container";
import {useUser} from "@/lib/hook/use-user";
import useSWRFetch from "@/lib/hook/use-swr-fetch";
import {Group} from "@/lib/types";
import Link from "next/link";
import {useMemo} from "react";

export default function ProfileHeader() {
    const user = useUser();
    const {data: groups} = useSWRFetch<Group[]>("/group/list");

    const totalOwed = useMemo(() => {
        if (!groups) return 0;
        return groups.reduce((sum, group) => sum + (group.remaining || 0), 0);
    }, [groups]);

    return <div className={"fixed top-0 left-0 p-4.5 w-full z-20"}>
        <Container className={"flex justify-between items-center border-[0.1px] border-gray-700"}>
            <div className={"flex gap-5"}>
                <ProfileIcon id={user._id} size={"lg"}/>
                <div className={"space-y-2.5"}>
                    <p className={"leading-4"}>You&apos;re owed 0€</p>
                    <p className={"leading-4"}>You owe {totalOwed}€</p>
                </div>
            </div>
            <Link href={"/zone/profile"}><Button className={"text-ligr gap-2"}>Details<ArrowRight className={"size-4"}/></Button></Link>
        </Container>
    </div>
}