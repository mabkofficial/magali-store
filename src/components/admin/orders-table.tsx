"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format, isAfter, isBefore, startOfDay } from "date-fns";
import { Search } from "lucide-react";
import { OrderStatusBadge } from "@/components/admin/status-badge";
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

export type AdminOrderRow = {
  id: string;
  customer_email: string;
  total_cents: number;
  status: string;
  created_at: string;
};

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

const statuses = ["all", "paid", "pending", "refunded", "cancelled"];

export function OrdersTable({ orders }: { orders: AdminOrderRow[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter((order) => {
      if (status !== "all" && order.status !== status) return false;
      if (fromDate) {
        const from = startOfDay(new Date(fromDate));
        if (isBefore(new Date(order.created_at), from)) return false;
      }
      if (toDate) {
        const to = startOfDay(new Date(toDate));
        if (isAfter(new Date(order.created_at), to)) return false;
      }
      if (!q) return true;
      return (
        order.customer_email.toLowerCase().includes(q) ||
        order.status.toLowerCase().includes(q) ||
        order.id.toLowerCase().includes(q)
      );
    });
  }, [orders, search, status, fromDate, toDate]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4">
        <CardTitle className="text-base">All orders</CardTitle>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search email or status…"
              className="pl-8"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <select
            className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {statuses.map((value) => (
              <option key={value} value={value}>
                {value === "all" ? "All statuses" : value}
              </option>
            ))}
          </select>
          <Input
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
            className="w-auto"
            aria-label="From date"
          />
          <Input
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
            className="w-auto"
            aria-label="To date"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No orders yet.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((order) => (
                <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link href={`/admin/orders/${order.id}`} className="block">
                      <p className="font-medium">{order.customer_email}</p>
                      <p className="text-xs text-muted-foreground">{order.id.slice(0, 8)}</p>
                    </Link>
                  </TableCell>
                  <TableCell>{formatCents(order.total_cents)}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {format(new Date(order.created_at), "MMM d, yyyy")}
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
