"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
export function CatalogRefresh() {
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    if (path !== "/" && !path.startsWith("/peluches") && path !== "/ofertas")
      return;
    const refresh = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    const timer = setInterval(refresh, 15000);
    window.addEventListener("focus", refresh);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, [path, router]);
  return null;
}
