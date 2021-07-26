export class JsonHandler {

	/**
	 * Add a record to a database object and return its string
	 * @param databaseObj The database object in TypeScript object form.
	 * @param addData The data string that needs to be added to the record.
	 * @returns The string for the updated JSON record with addData appended
	*/
	public returnAppendedJSONStr(databaseObj: any, addData: string) {
		let dataStr = '{';

		//Loop through database object
		for (const Id of Object.keys(databaseObj)) {
			const dataEntry = "\n" +"\"" + Id + "\": " +
				JSON.stringify(databaseObj[Id]) + ", \n";
			dataStr += dataEntry;
		}

		dataStr += addData +
			'\n' +
			'}';

		return dataStr;
	}

	/**
	 * Remove a record from a database object and return its string.
	 * @param databaseObj The database object in TypeScript object form.
	 * @param removeId The id of the record that needs to be removed.
	 * @returns The string for the updated JSON record with removeId's record removed
	 */
	public returnRemovedJSONStr(databaseObj: any, removeId: string) {
		delete databaseObj[removeId];
		let dataStr = '{'
		const recordLength = Object.keys(databaseObj).length;
		let count = 0;

		//Loop through database object
		for (const Id of Object.keys(databaseObj)) {
			count++;
			const dataEntry = "\n" +"\"" + Id + "\": " +
				JSON.stringify(databaseObj[Id]);
			dataStr += dataEntry
			//check if record needs a comma;
			if (count < recordLength) {
				dataStr += ", \n";
			} else {
				dataStr += "\n";
			}
		}

		dataStr += '}';

		return dataStr;
	}

	/**
	 * Read a JSON file from a filepath.
	 * @param databaseFilePath The filepath of the JSON object.
	 */
	public readJSON(databaseFilePath: string) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const fs = require('fs');

		fs.readFile(databaseFilePath, 'utf8', (err: any, jsonStr: any) => {
			if (err) {
				console.log("File read failed: ", err)
				return
			}
			console.log("File Data: ", jsonStr)
		})
	}

	/**
	 * write to JSON file with data that needs to be stringified
	 * @param databaseFilePath The filepath of the JSON object to be written.
	 * @param data The data that needs to be stringified and written to a JSON.
	 */
	public writeJSON(databaseFilePath: string, data: any) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const fs = require('fs');
		const jsonStr = JSON.stringify(data);

		fs.writeFile(databaseFilePath, jsonStr, (err: any) => {
			if (err) {
				console.log('Error writing file', err)
			} else {
				console.log('Successfully wrote file')
			}
		})
	}

	/**
	 * Write to a JSON file with a string.
	 * @param databaseFilePath The filepath of the JSON object to be written.
	 * @param data The data in string form that needs to be written to a JSON.
	 */
	public writeJSONStr(databaseFilePath: string, data: string) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const fs = require('fs');

		fs.writeFile(databaseFilePath, data, (err: any) => {
			if (err) {
				console.log('Error writing file', err)
			} else {
				console.log('Successfully wrote file')
			}
		})
	}

	/**
	 * Wipes a JSON file clean.
	 * @param databaseFilePath The filepath of the JSON object.
	 */
	public cleanJSON(databaseFilePath: string) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const fs = require('fs');

		fs.writeFile(databaseFilePath, "{ }", (err: any) => {
			if (err) {
				console.log('Error writing file', err)
			} else {
				console.log('Successfully cleaned JSON')
			}
		})
	}
}
