"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MentionsFilterProps {
  platforms: string[];
  currentPlatform?: string;
  currentFrom?: string;
  currentTo?: string;
}

export function MentionsFilter({
  platforms,
  currentPlatform,
  currentFrom,
  currentTo,
}: MentionsFilterProps) {
  const router = useRouter();

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const sp = new URLSearchParams();

      const platform = formData.get("platform") as string;
      const from = formData.get("from") as string;
      const to = formData.get("to") as string;

      if (platform && platform !== "all") sp.set("platform", platform);
      if (from) sp.set("from", from);
      if (to) sp.set("to", to);

      const qs = sp.toString();
      router.push(`/mentions${qs ? `?${qs}` : ""}`);
    },
    [router]
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="platform" className="text-sm font-medium">
          Platform
        </label>
        <Select name="platform" defaultValue={currentPlatform ?? "all"}>
          <SelectTrigger id="platform" className="w-[160px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {platforms.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="from" className="text-sm font-medium">
          From
        </label>
        <Input
          id="from"
          name="from"
          type="date"
          defaultValue={currentFrom}
          className="w-[160px]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="to" className="text-sm font-medium">
          To
        </label>
        <Input
          id="to"
          name="to"
          type="date"
          defaultValue={currentTo}
          className="w-[160px]"
        />
      </div>

      <Button type="submit">Filter</Button>
    </form>
  );
}
