import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MotionWrapper from '@/components/MotionWrapper';
import prisma from '@/lib/prisma';

export const revalidate = 300;

type ContactData = {
  address?: string;
  phone?: string;
  email?: string;
  officeHours?: string;
};

async function getContactData() {
  try {
    return await prisma.contact.findFirst({
      select: {
        address: true,
        phone: true,
        email: true,
        officeHours: true,
      },
    });
  } catch (error) {
    console.error('Error fetching contact data:', error);
    return null;
  }
}

export default async function ContactPage() {
  const contactData: ContactData = (await getContactData()) || {};

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <MotionWrapper>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Have questions, collaborations, or just want to say hello? Reach
              out to us today.
            </p>
          </MotionWrapper>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <MotionWrapper
              className="contact-card bg-white p-8 rounded-2xl shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Contact Information
              </h2>
              <div className="space-y-6 text-gray-700">
                <div className="flex items-center space-x-4">
                  <Mail className="h-6 w-6 text-blue-600" />
                  <span>{contactData.email || 'info.sauric@gmail.com'}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="h-6 w-6 text-blue-600" />
                  <span>{contactData.phone || '+880 123 456 789'}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="h-10 w-10 text-blue-600" />
                  <span>
                    {contactData.address || '4th Floor, Central Library, Sher-e-Bangla Agricultural University, Dhaka-1207, Bangladesh'}
                  </span>
                </div>
              </div>
            </MotionWrapper>

            <MotionWrapper
              className="contact-card bg-white p-8 rounded-2xl shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Office Hours
              </h2>
              <ul className="text-gray-700 space-y-2">
                <li>{contactData.officeHours || 'Sunday – Thursday: 9:00 AM – 6:00 PM'}</li>
              </ul>
            </MotionWrapper>
          </div>

          {/* Contact Form */}
          <MotionWrapper
            className="contact-card bg-white p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send us a Message
            </h2>
            <form className="space-y-6">
              <div>
                <Input placeholder="Your Name" />
              </div>
              <div>
                <Input type="email" placeholder="Your Email" />
              </div>
              <div>
                <Textarea placeholder="Your Message" className="h-32" />
              </div>
              <Button size="lg" className="w-full">
                Send Message <Send className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </MotionWrapper>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <MotionWrapper className="rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.324029265097!2d90.3741832760517!3d23.77147308796556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c75306d7c739%3A0x8a214dc0432cb930!2z4KaV4KeH4Kao4KeN4Kam4KeN4Kaw4KeA4KefIOCml-CnjeCmsOCmqOCnjeCmpeCmvuCml-CmvuCmsCAo4Ka24KeH4KaV4KeD4Kas4Ka_KQ!5e0!3m2!1sbn!2sbd!4v1759830599627!5m2!1sbn!2sbd"
              width="100%"
              height="400"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </MotionWrapper>
        </div>
      </section>
    </div>
  );
}
