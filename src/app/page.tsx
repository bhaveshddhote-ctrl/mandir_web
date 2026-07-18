'use client';

import React, { useState, useEffect } from 'react';
import './temple.css';

type Language = 'hi' | 'en' | 'mr';

interface LedgerEntry {
  _id?: string;
  date: string;
  type: 'in' | 'out';
  desc: string;
  name?: string;
  amount: number;
}

const translations = {
  hi: {
    brandName: "गुरु गोरखनाथ मठ",
    navHome: "होम",
    navHistory: "इतिहास",
    navGallery: "गैलरी",
    navFestivals: "पर्व",
    navDonation: "दान",
    navLedger: "आय-व्यय",
    navContact: "संपर्क",
    
    heroEyebrow: "अलख निरंजन",
    heroTitle: "श्री गुरु गोरखनाथ मठ",
    heroSub: "नाथ संप्रदाय की सिद्ध परंपरा — तप, त्याग और भक्ति का पावन स्थल",
    heroLocation: "निमनवाड़ा",
    btnDonate: "दान करें",
    btnContact: "संपर्क करें",

    historyEyebrow: "परंपरा",
    historyTitle: "मठ का इतिहास",
    historyP1: "श्री गुरु गोरखनाथ मठ, निमनवाड़ा नाथ संप्रदाय की सिद्ध परंपरा का एक पावन केंद्र है। यहाँ की धूनी वर्षों से अखंड रूप से प्रज्ज्वलित है, जो गुरु परंपरा की निरंतरता और साधना की शक्ति का प्रतीक है। यह स्थान श्रद्धालुओं के लिए तप, ध्यान और सेवा का केंद्र रहा है।",
    historyP2: "यहाँ प्रतिवर्ष गुरु पूर्णिमा, महाशिवरात्रि और नाथ जयंती जैसे पावन अवसरों पर विशेष पूजा-अर्चना और भंडारे का आयोजन होता है, जिसमें आसपास के गाँवों से बड़ी संख्या में भक्तगण सम्मिलित होते हैं।",

    galleryEyebrow: "दर्शन झलक",
    galleryTitle: "फोटो गैलरी",
    gTile1: "मठ मंदिर",
    gTile2: "अखंड धूनी",
    gTile3: "गुरु समाधि",
    gTile4: "सत्संग सभा",
    gTile5: "संध्या आरती",
    gTile6: "मठ परिसर",

    festEyebrow: "वार्षिक कैलेंडर",
    festTitle: "पर्व एवं उत्सव",
    fest1Date: "माघ पूर्णिमा",
    fest1Name: "गुरु गोरखनाथ जयंती",
    fest1Desc: "विशेष पूजा, भंडारा एवं सत्संग का आयोजन",
    fest2Date: "फाल्गुन",
    fest2Name: "महाशिवरात्रि",
    fest2Desc: "रात्रि जागरण, रुद्राभिषेक एवं विशेष श्रृंगार",
    fest3Date: "श्रावण मास",
    fest3Name: "कांवड़ एवं शिव आराधना",
    fest3Desc: "सोमवार विशेष अभिषेक एवं जलाभिषेक",
    fest4Date: "आषाढ़ पूर्णिमा",
    fest4Name: "गुरु पूर्णिमा",
    fest4Desc: "गुरु पूजन एवं शिष्य सम्मेलन",
    fest5Date: "पौष माह",
    fest5Name: "मकर संक्रांति",
    fest5Desc: "खिचड़ी भंडारा एवं दान-पुण्य",

    daanEyebrow: "सेवा में सहयोग",
    daanTitle: "दान करें",
    daanDesc: "मठ के नित्य पूजन, भंडारा, रख-रखाव एवं जीर्णोद्धार कार्यों हेतु आपका सहयोग अपेक्षित है। समस्त प्राप्त दान का पारदर्शी विवरण नीचे 'आय-व्यय विवरण' अनुभाग में सार्वजनिक रूप से उपलब्ध है।",
    bankName: "बैंक खाता नाम",
    accountNum: "खाता संख्या",
    ifsc: "IFSC कोड",
    upiId: "UPI ID",
    qrHint: "यहाँ अपना असली UPI QR कोड इमेज लगाएँ",

    ledgerEyebrow: "पारदर्शिता",
    ledgerTitle: "आय-व्यय विवरण",
    totalIn: "कुल दान (आय)",
    totalOut: "कुल व्यय",
    balance: "शेष राशि",
    addEntryBtn: "🔒 एंट्री जोड़ें (प्रबंधक)",
    thDate: "दिनांक",
    thType: "प्रकार",
    thDesc: "विवरण",
    thName: "नाम",
    thAmount: "राशि (₹)",
    typeIn: "दान",
    typeOut: "व्यय",
    loadingText: "लोड हो रहा है...",
    noEntries: "अभी तक कोई एंट्री नहीं जोड़ी गई है।",

    contactEyebrow: "दर्शन हेतु पधारें",
    contactTitle: "संपर्क एवं स्थान",
    addressTitle: "पता",
    addressVal: "श्री गुरु गोरखनाथ मठ, निमनवाड़ा",
    phoneTitle: "फ़ोन",
    darshanTitle: "दर्शन समय",
    darshanVal: "प्रातः 5:00 बजे — रात्रि 9:00 बजे",
    emailTitle: "ईमेल",
    mapTitle: "मठ का नक्शा",

    footerAlakh: "अलख निरंजन 🔥",
    footerCopyright: "श्री गुरु गोरखनाथ मठ, निमनवाड़ा। सर्वाधिकार सुरक्षित।",

    gateModalTitle: "प्रबंधक प्रवेश",
    gateModalLabel: "पासकोड डालें",
    gateModalCancel: "रद्द करें",
    gateModalSubmit: "प्रवेश करें",
    gateErrorMsg: "गलत पासकोड। पुनः प्रयास करें।",

    entryModalTitle: "नई एंट्री जोड़ें",
    entryDateLabel: "दिनांक",
    entryTypeLabel: "प्रकार",
    typeOptIn: "दान (आय)",
    typeOptOut: "व्यय",
    entryDescLabel: "विवरण",
    entryDescPlaceholder: "जैसे: भंडारा सामग्री",
    entryNameLabel: "दानदाता/विक्रेता नाम (वैकल्पिक)",
    entryNamePlaceholder: "नाम",
    entryAmountLabel: "राशि (₹)",
    entrySubmitBtn: "जोड़ें",
    entryCancelBtn: "रद्द करें",
    entrySuccessMsg: "एंट्री सफलतापूर्वक जुड़ गई।",
    entryValidationMsg: "कृपया दिनांक, विवरण एवं सही राशि भरें।"
  },
  en: {
    brandName: "Guru Gorakhnath Math",
    navHome: "Home",
    navHistory: "History",
    navGallery: "Gallery",
    navFestivals: "Festivals",
    navDonation: "Donation",
    navLedger: "Ledger",
    navContact: "Contact",

    heroEyebrow: "ALAKH NIRANJAN",
    heroTitle: "Shri Guru Gorakhnath Math",
    heroSub: "Sacred Seat of Nath Tradition — Holy Abode of Penance, Renunciation & Devotion",
    heroLocation: "Nimanwada",
    btnDonate: "Donate Now",
    btnContact: "Contact Us",

    historyEyebrow: "TRADITION",
    historyTitle: "Math History",
    historyP1: "Shri Guru Gorakhnath Math, Nimanwada is a sacred center of the Siddha tradition of the Nath Sampradaya. The holy fire (Akhand Dhuni) here has been burning continuously for generations, symbolizing the unbroken lineage of Guru wisdom and spiritual penance.",
    historyP2: "Every year on auspicious occasions like Guru Purnima, Mahashivratri, and Nath Jayanti, special rituals, worship, and community feasts (Bhandara) are organized, attracting devotees from all surrounding regions.",

    galleryEyebrow: "GLIMPSE",
    galleryTitle: "Photo Gallery",
    gTile1: "Temple Shrine",
    gTile2: "Akhand Dhuni",
    gTile3: "Guru Samadhi",
    gTile4: "Satsang Assembly",
    gTile5: "Evening Aarti",
    gTile6: "Math Campus",

    festEyebrow: "CALENDAR",
    festTitle: "Festivals & Events",
    fest1Date: "Magh Purnima",
    fest1Name: "Guru Gorakhnath Jayanti",
    fest1Desc: "Special Pooja, Bhandara and Satsang event",
    fest2Date: "Phalguna",
    fest2Name: "Mahashivratri",
    fest2Desc: "Night vigil, Rudrabhishekam and special decoration",
    fest3Date: "Shravan Month",
    fest3Name: "Kanwar & Shiva Worship",
    fest3Desc: "Monday special Abhishek and holy water offering",
    fest4Date: "Ashadha Purnima",
    fest4Name: "Guru Purnima",
    fest4Desc: "Guru Worship and Devotee Assembly",
    fest5Date: "Pausha Month",
    fest5Name: "Makar Sankranti",
    fest5Desc: "Khichdi Bhandara and Charitable Service",

    daanEyebrow: "SUPPORT DEVOTION",
    daanTitle: "Make a Donation",
    daanDesc: "Your generous contribution supports daily rituals, community feast (Bhandara), maintenance, and shrine upkeep. All received donations are publicly transparent in the Ledger section below.",
    bankName: "Account Name",
    accountNum: "Account Number",
    ifsc: "IFSC Code",
    upiId: "UPI ID",
    qrHint: "Scan UPI QR Code to donate directly",

    ledgerEyebrow: "TRANSPARENCY",
    ledgerTitle: "Financial Ledger",
    totalIn: "Total Donations",
    totalOut: "Total Expenses",
    balance: "Net Balance",
    addEntryBtn: "🔒 Add Entry (Admin)",
    thDate: "Date",
    thType: "Type",
    thDesc: "Description",
    thName: "Name/Donor",
    thAmount: "Amount (₹)",
    typeIn: "Donation",
    typeOut: "Expense",
    loadingText: "Loading ledger entries...",
    noEntries: "No ledger entries added yet.",

    contactEyebrow: "VISIT US",
    contactTitle: "Contact & Location",
    addressTitle: "Address",
    addressVal: "Shri Guru Gorakhnath Math, Nimanwada",
    phoneTitle: "Phone",
    darshanTitle: "Darshan Hours",
    darshanVal: "5:00 AM — 9:00 PM Daily",
    emailTitle: "Email",
    mapTitle: "Location Map",

    footerAlakh: "Alakh Niranjan 🔥",
    footerCopyright: "Shri Guru Gorakhnath Math, Nimanwada. All rights reserved.",

    gateModalTitle: "Admin Access Verification",
    gateModalLabel: "Enter Admin Passcode",
    gateModalCancel: "Cancel",
    gateModalSubmit: "Verify & Enter",
    gateErrorMsg: "Incorrect passcode. Please try again.",

    entryModalTitle: "Add New Ledger Entry",
    entryDateLabel: "Date",
    entryTypeLabel: "Entry Type",
    typeOptIn: "Donation (Income)",
    typeOptOut: "Expense",
    entryDescLabel: "Description",
    entryDescPlaceholder: "e.g., Bhandara Supplies",
    entryNameLabel: "Donor / Vendor Name (Optional)",
    entryNamePlaceholder: "Full Name",
    entryAmountLabel: "Amount (₹)",
    entrySubmitBtn: "Save Entry",
    entryCancelBtn: "Cancel",
    entrySuccessMsg: "Entry added successfully.",
    entryValidationMsg: "Please fill date, description, and valid amount."
  },
  mr: {
    brandName: "श्री गुरु गोरखनाथ मठ",
    navHome: "मुख्यपृष्ठ",
    navHistory: "इतिहास",
    navGallery: "गॅलरी",
    navFestivals: "उत्सव",
    navDonation: "दान",
    navLedger: "जमा-खर्च",
    navContact: "संपर्क",

    heroEyebrow: "अलख निरंजन",
    heroTitle: "श्री गुरु गोरखनाथ मठ",
    heroSub: "नाथ संप्रदायाची सिद्ध परंपरा — तप, त्याग आणि भक्तीचे पवित्र स्थान",
    heroLocation: "निमनवाडा",
    btnDonate: "दान करा",
    btnContact: "संपर्क करा",

    historyEyebrow: "परंपरा",
    historyTitle: "मठाचा इतिहास",
    historyP1: "श्री गुरु गोरखनाथ मठ, निमनवाडा हे नाथ संप्रदायाचे एक पवित्र सिद्ध पीठ आहे. येथील अखंड धुनी गेली कित्येक वर्षे निरंतर प्रज्ज्वलित आहे, जी गुरु परंपरेची अखंडता आणि साधनेच्या शक्तीचे प्रतीक आहे.",
    historyP2: "येथे दरवर्षी गुरुपौर्णिमा, महाशिवरात्री आणि नाथ जयंती या पवित्र प्रसंगी विशेष पूजा, आरती आणि महाप्रसादाचे (भंडारा) आयोजन केले जाते, ज्यामध्ये भाविक मोठ्या संख्येने उपस्थित राहतात.",

    galleryEyebrow: "दर्शन झलक",
    galleryTitle: "फोटो गॅलरी",
    gTile1: "मठ मंदिर",
    gTile2: "अखंड धुनी",
    gTile3: "गुरु समाधी",
    gTile4: "सत्संग सभा",
    gTile5: "संध्या आरती",
    gTile6: "मठ परिसर",

    festEyebrow: "वार्षिक दिनदर्शिका",
    festTitle: "उत्सव आणि सण",
    fest1Date: "माघ पौर्णिमा",
    fest1Name: "गुरु गोरखनाथ जयंती",
    fest1Desc: "विशेष पूजा, महाप्रसाद आणि सत्संग आयोजन",
    fest2Date: "फाल्गुन",
    fest2Name: "महाशिवरात्री",
    fest2Desc: "रात्रौ जागरण, रुद्राभिषेक आणि विशेष पूजा",
    fest3Date: "श्रावण महिना",
    fest3Name: "कावड व शिव उपासना",
    fest3Desc: "सोमवारी विशेष अभिषेक व जलाभिषेक",
    fest4Date: "आषाढ पौर्णिमा",
    fest4Name: "गुरुपौर्णिमा",
    fest4Desc: "गुरु पूजन आणि भक्त संमेलन",
    fest5Date: "पौष महिना",
    fest5Name: "मकर संक्रांती",
    fest5Desc: "खिचडी महाप्रसाद आणि दान-धर्म",

    daanEyebrow: "सेवा सहभाग",
    daanTitle: "दान करा",
    daanDesc: "मठातील नित्य पूजा, महाप्रसाद, देखभाल व जिर्णोद्धार कार्यासाठी आपले योगदान अपेक्षित आहे. प्राप्त दानाचा संपूर्ण तपशील खालील 'जमा-खर्च' विभागात पारदर्शकपणे उपलब्ध आहे.",
    bankName: "बँक खाते नाव",
    accountNum: "खाते क्रमांक",
    ifsc: "IFSC कोड",
    upiId: "UPI ID",
    qrHint: "दान करण्यासाठी UPI QR कोड स्कॅन करा",

    ledgerEyebrow: "पारदर्शकता",
    ledgerTitle: "जमा-खर्च विवरण",
    totalIn: "एकूण जमा (दान)",
    totalOut: "एकूण खर्च",
    balance: "शिल्लक रक्कम",
    addEntryBtn: "🔒 नोंद जोडा (व्यवस्थापक)",
    thDate: "दिनांक",
    thType: "प्रकार",
    thDesc: "तपशील",
    thName: "नाव",
    thAmount: "रक्कम (₹)",
    typeIn: "दान",
    typeOut: "खर्च",
    loadingText: "माहिती लोड होत आहे...",
    noEntries: "अद्याप कोणतीही नोंद जोडलेली नाही.",

    contactEyebrow: "दर्शनासाठी या",
    contactTitle: "संपर्क व पत्ता",
    addressTitle: "पत्ता",
    addressVal: "श्री गुरु गोरखनाथ मठ, निमनवाडा",
    phoneTitle: "फोन",
    darshanTitle: "दर्शन वेळ",
    darshanVal: "सकाळी ५:०० — रात्री ९:०० वाजेपर्यंत",
    emailTitle: "ईमेल",
    mapTitle: "नकाशा",

    footerAlakh: "अलख निरंजन 🔥",
    footerCopyright: "श्री गुरु गोरखनाथ मठ, निमनवाडा। सर्व हक्क सुरक्षित.",

    gateModalTitle: "व्यवस्थापक प्रवेश",
    gateModalLabel: "पासकोड टाका",
    gateModalCancel: "रद्द करा",
    gateModalSubmit: "प्रवेश करा",
    gateErrorMsg: "चुकीचा पासकोड. पुन्हा प्रयत्न करा.",

    entryModalTitle: "नवीन नोंद जोडा",
    entryDateLabel: "दिनांक",
    entryTypeLabel: "प्रकार",
    typeOptIn: "दान (जमा)",
    typeOptOut: "खर्च",
    entryDescLabel: "तपशील",
    entryDescPlaceholder: "उदा: महाप्रसाद साहित्य",
    entryNameLabel: "दानदाता / विक्रेता नाव (पर्यायी)",
    entryNamePlaceholder: "नाव",
    entryAmountLabel: "रक्कम (₹)",
    entrySubmitBtn: "जोडा",
    entryCancelBtn: "रद्द करा",
    entrySuccessMsg: "नोंद यशस्वीरीत्या जोडली गेली.",
    entryValidationMsg: "कृपया दिनांक, तपशील आणि योग्य रक्कम भरा."
  }
};

