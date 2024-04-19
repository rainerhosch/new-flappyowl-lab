import React, { useEffect } from "react"
import * as echarts from "echarts"

const Piechart = () => {
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
                    color: "rgba(255, 42, 42, 1)",
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
                    color: "rgba(255, 42, 42, 1)",
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
                            value: 30,
                            name: "Public Sale",
                            label: {
                                color: "rgba(255, 42, 42, 1)",
                                fontWeight: "bold",
                                fontFamily: "monospace",
                            },
                        },
                        {
                            value: 45,
                            name: "Ecosystem Partner",
                            label: {
                                color: "rgba(255, 42, 42, 1)",
                                fontWeight: "bold",
                                fontFamily: "monospace",
                            },
                        },
                        {
                            value: 8,
                            name: "Initial Liquidity",
                            label: {
                                color: "rgba(255, 42, 42, 1)",
                                fontWeight: "bold",
                                fontFamily: "monospace",
                            },
                        },
                        {
                            value: 12,
                            name: "Airdrop",
                            label: {
                                color: "rgba(255, 42, 42, 1)",
                                fontWeight: "bold",
                                fontFamily: "monospace",
                            },
                        },
                        {
                            value: 5,
                            name: "Foundation",
                            label: {
                                color: "rgba(255, 42, 42, 1)",
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
                            shadowColor: "rgba(255, 42, 42, 1)",
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