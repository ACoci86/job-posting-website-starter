import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Job Board Logo" width={40} height={40} />
          <span className="text-lg font-semibold">Job Board</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-gray-700">
          <Link href="/jobs" className="hover:text-black">Browse Jobs</Link>
          <Link href="/jobs/post" className="hover:text-black">Post a Job</Link>
          <Link href="/dashb" className="hover:text-black">Dashboard</Link>
          
          <Link
            href="/auth/signin"
            className="rounded-md bg-black px-4 py-2 font-medium text-white hover:bg-gray-800">
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}