export default class TokenHelper {
	static openPrototypeConfig(entity) {
		new CONFIG.Token.prototypeSheetClass(entity).render(true);
	}

	static buildButton(text, icon, type = "button") {
		return $(`<button type='${type}'/>`)
			.text(text)
			.prepend($(`<i class='${icon}' />`));
	}

	static updateButtonText(button, newText) {
		button
			.contents()
			.filter(function () {
				return this.nodeType == Node.TEXT_NODE;
			})
			.each(function () {
				this.textContent = newText;
			});
	}

	static updatePrototypeToken(actorId, tokenData) {
		const actor = game.actors.get(actorId);
		actor.update({ token: tokenData });
	}

	static updateRelatedTokens(actorId, tokenData) {
		const actor = game.actors.get(actorId);
		actor.getActiveTokens();

		for (let s of game.scenes) {
			const tokenDocs = s.tokens.filter((i) => i.actor?.id === actorId);
			const updates = tokenDocs.map((i) => {
				const { x, y, _id } = i.data;
				const upd = foundry.utils.duplicate(tokenData);
				return foundry.utils.mergeObject(upd, { x, y, _id });
			});
			s.updateEmbeddedDocuments("Token", updates);
		}
	}

	static getAllTokens(actorId) {
		return game.scenes.map((scene) => scene.tokens.filter((i) => i.actor?.id === actorId)).flat();
	}
}