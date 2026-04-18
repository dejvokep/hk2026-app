import {ReactNode} from "react";
import {redirect} from "next/navigation";
import {db, remapId} from "@/lib/db";
import {Group} from "@/lib/types";
import {ObjectId} from "bson";
import GroupContextWrapper from "@/components/group-context-wrapper";
import {WithId} from "mongodb";

export default async function Layout({children, params}: {children: ReactNode, params: Promise<{id: string}>}) {
    const id = (await params).id;
    const group = await (await db).db("tb").collection<Omit<Group, "_id">>("groups").aggregate([{$match: {_id: new ObjectId(id)}}, {
        $lookup: {
            from: "users",
            localField: "users",
            foreignField: "sub",
            as: "users"
        }
    }]).limit(1).toArray();
    if (!group || !group.length) redirect("/zone");

    return <GroupContextWrapper group={remapId((group[0] as unknown) as WithId<Omit<Group, "_id">>) as Group}>
        {children}
    </GroupContextWrapper>
}