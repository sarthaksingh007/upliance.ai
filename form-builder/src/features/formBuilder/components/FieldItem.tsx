import React from 'react';
import { IconButton, ListItem, ListItemText, Chip, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { deleteField, moveField, setSelectedField } from '../formSlice';

export const FieldItem: React.FC<{ id: string; index: number }> = ({ id, index }) => {
    const dispatch = useAppDispatch();
    const field = useAppSelector(s => s.form.workingForm.fields.find(f => f.id === id))!;
    const total = useAppSelector(s => s.form.workingForm.fields.length);
    return (
        <ListItem
            selected={useAppSelector(s => s.form.selectedFieldId) === id}
            onClick={() => dispatch(setSelectedField(id))}
            secondaryAction={
                <Stack direction="row" spacing={1}>
                    <IconButton disabled={index === 0} onClick={(e) => { e.stopPropagation(); dispatch(moveField({ from: index, to: index - 1 })); }}>
                        <ArrowUpwardIcon />
                    </IconButton>
                    <IconButton disabled={index === total - 1} onClick={(e) => { e.stopPropagation(); dispatch(moveField({ from: index, to: index + 1 })); }}>
                        <ArrowDownwardIcon />
                    </IconButton>
                    <IconButton color="error" onClick={(e) => { e.stopPropagation(); dispatch(deleteField(id)); }}>
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            }
        >
            <ListItemText
                primary={`${field.label} (${field.type})`}
                primaryTypographyProps={{
                    sx: { fontWeight: 'semibold', cursor: 'pointer' }
                }}
                secondary={
                    <Stack direction="row" spacing={1}>
                        {field.required && <Chip size="small" label="Required" color="primary" variant="outlined" />}
                        {field.derived?.enabled && <Chip size="small" label="Derived" color="secondary" variant="outlined" />}
                    </Stack>
                }
            />
        </ListItem>
    );
};
