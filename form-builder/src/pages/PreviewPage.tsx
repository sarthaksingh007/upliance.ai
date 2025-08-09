import React from 'react';
import { useAppSelector } from '../app/hooks';
import { Alert } from '@mui/material';
import { FormRenderer } from '../features/formBuilder/preview/FormRenderer';

export const PreviewPage: React.FC = () => {
    const fields = useAppSelector(s => s.form.workingForm.fields);
    if (!fields.length) return <Alert severity="info">No fields yet. Go to Create and add some fields.</Alert>;
    return <FormRenderer fields={fields} />;
};