import TokenConfigHelper from "./helper.js";

export default class ContextMenuHelper {
	static init() {
		libWrapper.register(
			"bugtoken",
			"ActorDirectory.prototype._getEntryContextOptions",
			function (wrapped, ...args) {
				const options = wrapped(...args);
				return ActorContextMenuHelper.appendPrototypeTokenMenuOption(options);
			},
			"WRAPPER"
		);
	}
}

class ActorContextMenuHelper {
	static appendPrototypeTokenMenuOption(options) {
		return [
			...options,
			{
				name: "Open Prototype Token Config",
				icon: '<i class="fas fa-user-circle"></i>',
				condition: (li) => {
					const actor = game.messages.get(li.data("actorId"));
					return game.user.isGM || actor.isOwner;
				},
				callback: (header) => {
					const actor = game.actors.get($(header).attr("data-document-id"));
					TokenConfigHelper.openPrototypeConfig(actor);
				},
			},
		];
	}
}
