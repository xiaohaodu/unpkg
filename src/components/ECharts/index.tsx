import { unpkgRequest /** , unpkgRequestSample*/ } from '@/api/unpkg.js'
import React, { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import './index.scss'
function Echarts(): React.JSX.Element {
  type EChartsOption = echarts.EChartsOption
  const [data, setData] = useState<any>([])
  const renderRef = useRef(false)
  function getLevelOption() {
    return [
      {
        itemStyle: {
          borderColor: '#777',
          borderWidth: 0,
          gapWidth: 1,
        },
        upperLabel: {
          show: false,
        },
      },
      {
        itemStyle: {
          borderColor: '#555',
          borderWidth: 5,
          gapWidth: 1,
        },
        emphasis: {
          itemStyle: {
            borderColor: '#ddd',
          },
        },
      },
      {
        colorSaturation: [0.35, 0.5],
        itemStyle: {
          borderWidth: 5,
          gapWidth: 1,
          borderColorSaturation: 0.6,
        },
      },
    ]
  }

  const chartDom = useRef<HTMLElement>()
  const myChart = useRef<echarts.ECharts>()
  const useECharts = () => {
    const option: EChartsOption = {
      title: {
        text: 'npm-node_modules',
        left: 'center',
      },

      tooltip: {
        formatter: function () {
          return '1'
        },
      },

      series: [
        {
          name: 'npm-node_modules',
          type: 'treemap',
          visibleMin: 300,
          label: {
            show: true,
            formatter: '{b}',
          },
          upperLabel: {
            show: true,
            height: 30,
          },
          itemStyle: {
            borderColor: '#fff',
          },
          levels: getLevelOption(),
          data: data,
        },
      ],
    }
    useEffect(() => {
      if (renderRef.current) {
        return
      }
      renderRef.current = true
      console.log('初始化')
      chartDom.current = document.getElementById('echarts')!
      myChart.current = echarts.init(chartDom.current)
    }, [])
    return option
  }
  const option = useECharts()
  useEffect(() => {
    myChart.current?.showLoading()
    myChart.current && myChart.current.setOption(option)
    myChart.current && myChart.current.hideLoading()
  }, [option])
  useEffect(() => {
    // unpkgRequestSample().then((res) => {
    //   console.log(res.data)
    //   setData(res.data)
    // })
    unpkgRequest().then((res) => {
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

export default Echarts
