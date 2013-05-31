/*
 *  Licensed Materials - Property of IBM
 *  5725-G92 (C) Copyright IBM Corp. 2011, 2012. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/*******************************************************************************
 * Implementation code for procedure - 'procedure1'
 * 
 * 
 * @return - invocationResult
 */

var procedure1Statement = WL.Server
		.createSQLStatement("select COLUMN1, COLUMN2 from TABLE1 where COLUMN3 = ?");

/*******************************************************************************
 * Functions that correspond to JSONStore client operations
 * 
 */

var selectProductStatement = WL.Server
		.createSQLStatement("select productID, productName, Qty, Model, price from product ORDER BY productName");

function getProducts() {

	return WL.Server.invokeSQLStatement({
		preparedStatement : selectProductStatement,
		parameters : []
	});

}

var insertProductStatment = WL.Server
		.createSQLStatement("insert into product (productName, Qty, Model, price) values (?, ?, ?, ?)");

function addProduct(productName, qty, model, price) {

	return WL.Server.invokeSQLStatement({
		preparedStatement : insertProductStatment,
		parameters : [ productName, qty, model, price ]
	});
}

var searchByProductNameStatment = WL.Server
		.createSQLStatement("select productID, productName, Qty, Model, price from product WHERE productName LIKE CONCAT('%',?,'%')");

function searchProduct(data) {
	// WL.Logger.debug("searchProduct " + JSON.stringify(data));

	// var sd = "'%" + data + "%'";
	WL.Logger
			.debug("searchProduct " + data + " " + searchByProductNameStatment);
	return WL.Server.invokeSQLStatement({
		preparedStatement : searchByProductNameStatment,
		parameters : [ data ]
	});
}

var updateProductStatement = WL.Server
		.createSQLStatement("update product set productName=?, Qty=?, Model=?, price=? WHERE productID = ?");

function updateProduct(productName, qty, model, price, productID) {

	return WL.Server.invokeSQLStatement({
		preparedStatement : updateProductStatement,
		parameters : [ productName, qty, model, price, productID ]
	});
}

var deleteProductStatement = WL.Server
		.createSQLStatement("delete from product where productID =?");

function deleteProduct(productID) {

	return WL.Server.invokeSQLStatement({
		preparedStatement : deleteProductStatement,
		parameters : [ productID ]
	});
}