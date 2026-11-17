// Mock profiles. likedMe: true means this profile has already liked the logged-in user,
// so a right swipe on them produces a match during a demo.
// This flag is server-only and is stripped before any response is sent.
const FIRST_NAMES = ['Maya','Jordan','Priya','Leo','Aisha','Noah','Sofia','Ethan','Chloe','Ravi','Zoe','Marcus','Hana','Lucas','Nadia','Owen','Iris','Dev','Lena','Theo','Amara','Felix','Mira','Caleb','Yara','Isaac','Ruby','Omar','Elena','Kai','Tessa','Sam'];
const PLACES = ['Brooklyn, NY','Austin, TX','Boston, MA','Seattle, WA','Chicago, IL','Los Angeles, CA','Columbia University','NYU','UT Austin','Stanford University'];
const INTERESTS = ['Hiking','Coffee','Film','Jazz','Climbing','Cooking','Poetry','Running','Board games','Photography','Travel','Yoga','Startups','Dogs','Tennis','Ceramics'];
const BIOS = [
  'Weekend hikers only. Will trade trail snacks for good coffee recs.',
  'Amateur chef, professional overthinker. Ask me about my sourdough.',
  'Looking for someone to split a bottle of wine and argue about movies.',
  'Film nerd. Ranking Kubrick films is my love language.',
  'Always planning the next trip. Passport is my most-used accessory.',
  'Plants, records, and long walks with my dog.',
  'Here to make friends first and see where it goes.',
  'Early riser, late-night sketcher. Tell me your favorite album.',
];

export function seedProfiles() {
  return FIRST_NAMES.map((name, i) => ({
    id: `p${i + 1}`,
    name,
    age: 21 + ((i * 7) % 12),
    city: PLACES[i % PLACES.length],
    bio: BIOS[i % BIOS.length],
    interests: [0, 1, 2].map(k => INTERESTS[(i + k * 5) % INTERESTS.length]),
    photo: `https://picsum.photos/seed/coy-${i + 1}/600/800`,
    likedMe: i % 4 === 1, // 8 of 32 profiles have already liked the user
  }));
}
