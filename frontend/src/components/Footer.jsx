import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative border-t border-slate-700/40 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-600/5 via-transparent to-transparent" style={{ backgroundImage: 'radial-gradient(circle at top right, rgba(59,130,246,0.08), transparent 40%)' }}></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-600 shadow-2xl shadow-blue-500/50 group-hover:shadow-blue-500/70 transition-all duration-300 group-hover:scale-110">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                CollegeFinder
              </span>
            </Link>
            <p className="text-base text-slate-300 leading-relaxed">
              Helping Class 10 students discover the right junior college based
              on their eligibility, preferences, and budget.
            </p>
          </div>

          <div className="md:text-center">
            <h4 className="font-semibold text-white mb-4 text-lg">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-base text-slate-300 hover:text-blue-400 transition-colors duration-300 inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/discover"
                  className="text-base text-slate-300 hover:text-blue-400 transition-colors duration-300 inline-block"
                >
                  Find Colleges
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:text-right">
            <h4 className="font-semibold text-white mb-4 text-lg">
              Useful Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://mumbai.11thadmission.org.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-slate-300 hover:text-blue-400 transition-colors duration-300 inline-block"
                >
                  FYJC Admission Portal
                </a>
              </li>
              <li>
                <a
                  href="https://mahahsscboard.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-slate-300 hover:text-blue-400 transition-colors duration-300 inline-block"
                >
                  Maharashtra Board
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-700 text-center">
          <p className="text-base text-slate-400">
            © {new Date().getFullYear()} CollegeFinder. Built to simplify junior
            college admissions.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
