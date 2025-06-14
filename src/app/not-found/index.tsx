import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-black text-slate-800 mb-4">404</h1>
          <div className="flex justify-center mb-6">
            <div className="w-32 h-1 bg-slate-400 rounded-full"></div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-md mx-auto">
            The page you're looking for seems to have vanished into the digital
            void. Don't worry, let's get you back on track!
          </p>
        </div>

        <div className="mb-12">
          <Link to="/">
            <Button
              size="lg"
              className="px-8 py-3 text-lg font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-all duration-200 transform hover:scale-105"
            >
              <Home className="w-5 h-5 mr-3" />
              Take Me Home
            </Button>
          </Link>
        </div>

        <div className="absolute top-20 left-10 w-20 h-20 bg-slate-300 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-slate-300 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-5 w-12 h-12 bg-slate-300 rounded-full opacity-30 animate-pulse delay-500"></div>
      </div>
    </div>
  );
}
