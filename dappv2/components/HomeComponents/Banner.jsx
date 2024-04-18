import Typewriter from "typewriter-effect"
import BannerLayout from "../Common/BannerLayout"
import Image from "next/image"

const Banner = () => {
    return (
        <BannerLayout>
            <div className="absolute inset-0 z-20 flex flex-col items-center py-6 justify-center w-full h-full bg-gradient-to-t from-RedSuprime">
                <div className="bg-SnowTransparent w-[95%] h-[95%] px-4 py-2 rounded-xl overflow-hidden flex md:block">
                    <div className="flex sm:content-center md:items-center md:justify-around">
                        <div className="">
                            <div className="">
                                <h1 className="text-2xl sm:text-4xl xl:text-5xl text-Snow font-bold">
                                    NFT Yeild Farm Solution.
                                </h1>
                            </div>

                            <div className="mt-3">
                                <p className="text-[0.95em] sm:text-2x1 xl:text-lg text-Snow font-medium font-mono">
                                    Discover, collect, and earn $FRC with stake your Nft, on our
                                    vault.
                                </p>
                            </div>
                        </div>
                        <div className="w-48 h-52 relative justify-center"></div>
                    </div>
                </div>

                {/* details in row */}
                <div className="bg-SnowTransparent w-[95%] px-4 py-2 rounded-xl mt-3">
                    <div className="grid grid-cols-2 gap-4 md:gap-0 md:flex md:items-center justify-around w-full px-4 xl:px-8 2xl:px-16">
                        <div className="flex items-center gap-x-1">
                            <span className="text-base md:text-lg text-DeepNightBlack font-bold font-mono">
                                5K+
                            </span>
                            <span className="text-sm text-MidNightBlack font-medium font-mono">
                                Owl Staked
                            </span>
                        </div>

                        <div className="flex items-center gap-x-1">
                            <span className="text-base md:text-lg text-DeepNightBlack font-bold font-mono">
                                1M+
                            </span>
                            <span className="text-sm text-MidNightBlack font-medium font-mono">
                                FRC Earned
                            </span>
                        </div>

                        <div className="flex items-center gap-x-1">
                            <span className="text-base md:text-lg text-DeepNightBlack font-bold font-mono">
                                500K
                            </span>
                            <span className="text-sm text-MidNightBlack font-medium font-mono">
                                $FRC Airdrop
                            </span>
                        </div>

                        <div className="flex items-center gap-x-1">
                            <span className="text-base md:text-lg text-DeepNightBlack font-bold font-mono">
                                21K
                            </span>
                            <span className="text-sm text-MidNightBlack font-medium font-mono">
                                NFT Minted
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </BannerLayout>
    )
}

export default Banner
