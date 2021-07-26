import * as MRE from "@microsoft/mixed-reality-extension-sdk";

/**
 * Displays an OK/Cancel prompt to the user in an asynchronous manner.
 * @param user The user being prompted.
 * @param message The message displayed on the prompt.
 * @returns Boolean for if OK button is pressed.
 */
export async function AsyncOKCancelPrompt(user: MRE.User, message: string) {
	let okPressed = false;

	await user.prompt(message)
			.then(res => {
				okPressed = res.submitted;
			})
			.catch(err => {
				console.error(err);
				okPressed = false;
			});

	return okPressed;
}

/**
 * Displays a user input prompt to the user in an asynchronous manner.
 * @param user The user being prompted.
 * @param message The message displayed on the prompt.
 * @returns The user's input.
 */
export async function AsyncTextInputPrompt(user: MRE.User, message: string) {
	let userInput: string = null;

	await user.prompt(message, true)
			.then(res => {
				if (res.submitted) {
					userInput = res.text;
				}
			})
			.catch(err => {
				console.error(err);
				userInput = null;
			});

	return userInput;
}
