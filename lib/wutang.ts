// Wu-Tang name generator for agent trial registrations
// Produces unique, non-ENS style names with trailing underscore for agent addresses

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

/**
 * Generate a Wu-Tang style agent name
 * Format: {Prefix}{Suffix}{random}_ (e.g. AncientWarrior7b3_)
 * @returns Agent name with trailing underscore
 */
export function generateWuTangName(): string {
  const prefix = WU_PREFIXES[Math.floor(Math.random() * WU_PREFIXES.length)];
  const suffix = WU_SUFFIXES[Math.floor(Math.random() * WU_SUFFIXES.length)];
  const random = Math.random().toString(36).slice(2, 5); // 3 chars for uniqueness
  return `${prefix}${suffix}${random}_`;
}

/**
 * Validate agent name format
 * @param name - Agent name to validate
 * @returns True if valid
 */
export function isValidAgentName(name: string): boolean {
  // Allow alphanumeric, dots, hyphens, underscores, must end with underscore for agents
  return /^[a-z0-9._-]+_$/.test(name.toLowerCase());
}

/**
 * Generate random claim code
 * @returns 8-character Base36 string
 */
export function generateClaimCode(): string {
  return Math.random().toString(36).slice(2, 10); // 8 chars
}
