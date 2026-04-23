import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CreateEvent from '../../pages/CreateEvent';
import { BrowserRouter } from 'react-router-dom';
import * as apiModule from '../../services/api';

vi.mock('../../services/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../services/api')>();
  return {
    ...actual,
    eventsAPI: {
      ...actual.eventsAPI,
      createEvent: vi.fn(),
    },
    categoriesAPI: {
      ...actual.categoriesAPI,
      getCategories: vi.fn(() => Promise.resolve({ data: [] })),
    },
  };
});

const mockUser = {
  id: 1,
  email: 'test@example.com',
  role: 'user' as const,
  name: 'Test User'
};

vi.mock('../../context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../context/AuthContext')>();
  return {
    ...actual,
    useAuth: () => ({
      user: mockUser,
      isAuthenticated: true,
      logout: vi.fn(),
    }),
  };
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

describe('CreateEvent Form', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(apiModule.categoriesAPI.getCategories).mockResolvedValue({ data: [] } as any);
  });

  it('должен отображать ошибки валидации при пустой форме', async () => {
    const { container } = renderWithProviders(<CreateEvent />);
    
    const form = container.querySelector('form');
    if (!form) throw new Error('Form not found');

    fireEvent.submit(form);
    
    const titleInput = screen.getByPlaceholderText(/Введите название события/i);
    
    await waitFor(() => {
      expect(titleInput).toHaveClass('border-red-500');
    });

    expect(screen.getByText('Введите название события')).toBeInTheDocument();
    expect(screen.getByText('Введите описание')).toBeInTheDocument();
  });

  it('должен успешно отправить форму с корректными данными', async () => {
    vi.mocked(apiModule.eventsAPI.createEvent).mockResolvedValueOnce({
      status: 201,
      data: { id: 1, title: 'Митап', location: 'Москва' }
    } as any);
    
    const { container } = renderWithProviders(<CreateEvent />);
    
    fireEvent.change(screen.getByPlaceholderText(/Введите название события/i), { 
      target: { value: 'Митап' } 
    });
    
    fireEvent.change(screen.getByPlaceholderText(/Опишите ваше событие/i), { 
      target: { value: 'Описание митапа' } 
    });
    
    const dateInput = screen.getByLabelText(/Дата и время/i) as HTMLInputElement;
    fireEvent.change(dateInput, { 
      target: { value: '2026-12-12T10:00' } 
    });
    
    fireEvent.change(screen.getByPlaceholderText(/Где будет проходить событие/i), { 
      target: { value: 'Москва' } 
    });
    
    const form = container.querySelector('form');
    if (!form) throw new Error('Form not found');
    
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(apiModule.eventsAPI.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Митап',
          description: 'Описание митапа',
          location: 'Москва',
          date: expect.any(String),
        })
      );
    });
    
    await waitFor(() => {
      expect(screen.getByText('Событие успешно создано!')).toBeInTheDocument();
    });
  });
});