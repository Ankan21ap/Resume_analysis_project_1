
import React from 'react';
import { ResumeAnalysis } from '../types';

interface DashboardProps {
  history: ResumeAnalysis[];
  onView: (analysis: ResumeAnalysis) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ history, onView }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-12 mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Your Recent Analyses</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((item) => (
          <div 
            key={item.id} 
            onClick={() => onView(item)}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3">
              <span className={`text-sm font-bold px-2 py-1 rounded ${item.score >= 80 ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                {item.score}% Match
              </span>
              <span className="text-xs text-gray-400">
                {new Date(item.timestamp || 0).toLocaleDateString()}
              </span>
            </div>
            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {item.targetRole}
            </h4>
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              Analysis based on your submitted resume text.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
