import { HydrateClient } from "~/trpc/server";
import { UserName } from "./_components/userName";

export default async function Home() {
    return (
        <HydrateClient>
            <main>
                <UserName />
            </main>
        </HydrateClient>
    );
}
