import ProfileIcon from "@/components/profile-icon";
import {Button} from "@/components/ui/button";
import {ArrowRight} from "lucide-react";
import Container from "@/components/container";
import {useUser} from "@/lib/hook/use-user";

export default function ProfileHeader() {
    const user = useUser();

    return <div className={"fixed top-0 left-0 p-4.5 w-full"}>
        <Container className={"flex justify-between items-center border-[0.1px] border-gray-700"}>
            <div className={"flex gap-5"}>
                <ProfileIcon id={user._id} size={"lg"}/>
                <div className={"space-y-2.5"}>
                    <p className={"leading-4"}>You&apos;re owed 40€</p>
                    <p className={"leading-4"}>You owe 21€</p>
                </div>
            </div>
            <Button className={"text-ligr gap-2"}>Details<ArrowRight className={"size-4"}/></Button>
        </Container>
    </div>
}