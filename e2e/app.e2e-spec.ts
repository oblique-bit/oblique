import { ObliqueReactivePage } from './app.po';

describe('ObliqueReactive App', function() {
  let page: ObliqueReactivePage;

  beforeEach(() => {
    page = new ObliqueReactivePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getHeaderText()).toEqual('ObliqueReactive');
  });
});
