"use client"

import React, { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return <div className={cn("absolute inset-0 w-full h-full", className)}>{children}</div>
}

interface CardSwapProps {
  children: React.ReactElement<CardProps>[]
  cardDistance?: number
  verticalDistance?: number
  delay?: number
  pauseOnHover?: boolean
  className?: string
}

export default function CardSwap({
  children,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  className,
}: CardSwapProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!pauseOnHover || !isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % children.length)
      }, delay)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [children.length, delay, pauseOnHover, isHovered])

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsHovered(true)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsHovered(false)
    }
  }

  return (
    <div
      className={cn("relative w-full h-full", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children.map((child, index) => {
        const isActive = index === currentIndex
        const isPrevious = index === (currentIndex - 1 + children.length) % children.length
        const isNext = index === (currentIndex + 1) % children.length

        let transform = ""
        let zIndex = 0
        let opacity = 0

        if (isActive) {
          transform = "translateX(0) translateY(0) scale(1)"
          zIndex = 30
          opacity = 1
        } else if (isPrevious) {
          transform = `translateX(-${cardDistance}px) translateY(${verticalDistance}px) scale(0.95)`
          zIndex = 20
          opacity = 0.7
        } else if (isNext) {
          transform = `translateX(${cardDistance}px) translateY(${verticalDistance}px) scale(0.95)`
          zIndex = 20
          opacity = 0.7
        } else {
          transform = "translateX(0) translateY(100px) scale(0.9)"
          zIndex = 10
          opacity = 0
        }

        return React.cloneElement(child, {
          key: index,
          className: cn(child.props.className, "transition-all duration-700 ease-in-out"),
          style: {
            transform,
            zIndex,
            opacity,
            ...child.props.style,
          },
        })
      })}
    </div>
  )
}
