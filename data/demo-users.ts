import type { DemoUser } from "@/lib/types";

export const PARTNER_DEMO_USER: DemoUser = {
  id: "priya-shah",
  name: "Priya Shah",
  role: "Optometrist and Practice Owner",
  organisation: "Marylebone Independent Opticians",
  location: "Marylebone, London",
  email: "priya.shah@example-opticians.co.uk",
  phone: "020 7000 1234",
  memberSince: "January 2025",
  greetingName: "Priya",
};

export const CLINIC_DEMO_USER: DemoUser = {
  id: "ryan-bdm",
  name: "Ryan",
  role: "Business Development Manager",
  organisation: "Eye Clinic London",
  location: "London",
  email: "ryan@eyecliniclondon.com",
  phone: "07340 890 623",
  memberSince: "March 2022",
  greetingName: "Ryan",
};

export const EXECUTIVE_DEMO_USER: DemoUser = {
  id: "executive",
  name: "Alexandra Whitfield",
  role: "Chief Executive Officer",
  organisation: "Eye Clinic London",
  location: "London",
  email: "executive@eyecliniclondon.com",
  phone: "020 7000 9000",
  memberSince: "2019",
  greetingName: "Alexandra",
};

export interface ReferringProfessional {
  id: string;
  name: string;
  role: string;
  organisation: string;
}

export const REFERRING_PROFESSIONALS: ReferringProfessional[] = [
  { id: "priya-shah", name: "Priya Shah", role: "Optometrist and Practice Owner", organisation: "Marylebone Independent Opticians" },
  { id: "daniel-morgan", name: "Daniel Morgan", role: "Optometrist", organisation: "Chelsea Vision Practice" },
  { id: "amelia-carter", name: "Dr Amelia Carter", role: "Private GP", organisation: "Central London Private GP Group" },
  { id: "sophie-williams", name: "Sophie Williams", role: "Dispensing Optician and Practice Manager", organisation: "Kensington Eye & Vision" },
  { id: "omar-rahman", name: "Omar Rahman", role: "Optometrist", organisation: "Notting Hill Optometry" },
  { id: "laura-bennett", name: "Laura Bennett", role: "Corporate Health Manager", organisation: "Harley Street Corporate Health" },
];
