import React, {useState} from "react";
import Head from "next/head";

import AuthService from "../services/AuthService";

const WAX_TO_SOAP_RATE = 1.0;
const DEFAULT_WAX_AMOUNT = 10.0;

function PageGetSoap({alias}) {
	const [stateWax, setStateWax] = useState(DEFAULT_WAX_AMOUNT);
	const [stateSoap, setStateSoap] = useState(DEFAULT_WAX_AMOUNT * WAX_TO_SOAP_RATE);

	function handler_txtWax_change(evt) {
		setStateWax(evt.target.value);
		setStateSoap(evt.target.value * WAX_TO_SOAP_RATE);
	}

	function handler_frm_submit(evt) {
		evt.preventDefault();

		AuthService.getSoap(parseFloat(stateWax), parseFloat(stateSoap));

		return false;
	}

	return (
		<React.Fragment>
			<Head>
				<title>Get SOAP | Soapbox</title>
			</Head>
			<div id="get-soap">
				<section>
					<h2>Get SOAP</h2>
					<h3>What is SOAP?</h3>
					<p>SOAP is a digital token required to shout in Soapbox. Each shout costs 1.0000 SOAP.</p>
				</section>
				<section>
					<h3>Exchange WAX for SOAP</h3>
					<p>
						<em>The current exchange rate is 1.00000000 WAX for 1.0000 SOAP</em>
					</p>
					<form onSubmit={handler_frm_submit}>
						<div className="input-wrap">
							<div className="text-wrap">
								<label htmlFor="txtWax">WAX</label>
								<input id="txtWax" name="txtWax" type="number" step="1" min="0" value={stateWax} onChange={handler_txtWax_change} />
							</div>
							<i className="fas fa-equals"></i>
							<div className="text-wrap">
								<label htmlFor="txtSoap">SOAP</label>
								<input id="txtSoap" name="txtSoap" type="number" step="1" min="0" value={stateSoap} readonly />
							</div>
						</div>
						<button id="btnExchange" type="submit" className="btn">
							Get SOAP
						</button>
					</form>
				</section>
			</div>
		</React.Fragment>
	);
}
export default PageGetSoap;
