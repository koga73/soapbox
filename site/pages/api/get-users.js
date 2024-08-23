import {JsonRpc} from "eosjs";
import fetch from "node-fetch";

const RPC = process.env.NEXT_PUBLIC_WAX_URL;
const ACCOUNT = process.env.NEXT_PUBLIC_BUILD_ACCOUNT;
const TABLE = process.env.NEXT_PUBLIC_BUILD_TABLE;
const TABLE_PAGE_SIZE = 100;

//Create RPC
const rpc = new JsonRpc(RPC, {fetch});

//Method to read table until end
async function readTable(scope, table) {
	let allTableData = [];
	let next = null;
	//do {
	const {rows, more, next_key} = await rpc.get_table_rows({
		json: true, // Get the response as json
		code: scope, // Contract that we target
		scope, // Account that owns the data
		table, // Table name
		index_position: 3, //Date modified
		key_type: "i64",
		//lower_bound: next,
		limit: TABLE_PAGE_SIZE, // Maximum number of rows that we want to get
		reverse: true, // Optional: Get reversed dataz
		show_payer: false // Optional: Show ram payer
	});
	allTableData = allTableData.concat(rows);
	next = more ? next_key : null;
	//} while (next);
	return allTableData;
}

export default async function handler(req, res) {
	try {
		if (req.method !== "GET") {
			throw new Error("invalid request");
		}
		const tableData = await readTable(ACCOUNT, TABLE);
		res.status(200).json(tableData);
	} catch (err) {
		res.status(400).json({success: false, data: err.message});
	}
}
