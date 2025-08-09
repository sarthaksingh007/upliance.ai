import React, { useEffect } from 'react';
import {
    TextField, FormControlLabel, Checkbox, MenuItem, RadioGroup, Radio,
    Button, Paper, Stack, Typography
} from '@mui/material';
import { useForm, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FieldBase } from '../../../lib/schema';
import { zodForForm } from '../validators';
import { buildCtx, evalDerived } from '../derived';

export const FormRenderer: React.FC<{ fields: FieldBase[] }> = ({ fields }) => {
    const defaultValues = Object.fromEntries(fields.map(f => [f.id, f.defaultValue ?? (f.type === 'checkbox' ? false : '')]));
    
    const schema = zodForForm(fields);
    
    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({ 
        defaultValues, 
        resolver: zodResolver(schema), 
        mode: 'onBlur' 
    });

    const values = watch();

    useEffect(() => {
        // compute derived fields when parents change
        const ctx = buildCtx(fields, values);
        for (const f of fields) {
            if (f.derived?.enabled && f.derived.expression) {
                try {
                    const result = evalDerived(f.derived.expression, ctx);
                    setValue(f.id, result, { shouldValidate: true, shouldDirty: true });
                } catch {
                    // ignore runtime errors; could display in UI if needed
                }
            }
        }
    }, [values, fields, setValue]);

    const onSubmit = (data: FieldValues) => {
        console.log('Submit', data);
        alert('Form is valid. Check console for values.');
    };

    const renderField = (f: FieldBase) => {
        const err = (errors)[f.id]?.message as string | undefined;
        const common = { fullWidth: true, helperText: err, error: !!err };
        const disabled = !!f.derived?.enabled;
        switch (f.type) {
            case 'text':
                return <TextField {...register(f.id)} label={f.label} disabled={disabled} {...common} />;
            case 'number':
                return <TextField {...register(f.id)} type="number" label={f.label} disabled={disabled} {...common} />;
            case 'textarea':
                return <TextField {...register(f.id)} label={f.label} multiline minRows={3} disabled={disabled} {...common} />;
            case 'select':
                return (
                    <TextField select label={f.label} {...register(f.id)} disabled={disabled} {...common}>
                        {(f.options ?? []).map(o => <MenuItem key={o.id} value={o.value}>{o.label}</MenuItem>)}
                    </TextField>
                );
            case 'radio':
                return (
                    <div>
                        <Typography sx={{ fontWeight: 600, mb: 0.5 }}>{f.label}</Typography>
                        <RadioGroup row>
                            {(f.options ?? []).map(o => (
                                <FormControlLabel
                                    key={o.id}
                                    control={<Radio />}
                                    label={o.label}
                                    value={o.value}
                                    {...register(f.id)}
                                />
                            ))}
                        </RadioGroup>
                        {err && <Typography color="error" variant="caption">{err}</Typography>}
                    </div>
                );
            case 'checkbox':
                return (
                    <FormControlLabel
                        control={<Checkbox {...register(f.id)} disabled={disabled} />}
                        label={f.label}
                    />
                );
            case 'date':
                return <TextField {...register(f.id)} type="date" label={f.label} InputLabelProps={{ shrink: true }} disabled={disabled} {...common} />;
            default:
                return null;
        }
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Preview Form</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                    {fields.map(f => (
                        <div key={f.id}>{renderField(f)}</div>
                    ))}
                    <Button type="submit" variant="contained">Submit</Button>
                </Stack>
            </form>
        </Paper>
    );
};