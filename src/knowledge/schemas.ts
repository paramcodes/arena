import { z } from 'zod';

export const RELATIONS = ['prerequisite', 'causes', 'mitigates', 'alternative', 'depends_on', 'observed_by'] as const;

const Id = z.string().regex(/^[a-z0-9-]+$/, 'ids are lowercase words joined by dashes');

export const ConceptSchema = z.object({
  id: Id,
  name: z.string().min(1),
  plain: z.string().min(1),       // simple language, shown first
  technical: z.string().min(1),   // the developer word
  mechanism: z.string().min(1),   // how it works underneath
  district: z.string().min(1),
  related: z.array(z.object({ id: Id, relation: z.enum(RELATIONS) })).default([]),
});

export const HintSchema = z.object({
  level: z.number().int().min(1).max(3),
  text: z.string().min(1),
});

export const StepSchema = z.object({
  id: Id,
  text: z.string().min(1),
  hints: z.array(HintSchema).default([]),
});

export const ObjectiveSchema = z.object({
  id: Id,
  text: z.string().min(1),
  steps: z.array(StepSchema).min(1),
});

export const MissionSchema = z
  .object({
    id: Id,
    title: z.string().min(1),
    district: z.string().min(1),
    intro: z.string().min(1),
    concepts: z.array(Id).min(1),
    objectives: z.array(ObjectiveSchema).min(1),
    reward: z.object({ label: z.string().min(1), description: z.string().min(1) }),
    unlocks: z.array(Id).default([]),
  })
  .superRefine((m, ctx) => {
    const seen = new Set<string>();
    for (const o of m.objectives) {
      for (const s of o.steps) {
        if (seen.has(s.id)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: `duplicate step id "${s.id}"` });
        }
        seen.add(s.id);
      }
    }
  });

export type Concept = z.infer<typeof ConceptSchema>;
export type Hint = z.infer<typeof HintSchema>;
export type Step = z.infer<typeof StepSchema>;
export type Objective = z.infer<typeof ObjectiveSchema>;
export type Mission = z.infer<typeof MissionSchema>;
