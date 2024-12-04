export const updateDescriptions = {
	summaryText: 'Updates Oblique and runs the migration.'
};

export interface PackageDependencies {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
}
