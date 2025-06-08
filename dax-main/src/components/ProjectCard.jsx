import React from 'react';

const ProjectCard = ({ title, description, status, progress, dueDate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600/30 text-green-300 border-green-600/50';
      case 'in-progress':
        return 'bg-blue-600/30 text-blue-300 border-blue-600/50';
      case 'pending':
        return 'bg-yellow-600/30 text-yellow-300 border-yellow-600/50';
      default:
        return 'bg-gray-600/30 text-gray-300 border-gray-600/50';
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(status)}`}>
          {status.replace('-', ' ')}
        </span>
      </div>
      
      <p className="text-gray-300 mb-4 leading-relaxed">{description}</p>
      
      {progress !== undefined && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm text-white font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {dueDate && (
        <div className="flex items-center text-sm text-gray-400">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Due: {dueDate}
        </div>
      )}
    </div>
  );
};

export default ProjectCard;

