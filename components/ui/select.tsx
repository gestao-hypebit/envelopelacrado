import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          'flex h-11 w-full rounded-xl border border-[#E8D5C9] bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C9768F] focus:border-transparent transition-all disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = 'Select'

export { Select }
