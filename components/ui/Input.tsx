import React from "react"
import { XIcon } from "lucide-react"

import globalConfig from "@/config/globalConfig"
import { trimDecimals } from "@/lib/utils/priceUtils"
import { cn } from "@/lib/utils/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  inputUpdateCallback?: (value: string) => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, inputUpdateCallback, ...props }, ref) => {
    const [value, setValue] = React.useState("")

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value
      if (type == "number") {
        value = trimDecimals(
          event.target.value,
          globalConfig.decimals.inputMaxDecimals
        )
      }

      setValue(value)
      if (inputUpdateCallback) {
        inputUpdateCallback(value)
      }
    }

    // Clear the input
    const handleClear = () => {
      setValue("")

      // Creating a synthetic event
      const event = new Event("input", { bubbles: true })
      // If the ref is attached to the input element, manually set its value to empty string
      if (ref && "current" in ref && ref.current) {
        ref.current.value = ""
        // Dispatch the event from the input element
        ref.current.dispatchEvent(event)
      }
      if (inputUpdateCallback) {
        inputUpdateCallback("")
      }
    }

    return (
      <div
        className={cn(
          "border-input relative flex h-12 items-center rounded-md border px-3 py-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        {icon && <span className="mr-3">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={handleChange}
          className="input size-full !bg-transparent pr-5 font-medium outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/50"
          ref={ref}
          {...props}
        />
        {value && (
          <button onClick={handleClear} className="absolute right-3 ml-2">
            <XIcon size={16} />
          </button>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
