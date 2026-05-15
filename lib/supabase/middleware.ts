import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getCurrentPathWithSearch } from "@/lib/auth/redirect";
import { routes } from "@/lib/routes";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

const PROTECTED_ROUTE_PREFIXES = [
  routes.overview,
  routes.dashboardAlias,
  routes.companiesAlias,
  routes.employees,
  routes.team,
  routes.payroll,
  routes.documents,
  routes.insights,
  routes.compliance,
];

export async function updateSupabaseSession(request: NextRequest) {
  const { supabaseUrl, supabaseAnonKey } = getSupabasePublicConfig();
  let responseCookiesToSet: ResponseCookieToSet[] = [];
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        responseCookiesToSet = cookiesToSet;

        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (!user && isProtectedRoute(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = routes.login;
    loginUrl.search = "";
    loginUrl.searchParams.set("next", getCurrentPathWithSearch(pathname, request.nextUrl.search));

    return withResponseCookies(NextResponse.redirect(loginUrl), responseCookiesToSet);
  }

  if (user && isAuthRoute(pathname)) {
    const appUrl = request.nextUrl.clone();
    appUrl.pathname = routes.overview;
    appUrl.search = "";

    return withResponseCookies(NextResponse.redirect(appUrl), responseCookiesToSet);
  }

  return response;
}

function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isAuthRoute(pathname: string) {
  return pathname === routes.login || pathname === routes.signup || pathname === routes.forgotPassword;
}

type ResponseCookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

function withResponseCookies(response: NextResponse, cookiesToSet: ResponseCookieToSet[]) {
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}
