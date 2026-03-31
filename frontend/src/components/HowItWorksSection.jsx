import { Percent, Users, BookOpen, School } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      icon: Percent,
      title: "Select Your Percentage",
      description:
        "Choose your Class 10 percentage range from the dropdown. We use 5% intervals for accurate matching.",
    },
    {
      number: 2,
      icon: Users,
      title: "Choose Your Category",
      description:
        "Select your caste category (Open, OBC, SC, ST, VJ/NT, EWS) to see category-specific cut-offs.",
    },
    {
      number: 3,
      icon: BookOpen,
      title: "Pick Your Subject",
      description:
        "Filter by preferred stream – Science, Commerce, Arts, or specialized bifocal subjects.",
    },
    {
      number: 4,
      icon: School,
      title: "View Matching Colleges",
      description:
        "Get a list of colleges you're eligible for, with fees, cut-offs, and available subjects.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #dbeafe 100%)' }}>
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-80 h-80 bg-blue-300/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-indigo-300/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 relative">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl mb-4" style={{ letterSpacing: '0.01em' }}>
            How It Works
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed font-medium" style={{ lineHeight: '1.75' }}>
            Four simple steps to find colleges that match your eligibility and
            preferences.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Connector Line (hidden on mobile and after last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400" />
              )}

              <div className="relative flex flex-col items-center text-center bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-blue-100 group-hover:border-blue-300">
                <div className="step-number mb-4 relative z-10 shadow-2xl bg-gradient-to-br from-blue-600 to-indigo-600 hover:scale-110 transition-transform duration-300">
                  {step.number}
                </div>
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
