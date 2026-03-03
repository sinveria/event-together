import React, { useState, useEffect, MouseEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { groupsAPI, Group } from '../services/api';

interface GroupCardProps {
  group: Group;
  onUpdate?: () => void;
}

const GroupCard = ({ group, onUpdate }: GroupCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [checkingMembership, setCheckingMembership] = useState(false);
  const [membershipError, setMembershipError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setIsMember(false);
      return;
    }

    const checkMembership = async () => {
      try {
        setCheckingMembership(true);
        
        if (group.current_user_is_member !== undefined && group.current_user_is_member !== null) {
          setIsMember(group.current_user_is_member);
          return;
        }
        
        const response = await groupsAPI.checkMembership(group.id);
        setIsMember(response.data.is_member);
        
      } catch (error) {
        setIsMember(false);
      } finally {
        setCheckingMembership(false);
      }
    };

    checkMembership();
  }, [user, group.id, group.current_user_is_member]);

  const handleJoin = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setMembershipError(null);
      
      await groupsAPI.joinGroup(group.id);
      
      setIsMember(true);
      
      onUpdate?.();
      
    } catch (error) {
      const axiosError = error as { response?: { data?: { detail?: string } } };
      if (axiosError.response?.data?.detail === 'Already a member of this group') {
        setIsMember(true);
        setMembershipError('Вы уже участник этой группы');
      } else {
        setMembershipError(axiosError.response?.data?.detail || 'Ошибка присоединения');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeave = async () => {
    try {
      setIsLoading(true);
      setMembershipError(null);
      
      await groupsAPI.leaveGroup(group.id);
      
      setIsMember(false);
      
      onUpdate?.();
      
    } catch (error) {
      const axiosError = error as { response?: { data?: { detail?: string } } };
      if (axiosError.response?.data?.detail === 'Not a member of this group') {
        setIsMember(false);
        setMembershipError('Вы уже не участник этой группы');
      } else if (axiosError.response?.data?.detail === 'Organizer cannot leave the group') {
        setMembershipError('Организатор не может покинуть группу');
      } else {
        setMembershipError(axiosError.response?.data?.detail || 'Ошибка выхода из группы');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMembership = async () => {
    if (isMember) {
      handleLeave();
    } else {
      handleJoin();
    }
  };

  useEffect(() => {
    if (membershipError) {
      const timer = setTimeout(() => {
        setMembershipError(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [membershipError]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 mx-48 hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-3">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{group.name}</h3>
              <div className="flex items-center gap-4 text-gray-600 mb-3">
                <span>{group.membersCount} участников</span>
                <span>{group.upcomingEvents} событий</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  group.tags.includes('открытая') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {group.tags.includes('открытая') ? 'Открытая' : 'Закрытая'}
                </span>
              </div>
            </div>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-3">
              {group.description}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {group.tags.map((tag: string, index: number) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 ml-6">
            {group.is_open && user && (
              <>
                <button 
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    handleToggleMembership();
                  }}
                  disabled={isLoading || checkingMembership}
                  className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                    isMember 
                      ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  } ${(isLoading || checkingMembership) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={isMember ? 'Вы в группе (нажмите, чтобы выйти)' : 'Присоединиться'}
                >
                  {checkingMembership ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                  ) : isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                  ) : isMember ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                </button>
                
                {membershipError && (
                  <div className="text-xs text-red-600 max-w-[120px] text-right">
                    {membershipError}
                  </div>
                )}
              </>
            )}
            
            <div className="text-right">
              <p className="text-sm text-gray-500">Организатор:</p>
              <p className="text-lg font-semibold text-gray-900">{group.organizer}</p>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-3 text-lg">Организатор</h4>
              <div>
                <p className="font-medium text-gray-900">{group.organizer}</p>
                <p className="text-gray-600 text-sm">Основатель группы</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-3 text-lg">Ближайшие события</h4>
              <ul className="space-y-2">
                {group.events.map((event: string, index: number) => (
                  <li key={index} className="text-gray-700">
                    {event}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-3 text-lg">Активность</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Сообщения:</span>
                  <span className="font-medium">{group.activity.messages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Участники онлайн:</span>
                  <span className="font-medium">{group.activity.online}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupCard;