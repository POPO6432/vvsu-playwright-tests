class HomePage {
  constructor(page) {
    this.page = page;
    const header = page.getByRole('banner');
    this.menu = header.locator('.header__links');
    this.infoLink = page.getByRole('contentinfo').getByRole('link', {
      name: 'Сведения об образовательной организации', exact: true,
    });
    this.newsLink = page.getByRole('main').getByRole('link', { name: 'Все новости', exact: true });
    this.searchToggle = header.getByRole('link', { name: 'Поиск', exact: true }).filter({ visible: true });
    this.searchField = header.getByRole('textbox', { name: 'Начните поиск' });
    this.acceptCookies = page.getByRole('button', { name: /Принять/ });
  }

  async open() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    if (await this.acceptCookies.isVisible()) {
      await this.acceptCookies.click();
    }
  }

  sectionLink(name) {
    return this.menu.getByRole('link', { name, exact: true });
  }

  async openSection(name) {
    await this.sectionLink(name).click();
  }

  async openUniversityInfo() {
    await this.infoLink.click();
  }

  async openNews() {
    await this.newsLink.click();
  }

  async search(query) {
    await this.searchToggle.click();
    await this.searchField.fill(query);
    await this.searchField.press('Enter');
  }
}

module.exports = { HomePage };
