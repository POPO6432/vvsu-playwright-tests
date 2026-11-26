const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { ContentPage } = require('../pages/ContentPage');
const { NewsPage } = require('../pages/NewsPage');

const sections = [
  { name: 'Поступление', href: '/admission/', heading: 'Поступление' },
  { name: 'Наука', href: '/scientific/', heading: 'Наука и инновации' },
  { name: 'Сотрудничество', href: '/international_cooperation/' },
  { name: 'ДПО', href: 'https://dpo.vvsu.ru/' },
  { name: 'Молодёжь ВВГУ', href: '/mc/' },
  { name: 'Об университете', href: '/about/' },
  { name: 'Обучение', href: '/education/' },
];

test('Главное меню содержит ссылки на семь ожидаемых разделов', async ({ page }) => {
  const home = new HomePage(page);
  await home.open();
  for (const { name, href } of sections) {
    await expect(home.sectionLink(name), name).toHaveAttribute('href', href);
  }
});

for (const { name, href, heading } of sections.filter(section => section.heading)) {
  test(`Из меню открывается раздел «${name}»`, async ({ page }) => {
    const home = new HomePage(page);
    const section = new ContentPage(page);
    await home.open();
    await home.openSection(name);
    await expect(page).toHaveURL(href);
    await expect(section.heading).toHaveText(heading);
  });
}

test('Из подвала открываются сведения об образовательной организации', async ({ page }) => {
  const home = new HomePage(page);
  const info = new ContentPage(page);
  await home.open();
  await home.openUniversityInfo();
  await expect(page).toHaveURL('/sveden/');
  await expect(info.heading).toHaveText('Сведения об образовательной организации');
});

test('Ссылка «Все новости» открывает ленту с публикациями', async ({ page }) => {
  const home = new HomePage(page);
  const news = new NewsPage(page);
  await home.open();
  await home.openNews();
  await expect(page).toHaveURL('/news/');
  await expect(news.heading).toHaveText('Новости');
  await expect(news.firstTitle).toBeVisible();
});

test('Карточка в ленте открывает статью с выбранным заголовком', async ({ page }) => {
  const news = new NewsPage(page);
  const article = new ContentPage(page);
  await news.open();
  await expect(news.firstTitle).toHaveText(/\S/);
  const title = await news.firstTitle.innerText();
  const href = await news.firstArticle.getAttribute('href');
  expect(href).toMatch(/^\/news\/\d+\/?$/);
  await news.openFirstArticle();
  await expect(page).toHaveURL(href);
  await expect(article.heading).toHaveText(title);
});
