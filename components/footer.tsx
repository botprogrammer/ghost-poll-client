"use client";

import { Github, Globe } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-muted-foreground">
              Created with ❤️ by{" "}
              <Link
                href="https://pranavgoswami.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Pranav Goswami
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/botprogrammer/ghost-poll-client"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href="https://pranavgoswami.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Portfolio"
            >
              <Globe className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <div className="text-muted-foreground mt-4 text-center text-sm">
          <p>
            Built with Next.js, TypeScript, and Tailwind CSS.{" "}
            <span className="hidden sm:inline">
              Open source and free to use.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
