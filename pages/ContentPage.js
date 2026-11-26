class ContentPage {
  constructor(page) {
    this.heading = page.getByRole('heading', { level: 1 }).filter({ visible: true });
  }
}

module.exports = { ContentPage };
