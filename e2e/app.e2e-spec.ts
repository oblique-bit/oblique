import { Oblique2ReactivePage } from './app.po';

describe('oblique2-reactive App', function() {
  let page: Oblique2ReactivePage;

  beforeEach(() => {
    page = new Oblique2ReactivePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getHeaderText()).toEqual('ObliqueReactive');
  });
});
