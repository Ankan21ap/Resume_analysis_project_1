
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AnalysisResult from './components/AnalysisResult';
import Dashboard from './components/Dashboard';
import { ResumeAnalysis } from './types';
import { loginAnonymously, saveAnalysis, getHistory } from './firebase';
import { analyzeResumeWithGemini } from './geminiService';

const App: React.FC = () => {
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileProcessing, setFileProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [targetRole, setTargetRole] = useState<string>('');
  const [currentAnalysis, setCurrentAnalysis] = useState<ResumeAnalysis | null>(null);
  const [history, setHistory] = useState<ResumeAnalysis[]>([]);

  // Auth & Initial Load
  useEffect(() => {
    const initApp = async () => {
      try {
        const user = await loginAnonymously();
        if (user) {
          setUid(user.uid);
          const userHistory = await getHistory(user.uid);
          setHistory(userHistory);
        }
      } catch (e) {
        console.warn("Firebase not configured, history will not be saved.");
      }
    };
    initApp();
  }, []);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    // @ts-ignore - Accessed via global script in index.html
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    if (!pdfjsLib) throw new Error("PDF library not loaded");
    
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      fullText += pageText + "\n";
    }
    return fullText;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileProcessing(true);
    setError(null);

    try {
      if (file.type === 'application/pdf') {
        const text = await extractTextFromPdf(file);
        if (text.trim().length < 50) {
          throw new Error("We couldn't extract enough text from this PDF. It might be an image-only scan.");
        }
        setResumeText(text);
      } else if (file.type === 'text/plain') {
        const text = await file.text();
        setResumeText(text);
      } else {
        setError("Unsupported file format. Please upload a PDF or TXT file.");
      }
    } catch (err: any) {
      console.error("File processing error:", err);
      setError(err.message || "Failed to extract text from file.");
    } finally {
      setFileProcessing(false);
      e.target.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !targetRole.trim()) {
      setError("Please provide both resume content and target role.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await analyzeResumeWithGemini(resumeText, targetRole);
      const fullAnalysis: ResumeAnalysis = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        targetRole,
        resumeText,
        score: result.score || 0,
        missingSkills: result.missingSkills || [],
        improvements: result.improvements || [],
        atsRewrites: result.atsRewrites || [],
        roadmap: result.roadmap || [],
      };

      if (uid) {
        try {
          await saveAnalysis(uid, fullAnalysis);
          const updatedHistory = await getHistory(uid);
          setHistory(updatedHistory);
        } catch (dbError) {
          console.error("Failed to save history:", dbError);
        }
      }
      
      setCurrentAnalysis(fullAnalysis);
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setCurrentAnalysis(null);
    setResumeText('');
    setTargetRole('');
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {!currentAnalysis ? (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
                Level up your career with <span className="text-blue-600">AI</span>
              </h1>
              <p className="text-xl text-gray-600">
                Optimize your resume for ATS, identify skill gaps, and get a personalized 6-month career roadmap.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Target Job Role
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Senior Software Engineer, Product Manager..."
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide flex justify-between">
                  Resume Content
                  {fileProcessing && <span className="text-blue-600 animate-pulse lowercase font-medium">Extracting text...</span>}
                </label>
                <div className="relative">
                  <textarea 
                    rows={10}
                    placeholder="Paste your resume text here, or upload a file..."
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 resize-none"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    disabled={loading || fileProcessing}
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <label className={`bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 ${loading || fileProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                      Upload PDF / TXT
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.txt" 
                        onChange={handleFileUpload} 
                        disabled={loading || fileProcessing}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleAnalyze}
                disabled={loading || fileProcessing || !resumeText.trim() || !targetRole.trim()}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3 active:transform active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Analyze My Resume
                  </>
                )}
              </button>
            </div>

            <Dashboard history={history} onView={setCurrentAnalysis} />
          </div>
        ) : (
          <AnalysisResult analysis={currentAnalysis} onReset={resetAnalysis} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} CareerCoach AI. Built for the modern workforce.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
