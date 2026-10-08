// The concept graph. Pure functions over the canonical concept list.
import type { Concept } from './schemas';

export interface GraphEdge {
  from: string;
  to: string;
  relation: string;
}

export function buildEdges(concepts: Concept[]): GraphEdge[] {
  return concepts.flatMap((c) => c.related.map((r) => ({ from: c.id, to: r.id, relation: r.relation })));
}

// A concept's prerequisites are the concepts it depends on.
export function prerequisitesOf(concept: Concept): string[] {
  return concept.related.filter((r) => r.relation === 'depends_on' || r.relation === 'prerequisite').map((r) => r.id);
}

export function readyToLearn(concepts: Concept[], learned: ReadonlySet<string>): string[] {
  return concepts
    .filter((c) => !learned.has(c.id) && prerequisitesOf(c).every((p) => learned.has(p)))
    .map((c) => c.id);
}

// Lay concepts out in columns by district, one row per concept. Positions are stable for the same input.
export function layout(concepts: Concept[]): Map<string, { x: number; y: number }> {
  const districts = [...new Set(concepts.map((c) => c.district))].sort();
  const out = new Map<string, { x: number; y: number }>();
  districts.forEach((d, col) => {
    concepts
      .filter((c) => c.district === d)
      .forEach((c, row) => out.set(c.id, { x: col, y: row }));
  });
  return out;
}

// Spaced review: look again after 1, then 3, then 7 days.
export const REVIEW_DAYS = [1, 3, 7] as const;

export function reviewDue(lastReviewDay: number, reviewsDone: number, today: number): boolean {
  const gap = REVIEW_DAYS[Math.min(reviewsDone, REVIEW_DAYS.length - 1)];
  return today - lastReviewDay >= gap;
}
