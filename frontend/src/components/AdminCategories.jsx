import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getCategories();
            setCategories(response.data);
        } catch (error) {
            setError('Ошибка загрузки категорий');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategory.name.trim()) {
            setError('Название категории обязательно');
            return;
        }

        try {
            setError('');
            await adminAPI.createCategory(newCategory);
            setNewCategory({ name: '', description: '' });
            loadCategories();
        } catch (error) {
            setError('Ошибка создания категории: ' + (error.response?.data?.detail || error.message));
        }
    };

    const handleUpdateCategory = async () => {
        if (!editingCategory.name.trim()) {
            setError('Название категории обязательно');
            return;
        }

        try {
            setError('');
            await adminAPI.updateCategory(editingCategory.id, {
                name: editingCategory.name,
                description: editingCategory.description
            });
            setEditingCategory(null);
            loadCategories();
        } catch (error) {
            setError('Ошибка обновления категории: ' + (error.response?.data?.detail || error.message));
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Удалить категорию?')) return;

        try {
            await adminAPI.deleteCategory(id);
            loadCategories();
        } catch (error) {
            setError('Ошибка удаления категории: ' + (error.response?.data?.detail || error.message));
        }
    };

    if (loading) return <div>Загрузка...</div>;

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded">
                    {error}
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Создать новую категорию</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Название категории *
                        </label>
                        <input
                            type="text"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Введите название"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Описание (необязательно)
                        </label>
                        <textarea
                            value={newCategory.description}
                            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            rows="3"
                            placeholder="Введите описание"
                        />
                    </div>
                    <button
                        onClick={handleCreateCategory}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Создать категорию
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Описание</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата создания</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {categories.map(category => (
                            <tr key={category.id} className="hover:bg-gray-50">
                                {editingCategory?.id === category.id ? (
                                    <>
                                        <td className="px-6 py-4">{category.id}</td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                value={editingCategory.name}
                                                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                                className="border border-gray-300 rounded px-2 py-1"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <textarea
                                                value={editingCategory.description || ''}
                                                onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                                                className="border border-gray-300 rounded px-2 py-1"
                                                rows="2"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(category.created_at).toLocaleDateString('ru-RU')}
                                        </td>
                                        <td className="px-6 py-4 space-x-2">
                                            <button
                                                onClick={handleUpdateCategory}
                                                className="text-green-600 hover:text-green-900"
                                            >
                                                Сохранить
                                            </button>
                                            <button
                                                onClick={() => setEditingCategory(null)}
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                Отмена
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-6 py-4">{category.id}</td>
                                        <td className="px-6 py-4 font-medium">{category.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{category.description || '—'}</td>
                                        <td className="px-6 py-4">
                                            {new Date(category.created_at).toLocaleDateString('ru-RU')}
                                        </td>
                                        <td className="px-6 py-4 space-x-2">
                                            <button
                                                onClick={() => setEditingCategory(category)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Изменить
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(category.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Удалить
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCategories;