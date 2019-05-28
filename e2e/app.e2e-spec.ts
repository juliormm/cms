import { LinappPage } from './app.po';

describe('linapp App', function() {
  let page: LinappPage;

  beforeEach(() => {
    page = new LinappPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
