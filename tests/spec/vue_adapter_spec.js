import VueFire from "app/adapters/vue_adapter";


describe("VueAdapter suite", function() {
	var adapter = new VueFire({}, 'https://scorching-fire-6566.firebaseio.com/trips/-K1-bQ2NT5d2SEj26ZIZ/locations');

	it("should contruct", function() {
		console.log(adapter);
	});
});
