import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import documentService from '../../services/documentService';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Tabs from '../../components/common/Tabs';

const DocumentDetailPage = () => {

  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDocument(data);
      } catch (error) {
        toast.error(`Failed to fetch document details`);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocumentDetails();
  }, [id]);

  //helper function to get the full PDF url
  const getPdfUrl = () => {
    if ( ! document?.data?.filePath) return null;

    const filePath = document.data.filePath;

    if(filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }

    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    return `${baseUrl}${filePath.startsWith('/')? '' : '/'}${filePath}`;  
  };

  const renderContent = () => {
    if ( loading ) { 
      return <Spinner/>
    }
    if ( !document || !document.data || !document.data.filePath) {
      return <div className="text-center p-8">PDF not available</div>;
    }

    const pdfUrl = getPdfUrl();

    return (
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-300">
          <span className="text-sm font-medium text-gray-700">Document Viewer</span>
          <a href={pdfUrl} target='_blank' rel="noopener norefferer" className='inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors'>
            <ExternalLink size={16}></ExternalLink>
            Open in new tab
          </a>
        </div>
        <div className="bg-gray-100 p-1">
          <iframe src={pdfUrl} className='w-full h-[70vh] bg-white rounded border border-gray-300' title='PDF Viewer' frameborder="0" style={{colorScheme:'light'}}></iframe>

        </div>
      </div>
    )
  };

  const renderChat = () => {
    return "renderChat";
  }


  const renderFlashcardsTab = () => {
    return "renderFlashcardsTab"
  }

  const renderAIActions = () => {
    return "renderAIActions";
  }

  const renderQuizzesTab = () => {
    return "renderQuizzesTab"
  }

  const tabs = [
    {name:'content', label: 'Content', content:renderContent()},
    {name:'chat', label: 'Chat', content:renderChat()},
    {name:'ai-actions', label: 'AI Actions', content:renderAIActions()},
    {name:'flashcards', label: 'Flashcards', content:renderFlashcardsTab()},
    {name:'quizzes', label: 'Quizzes', content:renderQuizzesTab()},

  ];

  if( loading ) {
    return <Spinner/>;
  }

  if( !document ) {
    return <div className="text-center p-8">Document not found.</div>
  }



  return (
    <div>
      <div className="">
        <Link to="/documents" className='inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors'>
          <ArrowLeft size={16}></ArrowLeft>
          Back to Documents
        </Link>        
      </div>
      <PageHeader title={document.data.title}></PageHeader>
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}></Tabs>
      
    </div>
  )
}

export default DocumentDetailPage;
