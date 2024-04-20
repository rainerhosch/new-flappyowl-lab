import RoadmapCard from "./RoadmapCard"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import React, { useState } from 'react';
import ParagraphSkeleton from "../../Common/ParagraphSkeleton"

const RoadMap = () => {
    const { isLoading, error, data } = useQuery(["recommendations"], async () =>
        axios
            .get("api/roadmap")
            .then(({ data }) => data)
            .catch((error) => console.error("Error fetching testimonials:", error))
    )

    return (
        <div className="bg-BluePastel">
            <div className="px-2 md:px-8 py-4 text-lg font-bold text-Snow text-center font-mono">
                Road Map
            </div>
            <div className="grid w-full h-full mt-5 justify-items-start gap-x-4 gap-y-4 px-2 md:px-8 pb-8">

                {isLoading ?
                    [1, 2, 3, 4].map((x) => (
                        <ParagraphSkeleton key={x} dataClass={"p-8 h-full w-full relative"} />
                    ))
                    :
                    data?.map((data, key) => (
                        <RoadmapCard key={key} data={data} />
                    ))
                }

            </div>
        </div>
    )
}

export default RoadMap
