import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SingleCard } from './layouts';
import { LoginForm, ChangePasswordForm, CreateAccountForm, ResetPasswordForm } from './components';

export const UnauthenticatedContent = () => {
  return (
    <Routes>
      <Route
        path='/login'
        element={
          <SingleCard title='Sign In'>
            <LoginForm
              resetLink='/send-reset-password-mail'
              createAccountLink='/create-account'
            />
          </SingleCard>
        }
      />
      <Route
        path='/create-account'
        element={
          <SingleCard title='Sign Up'>
            <CreateAccountForm
              buttonLink='/login'
              redirectLink='/login'
            />
          </SingleCard>
        }
      />
      <Route
        path='/send-reset-password-mail'
        element={
          <SingleCard
            title='Reset Password'
            description='Please enter the email address that you used to register, and we will send you a link to reset your password via Email.'>

            <ResetPasswordForm
              signInLink='/login'
              buttonLink='/login'
            />
          </SingleCard>
        }
      />
      <Route
        path='/change-password/:userId'
        element={
          <SingleCard title='Change Password'>
            <ChangePasswordForm />
          </SingleCard>
        }
      />
      <Route path='*' element={<Navigate to='/login' />} />
    </Routes>
  );
};
