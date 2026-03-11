import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/common/Spinner.jsx';
import progressService from '../../services/progressService.js';
import toast from 'react-hot-toast';
import { FileText, BookOpen, BrainCircuit, TrendingUp, Clock, Trophy, Star, Target, Calendar, CheckCircle, PlayCircle } from 'lucide-react';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboardData();
        console.log("Dashboard data:", data);
        setDashboardData(data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error(error.message || "Failed to load dashboard data.");
      }
      finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if(loading){
    return <Spinner/>;
  }

  if(!dashboardData || !dashboardData.overview){
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
            <TrendingUp className="w-8 h-8 text-slate-400"/>
          </div>
          <p className="text-slate-600 text-sm">No dashboard data available.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Documents',
      value: dashboardData.overview.totalDocuments,
      icon: FileText,
      gradient: 'from-blue-400 to-cyan-500',
      shadowColor: 'shadow-blue-500/25'
    },
    {
      label: 'Flashcard Sets',
      value: dashboardData.overview.totalFlashcardSets,
      icon: BookOpen,
      gradient: 'from-purple-400 to-pink-500',
      shadowColor: 'shadow-purple-500/25'
    },
    {
      label: 'Total Flashcards',
      value: dashboardData.overview.totalFlashcards,
      icon: Star,
      gradient: 'from-amber-400 to-orange-500',
      shadowColor: 'shadow-amber-500/25'
    },
    {
      label: 'Reviewed Cards',
      value: dashboardData.overview.reviewedFlashcards,
      icon: CheckCircle,
      gradient: 'from-green-400 to-emerald-500',
      shadowColor: 'shadow-green-500/25'
    },
    {
      label: 'Total Quizzes',
      value: dashboardData.overview.totalQuizzes,
      icon: BrainCircuit,
      gradient: 'from-emerald-400 to-teal-500',
      shadowColor: 'shadow-emerald-500/25'
    },
    {
      label: 'Completed Quizzes',
      value: dashboardData.overview.completedQuizzes,
      icon: Trophy,
      gradient: 'from-yellow-400 to-amber-500',
      shadowColor: 'shadow-yellow-500/25'
    },
    {
      label: 'Average Score',
      value: `${dashboardData.overview.averageScore}%`,
      icon: Target,
      gradient: 'from-indigo-400 to-purple-500',
      shadowColor: 'shadow-indigo-500/25'
    },
    {
      label: 'Study Streak',
      value: `${dashboardData.overview.studyStreak} days`,
      icon: Calendar,
      gradient: 'from-rose-400 to-pink-500',
      shadowColor: 'shadow-rose-500/25'
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:16px_16px] opacity-30"/>

        <div className="relative">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-slate-900 tracking-tight mb-2">Dashboard</h1>
          <p className="text-slate-500 text-sm">Welcome back! Here's your learning progress overview.</p>
        </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-6 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.shadowColor} text-white`}>
                    <stat.icon className="w-6 h-6" strokeWidth={2}/>
                  </div>
                  <div className={`text-2xl font-bold text-slate-900`}>
                    {stat.value}
                  </div>
                </div>
                <div className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Documents */}
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 shadow-lg shadow-blue-500/25 text-white">
                  <FileText className="w-5 h-5" strokeWidth={2}/>
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Recent Documents</h2>
              </div>
              <div className="space-y-3">
                {dashboardData.recentActivity.documents.length > 0 ? (
                  dashboardData.recentActivity.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-slate-100/50 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xs font-semibold">
                          {doc.title.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{doc.title}</p>
                          <p className="text-xs text-slate-500">Last accessed {formatDate(doc.lastAccessed)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {doc.score !== undefined && (
                          <p className="text-sm font-semibold text-slate-900">{doc.score}%</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
                    <p className="text-sm text-slate-500">No documents yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Quizzes */}
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25 text-white">
                  <BrainCircuit className="w-5 h-5" strokeWidth={2}/>
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Recent Quizzes</h2>
              </div>
              <div className="space-y-3">
                {dashboardData.recentActivity.quizzes.length > 0 ? (
                  dashboardData.recentActivity.quizzes.map((quiz, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-slate-100/50 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-semibold">
                          <Trophy className="w-4 h-4"/>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{quiz.title}</p>
                          <p className="text-xs text-slate-500">Completed {formatDate(quiz.completedAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{quiz.scores}%</p>
                        <p className="text-xs text-slate-500">{quiz.totalQuestions} questions</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <BrainCircuit className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
                    <p className="text-sm text-slate-500">No quizzes completed yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => navigate('/documents')}
                className="group flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
                  <FileText className="w-5 h-5"/>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">Upload Document</p>
                  <p className="text-xs text-slate-500">Add new learning material</p>
                </div>
              </button>

              <button 
                onClick={() => navigate('/flashcards')}
                className="group flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
                  <BookOpen className="w-5 h-5"/>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">Create Flashcards</p>
                  <p className="text-xs text-slate-500">Generate study cards</p>
                </div>
              </button>

              <button 
                onClick={() => navigate('/documents')}
                className="group flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
                  <PlayCircle className="w-5 h-5"/>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">View Documents</p>
                  <p className="text-xs text-slate-500">Access your learning materials</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
