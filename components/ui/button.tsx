import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

// Define button variants
const buttonVariants = {
  default: "bg-primary text-white hover:bg-primary/90",
  outline: "border hover:bg-secondary/60",
  ghost: "text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-900",
  destructive: "bg-red-500 text-white hover:bg-red-600",
};

interface TButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: "default" | "sm" | "lg";
  variant?: keyof typeof buttonVariants;
  className?: string;
}

const Button = ({
  children,
  onClick,
  size = "default",
  variant = "default",
  className,
  ...props
}: TButtonProps) => {
  return (
    <button
      className={cn(
        "flex cursor-pointer items-center justify-center gap-2 rounded-md font-medium transition-all",
        {
          "h-10 px-4 py-2": size === "default",
          "h-9 rounded-md px-3 text-sm": size === "sm",
          "h-11 rounded-md px-8 text-lg": size === "lg",
          "cursor-not-allowed opacity-50": props.disabled,
        },
        buttonVariants[variant],
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
