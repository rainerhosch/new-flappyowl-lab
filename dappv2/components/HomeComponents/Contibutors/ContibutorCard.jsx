import { MdLocationOn } from "react-icons/md"
import { FaStar } from "react-icons/fa"
import CardLayout from "../../Common/CardLayout"
import Image from "next/image"

const ContibutorCard = ({ data }) => {
    return (
        <CardLayout>
            <div className="flex flex-col justify-between card_stylings w-80 md:w-96 h-full  p-4 md:p-8">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-Snow font-bold">
                            <a href={data?.linkednURL} target="_blank" rel="noreferrer">
                                {data?.name}
                            </a>
                        </span>
                        <div className="text-xs text-LightGray flex items-center gap-1 font-light">
                            <MdLocationOn />
                            <em>{data?.location}</em>
                        </div>
                    </div>
                    <Image
                        width={64}
                        height={64}
                        src={"/" + data?.image}
                        alt="Photod"
                        className="z-10 right-10 -top-5 border-Snow w-16 h-16  border-[3px] rounded-full m-0"
                    />
                </div>
                <div className="text-sm mt-2 text-LightGray font-normal">{data?.view}</div>
                <div className="flex gap-2 items-center justify-center bg-MidNightBlack text-xs text-LightGray rounded-md p-2 mt-4 ">
                    {data?.designation}
                </div>
            </div>
        </CardLayout>
    )
}

export default ContibutorCard
