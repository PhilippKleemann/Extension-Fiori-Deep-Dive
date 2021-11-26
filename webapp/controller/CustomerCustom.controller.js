sap.ui.define([
	"at/clouddna/training14/FioriDeepDive/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"at/clouddna/training14/FioriDeepDive/formatter/formatter",
	"sap/ui/core/routing/History",
	"sap/m/UploadCollectionParameter"
], function (e, t, i, s, o, n, UploadCollectionParameter) {
	"use strict";
	return sap.ui.controller("at.clouddna.training14.FioriDeepDive.ZHOFIO_14Extension.controller.CustomerCustom", {
		//    _fragmentList: {},
		//    _sMode: "",
		//    formatter: o,
		//    onInit: function () {
		//        this.getRouter().getRoute("Customer").attachPatternMatched(this._onPatternMatched, this);
		//    },
		_onPatternMatched: function (e) {
			let i = e.getParameter("arguments").customerid;
			let s = new t({
				editMode: false
			});
			this.setModel(s, "editModel");
			if (i !== "create") {
				this._sMode = "display";
				this._showCustomerFragment("DisplayCustomer");
				this.getView().bindElement({
					path: "/CustomerSet(guid'" + i + "')",
					events: {
						dataRequested: function () {
							this.logInfo("Customer" + i + "was requested");
							this.getView().setBusy(true);
						}.bind(this),
						dataReceived: function (e) {
							if (e.getParameter("data")) {
								this.logInfo("Customer" + i + "was received");
							} else {
								this.logError("Customer" + i + "was not found");
							}
							this.getView().setBusy(false);
						}.bind(this)
					}
				});
				this.logInfo("Display Customer");
				this.getView().byId("customer_button_attachments").setVisible(true);
			} else {
				this._sMode = "create";
				let e = new t({
					Firstname: "",
					Lastname: "",
					AcademicTitle: "",
					Gender: "",
					Email: "",
					Phone: "",
					Website: ""
				});
				this.setModel(e, "createModel");
				s.setProperty("/editMode", true);
				this._showCustomerFragment("CreateCustomer");
				this.logInfo("Create Customer");
				this.getView().byId("customer_button_attachments").setVisible(false);
			}
		},

		onOpenAttachments: function (oEvent) {
			if (this._oAttachmentsDialog) {
				this._oAttachmentsDialog.open();
				this._oUploadCollection.setUploadUrl(
					this.getModel().sServiceUrl + this.getView().getBindingContext().sPath + "/Documents");
			} else {
				s.load({
					id: this.getView().getId(),
					name: "at.clouddna.training14.FioriDeepDive.ZHOFIO_14Extension.view.AttachmentsDialog",
					controller: this
				}).then(function (oDialog) {
					this._oAttachmentsDialog = oDialog;
					this._oAttachmentsDialog.addStyleClass(this._getContentDensityClass());
					this.getView().addDependent(this._oAttachmentsDialog);
					this._oAttachmentsDialog.open();

					this._oUploadCollection = this.getView().byId("attachments_uploadcollection");
					this._oUploadCollection.setUploadUrl(
						this.getModel().sServiceUrl + this.getView().getBindingContext().sPath + "/Documents");
				}.bind(this));
			}
		},

		onBeforeUploadStarts: function (oEvent) {
			let oHeaderSlug = new UploadCollectionParameter({
				name: "slug",
				value: oEvent.getParameter("fileName")
			});

			oEvent.getParameter().addHeaderParameter(oHeaderSlug);
		},

		onUploadComplete: function (oEvent) {
			this.getModel().refresh();
		},

		onAttachmentsDialogClose: function (oEvent) {
			this._oAttachmentsDialog.close();
		},

		onUploadChange: function (oEvent) {
			this._oUploadCollection.removeAllHeaderParameters();

			let oCSRFHeader = new UploadCollectionParameter({
				name: "x-csrf-token",
				value: this.getModel().getSecurityToken()
			});
			this._oUploadCollection.addHeaderParameter(oCSRFHeader);
		},

		formatUploadItemUrl: function (sDocId) {
			return this.getModel().sServiceUrl + "/CustomerDocumentSet(guid'" + sDocId + "')/$value";
		},

		onDocumentDelete: function (oEvent) {
				let sDocumentPath = oEvent.getSource().getBindingContext().sPath;
					
					i.confirm(this.geti18nText("dialog.delete.attachment"), {
						onClose: function (oAction) {
							if (oAction === i.Action.OK) {
								this.getView().setBusy(true);
								this.getModel().remove(sDocumentPath, {
									success: function (oData, response) {
										this.getView().setBusy(false);
										
										this.logInfo("Delete Document - success");
										i.success(this.geti18nText("dialog.delete.attachment.success"));
									}.bind(this),
									error: function (oError) {
										this.getView().setBusy(false);
										
										this.logError("Delete Document - error");
										i.error(oError.message);
									}.bind(this) 
								});
							}
						}.bind(this)
					});
			}
			//    onEditPress: function (e) {
			//        this._toggleEdit(true);
			//    },
			//    onSavePress: function (e) {
			//        this.getView().setBusy(true);
			//        if (this._sMode === "create") {
			//            let e = this.getView().getModel(), t = this.getView().getModel("createModel").getData();
			//            e.create("/CustomerSet", t, {
			//                success: function (e, t) {
			//                    i.information(this.geti18nText("dialog.create.success"), {
			//                        onClose: function (e) {
			//                            this.onNavBack();
			//                            this.logInfo("Customer created");
			//                            this.getView().setBusy(false);
			//                        }.bind(this)
			//                    });
			//                }.bind(this),
			//                error: function (e) {
			//                    i.error(e.message, {
			//                        onClose: function (e) {
			//                            this.onNavBack();
			//                            this.getView().setBusy(false);
			//                            this.logError("Customer creation failed");
			//                        }.bind(this)
			//                    });
			//                }
			//            });
			//        } else {
			//            if (this.getModel().hasPendingChanges()) {
			//                this.getModel().submitChanges({
			//                    success: function (e) {
			//                        i.information(this.geti18nText("dialog.update.success"));
			//                        this.logInfo("Customer saved");
			//                        this.getView().setBusy(false);
			//                    }.bind(this),
			//                    error: function (e) {
			//                        i.information(this.geti18nText("dialog.update.error"));
			//                        this.logInfo("Customer not saved");
			//                        this.getView().setBusy(false);
			//                    }.bind(this)
			//                });
			//            } else {
			//                this._toggleEdit(false);
			//            }
			//        }
			//    },
			//    onCancelPress: function (e) {
			//        i.confirm(this.geti18nText("dialog.cancel"), {
			//            onClose: function (e) {
			//                if (e === i.Action.OK) {
			//                    if (this._sMode === "create") {
			//                        this.onNavBack();
			//                    } else {
			//                        if (this.getModel().hasPendingChanges()) {
			//                            this.getModel().resetChanges();
			//                        }
			//                        this._toggleEdit(false);
			//                    }
			//                }
			//            }.bind(this)
			//        });
			//    },
			//    _toggleEdit: function (e) {
			//        let t = this.getModel("editModel");
			//        t.setProperty("/editMode", e);
			//        this.setDirtyState(e);
			//        this._showCustomerFragment(e ? "EditCustomer" : "DisplayCustomer");
			//    },
			//    _showCustomerFragment: function (e) {
			//        let t = this.getView().byId("customer_page");
			//        t.removeAllContent();
			//        if (this._fragmentList[e]) {
			//            t.insertContent(this._fragmentList[e]);
			//        } else {
			//            s.load({
			//                id: this.getView().createId(e),
			//                name: "at.clouddna.training14.FioriDeepDive.view." + e,
			//                controller: this
			//            }).then(function (i) {
			//                this._fragmentList[e] = i;
			//                t.insertContent(this._fragmentList[e]);
			//                this.logInfo("Fragment" + e + "loaded");
			//            }.bind(this));
			//        }
			//    }
	});
});