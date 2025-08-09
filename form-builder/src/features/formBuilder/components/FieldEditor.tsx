import React from 'react';
import {
    Paper, Typography, TextField, FormControlLabel, Switch, Stack, Divider, Button,
    Checkbox
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setDerived, updateField, updateOptions } from '../formSlice';
import type { FieldBase, Option } from '../../../lib/schema';

export const FieldEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const selectedId = useAppSelector(s => s.form.selectedFieldId);
    const field = useAppSelector(s => s.form.workingForm.fields.find(f => f.id === selectedId));
    const fields = useAppSelector(s => s.form.workingForm.fields);
    if (!field) return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Field Editor</Typography>
            <Typography variant="body2" color="text.secondary">Select a field to edit.</Typography>
        </Paper>
    );

    const setPatch = (patch: Partial<FieldBase>) => dispatch(updateField({ id: field.id, patch }));

    const onOptionChange = (i: number, patch: Partial<Option>) => {
        const next = (field.options ?? []).map((o, idx) => idx === i ? { ...o, ...patch } : o);
        dispatch(updateOptions({ id: field.id, options: next }));
    };

    const addOption = () => {
        const next = [...(field.options ?? []), {
            id: crypto.randomUUID(), label: 'New', value: `value${(field.options?.length ?? 0) + 1}`
        }];
        dispatch(updateOptions({ id: field.id, options: next }));
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Field Editor</Typography>
            <Stack spacing={2}>
                <TextField
                    label="Label"
                    value={field.label}
                    onChange={e => setPatch({ label: e.target.value })}
                    fullWidth
                />
                <FormControlLabel
                    control={<Switch checked={field.required} onChange={e => setPatch({ required: e.target.checked })} />}
                    label="Required"
                />
                {field.type !== 'checkbox' && (
                    <TextField
                        label="Default Value"
                        value={field.defaultValue ?? ''}
                        onChange={e => setPatch({ defaultValue: e.target.value })}
                        fullWidth
                    />
                )}
                {field.type === 'checkbox' && (
                    <FormControlLabel
                        control={<Checkbox checked={!!field.defaultValue} onChange={e => setPatch({ defaultValue: e.target.checked })} />}
                        label="Default Checked"
                    />
                )}
                <Divider />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Validation Rules</Typography>
                <FormControlLabel
                    control={<Switch checked={!!field.validations?.notEmpty || field.required}
                        onChange={e => setPatch({ validations: { ...field.validations, notEmpty: e.target.checked } })} />}
                    label="Not empty"
                />
                {['text', 'textarea'].includes(field.type) && (
                    <>
                        <TextField
                            type="number" label="Min Length" value={field.validations?.minLength ?? ''}
                            onChange={e => setPatch({ validations: { ...field.validations, minLength: e.target.value ? Number(e.target.value) : undefined } })}
                        />
                        <TextField
                            type="number" label="Max Length" value={field.validations?.maxLength ?? ''}
                            onChange={e => setPatch({ validations: { ...field.validations, maxLength: e.target.value ? Number(e.target.value) : undefined } })}
                        />
                        <FormControlLabel
                            control={<Switch checked={!!field.validations?.email}
                                onChange={e => setPatch({ validations: { ...field.validations, email: e.target.checked } })} />}
                            label="Email format"
                        />
                        <FormControlLabel
                            control={<Switch checked={!!field.validations?.passwordRule}
                                onChange={e => setPatch({ validations: { ...field.validations, passwordRule: e.target.checked } })} />}
                            label="Password rule"
                        />
                    </>
                )}
                {['select', 'radio'].includes(field.type) && (
                    <>
                        <Divider />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Options</Typography>
                        <Stack spacing={1}>
                            {(field.options ?? []).map((o, i) => (
                                <Stack key={o.id} direction="row" spacing={1}>
                                    <TextField label="Label" value={o.label} onChange={e => onOptionChange(i, { label: e.target.value })} />
                                    <TextField label="Value" value={o.value} onChange={e => onOptionChange(i, { value: e.target.value })} />
                                </Stack>
                            ))}
                            <Button startIcon={<AddIcon />} onClick={addOption}>Add Option</Button>
                        </Stack>
                    </>
                )}
                <Divider />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Derived Field</Typography>
                <FormControlLabel
                    control={<Switch checked={!!field.derived?.enabled}
                        onChange={e => dispatch(setDerived({
                            id: field.id,
                            enabled: e.target.checked,
                            parents: field.derived?.parents ?? [],
                            expression: field.derived?.expression ?? '',
                        }))} />}
                    label="Enable derived field"
                />
                {field.derived?.enabled && (
                    <Stack spacing={1}>
                        <TextField
                            select
                            SelectProps={{ multiple: true, native: true }}
                            label="Parent Fields"
                            value={field.derived.parents}
                            onChange={e => {
                                const target = e.target;
                                if (target instanceof HTMLSelectElement) {
                                    const options = Array.from(target.selectedOptions, option => option.value);
                                    dispatch(setDerived({
                                        id: field.id,
                                        enabled: true,
                                        parents: options,
                                        expression: field.derived!.expression
                                    }));
                                }
                            }}
                        >
                            {fields.filter(f => f.id !== field.id).map(f => (
                                <option key={f.id} value={f.id}>{f.label}</option>
                            ))}
                        </TextField>
                        <TextField
                            label="Expression"
                            helperText="Use field ids as variables. Example: Math.floor((Date.now()-new Date(dob))/31557600000)"
                            value={field.derived.expression}
                            onChange={e => dispatch(setDerived({ id: field.id, enabled: true, parents: field.derived!.parents, expression: e.target.value }))}
                            multiline
                        />
                    </Stack>
                )}
            </Stack>
        </Paper>
    );
};