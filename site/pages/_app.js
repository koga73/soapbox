import React, {useState, useEffect, useMemo, useRef} from "react";

import AuthService from "../services/AuthService";

import "../scss/app.scss";

import packageJson from "../package.json";
console.info(`${packageJson.name} v${packageJson.version}`);

function App({Component, pageProps}) {
	const [stateAlias, setStateAlias] = useState(null);

	const refBtnMenu = useRef();

	useEffect(function componentDidMount() {
		(async () => {
			try {
				const alias = await AuthService.autoLogin();
				setStateAlias(alias);
			} catch (err) {
				console.warn(err);
			}
		})();
	}, []);

	async function handler_btnSignIn_click(evt) {
		try {
			const alias = await AuthService.login();
			setStateAlias(alias);
		} catch (err) {
			console.warn(err);
		}
	}

	async function handler_btnSignOut_click(evt) {
		AuthService.logout();
	}

	function handler_btnMenu_click(evt) {
		refBtnMenu.current.focus();
	}

	const year = useMemo(() => new Date().getFullYear(), []);

	return (
		<div id="page">
			<header>
				<div className="content-left">
					<h1>Soapbox</h1>
					<a href="/" id="linkHome">
						<span className="hide-text">Home</span>
					</a>
				</div>
				<div className="content-right">
					<button ref={refBtnMenu} id="btnMenu" type="button" onClick={handler_btnMenu_click}>
						<span className="hide-text">Menu</span>
						<i className="fas fa-bars"></i>
					</button>
					<nav id="menu">
						<ul>
							{!AuthService.isLoggedIn() ? (
								<React.Fragment>
									<li>
										<button type="button" title="Sign In with Anchor Wallet" onClick={handler_btnSignIn_click}>
											<i className="fas fa-user-circle"></i>
											<span className="link-copy">Sign In with Anchor Wallet</span>
										</button>
									</li>
									<li>
										<a href="/about" title="Sign Up for a Wax account">
											<i className="fas fa-user-plus"></i>
											<span className="link-copy">Sign Up for a Wax account</span>
										</a>
									</li>
								</React.Fragment>
							) : (
								<React.Fragment>
									<li>
										<a href={`/user/${stateAlias}`} title={stateAlias}>
											<i className="fas fa-user-circle"></i>
											<span className="link-copy">{stateAlias}</span>
										</a>
									</li>
									<li>
										<button type="button" title="Sign Out" onClick={handler_btnSignOut_click}>
											<i className="fas fa-sign-out-alt"></i>
											<span className="link-copy">Sign Out</span>
										</button>
									</li>
								</React.Fragment>
							)}
							<li>
								<a href="/about" title="About">
									<i className="fas fa-question"></i>
									<span className="link-copy">Getting Started</span>
								</a>
							</li>
							<li>
								<a href="/get-soap" title="Get SOAP">
									<i className="fas fa-coins"></i>
									<span className="link-copy">Get SOAP</span>
								</a>
							</li>
						</ul>
						<footer className="wrap">
							<p>&copy;Copyright {year} AJ Savino and contributors</p>
						</footer>
					</nav>
				</div>
			</header>
			<main className="wrap">
				<Component alias={stateAlias} {...pageProps} />
			</main>
		</div>
	);
}
export default App;
