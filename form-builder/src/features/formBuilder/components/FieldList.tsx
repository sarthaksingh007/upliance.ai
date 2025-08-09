import React from 'react';
import { Paper, Typography, List } from '@mui/material';
import { useAppSelector } from '../../../app/hooks';
import { FieldItem } from './FieldItem';

export const FieldList: React.FC = () => {
    const fields = useAppSelector(s => s.form.workingForm.fields);
    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Fields</Typography>
            <List dense>
                {fields.map((f, i) => <FieldItem key={f.id} id={f.id} index={i} />)}
            </List>
        </Paper>
    );
};