import React from 'react';

export default function DashboardCard({ title, value, icon, bgColor, textColor, linkTo, linkText }) {
  return (
    <div className={`${bgColor || 'bg-white'} p-6 rounded-lg shadow-sm overflow-hidden relative`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        <div className={`${textColor || 'text-blue-500'}`}>
          {icon || (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4m0 0l-4-4-4 4m4-4v12" />
            </svg>
          )}
        </div>
      </div>
      
      <div className="text-3xl font-bold mb-2">
        {value}
      </div>
      
      {linkTo && linkText && (
        <a 
          href={linkTo}
          className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
        >
          {linkText}
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      )}
    </div>
  );
}