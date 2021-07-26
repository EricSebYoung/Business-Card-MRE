import * as MRE from "@microsoft/mixed-reality-extension-sdk";
import App from "../app";
import { BusinessCard } from "../BusinessCardsDatabase";
import { ButtonMesh, CreateActorFromMesh } from "../Functions/CreateActors";
import { SendEmail } from "../Functions/SendEmail";
import { AsyncOKCancelPrompt, AsyncTextInputPrompt } from "../Functions/UserPrompts";

export class UserBusinessCard {
	private _businessCard: BusinessCard;

	public get Name() { return this._businessCard.name; }
	public set Name(name: string) { this._businessCard.name = name; }
	public get Occupation() { return this._businessCard.occupation; }
	public set Occupation(occupation: string) { this._businessCard.occupation = occupation; }
	public get Organization() { return this._businessCard.organization; }
	public set Organization(organization: string) { this._businessCard.organization = organization; }
	public get Email() { return this._businessCard.email; }
	public set Email(email: string) { this._businessCard.email = email; }
	public get Phone() { return this._businessCard.phone; }
	public set Phone(phone: string) { this._businessCard.phone = phone; }
	public get Location() { return this._businessCard.location; }
	public set Location(location: string) { this._businessCard.location = location; }
	public get Message() { return this._businessCard.message; }
	public set Message(message: string) { this._businessCard.message = message; }

	public get BusinessCard() { return this._businessCard; }

	private button: MRE.Actor;
	private attachPoint: MRE.AttachPoint = 'spine-middle';

	constructor(private app: App, private user: MRE.User) {
		this._businessCard = {
			name: "",
			occupation: "",
			organization: "",
			email: "",
			phone: "",
			location: "",
			message: ""
		};
		this.Name = "blank";
	}

	public async createNewBusinessCard() {
		await this.promptForName();
		await this.promptForOccupation();
		await this.promptForOrganization();
		await this.promptForEmail();
		await this.promptForPhone();
		await this.promptForLocation();
		await this.promptForMessage();
		console.log("Created: " + this._businessCard);
		this.createButton();
	}

	public loadBusinessCard(businessCard: BusinessCard) {
		this._businessCard = businessCard;
		console.log("Loaded: " + this._businessCard);
		if(!this.button){
			this.createButton();
		}
	}

	private createButton() {
		const mesh = ButtonMesh(this.app, 0.1, 0.1, 0.01);
		const position = { x: -.05, y: 0.05, z: 0.1 } 
		this.button = CreateActorFromMesh(this.app, this.user.name + "Card", mesh, position); 
		this.button.attach(this.user, this.attachPoint);
		const buttonBehavior = this.button.setBehavior(MRE.ButtonBehavior);
		buttonBehavior.onClick(userBehavior => this.showBusinessCard(userBehavior))
	}

	private async showBusinessCard(user: MRE.User) {
		const messageForEmail = "Name: " + this.Name + "\n" +
		"Occupation: " + this.Occupation + "\n" +
		"Organization: " + this.Organization + "\n" +
		"E-mail: " + this.Email + "\n" +
		"Phone: " + this.Phone + "\n" +
		"Location: " + this.Location + "\n" +
		"Message: " + this.Message + "\n";
		const messageForPrompt = 
			"\n" + "(Press OK if you want to be e-mailed this information or Cancel to exit.)"

		const okPressed = await AsyncOKCancelPrompt(user, messageForEmail + messageForPrompt);

		if (okPressed) {
			this.emailBusinessCard(user, messageForEmail);
		}
	}

	private async emailBusinessCard(user: MRE.User, emailMessage: string) {
		const message = "Please enter your e-mail then press OK."
		const email = await AsyncTextInputPrompt(user, message);
		const subject = this.user.name + " Contact Info";
		SendEmail(email, subject, emailMessage);
		return email;
	}

	public async promptForName() {
		let success = true;
		const message = "Enter your name"
		const input = await AsyncTextInputPrompt(this.user, message);
		if (input !== null) {
			this.Name = input;
		} else {
			success = false;
		}
		return success;
	}

	public async promptForOccupation() {
		let success = true;
		const message = "Enter your occupation"
		const input = await AsyncTextInputPrompt(this.user, message);
		if (input !== null) {
			this.Occupation = input;
		} else {
			success = false;
		}
		return success;
	}

	public async promptForOrganization() {
		let success = true;
		const message = "Enter the name of your organization"
		const input = await AsyncTextInputPrompt(this.user, message);
		if (input !== null) {
			this.Organization = input;
		} else {
			success = false;
		}
		return success;
	}

	public async promptForEmail() {
		let success = true;
		const message = "Enter your e-mail address"
		const input = await AsyncTextInputPrompt(this.user, message);
		if (input !== null) {
			this.Email = input;
		} else {
			success = false;
		}
		return success;
	}

	public async promptForPhone() {
		let success = true;
		const message = "Enter your phone number"
		const input = await AsyncTextInputPrompt(this.user, message);
		if (input !== null) {
			this.Phone = input;
		} else {
			success = false;
		}
		return success;
	}

	public async promptForLocation() {
		let success = true;
		const message = "Enter your location"
		const input = await AsyncTextInputPrompt(this.user, message);
		if (input !== null) {
			this.Location = input;
		} else {
			success = false;
		}
		return success;
	}

	public async promptForMessage() {
		let success = true;
		const message = "Enter a short message you'd like to include"
		const input = await AsyncTextInputPrompt(this.user, message);
		if (input !== null) {
			this.Message = input;
		} else {
			success = false;
		}
		return success;
	}

	public syncFix() {
		this.button.detach();
		this.button.attach(this.user, this.attachPoint);
	}
}
