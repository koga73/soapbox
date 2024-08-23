import AnchorLink from "anchor-link";
import anchorLinkBrowserTransport from "anchor-link-browser-transport";

import packageJson from "../package.json";

const WAX_URL = process.env.NEXT_PUBLIC_WAX_URL;
const WAX_CHAIN_ID = process.env.NEXT_PUBLIC_WAX_CHAIN_ID;
const BUILD_ACCOUNT = process.env.NEXT_PUBLIC_BUILD_ACCOUNT;
const TOKEN_ACCOUNT = process.env.NEXT_PUBLIC_TOKEN_ACCOUNT;
const WAX_TOKEN_ACCOUNT = process.env.NEXT_PUBLIC_WAX_TOKEN_ACCOUNT;

class _class {
	static transport = new anchorLinkBrowserTransport();
	static link = new AnchorLink({
		transport: _class.transport,
		chains: [
			{
				nodeUrl: WAX_URL,
				chainId: WAX_CHAIN_ID
			}
		]
	});
	static session = null;
	static auth = null;
	static alias = "";

	static autoLogin() {
		return new Promise(async (resolve, reject) => {
			let session = null;
			try {
				session = await _class.link.restoreSession(packageJson.name);
				if (!session) {
					throw new Error("Not logged in");
				}
				const auth = session.auth;
				const alias = auth.toString().replace(/\@.+$/i, "");

				_class.session = session;
				_class.auth = auth;
				_class.alias = alias;

				console.info(`Logged in as ${alias}`);
				resolve(alias);
			} catch (err) {
				reject(err);
			}
		});
	}

	static login() {
		return new Promise(async (resolve, reject) => {
			let session = null;
			try {
				session = await _class.link.restoreSession(packageJson.name);
				if (!session) {
					const identity = await _class.link.login(packageJson.name);
					session = identity.session;
				}
				const auth = session.auth;
				const alias = auth.toString().replace(/\@.+$/i, "");

				_class.session = session;
				_class.auth = auth;
				_class.alias = alias;

				console.info(`Logged in as ${alias}`);
				resolve(alias);
			} catch (err) {
				reject(err);
			}
		});
	}

	static async logout() {
		_class.link.clearSessions(packageJson.name);
		console.info("Successfully logged out");
		window.location.reload();
	}

	static isLoggedIn() {
		return _class.auth !== null;
	}

	static action({name, data}) {
		return _class.session.transact({
			action: {
				authorization: [_class.auth],
				account: BUILD_ACCOUNT,
				name,
				data
			}
		});
	}

	static getSoap(waxQuantity, soapQuantity) {
		return _class.session.transact({
			actions: [
				{
					authorization: [_class.auth],
					account: WAX_TOKEN_ACCOUNT,
					name: "transfer",
					data: {
						from: _class.alias,
						to: TOKEN_ACCOUNT,
						quantity: `${waxQuantity.toFixed(8)} WAX`,
						memo: "Exchanging WAX for SOAP"
					}
				},
				{
					authorization: [_class.auth],
					account: TOKEN_ACCOUNT,
					name: "transfer",
					data: {
						from: _class.alias,
						to: BUILD_ACCOUNT,
						quantity: `${soapQuantity.toFixed(4)} SOAP`,
						memo: "Sending SOAP to Soapbox"
					}
				}
			]
		});
	}
}
export default _class;
