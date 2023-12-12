import * as echarts from 'echarts'
import './index.scss'
import { useState, useEffect, useRef } from 'react'
import { unpkgNpmRequest } from '@/api/unpkg'
function getOptionDefault(json: Analyser.NpmAnalyser): EChartsOption {
  return {
    title: {
      text: 'NPM Dependencies',
    },
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        type: 'graph',
        layout: 'none',
        // progressiveThreshold: 700,
        data: json.nodes.map(function (node) {
          return {
            x: node.x,
            y: node.y,
            id: node.id,
            name: node.label,
            symbolSize: node.size,
            itemStyle: {
              color: node.color,
            },
          }
        }),
        edges: json.edges.map(function (edge) {
          return {
            source: edge.sourceID,
            target: edge.targetID,
          }
        }),
        emphasis: {
          focus: 'adjacency',
          label: {
            position: 'right',
            show: true,
          },
        },
        roam: true,
        lineStyle: {
          width: 0.5,
          curveness: 0.3,
          opacity: 0.7,
        },
      },
    ],
  }
}

function EchartsNpm(): React.JSX.Element {
  const [json, setData] = useState<Analyser.NpmAnalyser>({
    nodes: [],
    edges: [],
  })
  const chartDom = useRef<HTMLElement>()
  const myChart = useRef<echarts.ECharts>()
  const renderRef = useRef(false)
  const useECharts = () => {
    const option: EChartsOption = getOptionDefault(json)
    useEffect(() => {
      renderRef.current = true
      chartDom.current = document.getElementById('echarts')!
      myChart.current = echarts.init(chartDom.current)
    }, [])
    return option
  }
  const option = useECharts()
  useEffect(() => {
    myChart.current?.showLoading()
    myChart.current && myChart.current.setOption(option, true)
    myChart.current && myChart.current.hideLoading()
  }, [option])
  useEffect(() => {
    unpkgNpmRequest().then((res) => {
      const { data } = res
      console.log(data)
      setData(data)
    })
  }, [])
  return (
    <>
      <div id="echarts"></div>
    </>
  )
}

export default EchartsNpm
