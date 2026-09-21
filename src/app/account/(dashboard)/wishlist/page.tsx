import { WishlistClient } from "./wishlist-client";
import { getCustomerContext } from "@/lib/customer/auth";
import { getWishlistForUser } from "@/lib/customer/wishlist";

export default async function AccountWishlistPage() {
  const customer = await getCustomerContext();
  if (!customer) return null;

  const items = await getWishlistForUser(customer.userId);

  return (
    <div>
      <h2 className="font-display text-xl text-ink">Wishlist</h2>
      <WishlistClient items={items} />
    </div>
  );
}
