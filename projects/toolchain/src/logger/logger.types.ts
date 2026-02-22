/* eslint @typescript-eslint/method-signature-style: ["error", "method"] */
// Reason: This interface is implemented by a class, method style reflects actual runtime behavior and offers better IDE support
// Since the rule applies to the whole file, the interface needed to be extracted to its own file
/**
 * Represents a logger for structured, formatted logging with:
 * - Level-based message formatting
 * - Symbol and label prefixes
 * - Consistent label alignment
 * - Colorized output via `chalk`
 *
 * This is the public type for loggers created by factories like {@link obCreateLogger|obCreateLogger()}
 * or {@link obCreateSchematicsLogger|obCreateSchematicsLogger()}. Consumers should not instantiate a logger directly.
 */
export interface ObLogger {
	/**
	 * Logs an informational message.
	 * @param message - The message to log.
	 * @returns void
	 */
	info(message: string): void;

	/**
	 * Logs a successful operation message.
	 * @param message - The success message to log.
	 * @returns void
	 */
	success(message: string): void;

	/**
	 * Logs a warning message.
	 * @param message - The warning message to log.
	 * @returns void
	 */
	warn(message: string): void;

	/**
	 * Logs an error message.
	 * @param message - The error message to log.
	 * @returns void
	 */
	error(message: string): void;

	/**
	 * Logs a raw message without any formatting.
	 * Typically used for blocks of text or command output.
	 * @param message - The raw message to log.
	 * @returns void
	 */
	raw(message: string): void;
}
