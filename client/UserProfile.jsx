
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import PasswordForm from './PasswordForm.jsx';

const ProfilePage = () => {
    const [username] = useState('');

    return (
        <div class="bg-secondary rounded p-8 m-2">
            <h1 class="text-2xl pb-2">Change Password</h1>
            <PasswordForm />
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('profile'));
    root.render(<ProfilePage />);
};

window.onload = init;


window.onload = init;