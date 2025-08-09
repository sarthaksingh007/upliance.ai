
import { Routes, Route, Navigate } from 'react-router-dom';
import { CreatePage } from '../pages/CreatePage';
import { PreviewPage } from '../pages/PreviewPage';
import { MyFormsPage } from '../pages/MyFormsPage';

export const Router = () => (

    <Routes>
        <Route path="/" element={<Navigate to="/create" replace />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/myforms" element={<MyFormsPage />} />
        <Route path="*" element={<Navigate to="/create" replace />} />
    </Routes>

);