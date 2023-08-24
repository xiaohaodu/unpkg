import { unpkgRequest } from '@/api/unpkg'
import React, { useEffect, useState } from 'react'
function App(): React.JSX.Element {
  const [data, setData] = useState({})
  useEffect(() => {
    unpkgRequest().then((res) => {
      console.log(res)
      setData(res)
    })
  }, [])
  return (
    <>
      <div>{JSON.stringify(data)}</div>
    </>
  )
}

export default App
