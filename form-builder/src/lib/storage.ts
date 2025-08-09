import { FormMeta, FormSchema } from './schema';

const LIST_KEY = 'forms:list';

export function getForms(): FormMeta[] {
    const raw = localStorage.getItem(LIST_KEY);
    if (!raw) return [];
    try { return JSON.parse(raw); } catch { return []; }
}

export function saveForm(form: FormSchema) {
    localStorage.setItem(`form: ${ form.id }`, JSON.stringify(form));
    const list = getForms();
    const exists = list.find(f => f.id === form.id);
    const meta: FormMeta = { id: form.id, name: form.name, createdAt: form.createdAt };
    const next = exists ? list.map(f => f.id === meta.id ? meta : f) : [meta, ...list];
    localStorage.setItem(LIST_KEY, JSON.stringify(next));
}

export function getFormById(id: string): FormSchema | null {
    const raw = localStorage.getItem(`form: ${ id }`);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
}