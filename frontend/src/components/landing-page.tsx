"use client";

import React from 'react';
import Link from 'next/link';
import { Check, Star, Sparkles, Zap, Shield, ArrowRight, Heart } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function LandingPage() {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  // 🐉 Absurdly enthusiastic testimonials - dragons approve of the silliness!
  const testimonials = [
    {
      name: "Dr. Productivity McTaskface",
      title: "Professional List Maker",
      quote: "I used to forget everything. My keys, my dog's name, even breathing sometimes. But since using Peachy Task, I've remembered 847 things! Now I breathe EXCLUSIVELY on schedule.",
      rating: 5,
      avatar: "🧑‍⚕️"
    },
    {
      name: "Barbara 'The Organizer' Jenkins",
      title: "Chaos Elimination Specialist",
      quote: "Before Peachy Task, my life was a mess. I had 47 different to-do apps and still forgot to feed my houseplants. Now? My plants are thriving, my tasks are color-coded, and I've achieved enlightenment. 10/10 would organize again.",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      name: "Kevin the Procrastinator",
      title: "Former Professional Delayer",
      quote: "I'll write this testimonial later... Just kidding! I ALREADY DID IT because Peachy Task cured my procrastination in 3.7 seconds. I've accomplished more in the last week than in my entire life. I've even started doing tasks that don't exist yet.",
      rating: 5,
      avatar: "🧔"
    },
    {
      name: "Princess Sparkle Whiskers III",
      title: "Cat (Yes, Really)",
      quote: "Meow meow meow meow. Meow meow MEOW meow meow. Peachy Task meow meow. *knocks water glass off table* 5 stars.",
      rating: 5,
      avatar: "🐱"
    }
  ];

  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Magically Organized",
      description: "Your tasks will be so organized, Marie Kondo will ask YOU for tips. We're talking next-level, color-coded, label-tagged, priority-sorted GLORY."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Create tasks faster than you can say 'I should probably write that down.' Our advanced peach-powered technology makes task creation 847% more peachy or satisfying*. *whichever comes first."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Fort Knox Secure",
      description: "Your tasks are protected by the peachiest of peaches! Even if hackers tried, they'd just get distracted by how peachy everything looks."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Unreasonably Delightful",
      description: "Using Peachy Task releases 3x more dopamine than finding money in your old jacket. Scientists are baffled. Competitors are jealous. Your tasks? Completed."
    }
  ];

  return (
    <div className={`min-h-screen transition-colors ${
      darkMode 
        ? 'peachy-gradient-dark' 
        : 'peachy-gradient-light'
    }`}>
      {/* Navigation Header */}
      <nav className={`sticky top-0 z-50 backdrop-blur-lg border-b ${
        darkMode 
          ? 'bg-stone-900/80 border-amber-900/30' 
          : 'bg-white/80 border-orange-200/50'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                darkMode ? 'bg-gradient-to-br from-amber-800 to-orange-900' : ''
              }`}
              style={darkMode ? {} : { backgroundColor: '#fce4d2' }}
            >
              <span className="text-2xl">🍑</span>
            </div>
            <span className={`text-xl font-bold ${
              darkMode 
                ? 'bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent'
            }`}>
              Peachy Task
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/auth/login"
              className={`px-4 py-2 rounded-lg font-medium transition ${
                darkMode 
                  ? 'text-amber-300 hover:bg-amber-900/30' 
                  : 'text-orange-700 hover:bg-orange-100'
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className={`px-5 py-2 rounded-lg font-semibold shadow-md transition ${
                darkMode 
                  ? 'bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-600 hover:to-orange-700 text-amber-50' 
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
              }`}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div 
              className={`w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl ${
                darkMode ? 'bg-gradient-to-br from-amber-800 to-orange-900' : ''
              }`}
              style={darkMode ? {} : { backgroundColor: '#fce4d2' }}
            >
              <span className="text-8xl animate-bounce">🍑</span>
            </div>
          </div>
          <h1 className={`text-6xl font-black mb-6 ${
            darkMode 
              ? 'bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent'
          }`}>
            Everything's Peachy<br />When You Get Things Done
          </h1>
          <p className={`text-xl mb-8 max-w-2xl mx-auto ${
            darkMode ? 'text-amber-200/80' : 'text-gray-700'
          }`}>
            The world's most delightfully absurd task management app. 
            Used by literally DOZENS of people worldwide. Probably.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/signup"
              className={`px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition flex items-center gap-2 ${
                darkMode 
                  ? 'bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-600 hover:to-orange-700 text-amber-50' 
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
              }`}
            >
              Start Being Productive (Maybe)
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className={`text-sm mt-4 italic ${
            darkMode ? 'text-amber-400/60' : 'text-orange-600/70'
          }`}>
            * Side effects may include excessive organization and spontaneous peachy feelings
          </p>
        </div>

        {/* Absurd Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className={`text-center p-6 rounded-2xl ${
            darkMode 
              ? 'bg-stone-900/80 border border-amber-900/30' 
              : 'bg-white/80 border border-orange-200/50'
          }`}>
            <div className="text-5xl font-black mb-2 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              847%
            </div>
            <p className={`text-sm font-medium ${
              darkMode ? 'text-amber-300/70' : 'text-gray-600'
            }`}>
              Increase in feeling peachy
            </p>
          </div>
          <div className={`text-center p-6 rounded-2xl ${
            darkMode 
              ? 'bg-stone-900/80 border border-amber-900/30' 
              : 'bg-white/80 border border-orange-200/50'
          }`}>
            <div className="text-5xl font-black mb-2 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              99.9%
            </div>
            <p className={`text-sm font-medium ${
              darkMode ? 'text-amber-300/70' : 'text-gray-600'
            }`}>
              Of users achieve peach flavored enlightenment*
            </p>
            <p className={`text-xs italic mt-1 ${
              darkMode ? 'text-amber-400/40' : 'text-gray-400'
            }`}>
              *Results may vary. Enlightenment not guaranteed.
            </p>
          </div>
          <div className={`text-center p-6 rounded-2xl ${
            darkMode 
              ? 'bg-stone-900/80 border border-amber-900/30' 
              : 'bg-white/80 border border-orange-200/50'
          }`}>
            <div className="text-5xl font-black mb-2 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              ∞
            </div>
            <p className={`text-sm font-medium ${
              darkMode ? 'text-amber-300/70' : 'text-gray-600'
            }`}>
              Peaches metaphorically involved
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className={`text-4xl font-bold text-center mb-12 ${
            darkMode ? 'text-amber-200' : 'text-gray-900'
          }`}>
            Features That'll Blow Your Mind*
          </h2>
          <p className={`text-center text-sm italic mb-8 ${
            darkMode ? 'text-amber-400/60' : 'text-gray-500'
          }`}>
            *Mind-blowing not medically verified
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className={`p-6 rounded-2xl transition hover:scale-105 ${
                darkMode 
                  ? 'bg-stone-900/80 border border-amber-900/30 hover:border-amber-700' 
                  : 'bg-white/80 border border-orange-200/50 hover:border-orange-400 hover:shadow-lg'
              }`}>
                <div className={`inline-flex p-3 rounded-xl mb-4 ${
                  darkMode 
                    ? 'bg-amber-900/50 text-amber-300' 
                    : 'bg-orange-100 text-orange-600'
                }`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${
                  darkMode ? 'text-amber-200' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={darkMode ? 'text-amber-300/70' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-20">
          <h2 className={`text-4xl font-bold text-center mb-4 ${
            darkMode ? 'text-amber-200' : 'text-gray-900'
          }`}>
            What Our Users Are Saying
          </h2>
          <p className={`text-center text-sm italic mb-12 ${
            darkMode ? 'text-amber-400/60' : 'text-gray-500'
          }`}>
            (These are 100% real testimonials from 100% real people. Probably.)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className={`p-6 rounded-2xl ${
                darkMode 
                  ? 'bg-stone-900/80 border border-amber-900/30' 
                  : 'bg-white/80 border border-orange-200/50'
              }`}>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 fill-current ${
                      darkMode ? 'text-amber-400' : 'text-orange-500'
                    }`} />
                  ))}
                </div>
                <p className={`mb-4 italic ${
                  darkMode ? 'text-amber-200/80' : 'text-gray-700'
                }`}>
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <div className={`font-bold ${
                      darkMode ? 'text-amber-200' : 'text-gray-900'
                    }`}>
                      {testimonial.name}
                    </div>
                    <div className={`text-sm ${
                      darkMode ? 'text-amber-400/60' : 'text-gray-500'
                    }`}>
                      {testimonial.title}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className={`text-center p-12 rounded-3xl ${
          darkMode 
            ? 'bg-gradient-to-r from-amber-900/50 to-orange-900/50 border border-amber-700' 
            : 'bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-300'
        }`}>
          <h2 className={`text-4xl font-bold mb-4 ${
            darkMode ? 'text-amber-100' : 'text-gray-900'
          }`}>
            Ready to Make Everything Peachy?
          </h2>
          <p className={`text-lg mb-8 ${
            darkMode ? 'text-amber-200/70' : 'text-gray-700'
          }`}>
            Join the dozens of satisfied users who've discovered the peachy path to productivity!
          </p>
          <Link
            href="/auth/signup"
            className={`px-10 py-4 rounded-xl font-bold text-lg shadow-xl transition ${
              darkMode 
                ? 'bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-600 hover:to-orange-700 text-amber-50' 
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
            }`}
          >
            Get Started For Free (And For Real)
          </Link>
          <p className={`text-xs mt-4 italic ${
            darkMode ? 'text-amber-400/50' : 'text-gray-500'
          }`}>
            No credit card required. No commitment. Just pure, unadulterated task management bliss.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className={`border-t py-8 ${
        darkMode 
          ? 'bg-stone-900/80 border-amber-900/30' 
          : 'bg-white/80 border-orange-200/50'
      }`}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">🍑</span>
            <span className={`font-bold ${
              darkMode ? 'text-amber-300' : 'text-orange-600'
            }`}>
              Peachy Task
            </span>
          </div>
          <p className={`text-sm mb-2 ${
            darkMode ? 'text-amber-400/60' : 'text-gray-500'
          }`}>
            Making task management ridiculously delightful since approximately 5 minutes ago.
          </p>
          <p className={`text-xs italic ${
            darkMode ? 'text-amber-400/40' : 'text-gray-400'
          }`}>
            © 2025 Peachy Task. All rights reserved. Dragons included free of charge. 🐉
          </p>
        </div>
      </footer>
    </div>
  );
}
