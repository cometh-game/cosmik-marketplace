import { useCallback, useRef } from "react"
import debounce from "lodash/debounce"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/Input"

type SearchAssetProps = {
  onChange: (name: string) => void
}

export function SearchAsset({ onChange }: SearchAssetProps) {
  const SearchRef = useRef<HTMLInputElement>(null)

  const handleChange = useCallback(
    debounce(() => {
      onChange(SearchRef?.current?.value as string)
    }, 300),
    [SearchRef, onChange]
  )

  return (
    <Input
      ref={SearchRef}
      type="text"
      placeholder="Search name"
      className="btn-default bg-primary/60 before:bg-primary/20 hover:bg-primary/40 h-[40px] border-0 text-white after:content-none max-md:w-[calc(100%-180px)]"
      icon={<Search size="16" className={"min-w-[17px]"} />}
      inputUpdateCallback={handleChange}
    />
  )
}
