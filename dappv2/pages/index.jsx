import Footer from '../components/Footer';
import Banner from '../components/HomeComponents/Banner';
import MyExpertise from '../components/HomeComponents/Expertise/MyExpertise';
import RoadMap from '../components/HomeComponents/Roadmap/RoadMap';
import Team from '../components/HomeComponents/Team/Team';
const home = () => {
    return (
        <div className="Home-Page -z-10">
            <Banner />
            <MyExpertise />
            <RoadMap />
            <Team />
            <Footer />
        </div>
    )
}

export default home