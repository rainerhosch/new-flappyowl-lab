import React from "react"
import CardLayout from "../../Common/CardLayout"
import Image from "next/image"

const RoadmapCard = ({ data }) => {
    return (
        <CardLayout>
            <div className="bg-NavLink/60 p-8 h-full relative card_stylings transition">
                <Image
                    width={64}
                    height={64}
                    src={"/" + data?.image}
                    alt="Photod"
                    className="absolute z-10 right-10 -top-5 border-Snow w-16 h-16  border-[3px] rounded-full m-0"
                />
                <div className=" text-Snow text-sm  font-mono ">{data?.tittle}</div>
                <div className="text-xs text-Snow italic mt-1 font-mono">
                    {/* {data?.time} */}
                </div>
                <div className="text-xs mt-2 text-Snow font-mono">
                    {data.task?.map((task) => (
                        <li key={task.id}>
                            {task.task_name}
                            {task.task_status === 1 ? (
                                <span className="text-xs inline-block h-5 w-5 text-NavLink/50">
                                    <svg
                                        className="h-3.5 w-3.5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M9.293 16.707a1 1 0 0 1-1.414 0l-5-5a1 1 0 1 1 1.414-1.414L9 14.586l8.293-8.293a1 1 0 1 1 1.414 1.414l-9 9z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                            ) : task.task_status === 2 ? (
                                <i className="text-xs text-NavLink">&nbsp;&nbsp;On Progress</i>
                            ) : (
                                <i className="text-xs text-NavLink/50">&nbsp;&nbsp;Soon</i>
                            )}
                        </li>
                    ))}
                </div>
            </div>
        </CardLayout>
    )
}

export default RoadmapCard
