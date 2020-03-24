import {ObDateDMYParserFormatter} from 'oblique';

describe('DateDMYParserFormatter', () => {
	let pf: ObDateDMYParserFormatter;

	beforeEach(() => {
		pf = new ObDateDMYParserFormatter();
	});

	describe('parse()', () => {
		it('should parse null undefined and empty string as null', () => {
			expect(pf.parse(null)).toBeNull();
			expect(pf.parse(undefined)).toBeNull();
			expect(pf.parse('')).toBeNull();
			expect(pf.parse('   ')).toBeNull();
		});

		it('should parse valid date', () => {
			expect(pf.parse('12.05.2016')).toEqual({year: 2016, month: 5, day: 12});
		});

		it('should parse non-date as null', () => {
			expect(pf.parse('foo.bar.baz')).toBeNull();
			expect(pf.parse('bar.2014')).toBeNull();
			expect(pf.parse('15.12.11.2014')).toBeNull();
		});

		it('should do its best parsing incomplete dates', () => {
			expect(pf.parse('5.2011')).toEqual({year: 2011, month: 5, day: null});
		});
	});

	describe('format()', () => {
		it('should format null and undefined as an empty string', () => {
			expect(pf.format(null)).toBe('');
			expect(pf.format(undefined)).toBe('');
		});

		it('should format a valid date', () => {
			expect(pf.format({year: 2016, month: 10, day: 15})).toBe('15.10.2016');
		});

		it('should format a valid date with padding', () => {
			expect(pf.format({year: 2016, month: 10, day: 5})).toBe('05.10.2016');
		});

		it('should try its best with invalid dates', () => {
			expect(pf.format({year: 2016, month: NaN, day: undefined})).toBe('..2016');
			expect(pf.format({year: 2016, month: null, day: 0})).toBe('00..2016');
		});
	});
});
