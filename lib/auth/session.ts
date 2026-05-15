import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  email?: string;
  accessToken: string;
  appMetadata: Record<string, unknown>;
  userMetadata: Record<string, unknown>;
};

export type WorkspaceIdentity = {
  userId: string;
  workspaceId?: string;
  organizationId?: string;
};

type JwtPayload = {
  sub?: string;
  email?: string;
  workspace_id?: string;
  organization_id?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const client = await createSupabaseServerClient();
  const { data, error } = await client.auth.getUser();

  if (error || !data.user?.id) {
    return null;
  }

  const accessToken = await getSessionAccessToken();

  return {
    id: data.user.id,
    email: data.user.email ?? undefined,
    accessToken: accessToken ?? "",
    appMetadata: (data.user.app_metadata as Record<string, unknown> | undefined) ?? {},
    userMetadata: (data.user.user_metadata as Record<string, unknown> | undefined) ?? {},
  };
}

export async function requireCurrentUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Sign in required to access Credo workspace.");
  }

  return user;
}

export async function getCurrentUserId(): Promise<string | null> {
  return (await getCurrentUser())?.id ?? null;
}

export async function getSessionAccessToken(): Promise<string | null> {
  const client = await createSupabaseServerClient();
  const { data, error } = await client.auth.getSession();

  if (error) {
    return null;
  }

  return data.session?.access_token ?? null;
}

export async function isAuthenticated(): Promise<boolean> {
  return Boolean(await getCurrentUserId());
}

export async function getWorkspaceIdentity(): Promise<WorkspaceIdentity | null> {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const payload = parseJwtPayload(user.accessToken);
  const workspaceId = firstString(
    payload?.workspace_id,
    user.appMetadata.workspace_id,
    user.userMetadata.workspace_id
  );
  const organizationId = firstString(
    payload?.organization_id,
    user.appMetadata.organization_id,
    user.userMetadata.organization_id
  );

  return {
    userId: user.id,
    workspaceId,
    organizationId,
  };
}

function parseJwtPayload(accessToken: string): JwtPayload | null {
  const payload = accessToken.split(".")[1];
  if (!payload) return null;

  const decoded = base64UrlDecode(payload);
  if (!decoded) return null;

  try {
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

function base64UrlDecode(value: string) {
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return Buffer.from(padded, "base64").toString("utf8");
  } catch {
    return null;
  }
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}
