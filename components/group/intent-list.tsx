import {GoalIntent, Intent, OnetimeIntent} from "@/lib/types";
import {useMemo} from "react";
import ExclamationMark from "@/components/home/exclamation-mark";
import {addDays, addMonths, formatDistanceToNow} from "date-fns";
import Container from "@/components/container";
import Link from "next/link";
import {Avatar, AvatarGroup, AvatarImage} from "@/components/ui/avatar";
import Check from "@/components/group/check";

export default function IntentList({intents}: { intents: Intent[] }) {
    const goals = intents.filter(i => i.type === "GOAL");
    const onetime = intents.filter(i => i.type === "ONETIME");

    return <>
        {goals.length > 0 && <div className={"space-y-4"}>
            <p className={"text-ligr text-sm font-bold pl-3"}>Recurring payments</p>
            {goals.map(intent => <GoalIn key={intent._id} intent={intent}/>)}
        </div>}
        {onetime.length > 0 && <div className={"space-y-4"}>
            <p className={"text-ligr text-sm font-bold pl-3"}>One-time payments</p>
            {onetime.map(intent => <OnetimeIn key={intent._id} intent={intent}/>)}
        </div>}
    </>;
}

function GoalIn({intent}: { intent: GoalIntent }) {
    const widget = useMemo(() => {
        if (intent.paid)
            return <p className={"absolute top-0 right-0 text-[12px] flex items-center gap-1"}><Check/>Paid</p>
        return addMonths(intent.date, 1).toISOString() < new Date().toISOString() ? <p className={"absolute top-0 right-0 text-[#BF3333] text-[12px] flex items-center gap-1"}><ExclamationMark/>Past due</p>
            : <p className={"absolute top-0 right-0 text-[#D4C45A] text-[12px] flex items-center gap-1"}><ExclamationMark/>Due</p>
    }, [intent]);

    return <Container className={"h-[180px] flex flex-col justify-between"}>
        <div className={"space-y-0.5 relative"}>
            <h2 className={"text-[16px]"}>{intent.name}</h2>
            <div className={"absolute top-0 right-0"}>
                {widget}
            </div>
        </div>
        <div>
            <p className={"font-bold text-white text-[40px]"}>{intent.value}{intent.currency}</p>
            <p className={"text-[14px] text-ligr"}>Next payment due in {formatDistanceToNow(addMonths(new Date(intent.date), 1))}</p>
        </div>
    </Container>
}

function OnetimeIn({intent}: { intent: OnetimeIntent }) {
    const widget = intent.paid ? <p className={"text-[12px] flex items-center gap-1"}><Check/>Paid</p> : addMonths(intent.date, 1).toISOString() < new Date().toISOString() ? <p className={"text-[#BF3333] text-[12px] flex items-center gap-1"}><ExclamationMark/>Past due</p>
        : <p className={"text-[#D4C45A] text-[12px] flex items-center gap-1"}><ExclamationMark/>Due</p>

    return <Container className={"flex justify-between"}>
        <p className={"text-ligr"}>{intent.name}</p>
        <div className={"flex gap-2 items-center"}><span>{widget}</span>{intent.value}{intent.currency}</div>
    </Container>;
}

function Widget({intent, date}: { intent: Intent, date: string }) {
    if (intent.paid)
        return
}