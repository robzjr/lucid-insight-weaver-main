
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Mail, Send } from 'lucide-react';
import { toast } from 'sonner';

interface HelpSupportProps {
  isDark?: boolean;
}

const HelpSupport = ({ isDark = true }: HelpSupportProps) => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqs = [
    {
      question: "How many dream interpretations do I get with the free plan?",
      answer: "With the free plan, you get 5 dream interpretations per month. These reset on the 1st of each month. Premium users get unlimited interpretations."
    },
    {
      question: "What are the different interpretation styles?",
      answer: "We offer three interpretation styles: Islamic (based on traditional Islamic dream interpretation), Spiritual (symbolic and intuitive insights), and Psychological (based on modern psychology and dream analysis)."
    },
    {
      question: "How accurate are the dream interpretations?",
      answer: "Our AI uses advanced language models trained on various dream interpretation methodologies. While interpretations can provide valuable insights, they should be considered as guidance rather than absolute truth."
    },
    {
      question: "Can I edit my dreams after saving them?",
      answer: "Yes! You can edit your dream descriptions from the Library section. Simply click the edit icon next to any saved dream to make changes."
    },
    {
      question: "How do I upgrade to Premium?",
      answer: "You can upgrade to Premium from the Settings page or the Subscription section. Premium gives you unlimited interpretations and advanced features."
    },
    {
      question: "Is my dream data private and secure?",
      answer: "Absolutely. Your dream data is encrypted and stored securely. We never share your personal dream content with third parties. You can read our full Privacy Policy for more details."
    },
    {
      question: "How do I delete my account?",
      answer: "To delete your account, please contact our support team. We'll help you remove all your data permanently from our servers."
    },
    {
      question: "Can I export my dream journal?",
      answer: "Premium users can export their complete dream journal as a PDF or text file from the Library section."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Your message has been sent! We\'ll get back to you within 24 hours.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      <div className="text-center mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Help & Support
        </h1>
        <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Find answers to common questions or get in touch with our team
        </p>
      </div>

      {/* FAQ Section */}
      <Card className={`${
        isDark ? 'glass-card border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center space-x-2 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <HelpCircle className="h-5 w-5" />
            <span>Frequently Asked Questions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className={`text-left ${
                  isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'
                }`}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className={`${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card className={`${
        isDark ? 'glass-card border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center space-x-2 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <Mail className="h-5 w-5" />
            <span>Contact Support</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Name
                </Label>
                <Input
                  id="name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  required
                  className={isDark ? 'bg-slate-900/50 border-slate-700 text-slate-200' : 'bg-white border-slate-300'}
                />
              </div>
              <div>
                <Label htmlFor="email" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  required
                  className={isDark ? 'bg-slate-900/50 border-slate-700 text-slate-200' : 'bg-white border-slate-300'}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="subject" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                Subject
              </Label>
              <Input
                id="subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                required
                className={isDark ? 'bg-slate-900/50 border-slate-700 text-slate-200' : 'bg-white border-slate-300'}
              />
            </div>
            
            <div>
              <Label htmlFor="message" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                Message
              </Label>
              <Textarea
                id="message"
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                required
                rows={5}
                className={isDark ? 'bg-slate-900/50 border-slate-700 text-slate-200' : 'bg-white border-slate-300'}
              />
            </div>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick Contact */}
      <Card className={`${
        isDark ? 'glass-card border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className={`mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Need immediate help?
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Email us directly at{' '}
              <a 
                href="mailto:support@ramel.app" 
                className="text-purple-500 hover:text-purple-400 font-medium"
              >
                support@ramel.app
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpSupport;
