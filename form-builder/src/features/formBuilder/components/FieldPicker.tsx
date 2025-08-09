import React from 'react';
import { Button, ButtonGroup, Paper, Typography } from '@mui/material';
import { useAppDispatch } from '../../../app/hooks';
import { addField } from '../formSlice';
import type { FieldType } from '../../../lib/schema';

const types: { t: FieldType; label: string }[] = [
    { t: 'text', label: 'Text' },
    { t: 'number', label: 'Number' },
    { t: 'textarea', label: 'Textarea' },
    { t: 'select', label: 'Select' },
    { t: 'radio', label: 'Radio' },
    { t: 'checkbox', label: 'Checkbox' },
    { t: 'date', label: 'Date' },
];

export const FieldPicker: React.FC = () => {
    const dispatch = useAppDispatch();
    return (
        <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Add Field</Typography>
            <ButtonGroup variant="outlined" sx={{ flexWrap: 'wrap', gap: 1 }}>
                {types.map(x => (
                    <Button key={x.t} onClick={() => dispatch(addField(x.t))} sx={{ textTransform: 'none' }}>
                        {x.label}
                    </Button>
                ))}
            </ButtonGroup>
        </Paper>
    );
};