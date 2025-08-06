import { useState } from 'react';
import { PageHeader } from './PageHeader';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Clock, 
  FileCheck, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  ExternalLink,
  Phone,
  MessageSquare
} from 'lucide-react';

type ApplicationStatus = 'submitted' | 'reviewing' | 'approved' | 'rejected';

interface ApplicationItem {
  id: string;
  policyTitle: string;
  status: ApplicationStatus;
  submittedDate: string;
  lastUpdated: string;
  progressPercentage: number;
  expectedDate?: string;
  rejectionReason?: string;
  nextSteps: string[];
  contactInfo?: {
    phone: string;
    email: string;
  };
}

const mockApplications: ApplicationItem[] = [
  {
    id: '1',
    policyTitle: '청년 월세 특별지원',
    status: 'reviewing',
    submittedDate: '2024-07-20',
    lastUpdated: '2024-07-25',
    progressPercentage: 60,
    expectedDate: '2024-08-05',
    nextSteps: [
      '서류 검토 중입니다',
      '추가 서류 요청 시 연락드릴 예정입니다',
      '심사 완료까지 약 5-7일 소요됩니다'
    ],
    contactInfo: {
      phone: '1588-0001',
      email: 'youth@molit.go.kr'
    }
  },
  {
    id: '2',
    policyTitle: '청년구직활동지원금',
    status: 'approved',
    submittedDate: '2024-07-15',
    lastUpdated: '2024-07-22',
    progressPercentage: 100,
    nextSteps: [
      '승인이 완료되었습니다',
      '지원금은 매월 25일에 지급됩니다',
      '활동보고서를 매월 제출해주세요'
    ],
    contactInfo: {
      phone: '1350',
      email: 'employment@moel.go.kr'
    }
  }
];

const statusConfig = {
  submitted: {
    label: '신청완료',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: FileCheck,
    iconColor: 'text-blue-600'
  },
  reviewing: {
    label: '심사중',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    icon: Clock,
    iconColor: 'text-yellow-600'
  },
  approved: {
    label: '승인완료',
    color: 'bg-green-50 text-green-700 border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-600'
  },
  rejected: {
    label: '반려',
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: AlertCircle,
    iconColor: 'text-red-600'
  }
};

interface ApplicationTrackingPageProps {
  appliedPolicies: string[];
  onBack: () => void;
}

export function ApplicationTrackingPage({ appliedPolicies, onBack }: ApplicationTrackingPageProps) {
  const [selectedTab, setSelectedTab] = useState('all');

  const getStatusIcon = (status: ApplicationStatus) => {
    const config = statusConfig[status];
    const IconComponent = config.icon;
    return <IconComponent className={`w-5 h-5 ${config.iconColor}`} />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProgressSteps = (status: ApplicationStatus) => {
    const steps = [
      { label: '신청접수', completed: true },
      { label: '서류검토', completed: status !== 'submitted' },
      { label: '심사완료', completed: status === 'approved' || status === 'rejected' }
    ];
    return steps;
  };

  const filteredApplications = selectedTab === 'all' 
    ? mockApplications 
    : mockApplications.filter(app => app.status === selectedTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="신청 현황" onBack={onBack} />
      
      <div className="max-w-4xl mx-auto p-4">
        {/* 요약 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="p-4 text-center">
            <div className="text-xl font-bold text-blue-600">{mockApplications.length}</div>
            <div className="text-sm text-gray-600">총 신청</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-xl font-bold text-yellow-600">
              {mockApplications.filter(app => app.status === 'reviewing').length}
            </div>
            <div className="text-sm text-gray-600">심사중</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-xl font-bold text-green-600">
              {mockApplications.filter(app => app.status === 'approved').length}
            </div>
            <div className="text-sm text-gray-600">승인완료</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-xl font-bold text-red-600">
              {mockApplications.filter(app => app.status === 'rejected').length}
            </div>
            <div className="text-sm text-gray-600">반려</div>
          </Card>
        </div>

        {/* 탭 필터 */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="reviewing">심사중</TabsTrigger>
            <TabsTrigger value="approved">승인</TabsTrigger>
            <TabsTrigger value="rejected">반려</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4 mt-6">
            {filteredApplications.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-gray-400 mb-2">📋</div>
                <h3 className="font-medium text-gray-900 mb-1">신청 내역이 없어요</h3>
                <p className="text-sm text-gray-600">관심 있는 정책에 신청해보세요</p>
              </Card>
            ) : (
              filteredApplications.map((application) => (
                <Card key={application.id} className="p-6">
                  <div className="space-y-4">
                    {/* 헤더 */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">
                          {application.policyTitle}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(application.status)}
                          <Badge 
                            variant="secondary" 
                            className={statusConfig[application.status].color}
                          >
                            {statusConfig[application.status].label}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* 진행률 바 */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">진행률</span>
                        <span className="font-medium">{application.progressPercentage}%</span>
                      </div>
                      <Progress value={application.progressPercentage} className="h-2" />
                      
                      {/* 진행 단계 */}
                      <div className="flex justify-between text-xs text-gray-500 mt-3">
                        {getProgressSteps(application.status).map((step, index) => (
                          <div 
                            key={index}
                            className={`flex flex-col items-center ${
                              step.completed ? 'text-blue-600' : 'text-gray-400'
                            }`}
                          >
                            <div 
                              className={`w-3 h-3 rounded-full mb-1 ${
                                step.completed ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                            />
                            <span>{step.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 날짜 정보 */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-gray-600">신청일</div>
                          <div className="font-medium">{formatDate(application.submittedDate)}</div>
                        </div>
                      </div>
                      {application.expectedDate && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-gray-600">예상 완료일</div>
                            <div className="font-medium">{formatDate(application.expectedDate)}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 다음 단계 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">다음 단계</h4>
                      <div className="space-y-1">
                        {application.nextSteps.map((step, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 연락처 및 액션 버튼 */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {application.contactInfo && (
                          <>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{application.contactInfo.phone}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              <span>이메일 문의</span>
                            </div>
                          </>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        상세보기
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {appliedPolicies.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              아직 신청한 정책이 없어요
            </h3>
            <p className="text-gray-600 mb-4">
              나에게 맞는 정책을 찾아 신청해보세요
            </p>
            <Button onClick={onBack}>
              정책 찾으러 가기
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}