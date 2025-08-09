import { z } from 'zod';
import type { FieldBase } from '../../lib/schema';

export function zodForField(f: FieldBase) {
    const req = f.required || f.validations?.notEmpty;

    switch (f.type) {
        case 'text':
        case 'textarea': {
            let s = z.string();
            
            // Apply all validations first
            if (req) {
                s = s.min(1, 'Required');
            }
            if (f.validations?.minLength) {
                s = s.min(f.validations.minLength, `Min ${f.validations.minLength}`);
            }
            if (f.validations?.maxLength) {
                s = s.max(f.validations.maxLength, `Max ${f.validations.maxLength}`);
            }
            if (f.validations?.email) s = s.email('Invalid email');
            if (f.validations?.passwordRule) {
                s = s.min(8, 'Min 8 characters').regex(/\d/, 'Must contain a number');
            }
            
            // Make optional at the end if not required
            if (!req) {
                return s.optional().default('');
            }
            return s;
        }

        case 'number': {
            const baseSchema = z.preprocess(
                v => v === '' || v === undefined ? undefined : Number(v),
                z.number({ message: 'Invalid number' })
            );
            
            if (!req) {
                return baseSchema.optional();
            }
            return baseSchema;
        }

        case 'select':
        case 'radio': {
            let s = z.string();
            if (req) {
                s = s.min(1, 'Required');
                return s;
            } else {
                return s.optional().default('');
            }
        }

        case 'checkbox': {
            const s = z.boolean();
            if (req) {
                return s.refine(v => v === true, 'Must be checked');
            } else {
                return s.optional().default(false);
            }
        }

        case 'date': {
            const s = z.string().refine(v => !v || !isNaN(Date.parse(v)), 'Invalid date');
            if (req) {
                return s.min(1, 'Required');
            } else {
                return s.optional().default('');
            }
        }

        default:
            return z.any();
    }
}

export function zodForForm(fields: FieldBase[]) {
    const shape: Record<string, z.ZodTypeAny> = {};
    for (const f of fields) {
        if (f.derived?.enabled) {
            shape[f.id] = z.any().optional();
        } else {
            shape[f.id] = zodForField(f);
        }
    }
    return z.object(shape);
}
