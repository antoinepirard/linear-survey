import { forwardRef, LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Label = forwardRef<
  HTMLLabelElement,
  LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }
>(({ className, children, required, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium text-text-primary",
      className
    )}
    {...props}
  >
    {children}
    {required && <span className="ml-1 text-red-500">*</span>}
  </label>
));
Label.displayName = "Label";

export { Label };

