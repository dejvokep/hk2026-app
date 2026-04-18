"use client"
import ProfileHeader from "@/components/home/profile-header";
import GroupList from "@/components/home/group-list";

export default function Page() {
    return <main className={"p-4.5 relative mb-[110px]"}>
        <ProfileHeader/>
        <GroupList/>
    </main>
}