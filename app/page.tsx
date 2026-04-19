import {Button} from "@/components/ui/button";

export default function Home() {
  return <main className={"h-dvh flex flex-col justify-center"}>
    <div className={"space-y-8 px-10"}>
      <h1 className={"font-bold text-center text-4xl"}>TatraShare™</h1>
      <div className={"text-black w-full space-y-2"}>
        <Button size={"bl"} className={"block"}><a href={"/zone"}>Log in</a></Button>
        <Button variant={"secondary"} size={"bl"} className={"block"}>Use Tatra Banka</Button>
      </div>
    </div>
  </main>
}
