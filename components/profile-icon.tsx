import Image from "next/image";

export default function ProfileIcon({id, size}: {id: string, size: "lg" | "md" | "sm"}) {
    const px = size === "lg" ? 42 : size === "md" ? 32 : 24;

    return <Image src={`/pfp/${id}.svg`} alt={"PFP"} width={px} height={px}/>
}