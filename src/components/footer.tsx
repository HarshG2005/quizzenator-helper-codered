// src/components/footer.tsx

import React from 'react';

const Footer = () => (
  <footer className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-6 mt-12 w-full absolute bottom-0 left-0">
    <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} QUIZZER. All Rights Reserved.
      </p>
      <div className="flex space-x-6">
        <a href="#" className="text-white hover:text-indigo-100">Privacy Policy</a>
        <a href="#" className="text-white hover:text-indigo-100">Terms of Service</a>
        <a href="mailto:support@quizzer.com" className="text-white hover:text-indigo-100">Contact</a>
      </div>
    </div>
  </footer>
);

export default Footer;
