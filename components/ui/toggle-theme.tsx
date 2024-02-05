"use client";

import { useTheme } from "next-themes";

import { Moon, Sun } from "lucide-react";
import Button from "./button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      className="size-10 rounded-full border"
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
