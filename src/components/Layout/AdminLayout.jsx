import React from 'react';
import Header from './Header';
import Footer from './Footer';

const AdminLayout = ({ title, children }) => {
  return (
    <div className="bg-[#141414] min-h-screen flex flex-col text-[#EFEFEF] font-body">
      <Header variant="solid" />
      <main className="flex-1 px-6 py-12 md:px-10">
        {title && <h1 className="text-4xl font-bold mb-8 text-[#E9BF84]">{title}</h1>}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
