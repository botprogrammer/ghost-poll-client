"use client";

import Link from "next/link";
import { Clock, Lock, MessageSquare, Zap } from "lucide-react";
import { Footer } from "./footer";

export function HomeContent() {
  return (
    <>
      <div className="container mx-auto min-h-screen px-4">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-primary/10 mb-6 inline-flex items-center justify-center rounded-full p-3">
            <MessageSquare className="text-primary h-6 w-6" />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Create Anonymous Polls That{" "}
            <span className="text-primary">Disappear</span>
          </h1>
          <p className="text-muted-foreground mb-8 max-w-2xl text-lg">
            Get instant feedback from your audience with temporary polls. No
            sign-up required. Share your poll and watch the results come in
            real-time.
          </p>
          <Link
            href="/create"
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary inline-flex items-center justify-center rounded-md px-8 py-4 text-lg font-medium shadow transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            Create a New Poll
          </Link>
        </div>

        {/* Features Section */}
        <div className="mx-auto max-w-5xl py-20">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
            Why Choose Ghost Poll?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-card rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="bg-primary/10 mb-4 inline-flex items-center justify-center rounded-full p-3">
                <Clock className="text-primary h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Timed Expiry</h3>
              <p className="text-muted-foreground">
                Polls automatically disappear after 1 hour, 12 hours, or 24
                hours. Perfect for time-sensitive decisions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="bg-primary/10 mb-4 inline-flex items-center justify-center rounded-full p-3">
                <Lock className="text-primary h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Private & Anonymous
              </h3>
              <p className="text-muted-foreground">
                No login required. Polls are only accessible via unique links.
                Keep your audience&apos;s privacy intact.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="bg-primary/10 mb-4 inline-flex items-center justify-center rounded-full p-3">
                <Zap className="text-primary h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Instant Feedback</h3>
              <p className="text-muted-foreground">
                See results in real-time or hide them until the poll ends. Get
                immediate insights from your audience.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mx-auto max-w-3xl py-20 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">
            Ready to Create Your First Poll?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            It only takes a few seconds to create a poll and start gathering
            feedback.
          </p>
          <Link
            href="/create"
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary inline-flex items-center justify-center rounded-md px-8 py-4 text-lg font-medium shadow transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            Get Started Now
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
