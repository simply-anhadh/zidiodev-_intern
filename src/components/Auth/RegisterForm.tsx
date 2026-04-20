import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { BarChart3 } from 'lucide-react';

const RegisterForm: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <BarChart3 className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Excel Analytics</h2>
          <p className="mt-2 text-sm text-gray-600">Create your account</p>
        </div>
        <div className="flex justify-center">
          <SignUp
            routing="hash"
            afterSignUpUrl="/#/dashboard"
            signInUrl="/#/login"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;