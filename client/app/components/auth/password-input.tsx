import { Eye, EyeOff } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function PasswordInput({
  className,
  ...props
}: ComponentProps<typeof Input>) {
  const [isVisibile, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        className={cn("pr-10", className)}
        type={isVisibile ? "text" : "password"}
        {...props}
      />
      <Button
        className="absolute top-1/2 right-1 -translate-y-1/2 cursor-pointer text-muted-foreground"
        // biome-ignore lint/performance/noJsxPropsBind: eu sei eu sei...
        onClick={() => setIsVisible((visible) => !visible)}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        {isVisibile ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
}
