// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const recommendationCard = [
  {
    id: 0,
    name: 'Alexandre Fernandes',
    image: "images/team/fernandes.jfif",
    location:"Brazil",
    designation: 'Founder of RDE WEB3 | Carbon RDE | Fintech - RDE BANK | BlockChain',
    view: "I am Alexandre Fernandes, CEO at RDE WEB3, a company that offers innovative and disruptive solutions in web3. I am also the founder of two other startups: Blockchain RDE, which develops projects and consultancy in blockchain, and Carbon RDE, which promotes sustainability in web3 through carbon emission reduction initiatives.",
    linkednURL: "https://www.linkedin.com/in/alexandrerdeweb3/"
  },
  {
    id: 1,
    name: 'Preetam',
    image: "images/team/preetam.jfif",
    location:"Dubai, United Arab Emirates",
    designation: 'CEO & Co-Founder @QuillAudits | 850+ Clients Globally | Web3 Security Solutions | Blockchain',
    view: "As the Co-founder and CEO of QuillAudits, I lead a team dedicated to making this vision a reality. Our expertise in Smart Contracts and DeFi Safety Audits ensures the security and innovation of your Web3 projects. We rigorously audit to identify and fix vulnerabilities, fostering trust in your ventures.",
    linkednURL: "https://www.linkedin.com/in/raopreetam/"
  },
  {
    id: 2,
    name: 'Usman Afridi',
    image: "images/team/alessandro.jfif",
    location:"Peshawar, Khyber Pakhtunkhwa, Pakistan",
    designation: 'Data Scientist | Generative AI Developer | Business Developer',
    view: " Automate your data-gathering process, and integrate it into a centralized system. Apply Machine Learning and Deep Learning Models on the data wherever applicable(if it can add value to your work)",
    linkednURL: "https://www.linkedin.com/in/m-usman-afridi/"
  },
  {
    id: 3,
    name: 'Mariam Nusrat',
    image: "images/team/mariam.png",
    location:"Vienna, Virginia, United States",
    designation: 'Founder & CEO of Breshna.io, a no code game maker platform | Forbes Next1k Entrepreneur Tedx | Speaker Ex- Sr. Educ Specialist at World Bank',
    view: "As a Forbes Next 1k Entrepreneur, a Tedx Speaker, and a World Bank Senior Education Specialist (on sabbatical), Mariam has demonstrated exceptional leadership, innovation, and vision in the fields of purposeful gaming and educational content. She has secured over $2.5 million in seed funding from prominent investors including Paris Hilton's 11:11 Media, Randi Zuckerberg, Blockchain Founders Fund.",
    linkednURL: "https://www.linkedin.com/in/mariamnusrat/"
  },
  {
    id: 4,
    name: 'Jordan Franklin',
    image: "images/team/jordanf.jfif",
    location:"Sydney, New South Wales, Australia",
    designation: 'Web3 Educator | Builder of People, Brands and Businesses | Start-ups & Entrepreneurship',
    view: "My first job out of university was at a Unicorn which was at the time a rapidly scaling education start-up. Here I learned how to sell ideas, value and products to people in a sink or swim environment. My experience here enlivened my zest for entrepreneurship, selling and business strategy.",
    linkednURL: "https://www.linkedin.com/in/jordan-franklin-dear-crypto/"
  },
]
export default function handler(req, res) {
  res.status(200).json(recommendationCard)
}
