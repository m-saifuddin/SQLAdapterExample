/*
 * Licensed Materials - Property of IBM
 * 5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

// Worklight comes with the jQuery 1.8.1 framework bundled inside. If you do not want to use it, please comment out the line below.
window.$ = window.jQuery = WLJQ;
var busyInd;
function wlCommonInit() {

	// Common initialization code goes here
	busyInd = new customBusyIndicator();

	// $.mobile.changePage("#password");
}

var ProductCollection = {};

$(document).ready(function() {

	$('#listproducts').click(function() {
		$.mobile.changePage("#list", {
			transition : "slide"
		});
		getProductsRec();
	});

	$('#productSearch').click(function() {
		$.mobile.changePage("#productSearch", {
			transition : "slide"
		});
		searchProductRec();
	});

	$('#updateButton').click(function() {
		updateProductRec();
	});

	$('#deleteButton').click(function() {
		deleteProductRec();
	});

});

function deleteProductRec() {

	var productID = $('#proddID').val();

	WL.Client.invokeProcedure({
		adapter : "Product",
		procedure : "deleteProduct",
		parameters : [ productID ]

	}, {
		onSuccess : function(result) {
			WL.Logger.debug("updateProductRec onSuccess "
					+ JSON.stringify(result));
			getProductsRec();
			$.mobile.changePage("#list", {
				transition : "slide",
				reverse : false,
				changeHash : false
			});
		},
		onFailure : failureCallback
	});
}

function getProductsRec() {

	busyInd.show("Retrieving Record");
	ProductCollection = {};
	var responseData = {};

	WL.Client.invokeProcedure({
		adapter : "Product",
		procedure : "getProducts",
		parameters : []
		},
		{
			onSuccess : function(result) {
				responseData = result.invocationResult.resultSet;
					if (result.invocationResult.isSuccessful) {
						if (responseData.length > 0) {
							$("#productsList").empty();
								for (i = 0; i < responseData.length; i++) {
									var obj = responseData[i];
									ProductCollection[obj.productID] = obj;
									$('#proddID').val(obj.productID);
									$('#productsList')
										.append($('<li/>', {}).append($('<a/>',{
											'href' : '#productDetail',
											'data-transition' : 'slide',
											'text' : obj.productName,
											'onclick' : 'getProductDetail('
											+ obj.productID+ ')'
											})));
									}
									$('#productsList').listview('refresh');
									busyInd.hide();
								}
							} else {
								WL.Logger
										.debug("something wrong with query in getProducts");
							}
						},
						onFailure : failureCallback
					});

}

function searchProductRec() {

	// var productName = $("#prods_name").val();
	// WL.Client.invokeProcedure({
	// adapter : "Product",
	// procedure : "searchProduct",
	// parameters : [ productName ]
	//
	// }, {
	// onSuccess : function(result) {
	// WL.Logger.debug("searchProductRec onSuccess "
	// + JSON.stringify(result));
	// // getProductsRec();
	// // $.mobile.changePage("#list", {
	// // transition : "slide",
	// // reverse : false,
	// // changeHash : false
	// // });
	// },
	// onFailure : failureCallback
	// });
	busyInd.show("Retrieving Record");
	WL.Client
			.invokeProcedure(
					{
						adapter : "Product",
						procedure : "getProducts",
						parameters : []
					},
					{
						onSuccess : function(result) {
							WL.Logger.debug("return Data "
									+ result.invocationResult.resultSet);
							responseData = result.invocationResult.resultSet;
							if (result.invocationResult.isSuccessful) {

								if (responseData.length > 0) {
									$("#searchedproductsList").empty();
									for (i = 0; i < responseData.length; i++) {

										var obj = responseData[i];
										ProductCollection[obj.productID] = obj;

										$('#proddID').val(obj.productID);
										$('#searchedproductsList')
												.append(
														$('<li/>', {

														})
																.append(
																		$(
																				'<a/>',
																				{
																					'href' : '#productDetail',
																					'data-transition' : 'slide',
																					'text' : obj.productName,
																					'onclick' : 'getProductDetail('
																							+ obj.productID
																							+ ')'
																				})));

									}
									$('#searchedproductsList').listview(
											'refresh');

									busyInd.hide();
								}
							} else {
								WL.Logger
										.debug("something wrong with query in getProducts");
							}
						},
						onFailure : failureCallback
					});
}

function updateProductRec() {

	var query = {};

	query.ProductID = $('#proddID').val();
	query.productName = $("#prodd_name").val();
	query.Model = $("#prodd_model").val();
	query.Qty = $("#prodd_qty").val();
	query.price = $("#prodd_price").val();

	var queryData = JSON.parse(JSON.stringify(query));

	WL.Client.invokeProcedure({
		adapter : "Product",
		procedure : "updateProduct",
		parameters : [ queryData.productName, queryData.Qty, queryData.Model,
				queryData.price, queryData.ProductID ]

	}, {
		onSuccess : function(result) {
			WL.Logger.debug("updateProductRec onSuccess "
					+ JSON.stringify(result));
			getProductsRec();
			$.mobile.changePage("#list", {
				transition : "slide",
				reverse : false,
				changeHash : false
			});
		},
		onFailure : failureCallback
	});
}

function getProductDetail(productID) {
	busyInd.show("Product Detail");

	var obj = ProductCollection[productID];
	$("#prodd_name").val(obj.productName);
	$("#prodd_model").val(obj.Model);
	$("#prodd_qty").val(obj.Qty);
	$("#prodd_price").val(obj.price);

	busyInd.hide();
}

function addProductRec() {

	busyInd.show("Adding Product");
	var validate = true;

	var query = {};
	if ($("#prod_name").val() != "") {
		query.productName = $("#prod_name").val();
	} else {
		validate = false;
	}

	if ($("#prod_model").val() != "") {
		query.Model = $("#prod_model").val();
	} else {
		validate = false;
	}

	if ($("#prod_qty").val() != "") {
		query.Qty = $("#prod_qty").val();
	} else {
		validate = false;
	}

	if ($("#prod_price").val() != "") {
		query.price = $("#prod_price").val();
	} else {
		validate = false;
	}

	if (validate) {
		var queryData = JSON.parse(JSON.stringify(query));

		WL.Client.invokeProcedure({
			adapter : "Product",
			procedure : "addProduct",
			parameters : [ queryData.productName, queryData.Qty,
					queryData.Model, queryData.price ]
		}, {
			onSuccess : function(result) {

				busyInd.hide();

				$.mobile.changePage("#list", {
					transition : "slide",
					reverse : false,
					changeHash : false
				});

				getProductsRec();
			},
			onFailure : failureCallback
		});
	} else {
		busyInd.hide();
		alert("All fields required");
	}
}

function customBusyIndicator() {

	this.isVisible = function() {
		var flag = ($('.ui-loader').is(':hidden') ? false : true);
		return flag;
	};

	this.show = function(message) {
		var htmlcontent = $("#busyInd").html();
		if (message != "" && message !== undefined) {
			htmlcontent = $("#busyInd").html().replace("Processing Request",
					message);
		}

		$.mobile.loading('show', {
			text : 'foo',
			textVisible : true,
			theme : 'z',
			html : htmlcontent
		});
	};

	this.hide = function() {
		$.mobile.loading('hide');
	};

}
function failureCallback(data) {
	if (busyInd.isVisible()) {
		busyInd.hide();
	}
	WL.Logger.debug("invoke procedure failed " + JSON.stringify(data));
	alert("invoke procedure failed");
}
