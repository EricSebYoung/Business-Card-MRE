import * as MRE from "@microsoft/mixed-reality-extension-sdk";
import App from "../app";
import { BusinessCardMenu } from "./BusinessCardMenu";
import { BusinessCard, BusinessCardsDatabase } from "../BusinessCardsDatabase";
import { ButtonMesh, CreateActorFromMesh, CreateLabel } from "../Functions/CreateActors";
import { UserBusinessCard } from "./UserBusinessCard";

export class BusinessCardsHandler {
	private BusinessCardsDatabase: BusinessCardsDatabase;

	private UserBusinessCardMap = new Map<MRE.Guid, UserBusinessCard>();
	private BusinessCardMenuMap = new Map<MRE.Guid, BusinessCardMenu>();

	private button: MRE.Actor;
	private label: MRE.Actor;
	private buttonMesh: MRE.Mesh;
	private currentlyEditingList: string[] = []


	constructor(private app: App) {
		this.BusinessCardsDatabase = new BusinessCardsDatabase();
		
		const buttonWidth = 0.25;
		const buttonHeight = 0.25;
		this.buttonMesh = ButtonMesh(this.app, buttonWidth, buttonHeight, 0.01);

		this.createButton();
	}

	private createButton() {

		const positionButton: MRE.Vector3Like = {
			x: 0,
			y: 0,
			z: -0.05
		}
		this.button = CreateActorFromMesh(this.app, "CreateEditCard", this.buttonMesh, positionButton); 

		const positionLabel: MRE.Vector3Like = {
			x: 0.15,
			y: 0,
			z: 0
		}
		this.label = CreateLabel(this.app, "CreateEditCardLabel", this.button.id, 
			"Get/Edit Business Card", positionLabel);

		this.button.appearance.enabled = new MRE.InvertedGroupMask(this.app.context, ['editing']);
		this.label.appearance.enabled = new MRE.InvertedGroupMask(this.app.context, ['editing']);

		const buttonBehavior = this.button.setBehavior(MRE.ButtonBehavior);
		const handler: MRE.ActionHandler<MRE.ButtonEventData> = userBehavior => this.buttonPressed(userBehavior);
		buttonBehavior.onClick(handler);
	}

	private async addBusinessCard(user: MRE.User) {
		const businessCard = new UserBusinessCard(this.app, user);
		this.UserBusinessCardMap.set(user.id, businessCard);
		await businessCard.createNewBusinessCard();
		this.saveCardToDatabase(user, businessCard.BusinessCard);
	}

	private loadBusinessCard(user: MRE.User, existingCard: BusinessCard) {
		const businessCard = new UserBusinessCard(this.app, user);
		this.UserBusinessCardMap.set(user.id, businessCard);
		businessCard.loadBusinessCard(existingCard);
	}

	private createBusinessCardMenu(user: MRE.User) {
		const userBusinessCard: UserBusinessCard = this.UserBusinessCardMap.get(user.id);
		const businessCardMenu = new BusinessCardMenu(this.app, user, userBusinessCard);
		this.BusinessCardMenuMap.set(user.id, businessCardMenu);
		this.BusinessCardMenuMap.get(user.id).showMenu();
	}

	public updateBusinessCard(user: MRE.User, updatedBusinessCard: BusinessCard) {
		const userBusinessCard: UserBusinessCard = this.UserBusinessCardMap.get(user.id);
		userBusinessCard.loadBusinessCard(updatedBusinessCard);
	}

	private cleanUserBusinessCard(user: MRE.User) {
		this.UserBusinessCardMap.delete(user.id);
	}

	public cleanBusinessCardMenu(user: MRE.User) {
		if (this.BusinessCardMenuMap.has(user.id)) { 
			this.BusinessCardMenuMap.get(user.id).cleanup(); 
		}
		this.BusinessCardMenuMap.delete(user.id);
	}

	public saveCardToDatabase(user: MRE.User, businessCard: BusinessCard) {
		this.BusinessCardsDatabase.addBusinessCard(user.name, businessCard);
	}

	private async buttonPressed(user: MRE.User) {
		const existingCard = this.BusinessCardsDatabase.hasBusinessCard(user.name);

		if (existingCard) {
			this.createBusinessCardMenu(user);
		} else {
			await this.addBusinessCard(user);
			this.createBusinessCardMenu(user);
		}

		user.groups.add("Editing");
	}

	public startup(user: MRE.User) {
		const existingCard = this.BusinessCardsDatabase.hasBusinessCard(user.name);

		if (existingCard) {
			this.loadBusinessCard(user, existingCard.card);
		}
	}

	public cleanup(user: MRE.User) {
		this.cleanUserBusinessCard(user);
		this.cleanBusinessCardMenu(user);

	}

	public syncFix() {
		for (const user of this.UserBusinessCardMap.keys()) {
			this.UserBusinessCardMap.get(user).syncFix();
		}
	}
}
