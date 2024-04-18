// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const recommendationCard = [
    {
        id: 0,
        tittle: "Phase 1",
        image: "images/roadmap/flappyowl.png",
        time: "Q4 - 2023 | Q1, Q2 - 2024",
        task: [
            {
                id: 0,
                task_status: true,
                task_name: "Deployed NFT on mainnet",
            },
            {
                id: 1,
                task_status: true,
                task_name: "Live Mint NFT on Ehereum Mainnet",
            },
            {
                id: 2,
                task_status: true,
                task_name: "Testnet Announchment",
            },
            {
                id: 3,
                task_status: true,
                task_name: "Testnet stage",
            },
        ],
    },
    {
        id: 1,
        tittle: "Phase 2",
        image: "images/roadmap/flappyowl.png",
        time: "Q4 - 2024",
        task: [
            {
                id: 0,
                task_status: false,
                task_name: "Deploy Dapp Vault on mainnet.",
            },
            {
                id: 1,
                task_status: false,
                task_name: "Public Sale",
            },
            {
                id: 2,
                task_status: false,
                task_name: "Initial Liquidity",
            },
            {
                id: 3,
                task_status: false,
                task_name: "Launch DApp on mainet.",
            },
        ],
    },
    {
        id: 2,
        tittle: "Phase 3",
        image: "images/roadmap/frc-airdrop.png",
        time: "Q6 - 2024",
        task: [
            {
                id: 0,
                task_status: false,
                task_name: "Airdrop $FRC distribution for testnet contributors",
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
                task_status: false,
                task_name: "We'll let you guess...",
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
