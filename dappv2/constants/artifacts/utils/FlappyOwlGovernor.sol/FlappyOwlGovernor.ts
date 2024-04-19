export const contractGovernanceName = [{ contractName: "FlappyOwlGovernor" }] as const
export const contractGovernanceAbi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_tokenAddress",
                type: "address",
            },
            {
                internalType: "address",
                name: "_lpStakingAddress",
                type: "address",
            },
            {
                internalType: "address",
                name: "_nftStakingAddress",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_initialRewardPerBlock",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "FlappyOwlPos__ItemAlreadyStaked",
        type: "error",
    },
    {
        inputs: [],
        name: "FlappyOwlPos__NotItemOwner",
        type: "error",
    },
    {
        inputs: [],
        name: "NotAuthenticNfts",
        type: "error",
    },
    {
        inputs: [],
        name: "NotHavePoolPosition",
        type: "error",
    },
    {
        inputs: [],
        name: "NotHaveStakedNfts",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "reward",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "blockclaimed",
                type: "uint256",
            },
        ],
        name: "Claimed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "_newBlockReward",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_newHalvingBlock",
                type: "uint256",
            },
        ],
        name: "HalvingReward",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        inputs: [],
        name: "_genesisSupplyFRC",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_user",
                type: "address",
            },
        ],
        name: "claimReward",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_user",
                type: "address",
            },
        ],
        name: "getUnclaimedRewards",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "initialSupply",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "initialSupplyMinted",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "lastClaimBlock",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "lastHalvingBlock",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "rewardPerBlock",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_lpStakingAddress",
                type: "address",
            },
        ],
        name: "updateLiquidityStakingInterface",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_nftStakingAddress",
                type: "address",
            },
        ],
        name: "updateNftStakingInterface",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_tokenAddress",
                type: "address",
            },
        ],
        name: "updateTokenInterface",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const
