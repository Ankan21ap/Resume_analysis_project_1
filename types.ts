
export interface AtsRewrite {
  original: string;
  rewritten: string;
  reason: string;
}

export interface RoadmapStep {
  month: number;
  focus: string;
  actions: string[];
}

export interface ResumeAnalysis {
  id: string;
  timestamp: number;
  targetRole: string;
  resumeText: string;
  score: number;
  missingSkills: string[];
  improvements: string[];
  atsRewrites: AtsRewrite[];
  roadmap: RoadmapStep[];
}

export interface UserProfile {
  uid: string;
  isAnonymous: boolean;
}
