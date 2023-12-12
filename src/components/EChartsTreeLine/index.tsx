import React, { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import './index.scss'
import { unpkgTreeLineRequest } from '@/api/unpkg'
function EchartsTree(): React.JSX.Element {
  const [data, setData] = useState<any>([])
  const renderRef = useRef(false)
  const chartDom = useRef<HTMLElement>()
  const myChart = useRef<echarts.ECharts>()
  const useECharts = () => {
    const option: EChartsOption = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        formatter: function (info: any) {
          return (
            info.data.path +
            '<br/>' +
            (info.data.value * 1024).toFixed(2) +
            'KB'
          )
        },
      },
      series: [
        {
          type: 'tree',
          data: [data],
          top: '1%',
          left: '7%',
          bottom: '1%',
          right: '20%',
          symbolSize: 7,
          label: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
            fontSize: 9,
          },
          leaves: {
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left',
            },
          },
          emphasis: {
            focus: 'descendant',
          },
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750,
        },
      ],
    }
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
    myChart.current && myChart.current.setOption(option)
    myChart.current && myChart.current.hideLoading()
  }, [option])
  useEffect(() => {
    unpkgTreeLineRequest().then((res) => {
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
