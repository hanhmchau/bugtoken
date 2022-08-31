import TokenHelper from "./helper.js";
import ActorHelper, { partition } from "./actor-helper.js";

export default class ActorConfigImprovement {
	static init() {
		this.addSyncItemsButton();
		this.addSyncCollectionsFunction();
	}

	static addSyncItemsButton() {
		libWrapper.register(
			"bugtoken",
			"ActorSheet.prototype._getHeaderButtons",
			function (wrapped, ...args) {
				const buttons = wrapped(...args);
				const hasPermission = game.user.isGM || this.actor.isOwner;
				if (this.token && !this.token.data.actorLink && hasPermission) {
					buttons.unshift({
						label: "Update related tokens",
						class: "sync-other-tokens",
						icon: "fas fa-sync-alt",
						onclick: (ev) => {
							new Dialog({
								title: `Update related tokens`,
								content: `
									<div id="preview-sync-dialog">
										<h3 class="dialog-prompt">Update the source actor and other related tokens based on this token?</h3>
										<p>Name, current HP and effects will not be copied.</p>
										<p class="warning">This operation is not reversible!</p>
										</div>
									</div>
								   `,
								buttons: {
									update: {
										label: `Update`,
										callback: () => {
											const sourceActor = game.actors.get(this.actor.id);
											const object = this.actor.toObject();
											const updateData = object.data;
											delete updateData.attributes.hp.value;
											sourceActor.update({
												data: updateData
											});
											const [itemsToUpdate, itemsToCreate] = partition(object.items, item => sourceActor.data.items.has(item._id))
											sourceActor.updateEmbeddedDocuments("Item", itemsToUpdate);
											sourceActor.createEmbeddedDocuments("Item", itemsToCreate);
										},
									},
									cancel: {
										label: "Cancel",
									},
								},
							}).render(true);
						},
					});
				}
				return buttons;
			},
			"WRAPPER"
		);
	}

	static addSyncCollectionsFunction() {
		libWrapper.register(
			"bugtoken",
			"Actor.prototype._onEmbeddedDocumentChange",
			function (wrapped, embeddedName) {
				wrapped(embeddedName);

				for (let s of game.scenes) {
					const tokenDocs = s.tokens.filter((i) => i.actor?.id === this.id);
					const updates = tokenDocs.map((token) => {
						return {
							_id: token.id,
							"actorData.items": this.data.items.contents,
						};
					});
					s.updateEmbeddedDocuments("Token", updates);
				}
			},
			"WRAPPER"
		);
	}
}
