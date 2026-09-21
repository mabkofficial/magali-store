"use client";

import { useState } from "react";
import { deleteAddress, saveAddress } from "@/app/account/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/database";

type AddressRow = Database["public"]["Tables"]["customer_addresses"]["Row"];

export function AddressManager({ addresses }: { addresses: AddressRow[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const editing = addresses.find((a) => a.id === editingId);

  return (
    <div className="mt-8 space-y-8">
      {addresses.length > 0 && (
        <ul className="divide-y divide-border border border-border">
          {addresses.map((address) => (
            <li key={address.id} className="flex flex-wrap items-start justify-between gap-4 px-4 py-4">
              <div className="text-sm">
                <p className="font-medium text-ink">
                  {address.label}
                  {address.is_default && (
                    <span className="ml-2 text-[10px] uppercase tracking-[0.1em] text-botanical">
                      Default
                    </span>
                  )}
                </p>
                <p className="mt-1 text-muted">
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}
                </p>
                <p className="text-muted">
                  {[address.city, address.state, address.postal_code].join(", ")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingId(address.id);
                    setShowForm(true);
                  }}
                >
                  Edit
                </Button>
                <form action={deleteAddress.bind(null, address.id)}>
                  <Button type="submit" variant="outline" size="sm">
                    Delete
                  </Button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showForm ? (
        <form
          className="max-w-md space-y-4 border border-border p-5"
          action={async (formData) => {
            if (editing) formData.set("id", editing.id);
            await saveAddress(formData);
            setShowForm(false);
            setEditingId(null);
          }}
        >
          <h3 className="font-medium text-ink">
            {editing ? "Edit address" : "Add address"}
          </h3>
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <div className="space-y-2">
            <label className="text-sm">Label</label>
            <input
              name="label"
              defaultValue={editing?.label ?? "Home"}
              className="w-full border border-border px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Address line 1</label>
            <input
              name="line1"
              required
              defaultValue={editing?.line1 ?? ""}
              className="w-full border border-border px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Address line 2</label>
            <input
              name="line2"
              defaultValue={editing?.line2 ?? ""}
              className="w-full border border-border px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm">City</label>
              <input
                name="city"
                required
                defaultValue={editing?.city ?? ""}
                className="w-full border border-border px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">State</label>
              <input
                name="state"
                required
                defaultValue={editing?.state ?? ""}
                className="w-full border border-border px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm">Postal code</label>
              <input
                name="postalCode"
                required
                defaultValue={editing?.postal_code ?? ""}
                className="w-full border border-border px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Country</label>
              <input
                name="country"
                defaultValue={editing?.country ?? "US"}
                className="w-full border border-border px-3 py-2 text-sm"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isDefault"
              defaultChecked={editing?.is_default ?? addresses.length === 0}
            />
            Set as default
          </label>
          <div className="flex gap-2">
            <Button type="submit">{editing ? "Save" : "Add address"}</Button>
            {addresses.length > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      ) : (
        <Button type="button" variant="outline" onClick={() => setShowForm(true)}>
          Add address
        </Button>
      )}
    </div>
  );
}
