import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { FormSchema, FieldBase, FieldType } from '../../lib/schema';
import { getForms, getFormById, saveForm } from '../../lib/storage';

type FormState = {
    workingForm: FormSchema;
    selectedFieldId: string | null;
    savedForms: ReturnType<typeof getForms>;
};

const initialForm: FormSchema = {
    id: nanoid(),
    name: 'Untitled Form',
    createdAt: new Date().toISOString(),
    fields: [],
};

const initialState: FormState = {
    workingForm: initialForm,
    selectedFieldId: null,
    savedForms: getForms(),
};

const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        setFormName(state, action: PayloadAction<string>) {
            state.workingForm.name = action.payload;
        },
        addField(state, action: PayloadAction<FieldType>) {
            const id = nanoid();
            const base: FieldBase = {
                id,
                type: action.payload,
                label: `${action.payload} field`, // ✅ fixed template literal
                required: false,
                defaultValue: action.payload === 'checkbox' ? false : '',
                validations: {},
                options:
                    action.payload === 'select' || action.payload === 'radio'
                        ? [
                              { id: nanoid(), label: 'Option 1', value: 'option1' },
                              { id: nanoid(), label: 'Option 2', value: 'option2' },
                          ]
                        : undefined,
                derived: { enabled: false, parents: [], expression: '' },
            };
            state.workingForm.fields.push(base);
            state.selectedFieldId = id;
        },
        updateField(state, action: PayloadAction<{ id: string; patch: Partial<FieldBase> }>) {
            const idx = state.workingForm.fields.findIndex(f => f.id === action.payload.id);
            if (idx >= 0) {
                state.workingForm.fields[idx] = {
                    ...state.workingForm.fields[idx],
                    ...action.payload.patch,
                };
            }
        },
        updateOptions(state, action: PayloadAction<{ id: string; options: FieldBase['options'] }>) {
            const f = state.workingForm.fields.find(x => x.id === action.payload.id);
            if (f) f.options = action.payload.options;
        },
        setSelectedField(state, action: PayloadAction<string | null>) {
            state.selectedFieldId = action.payload;
        },
        deleteField(state, action: PayloadAction<string>) {
            state.workingForm.fields = state.workingForm.fields.filter(f => f.id !== action.payload);
            if (state.selectedFieldId === action.payload) {
                state.selectedFieldId = null;
            }
        },
        moveField(state, action: PayloadAction<{ from: number; to: number }>) {
            const arr = state.workingForm.fields;
            const [item] = arr.splice(action.payload.from, 1);
            arr.splice(action.payload.to, 0, item);
        },
        setDerived(
            state,
            action: PayloadAction<{
                id: string;
                enabled: boolean;
                parents: string[];
                expression: string;
            }>
        ) {
            const f = state.workingForm.fields.find(x => x.id === action.payload.id);
            if (f) {
                f.derived = {
                    enabled: action.payload.enabled,
                    parents: action.payload.parents,
                    expression: action.payload.expression,
                };
            }
        },
        saveWorkingForm(state, action: PayloadAction<{ name: string }>) {
            state.workingForm.name = action.payload.name;
            if (!state.workingForm.id) state.workingForm.id = nanoid();
            if (!state.workingForm.createdAt) {
                state.workingForm.createdAt = new Date().toISOString();
            }
            saveForm(state.workingForm);
            state.savedForms = getForms();
        },
        loadFormById(state, action: PayloadAction<string>) {
            const f = getFormById(action.payload);
            if (f) {
                state.workingForm = f;
                state.selectedFieldId = null;
            }
        },
        resetToNew(state) {
            state.workingForm = {
                id: nanoid(),
                name: 'Untitled Form',
                createdAt: new Date().toISOString(),
                fields: [],
            };
            state.selectedFieldId = null;
        },
    },
});

export const {
    setFormName,
    addField,
    updateField,
    updateOptions,
    setSelectedField,
    deleteField,
    moveField,
    setDerived,
    saveWorkingForm,
    loadFormById,
    resetToNew,
} = formSlice.actions;

export default formSlice.reducer;
