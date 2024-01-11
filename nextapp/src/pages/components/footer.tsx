import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-center p-4 absolute bottom-0 w-full">
      <p className="text-sm text-gray-600">
        © {new Date().getFullYear()} Harebare company. All rights reserved.
      </p>
      <a href="/privacy-policy" className="text-sm text-gray-600 hover:underline">
        プライバシーポリシー
      </a>
    </footer>
  );
};

export default Footer;