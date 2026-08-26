import React from 'react';
import { Outlet } from 'react-router-dom';
import { ConsumerSidebar } from './ConsumerSidebar';

export function ConsumerLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <ConsumerSidebar />
      <main className="flex-1 w-full min-w-0 lg:pl-64">
        <div className="px-4 py-8 sm:px-8 lg:px-12 pt-24 lg:pt-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
