import { unpkgRequest } from '@/api/unpkg'
import React, { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
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
      text: 'Disk Usage',
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
          'Disk Usage: ' + echarts.format.addCommas(value) + ' KB',
        ].join('')
      },
    },

    series: [
      {
        name: 'Disk Usage',
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
