import { AiFillCopyrightCircle } from "react-icons/ai"
import Link from "next/link"
import { NAME, DESIGNATION, SOCIAL_LINKS, SUBNAME } from "../constants/constants"

import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa"

const Footer = () => {
    return (
        <section id="footer" className="footer pb-[20px] mb-[30px] lg:mb-10">
            <div className="flex h-20 items-center justify-between text-xs font-normal text-dark py-4 px-2 md:px-4 w-full bg-BluePastel text-SilverGray">
                <div className="md:flex hidden items-center">
                    <div className="mr-1 ">
                        <AiFillCopyrightCircle />
                    </div>
                    <div className="font-mono text-bold">
                        <span>2023 All Rights Reserved.</span>
                    </div>
                </div>
                <div className="font-mono font-bold md:flex items-center text-left md:hidden">
                    <div className="hidden sm:block">Made</div>
                    <div className="hidden sm:block">&nbsp;with ❤️ by&nbsp;</div>
                    <div className="font-bold">{NAME}</div>
                    <div className="font-bold">{SUBNAME}</div>
                </div>
                <div className="flex items-center">
                    <div className="mr-1 text-base">
                        <Link
                            href={SOCIAL_LINKS.DISCORD}
                            target="_blank"
                            rel="noreferrer"
                            className=""
                        >
                            <FaDiscord />
                        </Link>
                    </div>
                    <div className="mr-1 text-base">
                        <Link
                            href={SOCIAL_LINKS.GITHUB}
                            target="_blank"
                            rel="noreferrer"
                            className=""
                        >
                            <FaGithub />
                        </Link>
                    </div>
                    <div className="mr-1 text-base">
                        <Link
                            href={SOCIAL_LINKS.TWITTER}
                            target="_blank"
                            rel="noreferrer"
                            className=""
                        >
                            <FaTwitter />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Footer
