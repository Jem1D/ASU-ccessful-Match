
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import { BookOpen, Calendar, MessageSquare, Star, UserRound, Video } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Index: React.FC = () => {
  const { currentUser } = useAuth();

  const features = [
    {
      icon: <UserRound className="w-12 h-12 text-asu-maroon" />,
      title: "Create Your Profile",
      description: "Specify your academic details, subjects you excel in, and areas where you need help."
    },
    {
      icon: <Star className="w-12 h-12 text-asu-gold" />,
      title: "AI Matchmaking",
      description: "Our intelligent algorithm connects you with the perfect study partners based on your profile."
    },
    {
      icon: <Video className="w-12 h-12 text-asu-teal" />,
      title: "Zoom Integration",
      description: "Schedule and join virtual study sessions with your peers with just one click."
    },
    {
      icon: <MessageSquare className="w-12 h-12 text-asu-navy" />,
      title: "Real-time Messaging",
      description: "Communicate with your study partners to coordinate sessions and discuss topics."
    },
    {
      icon: <BookOpen className="w-12 h-12 text-asu-maroon" />,
      title: "Subject Expertise",
      description: "Find tutors for specific subjects or offer your knowledge to those who need help."
    },
    {
      icon: <Calendar className="w-12 h-12 text-asu-gold" />,
      title: "Flexible Scheduling",
      description: "Set your availability and find sessions that fit your busy academic schedule."
    }
  ];

  const testimonials = [
    {
      name: "Sophia Chen",
      role: "Computer Science Junior",
      content: "ASU-ccessful Match helped me find a study partner for my difficult algorithms class. My grades improved dramatically!",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      name: "Marcus Johnson",
      role: "Biology Sophomore",
      content: "I was struggling with organic chemistry until I found a perfect tutor through this platform. The matching algorithm really works!",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    {
      name: "Aisha Patel",
      role: "Physics Senior",
      content: "Being able to tutor others has deepened my understanding of the subjects I teach. It's a win-win for everyone involved.",
      avatar: "https://randomuser.me/api/portraits/women/48.jpg"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-asu-maroon to-asu-navy opacity-90"></div>
        <div className="relative px-4 py-20 mx-auto max-w-7xl sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              Find Your Perfect <span className="text-asu-gold">Study Partner</span>
            </h1>
            <p className="mt-6 text-xl text-white">
              Connect with fellow students for tutoring and collaborative study sessions.
              Enhance your learning experience and academic success.
            </p>
            <div className="flex justify-center mt-10 space-x-4">
              {currentUser ? (
                <Button size="lg" className="text-lg" asChild>
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" className="text-lg" asChild>
                    <Link to="/signup">Get Started</Link>
                  </Button>
                  <Button size="lg" className="text-lg" variant="outline" asChild>
                    <Link to="/login">Log In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How ASU-ccessful Match Works</h2>
            <p className="mt-4 text-lg text-gray-600">
              Our platform makes it easy to connect with peers who can help you excel in your studies
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="overflow-hidden border-none shadow-md hover-scale">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center">{feature.icon}</div>
                  <h3 className="mt-4 text-xl font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">What Students Say</h2>
            <p className="mt-4 text-lg text-gray-600">
              Hear from students who have found success using our platform
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="overflow-hidden border-none shadow-md">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="relative w-16 h-16 mb-4 overflow-hidden rounded-full">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.content}"</p>
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-asu-maroon">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to boost your academic success?
          </h2>
          <p className="mt-4 text-xl text-white/80">
            Join ASU-ccessful Match today and connect with the perfect study partners.
          </p>
          <div className="mt-8">
            {currentUser ? (
              <Button size="lg" className="text-lg bg-white text-asu-maroon hover:bg-gray-100" asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button size="lg" className="text-lg bg-white text-asu-maroon hover:bg-gray-100" asChild>
                <Link to="/signup">Get Started Today</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
