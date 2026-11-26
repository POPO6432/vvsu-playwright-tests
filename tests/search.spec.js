const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { SearchPage } = require('../pages/SearchPage');

const missingQuery = 'qqvvzz123456789';

test('Поиск из шапки сохраняет запрос и сообщает об отсутствии совпадений', async ({ page }) => {
  const home = new HomePage(page);
  const search = new SearchPage(page);
  await home.open();
  await home.search(missingQuery);
  await expect(page).toHaveURL(url => url.pathname === '/search/' && url.searchParams.get('q') === missingQuery);
  await expect(search.query).toHaveValue(missingQuery);
  await expect(search.results).toContainText('По вашему запросу ничего не найдено');
});

test('После очистки поискового поля предыдущая выдача исчезает', async ({ page }) => {
  const search = new SearchPage(page);
  await search.openWithQuery('университет');
  await expect(search.results).toContainText(/университет/i);
  await search.clearQuery();
  await expect(search.query).toHaveValue('');
  await expect(search.results).toHaveText('');
});
