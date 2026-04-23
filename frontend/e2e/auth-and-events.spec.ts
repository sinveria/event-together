import { test, expect } from '@playwright/test';

test.describe('Полный цикл пользователя', () => {
  
  test('должен зарегистрироваться, создать событие и увидеть его на карте', async ({ page }) => {
    test.setTimeout(60000);
    
    await page.goto('/register');
    await page.waitForSelector('form');

    const uniqueEmail = `e2e_test_${Date.now()}@example.com`;
    await page.fill('input[type="email"]', uniqueEmail);
    await page.fill('input[type="password"]', 'password123');
    await page.fill('input[placeholder*="имя" i], input[name="name"]', 'E2E User');
    
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(success|events|$)/, { timeout: 10000 });

    if (page.url().includes('/success')) {
        await page.waitForTimeout(2000); 
    }

    await page.goto('/events');
    await page.click('text=Создать событие', { timeout: 10000 });

    await page.waitForSelector('form', { timeout: 10000 });
    
    await page.fill('input[placeholder="Введите название события"]', 'E2E Конференция');
    await page.fill('textarea[placeholder="Опишите ваше событие"]', 'Тестовое событие для лабораторной работы');
    await page.fill('input[type="datetime-local"]', '2026-12-31T20:00');
    await page.fill('input[placeholder="Где будет проходить событие?"]', 'Санкт-Петербург');
    
    await page.fill('input[placeholder="0.00"]', '1000');
    await page.fill('input[placeholder="10"]', '100');
    
    await page.click('button:has-text("Создать событие")');
    
    await expect(page.getByText('Событие успешно создано!')).toBeVisible({ timeout: 15000 });
    
    await page.goto('/events');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    let eventFound = false;
    let currentPage = 1;
    const maxPages = 5;
    
    while (!eventFound && currentPage <= maxPages) {
      const eventText = await page.getByText('E2E Конференция', { exact: false }).count();
      if (eventText > 0) {
        eventFound = true;
        break;
      }
      
      const nextButton = page.getByText('Вперед →');
      if (await nextButton.isEnabled()) {
        await nextButton.click();
        await page.waitForTimeout(2000);
        currentPage++;
      } else {
        break;
      }
    }
    
    await expect(page.getByText('E2E Конференция', { exact: false }).first()).toBeVisible({ timeout: 5000 });
  });

  test('должен отказать в доступе к профилю без авторизации', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });
});