import React, { useEffect } from "react"
import * as echarts from "echarts"

const Piechart = () => {
    const FontTitleColor = "rgba(60, 131, 255, 1)"
    const legendFontColor = "rgba(255, 255, 255, 0.764)"
    const seriesFontColor = "rgba(204, 204, 204, 1)"
    const emphasisFontColor = "rgba(108, 108, 108, 1)"
    useEffect(() => {
        // Initialize ECharts instance
        const chart = echarts.init(document.getElementById("echarts-chart"))

        // Define chart options
        const options = {
            title: {
                // text: 'TOKENOMIC ALOCATION',
                // subtext: '-',
                left: "center",
                textStyle: {
                    fontSize: 30,
                    color: FontTitleColor,
                    fontFamily: "monospace",
                },
            },
            tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b}: {c}%",
            },
            legend: {
                orient: "horizontal",
                left: "center",
                textStyle: {
                    fontSize: 12,
                    color: legendFontColor,
                    fontWeight: "bold",
                    fontFamily: "monospace",
                },
            },
            series: [
                {
                    name: "$FRC Allocation",
                    type: "pie",
                    radius: "70%",
                    data: [
                        {
                            value: 75,
                            name: "Public Sale",
                            label: {
                                color: seriesFontColor,
                                fontWeight: "bold",
                                fontFamily: "monospace",
                            },
                        },
                        {
                            value: 8,
                            name: "Partner Ecosystem",
                            label: {
                                color: seriesFontColor,
                                fontWeight: "bold",
                                fontFamily: "monospace",
                            },
                        },
                        // {
                        //     value: 45,
                        //     name: "Initial Liquidity",
                        //     label: {
                        //         color: seriesFontColor,
                        //         fontWeight: "bold",
                        //         fontFamily: "monospace",
                        //     },
                        // },
                        {
                            value: 12,
                            name: "Airdrop",
                            label: {
                                color: seriesFontColor,
                                fontWeight: "bold",
                                fontFamily: "monospace",
                            },
                        },
                        {
                            value: 5,
                            name: "Foundation",
                            label: {
                                color: seriesFontColor,
                                fontWeight: "bold",
                                fontFamily: "monospace",
                            },
                        },
                    ],
                    label: {
                        show: true,
                        formatter: "{c}%",
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: emphasisFontColor,
                        },
                    },
                },
            ],
        }
        // Set chart options
        chart.setOption(options)
        // Handle window resize event
        const handleResize = () => {
            chart.resize()
        }
        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
            chart.dispose()
        }
    }, [])

    return <div className="" id="echarts-chart" style={{ width: "100%", height: "400px" }} />
}

export default Piechart
