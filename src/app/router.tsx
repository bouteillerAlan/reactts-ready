import React from 'react';
import './style/scss/app.scss';
import { Route } from 'react-router-dom';
import HomePage from './pages/Home/home.page';

const RouterApp: React.FC = () => {
    return (
        <Route path='/' component={HomePage}/>
    );
};

export default RouterApp;
