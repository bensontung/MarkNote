import { NGNOTE4Page } from './app.po';

describe('ng-note4 App', () => {
  let page: NGNOTE4Page;

  beforeEach(() => {
    page = new NGNOTE4Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
