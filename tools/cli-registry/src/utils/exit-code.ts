/** Process exit codes used by the obreg commands. */
export const exitCode = {
	/** The command ran successfully. */
	success: 0,
	/** The command failed or was unknown. */
	failure: 1,
} as const;

/** A process exit code returned by a command handler. */
export type ExitCode = (typeof exitCode)[keyof typeof exitCode];
