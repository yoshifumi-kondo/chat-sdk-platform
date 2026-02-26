import { createSupabaseServer } from "@/lib/supabase/server";
import { MentionsFilter } from "./mentions-filter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PLATFORMS = ["slack", "discord", "teams", "gchat", "github", "linear"] as const;
const PAGE_SIZE = 20;

const platformColors: Record<string, string> = {
  slack: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  discord: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  teams: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  gchat: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  github: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  linear: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
};

interface SearchParams {
  platform?: string;
  from?: string;
  to?: string;
  page?: string;
}

export default async function MentionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const platform = params.platform;
  const from = params.from;
  const to = params.to;
  const page = Math.max(1, Number(params.page) || 1);

  const supabase = await createSupabaseServer();

  let query = supabase
    .from("mentions")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (platform && PLATFORMS.includes(platform as (typeof PLATFORMS)[number])) {
    query = query.eq("platform", platform);
  }
  if (from) {
    query = query.gte("created_at", `${from}T00:00:00Z`);
  }
  if (to) {
    query = query.lte("created_at", `${to}T23:59:59Z`);
  }

  const { data: mentions, count, error } = await query;

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Mentions</h1>

      <MentionsFilter
        platforms={[...PLATFORMS]}
        currentPlatform={platform}
        currentFrom={from}
        currentTo={to}
      />

      {error ? (
        <div className="rounded-lg border border-destructive p-4 mt-4 text-destructive">
          Failed to load mentions: {error.message}
        </div>
      ) : !mentions || mentions.length === 0 ? (
        <div className="rounded-lg border p-8 mt-4 text-center text-muted-foreground">
          No mentions found.
        </div>
      ) : (
        <>
          <div className="rounded-lg border mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Platform</TableHead>
                  <TableHead className="w-[150px]">Author</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="w-[180px] text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mentions.map((mention) => (
                  <TableRow key={mention.id}>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={platformColors[mention.platform] ?? ""}
                      >
                        {mention.platform}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {mention.author_name}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {mention.message_text}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">
                      {new Date(mention.created_at).toLocaleString("ja-JP", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                {count} mentions - Page {page} / {totalPages}
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={buildUrl({ platform, from, to, page: page - 1 })}>
                      Previous
                    </Link>
                  </Button>
                )}
                {page < totalPages && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={buildUrl({ platform, from, to, page: page + 1 })}>
                      Next
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function buildUrl(params: {
  platform?: string;
  from?: string;
  to?: string;
  page?: number;
}) {
  const sp = new URLSearchParams();
  if (params.platform) sp.set("platform", params.platform);
  if (params.from) sp.set("from", params.from);
  if (params.to) sp.set("to", params.to);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  const qs = sp.toString();
  return `/mentions${qs ? `?${qs}` : ""}`;
}
