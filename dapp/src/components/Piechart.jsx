import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const Piechart = () => {
  useEffect(() => {
    // Initialize ECharts instance
    const chart = echarts.init(document.getElementById('echarts-chart'));

    // Define chart options
    const options = {
      title: {
        // text: 'TOKENOMIC ALOCATION',
        // subtext: 'Fake Data',
        left: 'center',
        textStyle: {
          fontSize: 30,
          color:"#fff"
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}%',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: {
          color: "rgba(255, 255, 255, 1)"
        }
      },
      series: [
        {
          name: '$FRC Allocation',
          type: 'pie',
          radius: '70%',
          data: [
            { 
              value: 70,
              name: 'Public Sale', 
              label: {
                color: "rgba(255, 255, 255, 1)"
              }
            },
            { 
              value: 15, 
              name: 'Initial Liquidity',
              label: {
                color: "rgba(255, 255, 255, 1)"
              }
            },
            { 
              value: 10, 
              name: 'Airdrop',
              label: {
                color: "rgba(255, 255, 255, 1)"
              }
            },
            { 
              value: 5, 
              name: 'Foundation',
              label: {
                color: "rgba(255, 255, 255, 1)"
              }
            }
          ],
          label: {
            show: true,
            formatter: '{c}%',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    // Set chart options
    chart.setOption(options);

    // Clean up ECharts instance
    // return () => {
    //   chart.dispose();
    // };
    // Handle window resize event
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, []);

  return <div className="" id="echarts-chart" style={{ width: '100%', height: '400px' }} />;
};

export default Piechart;
