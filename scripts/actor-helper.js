export default class ActorHelper {
	static getSourceActor(token) {
		return game.actors.get();
	}
}

export const partition = (arr, fn) =>
	arr.reduce(
		(acc, val, i, arr) => {
			acc[fn(val, i, arr) ? 0 : 1].push(val);
			return acc;
		},
		[[], []]
	);
