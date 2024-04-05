import React from "react";
// import { PieChart, Pie, Cell } from 'recharts';
import EChartsExample from "./Piechart"

function About() {

  // const data = [
  //   { name: 'Group A', value: 400 },
  //   { name: 'Group B', value: 300 },
  //   { name: 'Group C', value: 300 },
  //   { name: 'Group D', value: 200 },
  // ];
  // const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <section
      // className="about bg-light"
      className="about"
      id="about"
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-9">
            <div className="text-center">
              <h1 className="about-title tracking-[.25rem] font-['Poppins'] text-[#ffffff]">Flappyowl VMS</h1>
              <p className="lead text-justify text-yellow">
                Flappyowl vault is the first nft project to introduce a virtual
                mining system, $FRC is the original token in the ecosystem.
              </p>
              <p className="lead text-justify text-yellow">It's like ethereum only minted by miners, so supply will depend on community staking nft.
              </p>
              <p className="lead text-justify text-yellow">The Flappyowl NTF is Onchain Nfts type, generated directly to the blockchain by algorithms stored and scured into blockchain without
                external storage.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-24 bg-[#31313185] rounded-md">
          <div className="row p-3 text-center text-[#fff]"><h3 className="">21M INITIAL SUPPLY $FRC ALLOCATION</h3></div>
          <div className="row p-3">
            <EChartsExample />
          </div>
        </div>
      </div>

      {/* <PieChart width={400} height={400}>
        <Pie
          dataKey="value"
          data={data}
          cx={200}
          cy={200}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart> */}

    </section>
  );
}

export default About;
