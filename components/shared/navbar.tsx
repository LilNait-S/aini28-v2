"use client"

import { cn } from "@/lib/utils"
import { getNavbarList } from "@/utils/navbar-list"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Container } from "../container"
import { buttonVariants } from "../ui/button"
import { Bag } from "./bag"
import { IsoLogoAini28, IsotipoAini28 } from "./logo-aini"
import { Searcher } from "./searcher"

export function Navbar() {
  const pathname = usePathname()
  const menuList = getNavbarList({ pathname })

  return (
    <Container>
      <section className="flex items-center justify-between mx-auto py-4">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="sm:px-2.5">
            <IsoLogoAini28 className="hidden sm:flex" />
            <IsotipoAini28 className="sm:hidden" />
          </Link>
          <nav className="hidden md:flex bg-muted p-1.5 rounded-full">
            {menuList.map(({ label, href, active }) => (
              <Link
                key={label}
                href={href}
                className={cn(
                  "px-6 py-2.5",
                  buttonVariants(),
                  !active &&
                    "bg-muted hover:bg-muted text-gray-900 hover:text-primary"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="max-w-md flex items-center relative gap-4">
          <Searcher />
          <Bag />
        </div>
      </section>

      <nav className="bg-muted/50 p-1.5 rounded-full w-fit flex flex-nowrap fixed bottom-10 left-1/2 transform -translate-x-1/2 md:hidden z-50 shadow-md border border-border backdrop-blur-xs">
        {menuList.map(({ label, href, active }) => (
          <Link
            key={label}
            href={href}
            className={cn(
              "block px-4 py-2 rounded-md",
              buttonVariants(),
              !active &&
                "bg-muted hover:bg-muted text-gray-900 hover:text-primary"
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
    </Container>
  )
}
