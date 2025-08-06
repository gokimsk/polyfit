import { useState } from 'react';
import { SplashPage } from './components/SplashPage';
import { MainPage } from './components/MainPage';
import { PolicyListPage } from './components/PolicyListPage';
import { PolicyDetailPage } from './components/PolicyDetailPage';

type Page = 'splash' | 'main' | 'list' | 'detail';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('splash');
  const [selectedSituations, setSelectedSituations] = useState<string[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = (situations: string[]) => {
    setIsTransitioning(true);
    setSelectedSituations(situations);
    setTimeout(() => {
      setCurrentPage('list');
      setIsTransitioning(false);
    }, 300);
  };

  const handlePolicyClick = (policyId: string) => {
    setSelectedPolicyId(policyId);
    setCurrentPage('detail');
  };

  const handleBackToMain = () => {
    setCurrentPage('main');
    setSelectedSituations([]);
  };

  const handleBackToList = () => {
    setCurrentPage('list');
  };

  const handleSplashComplete = () => {
    setCurrentPage('main');
  };

  if (currentPage === 'splash') {
    return <SplashPage onComplete={handleSplashComplete} />;
  }

  if (currentPage === 'main') {
    return <MainPage onNext={handleNext} />;
  }

  if (currentPage === 'list') {
    return (
      <PolicyListPage
        selectedSituations={selectedSituations}
        onBack={handleBackToMain}
        onPolicyClick={handlePolicyClick}
      />
    );
  }

  if (currentPage === 'detail') {
    return (
      <PolicyDetailPage
        policyId={selectedPolicyId}
        onBack={handleBackToList}
      />
    );
  }

  return null;
}