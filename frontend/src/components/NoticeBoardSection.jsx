import { ExternalLink, Bell, Calendar, FileText, AlertCircle } from "lucide-react";

const NoticeBoardSection = () => {
  const notices = [
    {
      icon: ExternalLink,
      title: "FYJC Admission Portal",
      description: "Official Mumbai 11th admission registration and login portal",
      link: "https://mumbai.11thadmission.org.in/",
      type: "portal",
    },
    {
      icon: Calendar,
      title: "Admission Timeline 2025-26",
      description:
        "Check important dates for registration, rounds, and document verification",
      link: "https://mumbai.11thadmission.org.in/",
      type: "timeline",
    },
    {
      icon: FileText,
      title: "Merit List Announcements",
      description:
        "View category-wise merit lists and allotment results",
      link: "https://mumbai.11thadmission.org.in/",
      type: "merit",
    },
    {
      icon: AlertCircle,
      title: "Document Verification",
      description:
        "List of required documents and verification centers",
      link: "https://mumbai.11thadmission.org.in/",
      type: "docs",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-orange-50/50 via-amber-50/40 to-yellow-50/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-orange-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse-slow"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse-slow" style={{ animationDelay: "1.5s" }}></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 relative">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 px-6 py-3 text-sm font-bold text-orange-700 mb-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Bell className="h-5 w-5" />
            <span>Important Updates</span>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl mb-4" style={{ letterSpacing: '0.01em' }}>
            Notice Board
          </h2>

          <p className="text-lg text-gray-600 leading-relaxed font-medium" style={{ lineHeight: '1.75' }}>
            Stay updated with official admission links and important
            announcements.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {notices.map((notice, index) => (
            <a
              key={notice.title}
              href={notice.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-white/95 to-orange-50/80 backdrop-blur-md border-l-4 border-orange-500 rounded-xl p-6 hover:shadow-2xl transition-all duration-500 group animate-fade-in hover:-translate-y-2 shadow-xl hover:border-orange-600"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <notice.icon className="h-6 w-6" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors flex items-center gap-2 text-lg">
                    {notice.title}
                    <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {notice.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NoticeBoardSection;
