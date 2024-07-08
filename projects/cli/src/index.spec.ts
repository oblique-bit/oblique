describe('îndex', () => {
	test('logs "Hello CLI"', () => {
		jest.spyOn(console, 'info'); // this has to be done before "require"
		require('./index'); // as this file don't export anything, "require" is necessary
		expect(console.info).toHaveBeenCalledWith('Hello CLI');
	});
});
