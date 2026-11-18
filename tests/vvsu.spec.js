const { test, expect } = require('@playwright/test');

// Сайт: https://www.vvsu.ru/ (ВВГУ). Только чтение: без входа, без форм, без заявок.

const cookieAccept = (page) =>
  page.getByText('Принять', { exact: true }).filter({ visible: true }).first();

// Баннер cookie перекрывает низ страницы, поэтому в тестах, где он не предмет проверки, закрываем его.
async function dismissCookieBanner(page) {
  const btn = cookieAccept(page);
  await btn.click({ timeout: 3000 }).catch(() => {});
}

// 1. Главное меню: пункт «Поступление» ведёт в свой раздел
test('меню: пункт «Поступление» открывает раздел /admission/', async ({ page }) => {
  await page.goto('/');                                                    // вход
  await dismissCookieBanner(page);
  await page.getByRole('link', { name: 'Поступление', exact: true })
    .filter({ visible: true }).first().click();                            // действие
  await expect(page).toHaveURL(/\/admission\/?$/);                         // проверка: адрес
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

// 2. Все пункты главного меню указывают на свои разделы
test('меню: каждый пункт ведёт на свой раздел сайта', async ({ page }) => {
  const sections = {
    'Поступление': '/admission/',
    'Наука': '/scientific/',
    'Сотрудничество': '/international_cooperation/',
    'Кампус': '/life/',
    'Молодёжь ВВГУ': '/mc/',
    'Об университете': '/about/',
    'Обучение': '/education/',
  };
  await page.goto('/');
  for (const [name, path] of Object.entries(sections)) {
    const link = page.getByRole('link', { name, exact: true }).first();
    await expect(link, `пункт меню «${name}»`).toHaveAttribute('href', new RegExp(`${path}$`));
  }
});

// 3. Обязательный раздел «Сведения об образовательной организации» доступен из подвала
test('подвал: «Сведения об образовательной организации» открывает /sveden/', async ({ page }) => {
  await page.goto('/');
  await dismissCookieBanner(page);
  const link = page.getByRole('link', { name: 'Сведения об образовательной организации' }).first();
  await link.scrollIntoViewIfNeeded();
  await link.click();
  await expect(page).toHaveURL(/\/sveden\/?$/);
  await page.waitForTimeout(2000); // ждем 2 секунды (для анимации)
await expect(page.locator('.cookie-banner, .cookie-notice, [class*="cookie"]').first()).not.toBeVisible();
});

// 4. Новости: из главной в ленту и из ленты в конкретную новость
test('новости: «Все новости» открывает ленту, первая новость открывается на своей странице', async ({ page }) => {
  await page.goto('/');
  await dismissCookieBanner(page);
  await page.getByRole('link', { name: 'Все новости' }).filter({ visible: true }).first().click();
  await expect(page).toHaveURL(/\/news\/?(\?.*)?$/);

  // не «сегодняшний заголовок», а инвариант: в ленте есть ссылки вида /news/<id>/
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  const newsLinks = page.getByRole('link').and(page.locator('a[href*="/news/"]'));
  const hrefs = await newsLinks.evaluateAll((as) =>
    as.map((a) => a.href).filter((h) => /\/news\/\d+\/?$/.test(h)));
  expect(hrefs.length).toBeGreaterThan(0);

  await page.goto(hrefs[0]);
  await expect(page).toHaveURL(/\/news\/\d+\/?$/);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

