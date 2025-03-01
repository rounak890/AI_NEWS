import React from "react";
import { Link } from "react-router-dom";
import { Bot, Mail, MessageSquare, BellRing, Zap } from "lucide-react";

export default function Home() {
  const benefits = [
    {
      icon: <Zap className="h-6 w-6 text-blue-600" />,
      title: "Real-time Updates",
      description: "Get the latest AI news as it happens, curated by experts.",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-blue-600" />,
      title: "Multi-platform Delivery",
      description: "Choose how you want to receive updates - Email, WhatsApp, or Telegram.",
    },
    {
      icon: <BellRing className="h-6 w-6 text-blue-600" />,
      title: "Customizable Alerts",
      description: "Set your preferences for topics and notification frequency.",
    },
  ];

  return (
    <div className="space-y-16">
      <section className="text-center space-y-6">
        <Bot className="h-16 w-16 mx-auto text-blue-600" />
        <h1 className="text-4xl font-bold text-gray-900">Stay Ahead with AI News Daily</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get curated AI news delivered directly to you. Stay informed about the latest developments
          in artificial intelligence, machine learning, and technology.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Start Your Free Subscription
          </Link>
          <Link
            to="/deregister"
            className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Deregister
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="p-6 bg-white rounded-lg shadow-md">
            <div className="mb-4">{benefit.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
            <p className="text-gray-600">{benefit.description}</p>
          </div>
        ))}
      </section>

      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Why Subscribe?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <img
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
            alt="AI Technology"
            className="rounded-lg"
          />
          <div className="space-y-4">
            <p className="text-gray-600">
              In today's fast-paced world of artificial intelligence, staying updated is crucial.
              Our service provides:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-blue-600" />
                <span>Personalized daily digests</span>
              </li>
              <li className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span>Breaking news alerts</span>
              </li>
              <li className="flex items-center space-x-2">
                <BellRing className="h-5 w-5 text-blue-600" />
                <span>Topic-specific updates</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
