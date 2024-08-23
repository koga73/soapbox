import React from "react";
import Head from "next/head";
import useSWR from "swr";

import Shout from "../components/Shout";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function PageIndex({alias}) {
	const {data: self, error: getSelfError} = useSWR(`/api/get-user/${alias}`, fetcher);
	const {data: users, error: getUsersError} = useSWR("/api/get-users", fetcher);

	const selfSuccess = self && self.success !== false;

	return (
		<React.Fragment>
			<Head>
				<title>Soapbox - Free Speech without Censorship</title>
			</Head>
			<section id="index">
				<h2>
					New to Web3 and Blockchain? <a href="/about">Start here</a>
				</h2>
				{users && (
					<ul>
						{alias && (
							<li>
								<Shout alias={alias} user={selfSuccess ? self : null} isFollowing={false} />
							</li>
						)}
						{users.map((user) => {
							if (user.alias == alias) {
								return;
							}
							return (
								<li key={user.alias}>
									<Shout alias={alias} user={user} isFollowing={selfSuccess ? self.following.indexOf(user.alias) != -1 : false} />
								</li>
							);
						})}
					</ul>
				)}
			</section>
		</React.Fragment>
	);
}
export default PageIndex;
