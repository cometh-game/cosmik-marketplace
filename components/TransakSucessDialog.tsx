import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"

import { Button } from "./ui/Button"

export type TransakSuccessDialogProps = {
  resumeOrder: any
  onClose: () => void
}

export function TransakSuccessDialog({ resumeOrder, onClose }: TransakSuccessDialogProps) {

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Order registered</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <>
            Thanks pilot! Your ETH is being transferred to your wallet. This may
            take up to 3 minutes.
            <br />
            You will receive an email when your order is complete. <br />
            You can also track your order here:
            {/* <a href=""></a> */}
          </>
        </DialogDescription>
        <Button size="lg" variant="ghost" onClick={() => onClose()}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  )
}
