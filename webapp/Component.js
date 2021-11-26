jQuery.sap.declare("at.clouddna.training14.FioriDeepDive.ZHOFIO_14Extension.Component");

// use the load function for getting the optimized preload file if present
sap.ui.component.load({
	name: "at.clouddna.training14.FioriDeepDive",
	// Use the below URL to run the extended application when SAP-delivered application is deployed on SAPUI5 ABAP Repository
	url: "/sap/bc/ui5_ui5/sap/ZHOFIO_14"
		// we use a URL relative to our own component
		// extension application is deployed with customer namespace
});

this.at.clouddna.training14.FioriDeepDive.Component.extend("at.clouddna.training14.FioriDeepDive.ZHOFIO_14Extension.Component", {
	metadata: {
		manifest: "json"
	}
});