export default function Home() {
  const [year, setYear] = useState<number>(2026);
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const [headerSolid, setHeaderSolid] = useState<boolean>(false);
  const [lang, setLang] = useState<Language>('hi');

  // Ledger state
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal control states
  const [showGateModal, setShowGateModal] = useState<boolean>(false);
  const [showEntryModal, setShowEntryModal] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Form states
  const [passcode, setPasscode] = useState<string>('');
  const [gateError, setGateError] = useState<string>('');

  const [formDate, setFormDate] = useState<string>('');
  const [formType, setFormType] = useState<'in' | 'out'>('in');
  const [formDesc, setFormDesc] = useState<string>('');
  const [formName, setFormName] = useState<string>('');
  const [formAmount, setFormAmount] = useState<string>('');
  const [entryMsg, setEntryMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Toast state
  const [toastMsg, setToastMsg] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);

  // Gallery state
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [lightbox, setLightbox] = useState<{url: string; title: string} | null>(null);

  // Dynamic CMS Site Content state
  const [siteContent, setSiteContent] = useState<any>(null);

  const t = translations[lang];

  useEffect(() => {
    setYear(new Date().getFullYear());

    // Restore saved language preference
    const savedLang = localStorage.getItem('mandir_lang') as Language;
    if (savedLang && ['hi', 'en', 'mr'].includes(savedLang)) {
      setLang(savedLang);
    }

    // Scroll listener for sticky header
    const handleScroll = () => {
      setHeaderSolid(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);

    // Initial load of ledger data
    loadLedger();

    // Load public gallery & site content with live polling
    const loadSiteData = async () => {
      try {
        const [galRes, contentRes] = await Promise.all([
          fetch('/api/gallery?public=true'),
          fetch('/api/admin/site-content')
        ]);
        if (galRes.ok) {
          const data = await galRes.json();
          if (Array.isArray(data)) setGalleryImages(data);
        }
        if (contentRes.ok) {
          const data = await contentRes.json();
          setSiteContent(data);
        }
      } catch (e) {}
    };

    loadSiteData();
    const dataInterval = setInterval(loadSiteData, 3000);
    window.addEventListener('focus', loadSiteData);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('focus', loadSiteData);
      clearInterval(dataInterval);
    };
  }, []);

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('mandir_lang', newLang);
  };

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2600);
  };

  const loadLedger = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ledger');
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      } else {
        console.error('Failed to load ledger');
      }
    } catch (e) {
      console.error('Error fetching ledger:', e);
    } finally {
      setLoading(false);
    }
  };

  const openAdminGate = () => {
    if (isAdmin) {
      setFormDate(new Date().toISOString().slice(0, 10));
      setFormDesc('');
      setFormName('');
      setFormAmount('');
      setEntryMsg(null);
      setShowEntryModal(true);
    } else {
      setPasscode('');
      setGateError('');
      setShowGateModal(true);
    }
  };

  const handleCheckPasscode = () => {
    if (passcode === 'namah108') {
      setIsAdmin(true);
      setShowGateModal(false);
      
      // Initialize form fields
      setFormDate(new Date().toISOString().slice(0, 10));
      setFormType('in');
      setFormDesc('');
      setFormName('');
      setFormAmount('');
      setEntryMsg(null);
      setShowEntryModal(true);
    } else {
      setGateError(t.gateErrorMsg);
    }
  };

  const handleSubmitEntry = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formDate || !formDesc.trim() || !formAmount || Number(formAmount) <= 0) {
      setEntryMsg({ text: t.entryValidationMsg, isError: true });
      return;
    }

    try {
      const res = await fetch('/api/ledger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formDate,
          type: formType,
          desc: formDesc,
          name: formName,
          amount: Number(formAmount),
          passcode: 'namah108', // Sent from verified admin session
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setEntryMsg({ text: t.entrySuccessMsg, isError: false });
        // Reload list
        await loadLedger();
        
        setTimeout(() => {
          setShowEntryModal(false);
          triggerToast('✓ Entry Saved');
        }, 700);
      } else {
        setEntryMsg({ text: data.error || 'Error: Failed to save entry.', isError: true });
      }
    } catch (err) {
      setEntryMsg({ text: 'Network Error: Unable to save. Try again.', isError: true });
    }
  };

  // Calculations
  const totalIn = entries
    .filter(e => e.type === 'in')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalOut = entries
    .filter(e => e.type === 'out')
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = totalIn - totalOut;

  const formatDate = (d: string) => {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    const locale = lang === 'en' ? 'en-IN' : 'hi-IN';
    return dt.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="temple-container">
      {/* ---------- Header ---------- */}
      <header id="siteHeader" className={headerSolid ? 'solid' : ''}>
        <div className="brand">
          <svg className="brand-mark" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C10 6 8 8 8 12a4 4 0 0 0 8 0c0-4-2-6-4-10Z" fill="#E8871E" />
            <path d="M12 22c-4 0-6-2-6-5 0-2 1-3 2-4 0 2 1 3 2 3s1-2 1-3c1 1 2 2 2 4 0 3-1 5-1 5" fill="#6E1423" />
          </svg>
          <span className="brand-name">{t.brandName}</span>
        </div>
        
        <nav className={`nav-links ${navOpen ? 'open' : ''}`} id="navLinks">
          <a href="#home" onClick={() => setNavOpen(false)}>{t.navHome}</a>
          <a href="#itihaas" onClick={() => setNavOpen(false)}>{t.navHistory}</a>
          <a href="#gallery" onClick={() => setNavOpen(false)}>{t.navGallery}</a>
          <a href="#utsav" onClick={() => setNavOpen(false)}>{t.navFestivals}</a>
          <a href="#daan" onClick={() => setNavOpen(false)}>{t.navDonation}</a>
          <a href="#ledger" onClick={() => setNavOpen(false)}>{t.navLedger}</a>
          <a href="#sampark" onClick={() => setNavOpen(false)}>{t.navContact}</a>
        </nav>

        <div className="header-actions">
          {/* Language Switcher */}
          <div className="lang-selector">
            <button 
              className={`lang-btn ${lang === 'hi' ? 'active' : ''}`} 
              onClick={() => changeLanguage('hi')}
              title="हिंदी"
            >
              🇮🇳 हिंदी
            </button>
            <button 
              className={`lang-btn ${lang === 'en' ? 'active' : ''}`} 
              onClick={() => changeLanguage('en')}
              title="English"
            >
              🇬🇧 ENG
            </button>
            <button 
              className={`lang-btn ${lang === 'mr' ? 'active' : ''}`} 
              onClick={() => changeLanguage('mr')}
              title="मराठी"
            >
              🚩 मराठी
            </button>
          </div>

          <button className="nav-toggle" id="navToggle" onClick={() => setNavOpen(!navOpen)}>
            ☰
          </button>
        </div>
      </header>

      {/* ---------- Hero Section ---------- */}
      <section className="hero" id="home">
        <span className="eyebrow">{siteContent?.hero?.eyebrow || t.heroEyebrow}</span>
        <h1>{siteContent?.hero?.title || t.heroTitle}</h1>
        <p className="sub">{siteContent?.hero?.sub || t.heroSub}</p>
        <p className="location">{siteContent?.hero?.location || t.heroLocation}</p>
        <div className="dhuni">
          <div className="base"></div>
          <div className="flame f2"></div>
          <div className="flame"></div>
          <div className="flame f3"></div>
        </div>
        <div className="cta-row" style={{ marginTop: '2.2rem' }}>
          <a href="#daan" className="btn btn-solid">{t.btnDonate}</a>
          <a href="#sampark" className="btn btn-outline">{t.btnContact}</a>
        </div>
      </section>

      {/* ---------- History Section ---------- */}
      <section id="itihaas">
        <div className="section-inner">
          <span className="eyebrow">{siteContent?.history?.eyebrow || t.historyEyebrow}</span>
          <h2 className="section-title">{siteContent?.history?.title || t.historyTitle}</h2>
          <div className="history-grid">
            <div className="history-text">
              <p>{siteContent?.history?.p1 || t.historyP1}</p>
              <p>{siteContent?.history?.p2 || t.historyP2}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Flame Divider ---------- */}
      <div className="flame-divider">
        <div className="line"></div>
        <div className="mini-flame"></div>
        <div className="line"></div>
      </div>

      {/* ---------- Gallery Section ---------- */}
      <section id="gallery">
        <div className="section-inner">
          <span className="eyebrow">{t.galleryEyebrow}</span>
          <h2 className="section-title">{t.galleryTitle}</h2>

          {galleryImages.length > 0 ? (
            /* Real images uploaded from admin dashboard */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '14px',
              marginTop: '1.5rem',
            }}>
              {galleryImages.map((img: any) => (
                <div
                  key={img.id}
                  onClick={() => setLightbox({ url: img.url, title: img.title })}
                  style={{
                    position: 'relative',
                    aspectRatio: '4/3',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: '#2B2420',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, transparent 100%)',
                    padding: '28px 12px 10px',
                    color: '#F4E9D6',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                  }}>
                    {img.title}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#B39C82', fontSize: '0.95rem' }}>
              🖼️ वर्तमान में कोई चित्र उपलब्ध नहीं है | एडमिन डैशबोर्ड से तस्वीरें अपलोड करें।
            </div>
          )}
        </div>
      </section>

      {/* ---------- Festival Section ---------- */}
      <section className="section-dark" id="utsav">
        <div className="section-inner">
          <span className="eyebrow">{t.festEyebrow}</span>
          <h2 className="section-title">{t.festTitle}</h2>
          <div className="fest-list">
            {siteContent?.festivals && siteContent.festivals.length > 0 ? (
              siteContent.festivals.map((f: any, idx: number) => (
                <div className="fest-item" key={f.id || idx}>
                  <div className="fest-date">{f.date}</div>
                  <div>
                    <div className="fest-name">{f.name}</div>
                    <div className="fest-desc">{f.desc}</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: '#B39C82', fontSize: '0.95rem', width: '100%' }}>
                📅 शीघ्र ही आगामी पर्वों की तिथि घोषित की जाएगी।
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Donation Section ---------- */}
      <section id="daan">
        <div className="section-inner">
          <span className="eyebrow">{t.daanEyebrow}</span>
          <h2 className="section-title">{t.daanTitle}</h2>
          <div className="donate-grid">
            <div className="donate-info">
              <p>{t.daanDesc}</p>
              <div className="detail-row"><span>{t.bankName}</span><span>{siteContent?.bankDetails?.bankName || 'State Bank of India'}</span></div>
              <div className="detail-row"><span>खाता धारक</span><span>{siteContent?.bankDetails?.accountName || 'Shri Guru Gorakhnath Math Trust'}</span></div>
              <div className="detail-row"><span>{t.accountNum}</span><span>{siteContent?.bankDetails?.accountNumber || '39485720194'}</span></div>
              <div className="detail-row"><span>{t.ifsc}</span><span>{siteContent?.bankDetails?.ifsc || 'SBIN0001234'}</span></div>
              {siteContent?.bankDetails?.branch && (
                <div className="detail-row"><span>शाखा (Branch)</span><span>{siteContent.bankDetails.branch}</span></div>
              )}
              <div className="detail-row">
                <span>{t.upiId}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#D4601A' }}>
                  {siteContent?.bankDetails?.upiId || 'gorakhnathmath@upi'}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(siteContent?.bankDetails?.upiId || 'gorakhnathmath@upi');
                      setToastMsg('UPI ID copied!');
                      setShowToast(true);
                      setTimeout(() => setShowToast(false), 2500);
                    }}
                    style={{ background: '#F5E6D3', border: 'none', borderRadius: '6px', padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer', color: '#8B4513' }}
                  >
                    📋 Copy
                  </button>
                </span>
              </div>
            </div>

            <div className="qr-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {siteContent?.bankDetails?.qrImage ? (
                <img
                  src={siteContent.bankDetails.qrImage}
                  alt="UPI QR Code"
                  style={{ width: '160px', height: '160px', objectFit: 'contain', borderRadius: '8px', background: '#fff', padding: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                />
              ) : (
                <div className="qr-placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '2rem' }}>📲</span>
                  <span style={{ fontSize: '0.75rem', color: '#8B4513', fontWeight: 'bold' }}>{siteContent?.bankDetails?.upiId || 'gorakhnathmath@upi'}</span>
                </div>
              )}
              <div style={{ marginTop: '10px', fontSize: '0.82rem', textAlign: 'center', color: '#665544', fontWeight: 600 }}>
                {t.qrHint} (GPay / PhonePe / Paytm)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Ledger Section ---------- */}
      <section className="section-dark" id="ledger">
        <div className="section-inner">
          <span className="eyebrow">{t.ledgerEyebrow}</span>
          <h2 className="section-title">{t.ledgerTitle}</h2>
          <div className="ledger-summary">
            <div className="stat-card">
              <div className="stat-value pos" id="totalIn">
                ₹{totalIn.toLocaleString('en-IN')}
              </div>
              <div className="stat-label">{t.totalIn}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value neg" id="totalOut">
                ₹{totalOut.toLocaleString('en-IN')}
              </div>
              <div className="stat-label">{t.totalOut}</div>
            </div>
            <div className="stat-card">
              <div className={`stat-value ${balance >= 0 ? 'pos' : 'neg'}`} id="balance">
                ₹{balance.toLocaleString('en-IN')}
              </div>
              <div className="stat-label">{t.balance}</div>
            </div>
          </div>
          <div className="admin-bar">
            <button className="btn-small" onClick={openAdminGate}>
              {t.addEntryBtn}
            </button>
          </div>
          <div className="ledger-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{t.thDate}</th>
                  <th>{t.thType}</th>
                  <th>{t.thDesc}</th>
                  <th>{t.thName}</th>
                  <th style={{ textAlign: 'right' }}>{t.thAmount}</th>
                </tr>
              </thead>
              <tbody id="ledgerBody">
                {loading ? (
                  <tr className="empty-row">
                    <td colSpan={5}>{t.loadingText}</td>
                  </tr>
                ) : entries.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan={5}>{t.noEntries}</td>
                  </tr>
                ) : (
                  entries.map((e, index) => (
                    <tr key={e._id || index}>
                      <td>{formatDate(e.date)}</td>
                      <td>{e.type === 'in' ? t.typeIn : t.typeOut}</td>
                      <td>{e.desc}</td>
                      <td>{e.name || '—'}</td>
                      <td
                        style={{ textAlign: 'right' }}
                        className={e.type === 'in' ? 'amt-in' : 'amt-out'}
                      >
                        {e.type === 'in' ? '+' : '−'}₹{e.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---------- Contact Section ---------- */}
      <section id="sampark">
        <div className="section-inner">
          <span className="eyebrow">{t.contactEyebrow}</span>
          <h2 className="section-title">{t.contactTitle}</h2>
          <div className="contact-grid">
            <div>
              <div className="contact-detail">
                <span className="ic">📍</span>
                <div>
                  <h4>{t.addressTitle}</h4>
                  <div>{siteContent?.contact?.address || t.addressVal}</div>
                </div>
              </div>
              <div className="contact-detail">
                <span className="ic">📞</span>
                <div>
                  <h4>{t.phoneTitle}</h4>
                  <div>{siteContent?.contact?.phone || '+91 98765 43210'}</div>
                </div>
              </div>
              <div className="contact-detail">
                <span className="ic">🕐</span>
                <div>
                  <h4>{t.darshanTitle}</h4>
                  <div>{siteContent?.contact?.timing || t.darshanVal}</div>
                </div>
              </div>
              <div className="contact-detail">
                <span className="ic">✉️</span>
                <div>
                  <h4>{t.emailTitle}</h4>
                  <div>{siteContent?.contact?.email || 'info@gorakhnathmath.org'}</div>
                </div>
              </div>
            </div>
            <iframe
              className="map-frame"
              loading="lazy"
              src="https://www.google.com/maps?q=Nimanwada&amp;output=embed"
              title={t.mapTitle}
            ></iframe>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer>
        <div className="alakh">{t.footerAlakh}</div>
        <div>© <span>{year}</span> {t.footerCopyright}</div>
      </footer>

      {/* ---------- Lightbox Modal for Public Gallery ---------- */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
          }}
        >
          <div style={{ maxWidth: '90vw', maxHeight: '90vh', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.title} style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '12px', objectFit: 'contain' }} />
            <p style={{ textAlign: 'center', color: '#F4E9D6', marginTop: '12px', fontWeight: 600, fontSize: '1.1rem' }}>{lightbox.title}</p>
            <button
              onClick={() => setLightbox(null)}
              style={{
                position: 'absolute', top: '-16px', right: '-16px',
                background: '#E8871E', color: '#fff', border: 'none', borderRadius: '50%',
                width: '36px', height: '36px', cursor: 'pointer', fontSize: '1.2rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ---------- Admin Gate Modal ---------- */}
      <div className={`modal-overlay ${showGateModal ? 'show' : ''}`} onClick={(e) => {
        if (e.target === e.currentTarget) setShowGateModal(false);
      }}>
        <div className="modal">
          <h3>{t.gateModalTitle}</h3>
          <div className="field">
            <label>{t.gateModalLabel}</label>
            <input
              type="password"
              placeholder="Passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCheckPasscode();
              }}
            />
          </div>
          {gateError && <div className="modal-msg error">{gateError}</div>}
          <div className="modal-actions">
            <button className="btn-small" onClick={() => setShowGateModal(false)}>{t.gateModalCancel}</button>
            <button className="btn-small primary" onClick={handleCheckPasscode}>{t.gateModalSubmit}</button>
          </div>
        </div>
      </div>

      {/* ---------- Entry Modal ---------- */}
      <div className={`modal-overlay ${showEntryModal ? 'show' : ''}`} onClick={(e) => {
        if (e.target === e.currentTarget) setShowEntryModal(false);
      }}>
        <div className="modal">
          <h3>{t.entryModalTitle}</h3>
          <form onSubmit={handleSubmitEntry}>
            <div className="field">
              <label>{t.entryDateLabel}</label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>{t.entryTypeLabel}</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as 'in' | 'out')}
              >
                <option value="in">{t.typeOptIn}</option>
                <option value="out">{t.typeOptOut}</option>
              </select>
            </div>
            <div className="field">
              <label>{t.entryDescLabel}</label>
              <input
                type="text"
                placeholder={t.entryDescPlaceholder}
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>{t.entryNameLabel}</label>
              <input
                type="text"
                placeholder={t.entryNamePlaceholder}
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="field">
              <label>{t.entryAmountLabel}</label>
              <input
                type="number"
                placeholder="0"
                min="1"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                required
              />
            </div>
            {entryMsg && (
              <div className={`modal-msg ${entryMsg.isError ? 'error' : 'success'}`}>
                {entryMsg.text}
              </div>
            )}
            <div className="modal-actions">
              <button type="button" className="btn-small" onClick={() => setShowEntryModal(false)}>
                {t.entryCancelBtn}
              </button>
              <button type="submit" className="btn-small primary">
                {t.entrySubmitBtn}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ---------- Toast ---------- */}
      <div className={`toast ${showToast ? 'show' : ''}`}>{toastMsg}</div>
    </div>
  );
}
