import { useState } from 'react'
import {
  ApartmentOutlined,
  AppstoreOutlined,
  BarsOutlined,
  // BranchesOutlined,
} from '@ant-design/icons'
import { FloatButton } from 'antd'
import { lazy, Suspense } from 'react'
import Loading from '@/components/Loading'
const EChartsNpm = lazy(() => import('@/components/EChartsNpm'))
const EChartsTreeChunk = lazy(() => import('@/components/EChartsTreeChunk'))
const EChartsTreeLine = lazy(() => import('@/components/EChartsTreeLine'))
function Home(): React.JSX.Element {
  const [echartsType, setEChartsType] = useState<
    'npm' | 'treeChunk' | 'treeLine'
  >('treeChunk')

  return (
    <>
      {echartsType === 'treeChunk' ? (
        <Suspense fallback={Loading}>
          <EChartsTreeChunk></EChartsTreeChunk>
        </Suspense>
      ) : (
        ''
      )}
      {echartsType === 'treeLine' ? (
        <Suspense fallback={Loading}>
          <EChartsTreeLine></EChartsTreeLine>
        </Suspense>
      ) : (
        ''
      )}
      {echartsType === 'npm' ? (
        <Suspense fallback={Loading}>
          <EChartsNpm></EChartsNpm>
        </Suspense>
      ) : (
        ''
      )}

      <>
        <FloatButton.Group
          trigger="click"
          type="primary"
          style={{ right: 94 }}
          icon={<BarsOutlined />}
        >
          <FloatButton
            icon={
              <ApartmentOutlined
                onClick={() => {
                  setEChartsType('treeLine')
                }}
              />
            }
            tooltip="NPM树图"
          />
          {/* <FloatButton
            icon={<BranchesOutlined />}
            onClick={() => {
              setEChartsType('npm')
            }}
            tooltip="NPM依赖关系图"
          /> */}
          <FloatButton
            icon={<AppstoreOutlined />}
            onClick={() => {
              setEChartsType('treeChunk')
            }}
            tooltip="NPM矩形树图"
          />
        </FloatButton.Group>
      </>
    </>
  )
}
export default Home
