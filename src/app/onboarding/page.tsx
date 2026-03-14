"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [orgName, setOrgName] = useState("");

  const createOrg = api.organization.create.useMutation();
  const syncUser = api.user.syncFromClerk.useMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    const org = await createOrg.mutateAsync({ name: orgName });
    await syncUser.mutateAsync({ clerkId: user.id, orgId: org.id });
    router.push("/");
  }

  const isPending = createOrg.isPending || syncUser.isPending;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-bold">Create your organization</h1>
        <input
          type="text"
          placeholder="Organization name"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Create Organization"}
        </button>
      </form>
    </div>
  );
}
