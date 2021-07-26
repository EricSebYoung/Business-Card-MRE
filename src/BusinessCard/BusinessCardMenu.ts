import * as MRE from "@microsoft/mixed-reality-extension-sdk";
import App from "../app";
import { ButtonMesh, CreateActorFromMesh, CreateLabel } from "../Functions/CreateActors";
import { UserBusinessCard } from "./UserBusinessCard";

const pageSize = 8;
const buttonSpacing = 2 / (pageSize + 1);
const buttonWidth = 0.25;
const buttonHeight = buttonSpacing * 0.8;

export class BusinessCardMenu {
	private MenuMap = new Map<string, MRE.Actor>();
	private buttonMesh: MRE.Mesh;
	private counter = 0;

	constructor(private app: App, private user: MRE.User, private businessCard: UserBusinessCard) {
		
	}

	public showMenu() {
		if (!this.buttonMesh) {
			this.buttonMesh = ButtonMesh(this.app, buttonWidth, buttonHeight, 0.01);
		}
		const name = this.createOption("name", "Name: " + this.businessCard.Name);
		const occupation = this.createOption("occupation", "Occupation: " + this.businessCard.Occupation);
		const organization = this.createOption("organization", "Organization: " + this.businessCard.Organization);
		const email = this.createOption("email", "E-Mail: " + this.businessCard.Email);
		const phone = this.createOption("phone", "Phone: " + this.businessCard.Phone);
		const location = this.createOption("location", "Location: " + this.businessCard.Location);
		const message = this.createOption("message", "Message: " + this.businessCard.Message);
		const finalize = this.createOption("finalize", "Finalize Card");

		const nameHandler: MRE.ActionHandler<MRE.ButtonEventData> = userBehavior => this.nameButton()
		const occupationHandler: MRE.ActionHandler<MRE.ButtonEventData> = userBehavior => this.occupationButton()
		const organizationHandler: MRE.ActionHandler<MRE.ButtonEventData> = userBehavior => this.organizationButton()
		const emailHandler: MRE.ActionHandler<MRE.ButtonEventData> = userBehavior => this.emailButton()
		const phoneHandler: MRE.ActionHandler<MRE.ButtonEventData> = userBehavior => this.phoneButton()
		const locationHandler: MRE.ActionHandler<MRE.ButtonEventData> = userBehavior => this.locationButton()
		const messageHandler: MRE.ActionHandler<MRE.ButtonEventData> = userBehavior => this.messageButton()
		const finalizeHandler: MRE.ActionHandler<MRE.ButtonEventData> = userBehavior => this.finalizeButton()

		this.setBehavior(name, nameHandler);
		this.setBehavior(occupation, occupationHandler);
		this.setBehavior(organization, organizationHandler);
		this.setBehavior(email, emailHandler);
		this.setBehavior(phone, phoneHandler);
		this.setBehavior(location, locationHandler);
		this.setBehavior(message, messageHandler);
		this.setBehavior(finalize, finalizeHandler);
	}

	private createOption(name: string, labelText: string) {
		const button = this.createButton(name + "Button");
		this.createLabel(name + "Label", button.id, labelText);
		this.counter++;

		return button;
	}

	private createButton(name: string) {
		const position: MRE.Vector3Like = {
			x: -1 + buttonWidth / 2,
			y: buttonSpacing / 2 + buttonSpacing * (pageSize - this.counter),
			z: -0.05
		}
		const button = CreateActorFromMesh(this.app, name, this.buttonMesh, position, this.user); 
		this.MenuMap.set(name, button);
		return button;
	}

	private createLabel(name: string, parent: MRE.Guid, labelText: string) {
		const position: MRE.Vector3Like = {
			x: buttonWidth * 0.8, 
			y: 0,
			z: 0.05
		}
		const label = CreateLabel(this.app, name, parent, labelText, position, this.user);
		this.MenuMap.set(name, label);
	}

	private setBehavior(button: MRE.Actor, handler: MRE.ActionHandler<MRE.ButtonEventData>) {

		const buttonBehavior = button.setBehavior(MRE.ButtonBehavior);
		buttonBehavior.onClick(handler);
	}

	private changeLabel(name: string, labelText: string) {
		this.MenuMap.get(name + "Label").text.contents = labelText;
	}

	private async nameButton() {
		const success = await this.businessCard.promptForName();
		if (success) {
			this.changeLabel("name", "Name: " + this.businessCard.Name)
		}
	}

	private async occupationButton() {
		const success = await this.businessCard.promptForOccupation();
		if (success) {
			this.changeLabel("occupation", "Occupation: " + this.businessCard.Occupation)
		}
	}

	private async organizationButton() {
		const success = await this.businessCard.promptForOrganization();
		if (success) {
			this.changeLabel("organization", "Organization: " + this.businessCard.Organization)
		}
	}

	private async emailButton() {
		const success = await this.businessCard.promptForEmail();
		if (success) {
			this.changeLabel("email", "Email: " + this.businessCard.Email)
		}
	}

	private async phoneButton() {
		const success = await this.businessCard.promptForPhone();
		if (success) {
			this.changeLabel("phone", "Phone: " + this.businessCard.Phone)
		}
	}

	private async locationButton() {
		const success = await this.businessCard.promptForLocation();
		if (success) {
			this.changeLabel("location", "Location: " + this.businessCard.Location)
		}
	}

	private async messageButton() {
		const success = await this.businessCard.promptForMessage();
		if (success) {
			this.changeLabel("message", "Message: " + this.businessCard.Message)
		}
	}

	private finalizeButton() {
		const finalizedCard = this.businessCard.BusinessCard;
		this.app.BusinessCardHandler.saveCardToDatabase(this.user, finalizedCard);
		this.app.BusinessCardHandler.updateBusinessCard(this.user, finalizedCard);
		this.app.BusinessCardHandler.cleanBusinessCardMenu(this.user);

		this.user.groups.delete("Editing");
	}

	private destroyActors() {
		for(const actorName of this.MenuMap.keys()) {
			this.MenuMap.get(actorName).destroy();
			this.MenuMap.delete(actorName);
		}
	}

	public cleanup() {
		this.destroyActors();
	}
}
