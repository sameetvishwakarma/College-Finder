import { Target, Users, MapPin } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: Target,
      title: "Simplify Admissions",
      description:
        "No more juggling multiple portals and PDFs. Get all college eligibility info in one place.",
    },
    {
      icon: Users,
      title: "For Students & Parents",
      description:
        "Designed for Class 10 students and parents navigating FYJC admissions for the first time.",
    },
    {
      icon: MapPin,
      title: "Mumbai Focus",
      description:
        "Currently supporting Ghatkopar, Vidyavihar, and Kurla areas with accurate, updated data.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50/80 via-gray-50/60 to-blue-50/40 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 right-20 w-80 h-80 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse-slow"></div>
      <div className="absolute bottom-10 left-20 w-80 h-80 bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse-slow" style={{ animationDelay: "1.5s" }}></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 relative">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl mb-4" style={{ letterSpacing: '0.01em' }}>
            About CollegeFinder
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed font-medium" style={{ lineHeight: '1.75' }}>
            We understand the confusion students face after Class 10.
            CollegeFinder is built to make junior college discovery simple,
            transparent, and stress-free.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-md border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300 group animate-fade-in shadow-2xl shadow-black/40 hover:scale-105 hover:shadow-amber-500/10"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
