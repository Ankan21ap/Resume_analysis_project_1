
import React from 'react';
import { ResumeAnalysis } from '../types';
import ProgressBar from './ProgressBar';

interface AnalysisResultProps {
  analysis: ResumeAnalysis;
  onReset: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, onReset }) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Overview Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <ProgressBar score={analysis.score} label="Match Score" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Targeting: {analysis.targetRole}</h2>
            <p className="text-gray-600 leading-relaxed">
              We've analyzed your resume against the industry standards for this role. 
              {analysis.score >= 80 ? ' You are in great shape!' : analysis.score >= 50 ? ' You have a solid foundation but need optimization.' : ' Significant improvements are needed to be competitive.'}
            </p>
            <button 
              onClick={onReset}
              className="mt-6 text-blue-600 font-medium hover:text-blue-800 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Start New Analysis
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skill Gaps */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            Key Skills to Develop
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.missingSkills.map((skill, idx) => (
              <span key={idx} className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-medium border border-amber-100">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Improvements */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Quick Wins
          </h3>
          <ul className="space-y-3">
            {analysis.improvements.map((imp, idx) => (
              <li key={idx} className="flex gap-3 text-gray-700 text-sm">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">{idx + 1}</span>
                {imp}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ATS Rewrites */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          ATS-Optimized Bullet Points
        </h3>
        <div className="space-y-6">
          {analysis.atsRewrites.map((item, idx) => (
            <div key={idx} className="border-l-4 border-purple-200 pl-4 py-2 hover:bg-purple-50 transition-colors rounded-r-lg">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Original</p>
              <p className="text-sm text-gray-500 italic mb-3 line-through">"{item.original}"</p>
              <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Rewritten</p>
              <p className="text-sm text-gray-900 font-medium mb-2">"{item.rewritten}"</p>
              <div className="bg-white/50 p-2 rounded text-xs text-purple-700">
                <span className="font-bold">Why:</span> {item.reason}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Career Roadmap */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          6-Month Growth Strategy
        </h3>
        <div className="relative border-l-2 border-gray-100 ml-4 space-y-12">
          {analysis.roadmap.map((step, idx) => (
            <div key={idx} className="relative pl-8">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-green-500 rounded-full"></div>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded mb-2 inline-block">Month {step.month}</span>
                <h4 className="text-lg font-bold text-gray-800 mb-3">{step.focus}</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {step.actions.map((action, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
