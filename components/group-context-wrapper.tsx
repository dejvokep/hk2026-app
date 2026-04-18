"use client"
import {ReactNode} from "react";
import {Group} from "@/lib/types";
import {GroupContext} from "@/lib/context/group-context";

export default function GroupContextWrapper({group, children}: {group: Group, children: ReactNode}) {
    return <GroupContext.Provider value={group}>
        {children}
    </GroupContext.Provider>
}