import React, { useCallback, useState } from "react"
import { useDebounceValue } from "usehooks-ts"

import globalConfig from "@/config/globalConfig"
import { Input } from "@/components/ui/Input"

import { FiatPrice } from "./FiatPrice"
import { InputProps } from "./Input"

export interface PriceInputProps extends InputProps {
  onInputUpdate?: (value: string) => void
}

const MIN_VALUE = 0.0001

export const PriceInput = ({ id, onInputUpdate }: PriceInputProps) => {
  const [inputValue, setInputValue] = useState<string>("")

  const [debouncedValue] = useDebounceValue(inputValue, 250)

  const handleChange = useCallback(
    (value: string) => {
      if (onInputUpdate) {
        onInputUpdate(value)
        setInputValue(value)
      }
    },
    [onInputUpdate]
  )

  return (
    <div className="space-y-1">
      <Input
        id={id}
        type="number"
        inputUpdateCallback={handleChange}
        min={MIN_VALUE}
        step={MIN_VALUE}
        placeholder="0.01"
      />
      <FiatPrice amount={debouncedValue} />
      {parseFloat(inputValue) < MIN_VALUE && (
        <p className="text-red-500">
          Minimum price :{" "}
          <b>
            {MIN_VALUE} {globalConfig.ordersErc20.symbol}
          </b>
        </p>
      )}
    </div>
  )
}
