"use client"
import {UserContext} from "@/lib/context/user-context";
import {ReactNode} from "react";
import {User} from "@/lib/types";

export default function UserContextWrapper({user, children}: {user: User, children: ReactNode}) {
    return <UserContext.Provider value={user}>
        {children}
    </UserContext.Provider>
}