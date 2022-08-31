import TokenHelper from "./helper.js";

export default class TokenConfigImprovement {
	static init() {
		this.addConvenientPrototypeButton();
		this.addUpdateAllFromPrototypeFunction();
	}

	static addConvenientPrototypeButton() {
		libWrapper.register(
			"bugtoken",
			"TokenConfig.prototype._getHeaderButtons",
			function (wrapped, ...args) {
				const buttons = wrapped(...args);
				if (this.options.sheetConfig && this.object.isOwner) {
					buttons.unshift({
						label: "Prototype",
						class: "configure-prototype",
						icon: "fas fa-user-circle",
						onclick: (ev) => {
							const actor = game.actors.get(this.object.data.actorId);
							TokenHelper.openPrototypeConfig(actor);
						},
					});
				}
				return buttons;
			},
			"WRAPPER"
		);
	}

	static addUpdateAllFromPrototypeFunction() {
		libWrapper.register(
			"bugtoken",
			"TokenConfig.prototype._onAssignToken",
			function (...args) {
				const app = this;
				const ev = args[0];
				app._onSubmit(ev).then((tokenData) => {
					TokenHelper.updateRelatedTokens(app.object.id, tokenData);
				});
			},
			"OVERRIDE"
		);
	}
}
