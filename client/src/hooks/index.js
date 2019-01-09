import { useEffect } from 'react'

export const connectToServerSideEvent = (route, handleData) => useEffect( () => {
    const stream = new EventSource(route)

    const handlePing = e => console.log(`ping: ${JSON.parse(e.data).time}`)

    const handleError = err => console.error(`There was an error getting data from event source ${route}:`, err)

    stream.addEventListener('message', handleData)
    stream.addEventListener('ping', handlePing)
    stream.addEventListener('error', handleError)

    return () => {
      stream.removeEventListener('message', handleData)
      stream.addEventListener('error', handleError)
      stream.close()
    }
  }, [])
