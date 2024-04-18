import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import ParagraphSkeleton from "../../Common/ParagraphSkeleton"
import ContibutorCard from "./ContibutorCard"

const Contributors = () => {
    const dNumber = [1, 2, 3, 4, 5]
    const { isLoading, error, data } = useQuery(["review"], async () =>
        axios
            .get("api/recommendations")
            .then(({ data }) => data)
            .catch((error) => console.error("Error fetching testimonials:", error))
    )

    return (
        <>
            <div className="px-2 md:px-8 py-4 text-lg font-bold text-Snow text-center">Contributors</div>
            <div className="overflow-x-auto w-full grid justify-items-center grid-flow-col gap-4 px-2 md:px-8 pt-2 pb-4">
                {isLoading
                    ? dNumber.map((key) => (
                        <ParagraphSkeleton
                        key={key}
                        dataClass="w-80 md:w-96 h-full p-4 md:p-8"
                        />
                        ))
                    : data?.map((data, key) => <ContibutorCard key={key} data={data} />)}
            </div>
        </>
    )
}

export default Contributors
