class SearchPage {
  constructor(page) {
    this.page = page;
    const main = page.getByRole('main');
    this.query = main.getByRole('textbox', { name: 'Начните поиск' });
    this.results = main.locator('.search-results');
  }

  async openWithQuery(query) {
    await this.page.goto('/search/?' + new URLSearchParams({ q: query }), {
      waitUntil: 'domcontentloaded',
    });
  }

  async clearQuery() {
    await this.query.fill('');
  }
}

module.exports = { SearchPage };
