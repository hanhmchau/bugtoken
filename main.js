import ContextMenuHelper from "./scripts/context-menu.js";
import TokenConfigImprovement from "./scripts/token-config.js";
import TokenHelper from "./scripts/helper.js";
import ActorConfigImprovement from "./scripts/actor-config.js";

Hooks.once("init", () => {
	ContextMenuHelper.init();
	TokenConfigImprovement.init();
	ActorConfigImprovement.init();
});

Hooks.on("renderTokenConfig", (app, html, data) => {
	if (data.isPrototype) {
		TokenHelper.updateButtonText($(html).find('.assign-token'), "Update all related tokens");
		TokenHelper.updateButtonText($(html).find('button[name=submit]'), "Update only prototype token");
	} else {
		const syncToPrototypeBtn = TokenHelper.buildButton("Update prototype and related tokens", "fas fa-user-circle").click((ev) => {
			app._onSubmit(ev).then((tokenData) => {
				TokenHelper.updatePrototypeToken(tokenData.actorId, foundry.utils.expandObject(tokenData));
				TokenHelper.updateRelatedTokens(tokenData.actorId, tokenData);
			});
		});
		$(html).find(".sheet-footer").prepend(syncToPrototypeBtn);
		TokenHelper.updateButtonText($(html).find('button[name=submit]'), "Update only this token");
	}
});
