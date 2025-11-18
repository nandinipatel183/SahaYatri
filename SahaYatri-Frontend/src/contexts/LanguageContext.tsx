import React, { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    welcome: 'Welcome to SahaYatri',
    tagline: 'Reuniting families, one step at a time',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    reportLostPerson: 'Report Lost Person',
    reportLostItem: 'Report Lost Item',
    search: 'Search',
    admin: 'Admin Panel',
    map: 'Map Navigation',
    help: 'Help & Support',
    logout: 'Logout',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    phone: 'Phone Number',
    role: 'Role',
    public: 'Public',
    volunteer: 'Volunteer',
    admin: 'Admin',
    submit: 'Submit',
    age: 'Age',
    gender: 'Gender',
    lastSeen: 'Last Seen Location',
    description: 'Description',
    uploadPhoto: 'Upload Photo',
    uploadVoice: 'Upload Voice Recording',
    itemName: 'Item Name',
    category: 'Category',
    color: 'Color',
    brand: 'Brand',
    notifications: 'Notifications',
    recentReports: 'Recent Reports',
    matches: 'Potential Matches',
    statistics: 'Statistics',
    totalReports: 'Total Reports',
    foundPersons: 'Found Persons',
    foundItems: 'Found Items',
    activeVolunteers: 'Active Volunteers'
  },
  hi: {
    welcome: 'सहायात्री में आपका स्वागत है',
    tagline: 'परिवारों को मिलाना, एक कदम में',
    login: 'लॉगिन',
    register: 'पंजीकरण',
    dashboard: 'डैशबोर्ड',
    reportLostPerson: 'खोया व्यक्ति रिपोर्ट करें',
    reportLostItem: 'खोई वस्तु रिपोर्ट करें',
    search: 'खोजें',
    admin: 'एडमिन पैनल',
    map: 'मैप नेवीगेशन',
    help: 'सहायता और समर्थन',
    logout: 'लॉगआउट',
    name: 'नाम',
    email: 'ईमेल',
    password: 'पासवर्ड',
    phone: 'फोन नंबर',
    role: 'भूमिका',
    public: 'जनता',
    volunteer: 'स्वयंसेवक',
    admin: 'एडमिन',
    submit: 'जमा करें',
    age: 'उम्र',
    gender: 'लिंग',
    lastSeen: 'अंतिम बार देखा गया स्थान',
    description: 'विवरण',
    uploadPhoto: 'फोटो अपलोड करें',
    uploadVoice: 'वॉयस रिकॉर्डिंग अपलोड करें',
    itemName: 'वस्तु का नाम',
    category: 'श्रेणी',
    color: 'रंग',
    brand: 'ब्रांड',
    notifications: 'सूचनाएं',
    recentReports: 'हाल की रिपोर्ट',
    matches: 'संभावित मिलान',
    statistics: 'आंकड़े',
    totalReports: 'कुल रिपोर्ट',
    foundPersons: 'मिले व्यक्ति',
    foundItems: 'मिली वस्तुएं',
    activeVolunteers: 'सक्रिय स्वयंसेवक'
  },
  mr: {
    welcome: 'सहायात्रीमध्ये आपले स्वागत आहे',
    tagline: 'कुटुंबांना एकत्र आणणे, एका पावलात',
    login: 'लॉगिन',
    register: 'नोंदणी',
    dashboard: 'डॅशबोर्ड',
    reportLostPerson: 'हरवलेली व्यक्ती नोंदवा',
    reportLostItem: 'हरवलेली वस्तू नोंदवा',
    search: 'शोधा',
    admin: 'अॅडमिन पॅनेल',
    map: 'नकाशा नेव्हिगेशन',
    help: 'मदत आणि समर्थन',
    logout: 'लॉगआउट',
    name: 'नाव',
    email: 'ईमेल',
    password: 'पासवर्ड',
    phone: 'फोन नंबर',
    role: 'भूमिका',
    public: 'सार्वजनिक',
    volunteer: 'स्वयंसेवक',
    admin: 'अॅडमिन',
    submit: 'सबमिट करा',
    age: 'वय',
    gender: 'लिंग',
    lastSeen: 'शेवटचे दिसलेले ठिकाण',
    description: 'वर्णन',
    uploadPhoto: 'फोटो अपलोड करा',
    uploadVoice: 'आवाज रेकॉर्डिंग अपलोड करा',
    itemName: 'वस्तूचे नाव',
    category: 'श्रेणी',
    color: 'रंग',
    brand: 'ब्रँड',
    notifications: 'सूचना',
    recentReports: 'अलीकडील अहवाल',
    matches: 'संभाव्य जुळणी',
    statistics: 'आकडेवारी',
    totalReports: 'एकूण अहवाल',
    foundPersons: 'सापडलेल्या व्यक्ती',
    foundItems: 'सापडलेल्या वस्तू',
    activeVolunteers: 'सक्रिय स्वयंसेवक'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};