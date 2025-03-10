import {
  faInfinity,
  faMobile,
  faMessage,
  faHeadset,
  faRocket,
  faSimCard,
} from "@fortawesome/free-solid-svg-icons";

export const features = [
  {
    icon: faInfinity,
    title: "Unlimited data",
    description:
      "Enjoy unlimited data while traveling to numerous destinations worry-free.",
  },
  {
    icon: faMobile,
    title: "Keep using your fav apps",
    description:
      "Get that safe ride home, find that great restaurant, and pin the local attractions, all while staying connected with your loved ones.",
  },
  {
    icon: faMessage,
    title: "WhatsApp number",
    description:
      "You can call and message all your contacts on WhatsApp, like you're in the same country. Don't lose touch with family and friends.",
  },
  {
    icon: faHeadset,
    title: "24/7 Customer Support",
    description:
      "In need of assistance? Our 24/7 chat support is just a message away to keep you connected and help you with everything you need.",
  },
  {
    icon: faRocket,
    title: "Fast & Internet Connection",
    description:
      "Connect to the best networks at your destination and get internet that's both reliable and fast",
  },
  {
    icon: faSimCard,
    title: "Enjoy your eSim",
    description:
      "Enjoy the flexibility of our digital eSIM while keeping the option to use your original SIM as usual whenever you need it.",
  },
];

export const esimTypes = [
  { id: "local", label: "Local eSim" },
  { id: "regional", label: "Regional eSim" },
  { id: "global", label: "Global eSim" },
];

export const countryData = {
  local: [
    { id: "SA", name: "Saudi", flag: "sa", plans: [] },
    { id: "US", name: "US", flag: "us", plans: [] },
    { id: "AE", name: "UAE", flag: "ae", plans: [] },
    { id: "GB", name: "UK", flag: "gb", plans: [] },
    { id: "TR", name: "Turkey", flag: "tr", plans: [] },
    { id: "TH", name: "Thailand", flag: "th", plans: [] },
    { id: "GR", name: "Greece", flag: "gr", plans: [] },
    { id: "ES", name: "Spain", flag: "es", plans: [] },
    { id: "QA", name: "Qatar", flag: "qa", plans: [] },
    { id: "CN", name: "China", flag: "cn", plans: [] },
    { id: "NP", name: "Nepal", flag: "np", plans: [] },
    { id: "IQ", name: "Iraq", flag: "iq", plans: [] },
    { id: "NL", name: "Netherlands", flag: "nl", plans: [] },
    { id: "MY", name: "Malaysia", flag: "my", plans: [] },
  ],
  regional: [{ id: "!RG", name: "All Regions", flag: "", plans: [] }],
  global: [{ id: "!GL", name: "Worldwide", flag: "", plans: [] }],
};

export const locationCodes = [
  { id: "PK", name: "Pakistan" },
  { id: "SA", name: "Saudi" },
  { id: "US", name: "US" },
  { id: "AE", name: "UAE" },
  { id: "GB", name: "UK" },
  { id: "TR", name: "Turkey" },
  { id: "TH", name: "Thailand" },
  { id: "GR", name: "Greece" },
  { id: "ES", name: "Spain" },
  { id: "QA", name: "Qatar" },
  { id: "CN", name: "China" },
  { id: "NP", name: "Nepal" },
  { id: "IQ", name: "Iraq" },
  { id: "NL", name: "Netherlands" },
  { id: "MY", name: "Malaysia" },
  { id: "!RG", name: "All Regions" },
  { id: "!GL", name: "Worldwide" },
];

export const faqs = [
  {
    question: "What products do you offer?",
    answer:
      "We offer eSIM services, which provide a convenient and flexible way to connect to mobile networks without the need for a physical SIM card. Our eSIM allows you to activate mobile data, make calls, and send messages on compatible devices, all with a simple digital activation process.",
  },
  {
    question: "How do I create an account?",
    answer:
      "To create an account, simply click on the 'Sign Up' button on our website or mobile app. Follow the prompts to enter your information and set up your account. It's quick and easy!",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we offer international shipping to many countries. Shipping rates and delivery times may vary depending on the destination. You can check the available shipping options during the checkout process.",
  },
  {
    question: "Do you have a mobile app?",
    answer:
      "Yes, we have a mobile app available for both iOS and Android devices. You can download it from the App Store or Google Play Store. Our app offers all the features of our website, plus some exclusive mobile-only benefits.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach our customer support team through various channels. We offer 24/7 support via live chat on our website and mobile app. You can also email us at support@roamdigi.com or call our toll-free number at 1-800-ROAMDIGI.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept a wide range of payment methods including major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay. For some regions, we also offer local payment options. You can view all available payment methods during checkout.",
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Rizwan Ali",
    image: "/images/home/hero-person.png",
    text: "I recently visited I really liked it. The design is user-friendly, and the content is informative and up-to-date. Overall.",
  },
  {
    id: 2,
    name: "Saqlain",
    image: "/images/home/hero-person.png",
    text: "I recently visited I really liked it. The design is user-friendly, and the content is informative and up-to-date. Overall.",
  },
  {
    id: 3,
    name: "Fatima Zehra",
    image: "/images/home/hero-person.png",
    text: "I recently visited I really liked it. The design is user-friendly, and the content is informative and up-to-date. Overall.",
  },
];

export const mainTestimonial = {
  text: "I recently visited and was really impressed. The website has a clean, user-friendly design, making it easy to navigate. The content is informative, well-organized, and up-to-date, which I found really helpful. Overall, it's a reliable and professional website that provides valuable information. I highly recommend checking it out!",
};

// export const specificFaqs = [
//   {
//     id: 1,
//     title: "Can I keep my existing phone number?",
//     description:
//       "Yes, you can keep your existing phone number active on your primary SIM. RoamDigi's eSIMs are typically used for data-only plans, so your number remains available for calls and messages.",
//   },
//   {
//     id: 2,
//     title: "What customer support is available?",
//     description:
//       "RoamDigi offers 24/7 customer support via live chat, email, and the support section of our website. We are here to help with any questions or issues you may encounter.",
//   },
//   {
//     id: 3,
//     title: "How can I manage my eSIM account?",
//     description:
//       "You can manage your eSIM through RoamDigi's app or website. First, view your data usage, then extend your plan, or purchase additional data packs all from one user-friendly platform.",
//   },
//   {
//     id: 4,
//     title: "What happens if I change my device?",
//     description:
//       "If you switch to a new eSIM-compatible device, you may need to transfer or reactivate your eSIM. Contact our support team for assistance. Some plans may require purchasing a new eSIM profile.",
//   },
//   {
//     id: 5,
//     title: "How secure is the eSIM activation process?",
//     description:
//       "RoamDigi uses industry-leading encryption and adheres to strict global security standards to ensure the safety of your data and the eSIM activation process. Your information is always protected from unauthorized access.",
//   },
// ];
