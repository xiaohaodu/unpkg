import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as echarts from 'echarts'
import './index.scss'
import { unpkgTreeChunkRequest } from '@/api/unpkg'
function EchartsTree(): React.JSX.Element {
  const [data, setData] = useState<any>([])
  const renderRef = useRef(false)
  const chartDom = useRef<HTMLElement>()
  const myChart = useRef<echarts.ECharts>()
  const option = useMemo(() => {
    const option: EChartsOption = {
      title: {
        text: 'npm-node_modules',
        left: 'center',
      },
      tooltip: {
        formatter: function (info: any) {
          const treePathInfo = info.treePathInfo
          const treePath = []
          for (let i = 1; i < treePathInfo.length; i++) {
            treePath.push(treePathInfo[i].name)
          }
          return (
            '<div class="tooltip-title">' +
            echarts.format.encodeHTML(treePath.join('/')) +
            '</div>' +
            '<br/>' +
            (info.value * 1024).toFixed(2) +
            'KB'
          )
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
          levels: [
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
          ],
          data: data,
        },
      ],
    }
    return option
  }, [data])
  useEffect(() => {
    if (renderRef.current) {
      return
    }
    renderRef.current = true
    chartDom.current = document.getElementById('echarts')!
    myChart.current = echarts.init(chartDom.current)
  }, [])
  useEffect(() => {
    myChart.current?.showLoading()
    myChart.current && myChart.current.setOption(option)
    myChart.current && myChart.current.hideLoading()
  }, [option])
  useEffect(() => {
    unpkgTreeChunkRequest().then((res) => {
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

export default EchartsTree
