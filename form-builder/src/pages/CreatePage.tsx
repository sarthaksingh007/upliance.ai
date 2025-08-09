import React, { useState } from 'react';
import { Grid, TextField, Paper, Button, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { FieldPicker } from '../features/formBuilder/components/FieldPicker';
import { FieldList } from '../features/formBuilder/components/FieldList';
import { FieldEditor } from '../features/formBuilder/components/FieldEditor';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { saveWorkingForm, setFormName } from '../features/formBuilder/formSlice';

export const CreatePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const form = useAppSelector(s => s.form.workingForm);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(form.name);

    const handleSave = () => setOpen(true);
    const confirmSave = () => {
        dispatch(saveWorkingForm({ name }));
        setOpen(false);
    };

    return (
        <div className="space-y-4">
            {/* Top Bar */}
            <div className="bg-white rounded-lg shadow p-4 flex flex-col flex-wrap gap-4 items-start">
                <h2 className="text-lg font-bold text-gray-800">Build Form</h2>
                <div>
                    <input
                        type="text"
                        placeholder="Form Name"
                        value={form.name}
                        onChange={(e) => {
                            setName(e.target.value);
                            dispatch(setFormName(e.target.value));
                        }}
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                        onClick={handleSave}
                        className="bg-cyan-500 m-2 hover:bg-cyan-600 text-white px-4 py-2 rounded text-sm font-medium"
                    >
                        Save
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Sidebar */}
                <div className="md:col-span-4 space-y-4">
                    <FieldPicker />
                    <FieldList />
                </div>

                {/* Main Editor */}
                <div className="md:col-span-8">
                    <FieldEditor />
                </div>
            </div>

            {/* Dialog */}
            {open && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                        <h3 className="text-lg font-semibold mb-4">Save Form</h3>
                        <input
                            autoFocus
                            type="text"
                            placeholder="Form Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSave}
                                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded text-sm font-medium"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};