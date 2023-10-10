import { Loader } from "lucide-react"
import cx from 'classnames'

export const Loading = () => {
  return (
    <div className="flex justify-center py-[100px]">
      <div className="w-12 h-12">
        <Loader size={22} className="animate-spin" />
      </div>
    </div>
  )
}