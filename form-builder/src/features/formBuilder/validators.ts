import { z } from 'zod';
import { FieldBase } from '../../lib/schema';

export function zodForField(f: FieldBase) {
    const req = f.required || f.validations?.notEmpty;
    switch (f.type) {
        case 'text':
        case 'textarea': {
            let s = z.string({ required_error: 'Required' });
            if (!req) s = s.optional().transform(v => v ?? '');
            if (req) s = s.min(1, 'Required');
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
            return s;
        }
        case 'number': {
            let s = z.preprocess(v => v === '' || v === undefined ? undefined : Number(v), z.number({ invalid_type_error: 'Invalid number' }));
            if (!req) s = s.optional();
            return s;
        }
        case 'select':
        case 'radio': {
            let s = z.string();
            if (!req) s = s.optional().transform(v => v ?? '');
            if (req) s = s.min(1, 'Required');
            return s;
        }
        case 'checkbox': {
            let s = z.boolean();
            if (req) s = s.refine(v => v === true, 'Must be checked');
            else s = s.optional().transform(v => !!v);
            return s;
        }
        case 'date': {
            let s = z.string().refine(v => !v || !isNaN(Date.parse(v)), 'Invalid date');
            if (!req) s = s.optional().transform(v => v ?? '');
            if (req) s = s.min(1, 'Required');
            return s;
        }
        default:
            return z.any();
    }
}

export function zodForForm(fields: FieldBase[]) {
    const shape: Record<string, z.ZodTypeAny> = {};
    for (const f of fields) {
        if (f.derived?.enabled) {
            // derived fields are computed, keep them as optional strings
            shape[f.id] = z.any().optional();
        } else {
            shape[f.id] = zodForField(f);
        }
    }
    return z.object(shape);
}