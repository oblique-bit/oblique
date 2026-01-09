module.exports = jest.fn(() => ({
	start: jest.fn(),
	succeed: jest.fn(),
	fail: jest.fn(),
}));
