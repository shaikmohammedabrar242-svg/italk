const ADJECTIVES = [
  'Quiet', 'Orange', 'Helpful', 'Curious', 'Brave', 'Calm', 'Silent', 'Wise',
  'Amber', 'Swift', 'Gentle', 'Bright', 'Wandering', 'Honest', 'Noble', 'Clever',
  'Golden', 'Daring', 'Patient', 'Mystic', 'Desi', 'Active', 'Friendly', 'Keen',
  'Resilient', 'Thoughtful', 'Vibrant', 'Serene', 'Kind'
];

const NOUNS = [
  'Owl', 'River', 'Tiger', 'Banyan', 'Ganga', 'Peacock', 'Lotus', 'Sparrow',
  'Falcon', 'Cloud', 'Elephant', 'Cobra', 'Leopard', 'Monsoon', 'Chinar', 'Breeze',
  'Falcon', 'Deer', 'Otter', 'Eagle', 'Neem', 'Gulmohar', 'Summit', 'Ranger',
  'Seeker', 'Voyager', 'Panda', 'Gazelle', 'Whale'
];

export const AVATAR_COLORS = [
  '#FF4500', // Orangered signature
  '#0284C7', // Sky Blue
  '#16A34A', // Green
  '#9333EA', // Purple
  '#D97706', // Amber
  '#E11D48', // Rose
  '#0D9488', // Teal
  '#4F46E5', // Indigo
  '#EA580C', // Orange
  '#475569'  // Slate
];

export function generateAnonymousUsername(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `${adj}${noun}${num}`;
}

export function getRandomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

export function getInitials(name: string): string {
  if (!name) return 'AN';
  // Extracts capital letters or first 2 chars
  const matches = name.match(/[A-Z]/g);
  if (matches && matches.length >= 2) {
    return matches.slice(0, 2).join('');
  }
  return name.slice(0, 2).toUpperCase();
}
