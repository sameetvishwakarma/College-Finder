import { ArrowRight, Search, Filter, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Premium University Architecture Background with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-zoom-subtle"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1509062522246-3755977927d7')`
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 relative">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-wide text-white md:text-6xl leading-tight max-w-3xl mx-auto" style={{ letterSpacing: '0.05em', textShadow: '0 4px 30px rgba(0,0,0,0.7)', opacity: 0, animation: 'fadeInUp 700ms ease-in-out forwards' }}>
            Find the Right Junior College After Class 10
          </h1>

          <p
            className="mb-10 text-lg text-slate-300 md:text-xl leading-relaxed mt-4"
            style={{ animationDelay: "0.2s", opacity: 0, animation: 'fadeInUp 700ms ease-in-out forwards 0.2s' }}
          >
            Discover the perfect academic path tailored to your future.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
            style={{ opacity: 0, animation: 'fadeInUp 700ms ease-in-out forwards 0.4s' }}
          >
            <Button asChild size="lg" className="bg-linear-to-r from-slate-800 to-slate-700 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl font-bold px-8 py-3 rounded-full">
              <Link to="/discover">
                Explore Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300 backdrop-blur-sm bg-white/10 font-bold px-8 py-3 rounded-full hover:scale-105 shadow-lg">
              <a href="#how-it-works">How It Works</a>
            </Button>
          </div>

          {/* Feature Pills */}
          <div
            className="mt-14 flex flex-wrap items-center justify-center gap-4"
            style={{ opacity: 0, animation: 'fadeInUp 700ms ease-in-out forwards 0.6s' }}
          >
            <div className="flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-6 py-3 text-sm text-white border border-white/30 hover:bg-white/25 transition-all duration-300 hover:scale-105">
              <Search className="h-5 w-5" />
              <span className="font-semibold">Smart Search</span>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-6 py-3 text-sm text-white border border-white/30 hover:bg-white/25 transition-all duration-300 hover:scale-105">
              <Filter className="h-5 w-5" />
              <span className="font-semibold">Easy Filters</span>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-6 py-3 text-sm text-white border border-white/30 hover:bg-white/25 transition-all duration-300 hover:scale-105">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">Eligibility Check</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#fef6f0"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
