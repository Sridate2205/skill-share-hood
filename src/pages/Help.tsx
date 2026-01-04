import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, MessageCircle } from 'lucide-react';
import { Chatbot } from '@/components/help/Chatbot';

const faqs = [
  {
    question: "How do I create a skill request?",
    answer: "Click on 'Post Request or Offer' button in the dashboard header. Select 'Request Help' tab, fill in the details about what help you need, the category, your location, and compensation offered, then submit."
  },
  {
    question: "How do I offer my skills?",
    answer: "Click on 'Post Request or Offer' button in the dashboard. Select 'Offer Skill' tab, describe your skill, set your availability and rate, then submit. Your offer will appear in the 'Skills Offered Nearby' section."
  },
  {
    question: "How does the interest system work?",
    answer: "When you see a request or offer you're interested in, click on it to view details, then click 'Express Interest'. The post owner will receive a notification and can choose to accept or decline your interest."
  },
  {
    question: "Can I delete my posts?",
    answer: "Yes! Navigate to your post by clicking on it, and if you're the owner, you'll see a 'Delete' button. Only you can delete your own posts."
  },
  {
    question: "How do I know when someone is interested in my post?",
    answer: "You'll receive a notification! Check the bell icon in the navigation bar to see all your notifications. Unread notifications will show a badge count."
  },
  {
    question: "Is this platform free to use?",
    answer: "Yes, SkillShare Connect is completely free to use. The compensation mentioned in posts is arranged directly between users."
  },
  {
    question: "How do I stay safe when meeting strangers?",
    answer: "Always meet in public places for initial meetings. Verify the person's identity before any transaction. Trust your instincts – if something feels off, don't proceed. We recommend video calls before in-person meetings."
  },
  {
    question: "Can I search for specific skills?",
    answer: "Yes! Use the search bar on the dashboard to filter requests and offers by keywords. It searches through titles and descriptions."
  },
  {
    question: "How do I update my profile?",
    answer: "Currently, profile information is set during signup. Contact support if you need to update your details."
  },
  {
    question: "What categories of skills are supported?",
    answer: "We support various categories including Home Repair, Tutoring, Technology, Gardening, Cooking, Fitness, Arts & Crafts, and more. You can also specify custom categories."
  }
];

const Help = () => {
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
              <HelpCircle className="h-10 w-10 text-primary" />
              Help Center
            </h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions or chat with our AI assistant
            </p>
          </div>

          {/* Chatbot Toggle */}
          <Card 
            className="border-border cursor-pointer hover:border-primary transition-colors"
            onClick={() => setShowChatbot(!showChatbot)}
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-full bg-primary/10">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Need personalized help?</h3>
                <p className="text-sm text-muted-foreground">
                  {showChatbot ? "Click to hide the chatbot" : "Click to chat with our AI assistant"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Chatbot */}
          {showChatbot && <Chatbot />}

          {/* FAQs */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;
