import React from "react";
import Head from "next/head";

function PageAbout({alias}) {
	return (
		<React.Fragment>
			<Head>
				<title>About | Soapbox</title>
			</Head>
			<div id="about">
				<section>
					<h2>About</h2>
					<h3>What is Soapbox?</h3>
					<p>
						Soapbox is a Web3 free speech platform. Unlike other sites Soapbox utilizes the Wax blockchain to store data. Once data is written to the blockchain it can
						never be removed. Our technology enables <strong>free speech without censorship.</strong>
					</p>
					<hr />
					<h3>What is Web3</h3>
					<p>
						Web3 is built on blockchain technology. Ordinary websites store data in private databases that are controlled by privileged individuals. Web3 sites store
						data on the blockchain, a public ledger. All data on the blockchain is publically available and cannot be erased as future blocks depend on the previous
						block data.
					</p>
					<hr />
					<h3>What is Blockchain?</h3>
					<p>
						Blockchain is a technology that stores data in a public ledger. Data is written to a &quot;block&quot; and subsequent blocks are built on previous blocks.
						This establishes a chain of trust.
					</p>
					<hr />
					<h3>What is Wax?</h3>
					<p>
						Wax is a blockchain forked from the EOS blockchain. It provides the backbone for our data storage.
						<br />
						To use Soapbox you must create a Wax account.
					</p>
					<hr />
					<h3>What is Anchor Wallet?</h3>
					<p>
						Anchor Wallet stores your identity and allows you to interact with the Wax blockchain.
						<br />
						To use Soapbox you must associate your Wax account with your Anchor Wallet.
					</p>
					<hr />
				</section>
				<section>
					<h2>Getting Started</h2>
					<ol>
						<li>
							<a href="https://greymass.com/en/anchor/download" target="_blank">
								Download Anchor Wallet
							</a>
						</li>
						<li>
							<a href="https://create.anchor.link/buy?p=prod_KMjpTazWbSrolo" target="_blank">
								Create a Wax account for your Anchor Wallet
							</a>
						</li>
						<li>Sign In to Soapbox</li>
						<li>Start Shouting!</li>
					</ol>
				</section>
			</div>
		</React.Fragment>
	);
}
export default PageAbout;
