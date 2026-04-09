import { cn } from "@/lib/utils"
import * as React from "react"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated'
  hover?: boolean
}

export function Card({ className, variant = 'default', hover = true, ...props }: CardProps) {
  const variants = {
    default: "rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-sm",
    glass: "rounded-2xl border border-white/20 bg-white/80 backdrop-blur-sm text-slate-950",
    elevated: "rounded-2xl bg-white text-slate-950 shadow-lg"
  }

  const hoverEffect = hover ? "hover:shadow-2xl hover:-translate-y-1 transition-all duration-500" : ""

  return (
    <div
      className={cn(
        variants[variant],
        hoverEffect,
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("flex flex-col space-y-1.5 p-6", className)} 
      {...props} 
    />
  )
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-2xl font-bold leading-none tracking-tight text-slate-900", className)}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p 
      className={cn("text-sm text-slate-500", className)} 
      {...props} 
    />
  )
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("p-6 pt-0", className)} 
      {...props} 
    />
  )
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("flex items-center p-6 pt-0", className)} 
      {...props} 
    />
  )
}