"use client"
import Container from "@/components/container";
import Image from "next/image";
import {usePathname} from "next/navigation";

export default function Menu() {
    const pathname = usePathname();
    if (["/zone/group/new", "/", "/zone/scan"].includes(pathname)) return null;

    return <div className={"fixed bottom-0 left-0 w-full px-[35px] pb-[35px]"}>
        <Container className={"flex justify-between items-center h-[60px]"}>
            <Image src={"/icon/menu.svg"} alt={"menu"} height={21} width={21}/>
            <Image src={"/icon/useradd.svg"} alt={"menu"} height={21} width={21}/>
            <Image src={"/icon/plus.svg"} alt={"menu"} height={24} width={24}/>
            <Image src={"/icon/camera.svg"} alt={"menu"} height={21} width={21}/>
            <Image src={"/icon/star.svg"} alt={"menu"} height={21} width={21}/>
        </Container>
    </div>
}