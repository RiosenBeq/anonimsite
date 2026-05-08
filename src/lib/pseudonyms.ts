const ADJECTIVES = [
  "Quiet", "Slow", "Half", "Open", "North", "Soft", "Late",
  "Bright", "Distant", "Gentle", "Hidden", "Warm", "Calm", "Patient",
  "Silent", "Still", "Fading", "Dawning", "Drifting", "Wandering",
  "Pale", "Tender", "Honest", "Listening", "Restless", "Curious",
  "Gentle", "Steady", "Hollow",
] as const;

const NOUNS = [
  "Wren", "River", "Light", "Door", "Pine", "Echo", "Sea", "Reader",
  "Cloud", "Tide", "Field", "Mountain", "Star", "Path", "Wind",
  "Lantern", "Compass", "Harbor", "Meadow", "Arrow", "Ember", "Pebble",
  "Branch", "Letter", "Hour", "Threshold", "Window", "Shore", "Room",
] as const;

const pick = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

export function generatePseudonym(): string {
  return `${pick(ADJECTIVES)} ${pick(NOUNS)}`;
}

export function generatePseudonymPool(count: number): string[] {
  const pool = new Set<string>();
  while (pool.size < count) pool.add(generatePseudonym());
  return Array.from(pool);
}
