import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Link, Shield, BarChart, Zap, Github, Globe, Smartphone } from 'lucide-react';

const About = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does URL shortening work?",
      answer: "Our URL shortener creates a unique short link that redirects to your original URL. When someone clicks the short link, they're automatically redirected to your original destination while we track analytics data."
    },
    {
      question: "Is it free to use?",
      answer: "Yes! Our basic URL shortening service is completely free. You can create unlimited short links with basic analytics. Premium features like custom domains and advanced analytics are available for paid plans."
    },
    {
      question: "How long do the links last?",
      answer: "Short links created with our service never expire. They will continue to work indefinitely unless you manually delete them from your dashboard."
    },
    {
      question: "Can I track my link performance?",
      answer: "Absolutely! Every short link comes with comprehensive analytics including click counts, geographic data, device information, and referrer tracking. View detailed charts and maps in your analytics dashboard."
    },
    {
      question: "Are custom aliases supported?",
      answer: "Yes! You can create custom aliases for your short links to make them more memorable and branded. Custom aliases are available on all plans."
    },
    {
      question: "Is my data secure?",
      answer: "We take security seriously. All data is encrypted, and we never share your information with third parties. Your original URLs and analytics data are completely private."
    }
  ];

  const features = [
    {
      icon: Link,
      title: "URL Shortening",
      description: "Transform long URLs into short, memorable links instantly"
    },
    {
      icon: BarChart,
      title: "Advanced Analytics",
      description: "Track clicks, locations, devices, and more with detailed insights"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and never shared with third parties"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate short links in milliseconds with our optimized infrastructure"
    },
    {
      icon: Globe,
      title: "Global CDN",
      description: "Fast redirects worldwide with our global content delivery network"
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Fully responsive design that works perfectly on all devices"
    }
  ];

  const techStack = [
    "React 18 with TypeScript",
    "Tailwind CSS for styling",
    "Framer Motion for animations",
    "React Router for navigation",
    "Chart.js for data visualization",
    "React Simple Maps for geography",
    "Local Storage for data persistence"
  ];

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            About ShortLink
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A modern, feature-rich URL shortener built with cutting-edge web technologies. 
            Create short links, track performance, and gain insights with our powerful analytics platform.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 hover:shadow-3xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tech Stack Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Built with Modern Technologies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Frontend Stack
              </h3>
              <ul className="space-y-3">
                {techStack.map((tech, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
                    <span className="text-gray-700 dark:text-gray-300">{tech}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Github className="w-16 h-16 text-white" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Open source and modern
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === index ? 'auto' : 0,
                    opacity: openFaq === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-6">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Create your first short link and start tracking your analytics today!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/'}
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Create Short Link
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;