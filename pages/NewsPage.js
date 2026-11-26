const { ContentPage } = require('./ContentPage');

class NewsPage extends ContentPage {
  constructor(page) {
    super(page);
    this.page = page;
    this.firstArticle = page.locator('#news').getByRole('link')
      .filter({ has: page.getByRole('heading') }).first();
    this.firstTitle = this.firstArticle.getByRole('heading');
  }

  async open() {
    await this.page.goto('/news/', { waitUntil: 'domcontentloaded' });
  }

  async openFirstArticle() {
    await this.firstArticle.click();
  }
}

module.exports = { NewsPage };
