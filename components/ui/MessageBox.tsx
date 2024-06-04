import { Info } from "lucide-react"

import { Card, CardDescription, CardHeader, CardTitle } from "./Card"

export type MessageBoxProps = {
  title: string
  description: string | React.ReactNode
  description: string | React.ReactNode
  renderIcon?: () => React.ReactNode
  className?: string
}

const MessageBox = ({
  title,
  description,
  renderIcon,
  className,
}: MessageBoxProps) => {
  return (
    <Card className={className}>
      <CardHeader className="">
        <CardTitle className="text-accent-foreground flex items-center justify-center gap-2 text-lg font-semibold">
          {renderIcon?.()}
          {title}
        </CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}

export const InfoBox = ({
  title,
  description,
}: {
  title: string
  description: string | React.ReactNode
  description: string | React.ReactNode
}) => {
  return (
    <MessageBox
      title={title}
      description={description}
      renderIcon={() => <Info size={20} />}
      className="rounded-lg border-0 bg-white/[0.05] shadow-none"
    />
  )
}
