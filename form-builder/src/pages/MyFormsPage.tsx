import React from 'react';
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Link } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loadFormById } from '../features/formBuilder/formSlice';
import { useNavigate } from 'react-router-dom';

export const MyFormsPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const forms = useAppSelector(s => s.form.savedForms);

    const openPreview = (id: string) => {
        dispatch(loadFormById(id));
        navigate('/preview');
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Saved Forms</Typography>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Form Name</TableCell>
                        <TableCell>Created</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {forms.map(f => (
                        <TableRow key={f.id}>
                            <TableCell>
                                <Link component="button" onClick={() => openPreview(f.id)} underline="hover">
                                    {f.name}
                                </Link>
                            </TableCell>
                            <TableCell>{new Date(f.createdAt).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};