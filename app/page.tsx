import {Button} from "@/components/ui/button";

export default function Home() {
  return <main className={"h-dvh grid place-items-center"}>
    <div className={"space-y-4"}>
      <h1 className={"font-bold text-center text-4xl"}>TatraShare</h1>
      <div className={"text-black"}>
        <Button variant={"secondary"} size={"bl"} className={"block"}><a href={"/zone"}>Log in</a></Button>
        <Button variant={"secondary"} size={"bl"}  className={"block"}>Use Tatra Banka</Button>
      </div>
    </div>
  </main>
}
