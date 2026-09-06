"use client";

import { useMemo, useState, useTransition } from "react";
import { format } from "date-fns";
import { Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteSubscriber } from "@/app/admin/(dashboard)/subscribers/actions";
import { Button } from "@/components/ui/cms-button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type SubscriberRow = {
  email: string;
  source: string;
  promo_interest: boolean;
  created_at: string;
};

export function SubscribersTable({ subscribers }: { subscribers: SubscriberRow[] }) {
  const [search, setSearch] = useState("");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return subscribers;
    return subscribers.filter(
      (row) =>
        row.email.toLowerCase().includes(q) ||
        row.source.toLowerCase().includes(q),
    );
  }, [subscribers, search]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base">Subscribers ({subscribers.length})</CardTitle>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search email…"
            className="pl-8"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Promo</TableHead>
              <TableHead className="text-right">Joined</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No subscribers found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow key={row.email}>
                  <TableCell>{row.email}</TableCell>
                  <TableCell className="capitalize text-muted-foreground">
                    {row.source}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.promo_interest ? "Yes" : "—"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {format(new Date(row.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={pending}
                      onClick={() =>
                        startTransition(async () => {
                          const result = await deleteSubscriber(row.email);
                          if (result?.error) {
                            toast.error(result.error);
                            return;
                          }
                          toast.success("Subscriber removed");
                        })
                      }
                      aria-label={`Remove ${row.email}`}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
