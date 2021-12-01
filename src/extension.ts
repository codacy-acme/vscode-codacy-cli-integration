import { config } from 'process';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const diagnosticCollection = vscode.languages.createDiagnosticCollection('codacy-cli');
	console.log('Congratulations, your extension "codacy-cli-integration" is now active!');

	let disposable = vscode.commands.registerCommand('codacy-cli-integration.runCodacyCli', () => {
		vscode.window.showInformationMessage('Codacy CLI has been launched!');


		if (vscode.workspace.workspaceFolders !== undefined && vscode.workspace.workspaceFolders.length > 0) {
			let configuration = vscode.workspace.getConfiguration("codacy-cli");
			const env: any = { env: { ...process.env } };
			let additionalParameters = [];
			let diagnosticMap: Map<string, vscode.Diagnostic[]> = new Map();

			//if user has api-token, it also needs to have 'provider', 'username' and 'project'
			if (configuration.has('api-token')) {
				if (configuration.has('provider') && configuration.has('username') && configuration.has('project')) {
					env.env['CODACY_API_TOKEN'] = configuration.get('api-token');
					additionalParameters.push(`--provider ${configuration.get('provider')}`);
					additionalParameters.push(`--username ${configuration.get('username')}`);
					additionalParameters.push(`--project ${configuration.get('project')}`);
				} else {
					vscode.window.showErrorMessage('You have an api-token but no provider, username or project so CLI will not consider the token');
				}
			} else if (configuration.has('project-token')) {
				env.env['CODACY_PROJECT_TOKEN'] = configuration.get('project-token');
			}

			if (configuration.has('codacy-api-base-url')) {
				env.env['env.CODACY_API_BASE_URL'] = configuration.get('codacy-api-base-url');
			}

			if (configuration.has('tool')) {
				additionalParameters.push(`--tool ${configuration.get('tool')}`);
			}

			if (configuration.has('ssl-verification') && configuration.get('ssl-verification') === 'true') {
				additionalParameters.push('--skip-ssl-verification');
			}

			for (let i = 0; i < vscode.workspace.workspaceFolders.length; i++) {
				let workspaceFolder = vscode.workspace.workspaceFolders[i].uri.path;
				workspaceFolder += workspaceFolder.slice(-1) === '/' ? '' : '/' //Ensure that there is a trailing slash on Macs. Should probably pull into a separate method and test

				env.env['CODACY_CODE'] = workspaceFolder;
				const dockerCommand = `docker run --rm=true --env CODACY_CODE="$CODACY_CODE" 	--volume /var/run/docker.sock:/var/run/docker.sock --volume "$CODACY_CODE":"$CODACY_CODE" --volume /tmp:/tmp codacy/codacy-analysis-cli analyze --format sarif ${additionalParameters.join(' ')}`;
				const cp = require('child_process');
				cp.exec(
					dockerCommand,
					env,
					(err: any, stdout: string, stderr: string) => {
						if (err && err.code !== 102) {
							vscode.window.showErrorMessage(`Codacy CLI failed due to ${err.message}`);
							console.log('error: ' + err);
							return;
						}
						let sarifReport = JSON.parse(stdout);

						sarifReport.runs.forEach((run: any) => {
							run.results.forEach((issue: any) => {
								let canonicalFile = workspaceFolder + issue.locations[0].physicalLocation.artifactLocation.uri.replace(run.invocations[0].workingDirectory.uri, '');
								let diagnostics = diagnosticMap.get(canonicalFile);
								if (!diagnostics) { diagnostics = []; }
								let line = issue.locations[0].physicalLocation.region.startLine - 1;
								let column = issue.locations[0].physicalLocation.region.startColumn;
								const range = new vscode.Range(line, column, line, column + 1);
								const diagnostic = new vscode.Diagnostic(range, issue.message.text, vscode.DiagnosticSeverity.Information);
								diagnostic.code = issue.ruleId;
								diagnostics.push(diagnostic);
								diagnosticMap.set(canonicalFile, diagnostics);
							});

						});
						diagnosticCollection.clear();
						diagnosticMap.forEach((diags, file) => {
							diagnosticCollection.set(vscode.Uri.parse(file), diags);
						});
					});
			}


		} else {
			vscode.window.showErrorMessage('There are no workspaces to analyze!');
			return;
		}




	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(diagnosticCollection);
}

// this method is called when your extension is deactivated
export function deactivate() { }
