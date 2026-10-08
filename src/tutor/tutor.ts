// A rule-based tutor. It builds every reply from the canonical concept content.
// It does not call a language model, and nothing it says is saved as course content.
// Hints come in order: question, then name, then a neighbour, and only then the explanation.
import type { Concept } from '@/knowledge/schemas';

export type TutorRequest = 'hint' | 'explain-simply' | 'explain-technically' | 'compare' | 'quiz' | 'diagnose';

export interface TutorReply {
  kind: TutorRequest;
  text: string;
  nextHintLevel: number; // how many hints have been given so far, after this reply
}

export function hintText(concept: Concept, level: 1 | 2 | 3, neighbour?: Concept): string {
  if (level === 1) return `Think about what you notice when you play with ${concept.name.toLowerCase()}. What changes?`;
  if (level === 2) return `The developer word is "${concept.technical}". Look for it in the panel and read the card.`;
  return neighbour
    ? `Compare it with "${neighbour.name}". How are they similar, and how are they different?`
    : `Read the mechanism card. It shows how the engine uses it.`;
}

export interface TutorContext {
  hintsGiven: number;        // hints already shown for this concept
  neighbour?: Concept;       // a related concept, if one exists
  answer?: string;           // learner's answer, for diagnose and quiz
}

const FILLER = new Set(['about', 'which', 'their', 'there', 'these', 'those', 'where', 'while', 'other', 'every', 'after', 'before', 'each', 'when', 'that', 'with', 'from', 'this', 'into', 'only', 'also', 'does', 'have']);

// Keywords a good answer is likely to contain: longer words from the plain sentence and the mechanism.
export function keywordsFor(concept: Concept): string[] {
  const words = `${concept.plain} ${concept.mechanism}`.toLowerCase().split(/\W+/);
  return [...new Set(words.filter((w) => w.length > 4 && !FILLER.has(w)))];
}

export function tutorReply(request: TutorRequest, concept: Concept, ctx: TutorContext): TutorReply {
  const hints = ctx.hintsGiven;
  switch (request) {
    case 'hint': {
      if (hints >= 3) {
        return { kind: request, text: `No more hints. Here is the explanation: ${concept.mechanism}`, nextHintLevel: 3 };
      }
      const level = (hints + 1) as 1 | 2 | 3;
      return { kind: request, text: hintText(concept, level, ctx.neighbour), nextHintLevel: level };
    }
    case 'explain-simply':
      return { kind: request, text: concept.plain, nextHintLevel: hints };
    case 'explain-technically':
      return { kind: request, text: `${concept.technical}: ${concept.mechanism}`, nextHintLevel: hints };
    case 'compare': {
      if (!ctx.neighbour) {
        return { kind: request, text: 'There is no closely related concept to compare with yet.', nextHintLevel: hints };
      }
      return {
        kind: request,
        text: `${concept.name}: ${concept.plain} ${ctx.neighbour.name}: ${ctx.neighbour.plain}`,
        nextHintLevel: hints,
      };
    }
    case 'quiz':
      return { kind: request, text: `In one sentence, what does ${concept.name.toLowerCase()} do?`, nextHintLevel: hints };
    case 'diagnose': {
      const keywords = keywordsFor(concept);
      const answer = (ctx.answer ?? '').toLowerCase();
      const matched = keywords.filter((k) => answer.includes(k)).length;
      if (answer.trim() === '') {
        return { kind: request, text: 'Type an answer first, then ask me to check it.', nextHintLevel: hints };
      }
      if (matched >= 2) {
        return { kind: request, text: 'Close. You have the main idea. Check the developer word on the card.', nextHintLevel: hints };
      }
      return {
        kind: request,
        text: `Not quite yet. ${hintText(concept, 1, ctx.neighbour)}`,
        nextHintLevel: hints,
      };
    }
  }
}
