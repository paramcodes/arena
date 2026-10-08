import { CONCEPT_BY_ID } from '@/knowledge/content/concepts';

// Learning order: plain words first, then the developer word, then how it works.
export function ConceptCard({ id }: { id: string }) {
  const concept = CONCEPT_BY_ID.get(id);
  if (!concept) return null;
  return (
    <article className="concept">
      <p>{concept.plain}</p>
      <p>
        Developer word: <strong>{concept.technical}</strong>
      </p>
      <p>{concept.mechanism}</p>
    </article>
  );
}
