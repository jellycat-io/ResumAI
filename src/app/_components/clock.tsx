"use client"

import { useEffect, useState } from "react"

export function Clock() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  })

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <span className="text-lg text-muted-foreground">The time is now</span>
      <div className="flex items-center gap-2">
        <TimeContainer
          value={currentTime.getHours().toLocaleString().padStart(2, "0")}
        />
        <TimeContainer
          value={currentTime.getMinutes().toLocaleString().padStart(2, "0")}
        />
        <TimeContainer
          value={currentTime.getSeconds().toLocaleString().padStart(2, "0")}
        />
      </div>
    </div>
  )
}

function TimeContainer({ value }: { value: string }) {
  return (
    <div className="bg-accent text-accent-foreground flex items-center justify-center size-24 text-7xl rounded-md font-bold">
      {value}
    </div>
  )
}
