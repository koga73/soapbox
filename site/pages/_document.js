import {Html, Head, Main, NextScript} from "next/document";

export default function Document() {
	return (
		<Html>
			<Head>
				<meta charSet="utf-8" />

				<meta name="theme-color" content="#5e9732" />
				<meta name="msapplication-navbutton-color" content="#5e9732" />
				<meta name="apple-mobile-web-app-status-bar-style" content="#5e9732" />

				<meta name="description" content="Soapbox is a Web3 free speech platform." />

				<link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
				<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />

				{/* TODO: Don't use CDN, move files locally */}
				<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Zilla+Slab" />
				<link
					href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
					integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf"
					crossOrigin="anonymous"
					rel="stylesheet"
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
