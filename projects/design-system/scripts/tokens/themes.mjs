import {execSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {rmSync, renameSync} from 'node:fs';

const remote = 'github';

export function getThemes(themesPath) {
	removeRemote(remote);
	addRemote(remote, 'https://github.com/oblique-bit/oblique.git');
	fetchRemote(remote);
	checkoutFolder(themesPath, 'tokens-main', remote);
	return listThemeFiles(themesPath);
}

function removeRemote(remoteName) {
	try {
		execSync(`git remote remove ${remoteName}`);
	} catch {
		// nothing to do, it simply means that the remote didn't exist
	}
}

function addRemote(remoteName, url) {
	execSync(`git remote add ${remoteName} ${url}`);
}

function fetchRemote(remoteName) {
	execSync(`git fetch ${remoteName}`);
}

function checkoutFolder(folder, branch, origin = 'origin') {
	rmSync(folder, {recursive: true, force: true});
	renameSync('../../.husky/post-checkout', '../../.husky/post-checkout.bak'); // disable husky hook
	execSync(`git checkout ${origin}/${branch} -- ${folder}`);
	execSync(`git rm -r --cached ${folder}`);
	renameSync('../../.husky/post-checkout.bak', '../../.husky/post-checkout'); // re-enable husky hook
}

function listThemeFiles(sourceFolder) {
	return JSON.parse(readFileSync(`${sourceFolder}/$metadata.json`).toString('utf-8'))
		.tokenSetOrder.filter(path => !path.includes('NO-DS'))
		.map(path => `${sourceFolder}/${path}.json`);
}
