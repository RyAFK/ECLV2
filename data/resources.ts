import type { ResourceItem } from "@/lib/types";

export const RESOURCES: ResourceItem[] = [
  { id: "cataract-guide", title: "Cataract referral guide", description: "A concise guide to identifying and referring cataract patients.", type: "Referral guide", fileName: "cataract-referral-guide.pdf" },
  { id: "rle-guide", title: "RLE patient conversation guide", description: "Suggested conversation points for discussing refractive lens exchange.", type: "Conversation guide", fileName: "rle-patient-conversation-guide.pdf" },
  { id: "laser-overview", title: "Laser vision correction overview", description: "An overview of LASIK, LASEK and PRK suitability considerations.", type: "Service overview", fileName: "laser-vision-correction-overview.pdf" },
  { id: "icl-overview", title: "ICL overview", description: "A summary of the implantable contact lens pathway for referring professionals.", type: "Service overview", fileName: "icl-overview.pdf" },
  { id: "dry-eye-guide", title: "Dry-eye referral guide", description: "Signs and symptoms that may benefit from a specialist dry-eye assessment.", type: "Referral guide", fileName: "dry-eye-referral-guide.pdf" },
  { id: "corneal-red-flags", title: "Corneal red-flags guide", description: "Key corneal irregularities and when specialist review may help.", type: "Referral guide", fileName: "corneal-red-flags-guide.pdf" },
  { id: "ecl-contact-card", title: "ECL contact card", description: "Ryan's contact details and the ECL referral pathway summary, ready to print.", type: "Contact card", fileName: "ecl-contact-card.pdf" },
  { id: "patient-leaflet", title: "Patient referral leaflet", description: "A patient-facing leaflet explaining what to expect from an ECL referral.", type: "Patient leaflet", fileName: "patient-referral-leaflet.pdf" },
  { id: "cpd-poster", title: "CPD event poster", description: "A printable poster for the upcoming optometrist and dispensing optician CPD evening.", type: "Event poster", fileName: "cpd-event-poster.pdf" },
  { id: "referral-qr", title: "Referral QR code placeholder", description: "A scannable code linking directly to the ECL Connect referral form.", type: "QR code", fileName: "referral-qr-code.pdf" },
];
