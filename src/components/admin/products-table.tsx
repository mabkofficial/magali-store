"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Copy, ExternalLink, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { bulkSetProductActive, duplicateProduct } from "@/app/admin/(dashboard)/products/actions";
import { Badge } from "@/components/ui/cms-badge";
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

export type AdminProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  inventory_count: number;
  is_active: boolean;
  shipping_class: string;
  featured: boolean;
};

function formatUSD(amount: number): string {
  return `$${Number(amount).toFixed(2)}`;
}

type FilterState = {
  category: string;
  shipping: string;
  status: string;
  stock: string;
};

export function ProductsTable({ products }: { products: AdminProductRow[] }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    shipping: "all",
    status: "all",
    stock: "all",
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((product) => {
      if (q) {
        const matchesSearch =
          product.name.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.slug.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }
      if (filters.category !== "all" && product.category !== filters.category) {
        return false;
      }
      if (filters.shipping !== "all" && product.shipping_class !== filters.shipping) {
        return false;
      }
      if (filters.status === "active" && !product.is_active) return false;
      if (filters.status === "inactive" && product.is_active) return false;
      if (filters.stock === "low" && product.inventory_count > 10) return false;
      if (filters.stock === "out" && product.inventory_count > 0) return false;
      return true;
    });
  }, [products, search, filters]);

  const toggleAll = () => {
    if (selected.length === filtered.length) {
      setSelected([]);
    } else {
      setSelected(filtered.map((product) => product.id));
    }
  };

  const toggleOne = (id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const bulkUpdate = (isActive: boolean) => {
    startTransition(async () => {
      const result = await bulkSetProductActive(selected, isActive);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(isActive ? "Products activated" : "Products deactivated");
      setSelected([]);
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Catalog</CardTitle>
          <Button render={<Link href="/admin/products/new" />}>
            <Plus className="size-4" />
            Add product
          </Button>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search products…"
              className="pl-8"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
              value={filters.category}
              onChange={(event) =>
                setFilters((current) => ({ ...current, category: event.target.value }))
              }
            >
              <option value="all">All categories</option>
              <option value="Hair Care">Hair Care</option>
              <option value="Wellness">Wellness</option>
              <option value="Food">Food</option>
            </select>
            <select
              className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
              value={filters.shipping}
              onChange={(event) =>
                setFilters((current) => ({ ...current, shipping: event.target.value }))
              }
            >
              <option value="all">All shipping</option>
              <option value="standard">Standard</option>
              <option value="frozen">Frozen</option>
            </select>
            <select
              className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
              value={filters.status}
              onChange={(event) =>
                setFilters((current) => ({ ...current, status: event.target.value }))
              }
            >
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
              value={filters.stock}
              onChange={(event) =>
                setFilters((current) => ({ ...current, stock: event.target.value }))
              }
            >
              <option value="all">All stock</option>
              <option value="low">Low stock (≤10)</option>
              <option value="out">Out of stock</option>
            </select>
          </div>
        </div>
        {selected.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">{selected.length} selected</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={() => bulkUpdate(true)}
            >
              Activate
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={() => bulkUpdate(false)}
            >
              Deactivate
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={filtered.length > 0 && selected.length === filtered.length}
                  onChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Inventory</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Shipping</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/50">
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selected.includes(product.id)}
                      onChange={() => toggleOne(product.id)}
                      aria-label={`Select ${product.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/products/${product.id}`} className="block">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </Link>
                  </TableCell>
                  <TableCell>{formatUSD(product.price)}</TableCell>
                  <TableCell>
                    <span
                      className={
                        product.inventory_count <= 0
                          ? "text-destructive"
                          : product.inventory_count <= 10
                            ? "text-amber-600"
                            : undefined
                      }
                    >
                      {product.inventory_count}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.is_active ? "default" : "outline"}>
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">
                    {product.shipping_class}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        render={<Link href={`/products/${product.slug}`} target="_blank" />}
                        aria-label="View storefront"
                      >
                        <ExternalLink className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={pending}
                        onClick={() =>
                          startTransition(async () => {
                            const result = await duplicateProduct(product.id);
                            if (result?.error) toast.error(result.error);
                          })
                        }
                        aria-label="Duplicate"
                      >
                        <Copy className="size-4" />
                      </Button>
                    </div>
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
