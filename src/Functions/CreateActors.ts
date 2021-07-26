import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import App from '../app';

/**
 * Creates a default button mesh.
 * @param app The app the function is running on
 * @returns 
 */
export function ButtonMesh(app: App, width: number, height: number, depth: number) {
	const buttonMesh: MRE.Mesh = app.assetContainer.createBoxMesh('menuButton', width, height, depth);
	return buttonMesh
}

/**
 * Creates an actor from a mesh.
 * @param app The app the function is running on.
 * @param name The name of the actor.
 * @param mesh The mesh for the actor.
 * @param position The x, y, and z coordinates of the actor.
 * @param user (Optional) User that the actor is exclusive to.
 */
export function CreateActorFromMesh(app: App, name: string, mesh: MRE.Mesh, 
	position: MRE.Vector3Like, user? : MRE.User) {
	const actorLike: Partial<MRE.ActorLike> = {
		name: name,
		appearance: {
			meshId: mesh.id
		},
		transform: {
			local: {
				position: position
			}
		},
		collider: { geometry: { shape: MRE.ColliderType.Auto} }
	}
	if (user) {
		actorLike.exclusiveToUser = user.id;
	}
	const actor = MRE.Actor.Create(app.context, {
		actor: actorLike
	});

	return actor;
}

export function CreateLabel(app: App, name: string, parent: MRE.Guid, text: string, 
	position: MRE.Vector3Like, user?: MRE.User) {
	const actorLike: Partial<MRE.ActorLike> = {
		name: name,
		parentId: parent,
		transform: {
			local: {
				position: position
			}
		},
		text: {
			contents: text,
			height: 0.2,
			anchor: MRE.TextAnchorLocation.MiddleLeft
		}
	}

	if (user) {
		actorLike.exclusiveToUser = user.id;
	}

	const label = MRE.Actor.Create(app.context, {
		actor: actorLike
	});

	return label;
}
