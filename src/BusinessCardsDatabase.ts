import { JsonHandler } from "./JsonHandler";

/**
 * The structure of the Business Card database.
 */
 type BusinessCardDatabase = {
	[key: string]: CardDescriptor;
};

type CardDescriptor = {
	card: BusinessCard;
}

export type BusinessCard = {
	name: string;
	occupation: string;
	organization: string;
	email: string;
	phone: string;
	location: string;
	message: string;
}

const fileName = '../public/businessCards.json'
const filePath = __dirname + '/' + fileName;

export class BusinessCardsDatabase {
	/* eslint-disable @typescript-eslint/no-var-requires */
	private BusinessCardDatabase: BusinessCardDatabase = require(fileName);
	
	constructor() {

	}

	public addBusinessCard(UserName: string, businessCard: BusinessCard) {
		const record: CardDescriptor = {
			card: businessCard
		}
		this.BusinessCardDatabase[UserName] = record;
		this.saveDatabase();
	}

	public hasBusinessCard(UserName: string) {
		const businessCard = this.BusinessCardDatabase[UserName];
		if (businessCard) {
			return businessCard;
		} else {
			return false;
		}
	}

	private saveDatabase() {
		const Handler: JsonHandler = new JsonHandler;

		Handler.writeJSON(filePath, this.BusinessCardDatabase);
	}
}
