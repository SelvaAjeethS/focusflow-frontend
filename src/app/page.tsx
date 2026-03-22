import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto py-12 md:py-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary mb-6 leading-[1.1] tracking-tight">
            Welcome to <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">FocusFlow</span>
          </h1>
          <p className="text-text-secondary text-base md:text-lg mb-8 md:mb-10 leading-relaxed max-w-xl mx-auto">
            Manage your tasks efficiently and boost your productivity with our modern, intuitive task management system.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/login"
              className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background text-sm md:text-base"
            >
              Get Started
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 bg-card hover:bg-border text-text-primary font-semibold rounded-lg border border-border transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background text-sm md:text-base"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
