import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[#C9768F] text-white hover:bg-[#b5607a] focus-visible:ring-[#C9768F] shadow-sm hover:shadow-md',
        outline:
          'border-2 border-[#C9768F] text-[#C9768F] bg-transparent hover:bg-[#C9768F] hover:text-white',
        ghost:
          'text-[#C9768F] hover:bg-[#F5EDE3]',
        destructive:
          'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500',
        secondary:
          'bg-[#F5EDE3] text-[#C9768F] hover:bg-[#e8d5c9]',
        dark:
          'bg-[#0D0D0D] text-white hover:bg-[#1a1a1a]',
        gold:
          'bg-[#C9A96E] text-[#0D0D0D] hover:bg-[#b8943e] font-bold',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-13 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
