import type { Json } from "@/lib/database.types";
import type { PersistedState } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

export const DEVICE_KEY = "letReviewer.deviceId";

function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

export function getDeviceId() {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

export async function pullRemoteSave(): Promise<PersistedState | null> {
  if (!isConfigured()) return null;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviewer_saves")
    .select("payload, updated_at")
    .eq("device_id", getDeviceId())
    .maybeSingle();

  if (error) {
    console.warn("Supabase pull skipped:", error.message);
    return null;
  }
  if (!data?.payload || typeof data.payload !== "object") return null;
  return data.payload as PersistedState;
}

export async function pushRemoteSave(payload: PersistedState) {
  if (!isConfigured()) return;
  const supabase = createClient();
  const { error } = await supabase.from("reviewer_saves").upsert(
    {
      device_id: getDeviceId(),
      payload: payload as Json,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "device_id" }
  );
  if (error) {
    console.warn("Supabase push skipped:", error.message);
  }
}
