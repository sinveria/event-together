import React, { useState } from 'react';

const GroupCard = ({ group }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 mx-48 hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div 
                className="cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="mb-3">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{group.name}</h3>
                            <div className="flex items-center gap-4 text-gray-600 mb-3">
                                <span>{group.membersCount} участников</span>
                                <span>{group.upcomingEvents} событий</span>
                            </div>
                        </div>
                        
                        <p className="text-gray-700 text-lg leading-relaxed mb-3">
                            {group.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                            {group.tags.map((tag, index) => (
                                <span 
                                    key={index}
                                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 ml-6">
                        <button className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors shadow-sm">
                            <span className="text-xl font-bold text-gray-700">+</span>
                        </button>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Следующее:</p>
                            <p className="text-lg font-semibold text-gray-900">{group.nextEventDate}</p>
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
                                {group.events.map((event, index) => (
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