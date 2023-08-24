import { unpkgRequest } from '@/api/unpkg'
import React, { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import './index.scss'
function Echarts(): React.JSX.Element {
  type EChartsOption = echarts.EChartsOption
  const [data, setData] = useState([])
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
  const option: EChartsOption = {
    title: {
      text: 'npm-node_modules',
      left: 'center',
    },

    tooltip: {
      formatter: function (info: any) {
        const value = info.value
        const treePathInfo = info.treePathInfo
        const treePath = []

        for (let i = 1; i < treePathInfo.length; i++) {
          treePath.push(treePathInfo[i].name)
        }

        return [
          '<div class="tooltip-title">' +
            echarts.format.encodeHTML(treePath.join('/')) +
            '</div>',
          'npm-node_modules: ' + echarts.format.addCommas(value) + ' KB',
        ].join('')
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
  const chartDom = useRef<HTMLElement>()
  const once = useRef(false)
  useEffect(() => {
    if (once.current) return
    chartDom.current = document.getElementById('echarts')!
    setData
    const myChart = echarts.init(chartDom.current)
    myChart.showLoading()
    unpkgRequest().then((res) => {
      console.log(res)
      option && myChart.setOption(option)
      myChart.hideLoading()
    })
    once.current = true
  }, [])
  return (
    <>
      <div id="echarts"></div>
    </>
  )
}

export default Echarts
