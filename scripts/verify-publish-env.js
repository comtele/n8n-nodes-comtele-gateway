const inGitHubActions = process.env.GITHUB_ACTIONS === 'true';

if (!inGitHubActions) {
	console.error('Publishing is only allowed from GitHub Actions to guarantee npm provenance.');
	console.error('Create a version tag (vX.Y.Z) and let .github/workflows/publish.yml publish the package.');
	process.exit(1);
}
