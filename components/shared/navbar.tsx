"use client"

import { cn } from "@/lib/utils"
import { getNavbarList } from "@/utils/navbar-list"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { buttonVariants } from "../ui/button"
import { Bag } from "./bag"
import { LogoAini28 } from "./logo-aini"
import { Searcher } from "./searcher"
import { Container } from "../container"

export function Navbar() {
  const pathname = usePathname()
  const menuList = getNavbarList({ pathname })

  return (
    <Container>
      <section className="flex items-center justify-between mx-auto py-4 font-">
        <div className="flex items-center gap-8">
          <Link href="/" className="py-2">
            <LogoAini28 />
          </Link>
          <nav className="flex bg-gray-100 p-1.5 rounded-full">
            {menuList.map(({ label, href, active }) => (
              <Link
                key={label}
                href={href}
                className={cn(
                  "px-6 py-2.5",
                  buttonVariants(),
                  !active &&
                    "bg-gray-100 hover:bg-gray-100 text-gray-900 hover:text-primary"
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
    </Container>
  )
}
