import React from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Image from "next/image"

const RecentMinted = ({ images }) => {
    const totalImg = images.length
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        responsive: [
            {
                breakpoint: 5000,
                settings: {
                    slidesToShow: Number(totalImg) ? 5 : Number(totalImg),
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: Number(totalImg) ? 3 : Number(totalImg),
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: Number(totalImg) ? 2 : Number(totalImg),
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 580,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    }

    return (
        <Slider {...settings}>
            {images.map((image, index) => (
                <div key={index} className="text-center p-10">
                    <Image
                        src={image.uri}
                        height={300}
                        width={300}
                        alt={`Slide ${index}`}
                        className="item-img-hero rounded-lg"
                    />
                    <div className="mt-3 mb-6 sm:text-sm md:text-sm lg:text-md">
                        <h4 className="text-Snow font-bold">{image.nftName}</h4>
                    </div>
                </div>
            ))}
        </Slider>
    )
}

export default RecentMinted
