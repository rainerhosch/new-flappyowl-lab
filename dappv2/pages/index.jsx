import Footer from '../components/Footer';
import Banner from '../components/HomeComponents/Banner';
import MyExpertise from '../components/HomeComponents/Expertise/MyExpertise';
import RoadMap from '../components/HomeComponents/Roadmap/RoadMap';
import Contributors from '../components/HomeComponents/Contibutors/Contributors';
const home = () => {
    return (
        <div className="Home-Page -z-10">
            <Banner />
            <MyExpertise />
            <RoadMap />
            <Contributors />
            <Footer />

        </div>
    )
}

export default home