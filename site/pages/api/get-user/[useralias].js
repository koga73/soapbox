import {JsonRpc} from "eosjs";
import fetch from "node-fetch";

const RPC = process.env.NEXT_PUBLIC_WAX_URL;
const ACCOUNT = process.env.NEXT_PUBLIC_BUILD_ACCOUNT;
const TABLE = process.env.NEXT_PUBLIC_BUILD_TABLE;

//Create RPC
const rpc = new JsonRpc(RPC, {fetch});

//Method to read table until end
async function readTable(scope, table, lower_bound) {
	const {rows} = await rpc.get_table_rows({
		json: true, // Get the response as json
		code: scope, // Contract that we target
		scope, // Account that owns the data
		table, // Table name
		lower_bound,
		limit: 1, // Maximum number of rows that we want to get
		reverse: false, // Optional: Get reversed data
		show_payer: false // Optional: Show ram payer
	});
	return rows;
}

export default async function handler(req, res) {
	try {
		if (req.method !== "GET") {
			throw new Error("invalid request");
		}
		const useralias = req.query.useralias;
		if (!/^[a-z1-5.]{1,12}$/i.test(useralias)) {
			throw new Error("invalid user name");
		}
		const tableData = await readTable(ACCOUNT, TABLE, useralias);
		if (tableData.length && tableData[0].alias == useralias) {
			res.status(200).json(tableData[0]);
		} else {
			res.status(200).json({success: false, data: "user not found"});
		}
	} catch (err) {
		res.status(400).json({success: false, data: err.message});
	}
}
