// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const recommendationCard = [
    {
        id: 0,
        tittle: "Phase 1",
        image: "images/roadmap/flappyowl.png",
        time: "Q4 - 2023 ~ Q4 - 2024",
        task: [
            {
                id: 0,
                task_status: 1,
                task_name: "Deployed Flappy Owl NFT on mainnet",
            },
            {
                id: 1,
                task_status: 1,
                task_name: "Live Mint Flappy Owl NFT on Ehereum Mainnet",
            },
            {
                id: 2,
                task_status: 1,
                task_name: "Deploy Testnet $FRC mining ecosystem",
            },
            {
                id: 3,
                task_status: 2,
                task_name: "Testnet stage for $FRC mining mechanism",
            },
        ],
    },
    {
        id: 1,
        tittle: "Phase 2",
        image: "images/roadmap/frc-airdrop.png",
        time: "Q1 ~ Q3 2025",
        task: [
            {
                id: 0,
                task_status: 0,
                task_name: "Mainnet.",
            },
            {
                id: 1,
                task_status: 0,
                task_name: "ICO & Public Sale $FRC",
            },
            {
                id: 2,
                task_status: 0,
                task_name: "Airdrop Round-1: for testnet contributors",
            },
            {
                id: 3,
                task_status: 0,
                task_name: "Airdrop Round-2: for Flappy Owl NFT holders.",
            },
            {
                id: 4,
                task_status: 0,
                task_name: "Listing & Open Trade $FRC",
            },
        ],
    },
    {
        id: 2,
        tittle: "Phase 3",
        image: "images/roadmap/frc-coin.png",
        time: "Q4 - 2025",
        task: [
            {
                id: 0,
                task_status: 0,
                task_name: "Open $FRC mining ecosystem.",
            },
            {
                id: 1,
                task_status: 0,
                task_name: "NFT & LP StakingPool BlockReward",
            },
            {
                id: 2,
                task_status: 0,
                task_name: "Grow Up Market",
            },
        ],
    },
    {
        id: 3,
        tittle: "Phase 4",
        image: "images/roadmap/frc-coin.png",
        time: "~",
        task: [
            {
                id: 0,
                task_status: 0,
                task_name: "Future collaboration.",
            },
        ],
    },
    // {
    //     id: 4,
    //     tittle: "Phase 5",
    //     image: "images/roadmap/jordanf.jfif",
    //     time:
    //         "",
    //     task: ["We'll let you guess..."]
    // },
]
export default function handler(req, res) {
    res.status(200).json(recommendationCard)
}
