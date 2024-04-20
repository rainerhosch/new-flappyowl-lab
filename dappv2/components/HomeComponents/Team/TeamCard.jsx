import { MdLocationOn } from "react-icons/md"
import { FaStar } from "react-icons/fa"
import CardLayout from "../../Common/CardLayout"
import Image from "next/image"

const TeamCard = ({ data }) => {
    return (
        <CardLayout>
            <div className="bg-NavLink/60 flex flex-col justify-between card_stylings w-80 md:w-96 h-full  p-4 md:p-8">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-Snow/70 font-bold font-mono">
                            <a href={data?.linkednURL} target="_blank" rel="noreferrer">
                                {data?.name}
                            </a>
                        </span>
                        <div className="text-xs text-Snow/40 flex items-center gap-1 font-light font-mono">
                            <MdLocationOn />
                            <em>{data?.location}</em>
                        </div>
                    </div>
                    <Image
                        width={64}
                        height={64}
                        src={"/" + data?.image}
                        alt="Photod"
                        className="z-10 right-10 -top-5 border-BlueBase w-16 h-16  border-[3px] rounded-full m-0"
                    />
                </div>
                <div className="text-xs md:text-sm text-justify mt-2 text-Snow/40 font-mono">{data?.view}</div>
                <div className="text-xs flex gap-2 items-center justify-center bg-NavLink/85 text-Black/30 rounded-md p-2 mt-4 font-mono">
                    {data?.designation}
                </div>
            </div>
        </CardLayout>
    )
}

export default TeamCard
