import { Label } from "@/components/ui/Label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"

type OrderExpirySelectProps = {
  setValidity: (v: string) => void
  defaultValidity: string
}

export function OrderExpirySelect({
  setValidity,
  defaultValidity,
}: OrderExpirySelectProps) {
  return (
    <>
      <Label htmlFor="order-validity">Validity time</Label>
      <Select
        defaultValue={defaultValidity}
        onValueChange={(newValidity) => setValidity(newValidity)}
      >
        <SelectTrigger className="sm:w-[180px]" id="order-validity">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10 days</SelectItem>
          <SelectItem value="30">30 days</SelectItem>
          <SelectItem value="90">90 days</SelectItem>
        </SelectContent>
      </Select>
    </>
  )
}
