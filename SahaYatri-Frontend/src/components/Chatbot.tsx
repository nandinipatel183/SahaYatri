import React, { useState } from 'react';
import { MessageCircle, Send, X, Bot, User, Phone, MapPin, Search, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Chatbot: React.FC = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: language === 'hi' ? 'नमस्ते! मैं सहायात्री का चैटबॉट हूँ। मैं आपकी कैसे मदद कर सकता हूँ?' : 
               language === 'mr' ? 'नमस्कार! मी सहायात्रीचा चॅटबॉट आहे. मी तुमची कशी मदत करू शकतो?' :
               'Hello! I\'m SahaYatri\'s chatbot. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickActions = [
    {
      id: 1,
      text: language === 'hi' ? 'खोया व्यक्ति रिपोर्ट करें' : 
            language === 'mr' ? 'हरवलेली व्यक्ती नोंदवा' : 'Report Lost Person',
      icon: Users,
      action: 'report_person'
    },
    {
      id: 2,
      text: language === 'hi' ? 'खोई वस्तु रिपोर्ट करें' : 
            language === 'mr' ? 'हरवलेली वस्तू नोंदवा' : 'Report Lost Item',
      icon: Search,
      action: 'report_item'
    },
    {
      id: 3,
      text: language === 'hi' ? 'नक्शा देखें' : 
            language === 'mr' ? 'नकाशा पहा' : 'View Map',
      icon: MapPin,
      action: 'view_map'
    },
    {
      id: 4,
      text: language === 'hi' ? 'आपातकालीन संपर्क' : 
            language === 'mr' ? 'आपत्कालीन संपर्क' : 'Emergency Contact',
      icon: Phone,
      action: 'emergency'
    }
  ];

  const predefinedResponses = {
    en: {
      report_person: 'I can help you report a lost person. Please click on "Report Lost Person" in the dashboard to fill out the detailed form with photo and voice recording.',
      report_item: 'To report a lost item, use the "Report Lost Item" feature in your dashboard. Make sure to include clear photos and detailed description.',
      view_map: 'You can access the interactive map through the "Map Navigation" section. It shows all important locations, help centers, and emergency contacts.',
      emergency: 'For emergencies, call:\n• SahaYatri Emergency: +91 1800-SAHAYATRI\n• Police: 100\n• Medical: 108\n• Fire: 101',
      help: 'I can help you with:\n• Reporting lost persons or items\n• Finding locations on the map\n• Emergency contacts\n• Using SahaYatri features',
      thanks: 'You\'re welcome! Is there anything else I can help you with?'
    },
    hi: {
      report_person: 'मैं आपको खोया व्यक्ति रिपोर्ट करने में मदद कर सकता हूँ। कृपया डैशबोर्ड में "खोया व्यक्ति रिपोर्ट करें" पर क्लिक करके फोटो और वॉयस रिकॉर्डिंग के साथ विस्तृत फॉर्म भरें।',
      report_item: 'खोई वस्तु रिपोर्ट करने के लिए, अपने डैशबोर्ड में "खोई वस्तु रिपोर्ट करें" सुविधा का उपयोग करें। स्पष्ट फोटो और विस्तृत विवरण शामिल करना सुनिश्चित करें।',
      view_map: 'आप "मैप नेवीगेशन" सेक्शन के माध्यम से इंटरैक्टिव मैप एक्सेस कर सकते हैं। यह सभी महत्वपूर्ण स्थान, सहायता केंद्र और आपातकालीन संपर्क दिखाता है।',
      emergency: 'आपातकाल के लिए कॉल करें:\n• सहायात्री आपातकाल: +91 1800-SAHAYATRI\n• पुलिस: 100\n• चिकित्सा: 108\n• अग्निशमन: 101',
      help: 'मैं आपकी इनमें मदद कर सकता हूँ:\n• खोए व्यक्तियों या वस्तुओं की रिपोर्ट करना\n• मैप पर स्थान खोजना\n• आपातकालीन संपर्क\n• सहायात्री सुविधाओं का उपयोग',
      thanks: 'आपका स्वागत है! क्या कोई और चीज़ है जिसमें मैं आपकी मदद कर सकूँ?'
    },
    mr: {
      report_person: 'मी तुम्हाला हरवलेली व्यक्ती नोंदवण्यात मदत करू शकतो. कृपया डॅशबोर्डमध्ये "हरवलेली व्यक्ती नोंदवा" वर क्लिक करून फोटो आणि व्हॉइस रेकॉर्डिंगसह तपशीलवार फॉर्म भरा.',
      report_item: 'हरवलेली वस्तू नोंदवण्यासाठी, तुमच्या डॅशबोर्डमधील "हरवलेली वस्तू नोंदवा" सुविधा वापरा. स्पष्ट फोटो आणि तपशीलवार वर्णन समाविष्ट करण्याची खात्री करा.',
      view_map: 'तुम्ही "नकाशा नेव्हिगेशन" विभागाद्वारे इंटरॅक्टिव्ह नकाशा ऍक्सेस करू शकता. हे सर्व महत्वाची ठिकाणे, मदत केंद्रे आणि आपत्कालीन संपर्क दाखवते.',
      emergency: 'आपत्कालीन परिस्थितीसाठी कॉल करा:\n• सहायात्री आपत्कालीन: +91 1800-SAHAYATRI\n• पोलीस: 100\n• वैद्यकीय: 108\n• अग्निशमन: 101',
      help: 'मी तुमची यामध्ये मदत करू शकतो:\n• हरवलेल्या व्यक्ती किंवा वस्तूंची नोंद करणे\n• नकाशावर ठिकाणे शोधणे\n• आपत्कालीन संपर्क\n• सहायात्री सुविधांचा वापर',
      thanks: 'तुमचे स्वागत आहे! काही आणि गोष्ट आहे का ज्यामध्ये मी तुमची मदत करू शकतो?'
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simple response logic
    setTimeout(() => {
      let botResponse = '';
      const currentLang = language as keyof typeof predefinedResponses;
      const responses = predefinedResponses[currentLang] || predefinedResponses.en;
      
      const lowerMessage = inputMessage.toLowerCase();
      
      if (lowerMessage.includes('lost person') || lowerMessage.includes('खोया व्यक्ति') || lowerMessage.includes('हरवलेली व्यक्ती')) {
        botResponse = responses.report_person;
      } else if (lowerMessage.includes('lost item') || lowerMessage.includes('खोई वस्तु') || lowerMessage.includes('हरवलेली वस्तू')) {
        botResponse = responses.report_item;
      } else if (lowerMessage.includes('map') || lowerMessage.includes('नक्शा') || lowerMessage.includes('मैप')) {
        botResponse = responses.view_map;
      } else if (lowerMessage.includes('emergency') || lowerMessage.includes('आपातकाल') || lowerMessage.includes('आपत्कालीन')) {
        botResponse = responses.emergency;
      } else if (lowerMessage.includes('help') || lowerMessage.includes('मदद') || lowerMessage.includes('सहायता')) {
        botResponse = responses.help;
      } else if (lowerMessage.includes('thank') || lowerMessage.includes('धन्यवाद') || lowerMessage.includes('आभार')) {
        botResponse = responses.thanks;
      } else {
        botResponse = responses.help;
      }

      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        message: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setInputMessage('');
  };

  const handleQuickAction = (action: string) => {
    const currentLang = language as keyof typeof predefinedResponses;
    const responses = predefinedResponses[currentLang] || predefinedResponses.en;
    
    const botMessage = {
      id: messages.length + 1,
      type: 'bot',
      message: responses[action as keyof typeof responses] || responses.help,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-4 rounded-full shadow-lg hover:from-teal-600 hover:to-cyan-600 transition-all transform hover:scale-110 z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 rounded-full p-2">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">SahaYatri Assistant</h3>
                <p className="text-xs text-cyan-100">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-xs ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`rounded-full p-2 ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-teal-100 text-teal-600'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-3">Quick actions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.action)}
                    className="flex items-center space-x-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs transition-colors"
                  >
                    <IconComponent className="h-4 w-4 text-gray-500" />
                    <span className="truncate">{action.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={
                  language === 'hi' ? 'अपना संदेश टाइप करें...' :
                  language === 'mr' ? 'तुमचा संदेश टाइप करा...' :
                  'Type your message...'
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-teal-500 text-white p-2 rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;