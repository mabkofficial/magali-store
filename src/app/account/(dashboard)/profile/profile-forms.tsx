"use client";

import { useState } from "react";
import { changePassword, updateProfile } from "@/app/account/(dashboard)/actions";
import { Button } from "@/components/ui/button";

export function ProfileForms({
  email,
  fullName,
  phone,
  isGoogleAuth,
  passwordUpdated,
}: {
  email: string;
  fullName: string;
  phone: string;
  isGoogleAuth: boolean;
  passwordUpdated: boolean;
}) {
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [profilePending, setProfilePending] = useState(false);
  const [passwordPending, setPasswordPending] = useState(false);

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display text-xl text-ink">Profile</h2>
        <form
          className="mt-6 max-w-md space-y-4"
          action={async (formData) => {
            setProfilePending(true);
            setProfileError(null);
            await updateProfile(formData);
            setProfilePending(false);
          }}
        >
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-ink">
              Email
            </label>
            <input
              id="email"
              value={email}
              readOnly
              className="w-full border border-border bg-surface-muted px-3 py-2 text-sm text-muted"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm text-ink">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              defaultValue={fullName}
              className="w-full border border-border bg-surface px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm text-ink">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={phone}
              className="w-full border border-border bg-surface px-3 py-2 text-sm"
            />
          </div>
          {profileError && <p className="text-sm text-destructive">{profileError}</p>}
          <Button type="submit" disabled={profilePending}>
            {profilePending ? "Saving…" : "Save profile"}
          </Button>
        </form>
      </section>

      <section>
        <h2 className="font-display text-xl text-ink">Password</h2>
        {isGoogleAuth ? (
          <p className="mt-4 text-sm text-muted">Signed in with Google.</p>
        ) : (
          <form
            className="mt-6 max-w-md space-y-4"
            action={async (formData) => {
              setPasswordPending(true);
              setPasswordError(null);
              const result = await changePassword(formData);
              if (result?.error) {
                setPasswordError(result.error);
              }
              setPasswordPending(false);
            }}
          >
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-ink">
                New password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                minLength={8}
                required
                className="w-full border border-border bg-surface px-3 py-2 text-sm"
              />
            </div>
            {passwordUpdated && (
              <p className="text-sm text-botanical">Password updated.</p>
            )}
            {passwordError && (
              <p className="text-sm text-destructive">{passwordError}</p>
            )}
            <Button type="submit" variant="outline" disabled={passwordPending}>
              {passwordPending ? "Updating…" : "Update password"}
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}
