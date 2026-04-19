"use client"
import Container from "@/components/container";
import Image from "next/image";
import {usePathname} from "next/navigation";
import Link from "next/link";

export default function Menu() {
    const pathname = usePathname();
    if (["/zone/group/new", "/", "/zone/scan", "/zone/chat"].includes(pathname)) return null;
    if (pathname.endsWith("/goal") || pathname.endsWith("/pay")) return null;

    return <div className={"fixed bottom-0 left-0 w-full px-[35px] pb-[35px]"}>
        <Container className={"flex justify-between items-center h-[60px]"}>
            <Link href={"/zone"}><Image src={"/icon/menu.svg"} alt={"menu"} height={21} width={21}/></Link>
            <Link href={"/zone/invite"}><Image src={"/icon/useradd.svg"} alt={"menu"} height={21} width={21}/></Link>
            <Link href={pathname.startsWith("/zone/group") ? pathname + "/goal" : "/zone/group/new"}><Image src={"/icon/plus.svg"} alt={"menu"} height={24} width={24}/></Link>
            <Link href={"/zone/scan"}><Image src={"/icon/camera.svg"} alt={"menu"} height={21} width={21}/></Link>
            <Link href={"/zone/chat"}><Image src={"/icon/star.svg"} alt={"menu"} height={21} width={21}/></Link>
        </Container>
    </div>
}