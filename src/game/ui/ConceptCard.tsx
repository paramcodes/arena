import { CONCEPT_BY_ID } from '@/knowledge/content/concepts';
import { useEffect } from 'react';
import { useUiStore } from '@/game/store/uiStore';
import { useLearningStore } from '@/game/store/learningStore';

// Learning order: plain words first, then the developer word, then how it works.
// In child mode the developer word is tucked behind a "Developer word" label, so the words are optional.
export function ConceptCard({ id }: { id: string }) {
  const childMode = useUiStore((s) => s.childMode);
  const concept = CONCEPT_BY_ID.get(id);
  const markSeen = useLearningStore((s) => s.markSeen);
  useEffect(() => {
    markSeen(id);
  }, [id, markSeen]);
  if (!concept) return null;
  if (childMode) {
    return (
      <article className="concept">
        <p>{concept.plain}</p>
        <details>
          <summary>Developer word</summary>
          <p><strong>{concept.technical}</strong></p>
          <p>{concept.mechanism}</p>
        </details>
      </article>
    );
  }
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
