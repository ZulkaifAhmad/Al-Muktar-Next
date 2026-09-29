"use client";

import React, { Suspense } from "react";
import NextLink from "next/link";
import {
  useRouter,
  usePathname,
  useSearchParams as useNextSearchParams,
  useParams as useNextParams,
} from "next/navigation";

/**
 * Compatible Link component supporting React Router and Next.js props (to -> href).
 */
export const Link = React.forwardRef(function CustomLink(
  { to, href, children, ...props },
  ref
) {
  const destination = href || to || "#";
  return (
    <NextLink ref={ref} href={destination} {...props}>
      {children}
    </NextLink>
  );
});

/**
 * Compatible NavLink with isActive callback support
 */
export function NavLink({ to, href, className, style, children, ...props }) {
  const pathname = usePathname();
  const destination = href || to || "";
  const isActive =
    destination === "/"
      ? pathname === "/"
      : pathname?.startsWith(destination);

  const resolvedClass =
    typeof className === "function" ? className({ isActive }) : className;

  const resolvedStyle =
    typeof style === "function" ? style({ isActive }) : style;

  const resolvedChildren =
    typeof children === "function" ? children({ isActive }) : children;

  return (
    <NextLink
      href={destination || "#"}
      className={resolvedClass}
      style={resolvedStyle}
      {...props}
    >
      {resolvedChildren}
    </NextLink>
  );
}

/**
 * Compatible Navigate component
 */
export function Navigate({ to, replace = false }) {
  const router = useRouter();
  React.useEffect(() => {
    if (to) {
      if (replace) {
        router.replace(to);
      } else {
        router.push(to);
      }
    }
  }, [router, to, replace]);

  return null;
}

/**
 * Compatible Outlet dummy component for layout compatibility
 */
export function Outlet() {
  return null;
}

/**
 * Compatible useNavigate hook for Next.js App Router
 */
export function useNavigate() {
  const router = useRouter();

  return React.useCallback(
    (target, options) => {
      if (target === -1) {
        router.back();
        return;
      }
      if (typeof target === "number") {
        router.back();
        return;
      }
      if (options?.replace) {
        router.replace(target);
      } else {
        router.push(target);
      }
    },
    [router]
  );
}

/**
 * Compatible useLocation hook
 */
export function useLocation() {
  const pathname = usePathname() || "";
  let search = "";
  if (typeof window !== "undefined") {
    search = window.location.search || "";
  }

  return {
    pathname,
    search,
    hash: typeof window !== "undefined" ? window.location.hash : "",
    state: null,
  };
}

/**
 * Compatible useParams hook
 */
export function useParams() {
  const params = useNextParams();
  return params || {};
}

/**
 * Internal search params consumer
 */
function SearchParamsConsumer({ onParams }) {
  const params = useNextSearchParams();
  React.useEffect(() => {
    onParams(params);
  }, [params, onParams]);
  return null;
}

/**
 * Safe useSearchParams hook that works across static prerender and runtime
 */
export function useSearchParams() {
  const router = useRouter();
  const pathname = usePathname() || "";
  const [params, setParams] = React.useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });

  const setSearchParams = React.useCallback(
    (newParams) => {
      const current = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : params.toString()
      );
      if (typeof newParams === "object" && newParams !== null) {
        Object.entries(newParams).forEach(([k, v]) => {
          if (v === undefined || v === null || v === "") {
            current.delete(k);
          } else {
            current.set(k, v);
          }
        });
      }
      router.push(`${pathname}?${current.toString()}`);
    },
    [params, pathname, router]
  );

  return [params, setSearchParams];
}
