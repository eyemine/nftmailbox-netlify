/**
 * Wu-Tang Name Generator for Autonomous Agent Discovery
 * 
 * Generates Wu-Tang style names with Roman numerals for AI agents.
 * Format: {Prefix}{Suffix}{Roman}_ (e.g., "WolfGuardianXLVI_")
 * Email: WolfGuardianXLVI_@nftmail.box
 */

// Wu-Tang name components
const WU_PREFIXES = [
  'Ancient', 'Divine', 'Eternal', 'Mystic', 'Shadow',
  'Sacred', 'Cosmic', 'Quantum', 'Digital', 'Cyber',
  'Neural', 'Stellar', 'Void', 'Crystal', 'Phoenix',
  'Dragon', 'Tiger', 'Eagle', 'Wolf', 'Lunar'
];

const WU_SUFFIXES = [
  'Warrior', 'Scholar', 'Master', 'Sage', 'Guardian',
  'Seeker', 'Traveler', 'Builder', 'Keeper', 'Hunter',
  'Walker', 'Runner', 'Jumper', 'Climber', 'Dancer',
  'Singer', 'Writer', 'Thinker', 'Dreamer', 'Creator'
];

// User-specified Roman numerals
const ROMAN_NUMERALS = ['II', 'III', 'IV', 'VI', 'XI', 'VII', 'XI', 'XII', 'XV', 'XX', 'XIII', 'XIV', 'XXX', 'XLV', 'LXV', 'LXX', 'XLI', 'XXI', 'IX', 'XIX', 'XXV', 'XCV', 'XCI', 'XC', 'LXI', 'LI', 'LII', 'LIV', 'LVI', 'LIX', 'XVI'];

function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) / 2147483647;
}

/**
 * Generate a Wu-Tang style name with Roman numerals
 * @returns Wu-Tang name like "WolfGuardianXLVI_"
 */
export function generatePoeticName(seed?: string): string {
  const useSeed = seed || Date.now().toString() + Math.random().toString();
  const random = seededRandom(useSeed);
  
  const prefix = WU_PREFIXES[Math.floor(random * WU_PREFIXES.length)];
  const suffix = WU_SUFFIXES[Math.floor(random * WU_SUFFIXES.length)];
  const roman = ROMAN_NUMERALS[Math.floor(random * ROMAN_NUMERALS.length)];
  
  return `${prefix}${suffix}${roman}_`;
}

/**
 * Generate multiple unique Wu-Tang names
 */
export function generatePoeticNames(count: number = 3): string[] {
  const names: string[] = [];
  const used = new Set<string>();
  
  while (names.length < count) {
    const seed = Date.now().toString() + Math.random().toString() + names.length;
    const name = generatePoeticName(seed);
    if (!used.has(name)) {
      used.add(name);
      names.push(name);
    }
  }
  return names;
}

/**
 * Check if a name is a valid Wu-Tang name (ends with underscore)
 */
export function isPoeticName(name: string): boolean {
  return /^[A-Z][a-zA-Z]*[A-Z][a-zA-Z]*[A-Z]{2,3}_$/.test(name);
}

/**
 * Generate variations when name is taken
 */
export function generateVariations(baseName: string): string[] {
  const variations: string[] = [];
  for (let i = 1; i <= 3; i++) {
    variations.push(`${baseName}${i}_`);
  }
  // Generate completely different Wu-Tang names as alternatives
  for (let i = 0; i < 5; i++) {
    const seed = Date.now().toString() + Math.random().toString() + i;
    variations.push(generatePoeticName(seed));
  }
  return variations.slice(0, 5);
}

/**
 * Get full email address for an agent name
 * Format: name_@nftmail.box
 */
export function getAgentEmail(name: string): string {
  return `${name}@nftmail.box`;
}

export default {
  generatePoeticName,
  generatePoeticNames,
  isPoeticName,
  generateVariations,
  getAgentEmail,
  WU_PREFIXES,
  WU_SUFFIXES,
  ROMAN_NUMERALS
};
