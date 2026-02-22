import React from 'react'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import ProtectedRoute from './components/auths/ProtectedRoute';
import DashboardPage from './pages/Dashboard/DashboardPage';
import LoginPage from './pages/Auth/LoginPage';
import DocumentDetailPage from './pages/Documents/DocumentDetailPage';
import FlashcardPage from './pages/Flashcards/FlashcardPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/Profile/ProfilePage';
import QuizResultPage from './pages/Quizzes/QuizResultPage';
import QuizTakePage from './pages/Quizzes/QuizTakePage';
import FlashcardListPage from './pages/Flashcards/FlashcardListPage';
import RegisterPage from './pages/Auth/RegisterPage';


const App = () => {

  const isAutheticated =false;
  const loading=false;

  if(loading){
    return(
      <div className="flex items-center justify-content-center text-center">
        <h2>Loading...</h2>
      </div>
    )
  }
  return (

    <Router>
      <Routes>
        <Route path='/' element={isAutheticated?<Navigate to='/dashboard'/>:<Navigate to='/login' replace/>}/>
        
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>



        {/* Protected Routes */}
        <Route element={<ProtectedRoute/>}>
          <Route path='/dashboard' element={<DashboardPage/>}/>
          <Route path='/documents' element={<DocumentListPage/>}></Route> 
          <Route path='/documents/:id' element={<DocumentDetailPage/>}></Route>
          <Route path='/flashcards' element={<FlashcardListPage/>}></Route>
          <Route path='/documents/:id/flashcards' element={<FlashcardPage/>}></Route>
          <Route path='/quizzes/:quizId' element={<QuizTakePage/>}></Route>
          <Route path='/quizzes/:quizId/results' element={<QuizResultPage/>}></Route>
          <Route path='/profile' element={<ProfilePage/>}></Route>
        </Route>
             
        <Route path='*' element={<NotFoundPage/>}></Route>

      </Routes>


    </Router>

   

    
  )
}

export default App;
