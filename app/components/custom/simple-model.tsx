import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";
import { cn } from "~/lib/utils";
import { type ClassNameValue } from "tailwind-merge";

interface SimplePopoverProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: ClassNameValue;
}

export function SimpleModel(props: SimplePopoverProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogTrigger
        onClick={(e) => {
          // e.preventDefault();
          e.stopPropagation();
        }}
        asChild
      >
        {props.trigger}
      </DialogTrigger>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className={cn("max-h-[100vh] overflow-y-auto", props.className)}
      >
        {props.children}
      </DialogContent>
    </Dialog>
  );
}
