import Document from '../models/Document.js';
import Quiz from '../models/Quiz.js';
import Flashcard from '../models/Flashcard.js';

//@desc Get user learning statistics
//@route GET/api/progress/dashboard
//@access Private
export const getDashboard = async (req,res,next) =>{
    try{
        const userId = req.user._id;

        //get counts
        const totalDocuments = await Document.countDocuments({userId});
        const totalFlashcardSets = await Flashcard.countDocuments({userId});
        const totalQuizzes = await Quiz.countDocuments({userId});
        const completedQuizzes = await Quiz.countDocuments({userId, completedAt: {$ne: null}});

        //get flashcard statistics
        const flashcardSets = await Flashcard.find({userId});
        let totalFlashcards = 0;
        let reviewedFlashcards =0;
        let starredFlashcards=0;

        flashcardSets.forEach(set => {
            totalFlashcards += set.cards.length;
            reviewedFlashcards += set.cards.filter(f => f.reviewCount>0).length;
            starredFlashcards += set.cards.filter(c => c.isStarred).length;

        });

        //get quiz statistics
        const quizzes = await Quiz.find({userId, completedAt: {$ne: null}});
        const averageScore = quizzes.length > 0 
            ?Math.round(quizzes.reduce((sum,q)=> sum+q.scores,0)/quizzes.length) :0;
        
        //recent activity
        const recentDocuments = await Document.find({userId})
        .sort({lastAccessed:-1})
        .limit(5)
        .select('title lastAccessed score totalQuestions completedAt');

        const recentQuizzes = await Quiz.find({userId})
        .sort({completedAt:-1})
        .limit(5)
        .populate('documentId','title')
        .select('title scores totalQuestions completedAt');

        
        //study streak calculation based on recent activity
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // Get activity from the last 30 days
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentDocumentActivity = await Document.find({
            userId,
            lastAccessed: { $gte: thirtyDaysAgo }
        }).select('lastAccessed');
        
        const recentQuizActivity = await Quiz.find({
            userId,
            completedAt: { $gte: thirtyDaysAgo }
        }).select('completedAt');
        
        // Combine and sort all activity dates
        const activityDates = [
            ...recentDocumentActivity.map(doc => doc.lastAccessed),
            ...recentQuizActivity.map(quiz => quiz.completedAt)
        ].filter(date => date).sort((a, b) => b - a);
        
        // Calculate streak
        let studyStreak = 0;
        const uniqueDays = new Set();
        
        activityDates.forEach(date => {
            const dayKey = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toDateString();
            uniqueDays.add(dayKey);
        });
        
        // Check consecutive days from today backwards
        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const dayKey = checkDate.toDateString();
            
            if (uniqueDays.has(dayKey)) {
                studyStreak++;
            } else if (i === 0) {
                // If no activity today, streak is 0
                studyStreak = 0;
                break;
            } else {
                // Gap in activity, streak ends
                break;
            }
        }

        res.status(200).json({
            success:true,
            data:{
                overview:{
                    totalDocuments,
                    totalFlashcardSets,
                    totalFlashcards,
                    reviewedFlashcards,
                    starredFlashcards,
                    totalQuizzes,
                    completedQuizzes,
                    averageScore,
                    studyStreak
                },
                recentActivity: {
                    documents: recentDocuments,
                    quizzes: recentQuizzes
                }
            }
        });
    }
    catch(error){
        next(error);
    }
}