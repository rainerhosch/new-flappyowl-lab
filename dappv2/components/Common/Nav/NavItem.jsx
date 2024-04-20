import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"

const NavItem = ({ NavIcon, NavText, NavRoute, setIsOpen }) => {
    const router = useRouter()
    const className =
        router.asPath === `${NavRoute}`
            ? "rounded-xl !text-white hover:text-DeepNightBlack font-bold tracking-widest"
            : ""
    // const className = router.asPath === `${NavRoute}` ? "rounded-xl !text-DeepNightBlack bg-[#ffadad57] font-bold tracking-widest" : '';

    return (
        <li>
            <Link
                onClick={(e) => setIsOpen(false)}
                href={NavRoute}
                className={`${className} transition flex items-center px-2 hover:bg-[#ffffff80] text-NavLink hover:text-BluePastel rounded-xl  py-1.5 font-semibold space-x-4 text-base font-mono`}
            >
                {NavIcon}
                <span>{NavText}</span>
            </Link>
        </li>
    )
}

export default NavItem
