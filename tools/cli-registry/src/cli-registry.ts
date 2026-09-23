import {printEnv} from './commands/env.js';
import {startRegistry} from './commands/start.js';
import {type ExitCode, exitCode} from './utils/exit-code.js';

/** A registered command: its name, a short description, and the handler returning the exit code. */
interface Command {
	name: string;
	description: string;
	run: () => Promise<ExitCode>;
}

/** The commands available on the obreg binary, keyed by name. */
const commands: Record<string, Command> = {
	start: {
		name: 'start',
		description: 'Starts the local Verdaccio registry and keeps it in the foreground',
		run: async () => {
			await startRegistry();
			return exitCode.success;
		},
	},
	env: {
		name: 'env',
		description: 'Prints the npm registry environment exports for the detected shell',
		run: printEnv,
	},
};

/** Prints the usage line listing the registered commands. */
function printUsage(): void {
	const commandList = Object.values(commands)
		.map(command => `  ${command.name}  ${command.description}`)
		.join('\n');
	console.error(`Usage: obreg <command>\n\nCommands:\n${commandList}`);
}

const commandArgumentIndex = 2;

function getRegisteredCommand(): Command {
	const command = process.argv.at(commandArgumentIndex);
	const registered = command === undefined ? undefined : commands[command];
	if (registered) {
		return registered;
	}
	if (command !== undefined) {
		console.error(`Unknown command: ${command}\n`);
	}
	printUsage();
	process.exit(exitCode.failure);
}

process.exitCode = await getRegisteredCommand().run();
