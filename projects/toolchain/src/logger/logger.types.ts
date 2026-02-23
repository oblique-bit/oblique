/* eslint @typescript-eslint/method-signature-style: ["error", "method"] */
// Reason: These interfaces are implemented by a class, method style reflects actual runtime behavior and offers better IDE support
// Since the rule applies to the whole file, the interfaces needed to be extracted to its own file
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

	/**
	 * Starts a top-level log group.
	 *
	 * Logs the group message at the info level immediately, then returns an {@link ObGroupLogger} instance
	 * for writing messages within the group. All messages logged via the returned logger will be indented
	 * under this top-level group.
	 *
	 * A log group must be closed by calling {@link ObGroupLogger#end|end()}.
	 *
	 * @param message - The title of the log group.
	 * @returns A new {@link ObGroupLogger} for writing messages in the group.
	 */
	group(message: string): ObGroupLogger;
}

/**
 * Represents a group logger that extends {@link ObLogger}.
 *
 * All messages within the group share the same indentation.
 * This is the public type for loggers returned by {@link ObLogger#group|ObLogger.group()}
 * and {@link ObGroupLogger#group|ObGroupLogger.group()}.
 */
export interface ObGroupLogger extends ObLogger {
	/**
	 * Starts a nested log group within the current group.
	 *
	 * Closes any currently active step in this group, then logs the nested group message at the info level immediately.
	 * Returns a new {@link ObGroupLogger} instance with increased indentation for the nested group.
	 *
	 * The nested group must be closed by calling {@link ObGroupLogger#end|end()}.
	 *
	 * @param message - The title of the nested log group.
	 * @returns A new {@link ObGroupLogger} for the nested group.
	 */
	group(message: string): ObGroupLogger;

	/**
	 * Starts a new step within the group, logging an info message.
	 *
	 * If a previous step is active, it is automatically completed with a success message including duration.
	 *
	 * @param message - Description of the step.
	 * @returns void
	 */
	step(message: string): void;

	/**
	 * Marks the current step as failed, logging an error message with duration
	 *
	 * If no message is provided, the last tracked step message is used.
	 *
	 * @param message - Optional step message. Defaults to the current step.
	 * @returns void
	 */
	stepError(message?: string): void;

	/**
	 * Ends the group, logging a summary message with duration.
	 *
	 * Automatically closes any active step. The summary is logged
	 * as success if no step failed, or as error if any step failed.
	 *
	 * @param message - Optional group name to display. Defaults to the current group name.
	 * @returns void
	 */
	end(message?: string): void;
}
