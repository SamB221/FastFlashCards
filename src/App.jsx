import {
    Route, 
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider 
} from 'react-router-dom';
import React from 'react';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import CreateSetPage from './pages/CreateSetPage';
import GeneratePage from './pages/GeneratePage';
import NotFoundPage from './pages/NotFoundPage';
import SetPage from './pages/SetPage';
import EditPage from './pages/CreateSetPage';
import PlayPage from './pages/PlayPage';
import MasterPage from './pages/MasterPage';
import MatchPage from './pages/MatchPage';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path='/landing' element={<LandingPage />} />
            <Route path='/upload' element={<UploadPage />} />
            <Route path='/create' element={<CreateSetPage />} />
            <Route path='/generate' element={<GeneratePage />} />
            <Route path='/set/:id' element={<SetPage />} />
            <Route path='/set/:id/edit' element={<EditPage />} />
            <Route path='/set/:id/basic' element={<PlayPage />} />
            <Route path='/set/:id/master' element={<MasterPage />} />
            <Route path='/set/:id/match' element={<MatchPage />} />
            <Route path='*' element={<NotFoundPage />} />
        </Route>
    )
);

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;