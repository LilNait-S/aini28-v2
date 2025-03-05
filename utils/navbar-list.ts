import { LucideIcon } from "lucide-react";

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon?: LucideIcon;
};

export function getNavbarList({ pathname }: { pathname: string }): Menu[] {
  return [
   
    {
      label: "Inicio",
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Peluches",
      href: "/peluches",
      active: pathname.includes("/peluches"),
    },
    {
      label: "Moda",
      href: "/moda",
      active: pathname.includes("/moda"),
    },
    {
      label: "Ofertas",
      href: "/ofertas",
      active: pathname.includes("/ofertas"),
    },
    {
      label: "Nosotros",
      href: "/nosotros",
      active: pathname.includes("/nosotros"),
    },
  ];
}
