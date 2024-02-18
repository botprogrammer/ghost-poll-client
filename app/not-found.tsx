import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="mt-2 text-2xl font-semibold">Poll Not Found</h2>
        <p className="mt-4 text-gray-500">
          The poll you&apos;re looking for doesn&apos;t exist or has expired.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Create a New Poll
          </Link>
        </div>
      </div>
    </div>
  );
}
