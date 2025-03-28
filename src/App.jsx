import {
    Route, 
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider 
} from 'react-router-dom';
import React from 'react';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import SetPage from './pages/SetPage';
import PlayPage from './pages/PlayPage';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path='/upload' element={<UploadPage />} />
            <Route path='/set/:id' element={<SetPage />} />
            <Route path='/set/:id/go' element={<PlayPage />} />
            <Route path='/settings' element={<SettingsPage />} />
            <Route path='*' element={<NotFoundPage />} />
        </Route>
    )
);

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;