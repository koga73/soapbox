import React from "react";
import {useRouter} from "next/router";
import ErrorPage from "next/error";
import Head from "next/head";
import useSWR from "swr";

import Shout from "../../components/Shout";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function PageUser({alias}) {
	const router = useRouter();
	const {useralias} = router.query;
	const {data: self, error: getSelfError} = useSWR(`/api/get-user/${alias}`, fetcher);
	const {data: user, error: getUserError} = useSWR(`/api/get-user/${useralias}`, fetcher);

	const selfSuccess = self && self.success !== false;

	const userSuccess = user && user.success !== false;
	const userNotFound = alias !== useralias && user && !userSuccess;
	if (userNotFound) {
		return <ErrorPage statusCode={404} />;
	}
	const isLoading = !user;

	return (
		<React.Fragment>
			<Head>
				<title>{useralias} | Soapbox</title>
			</Head>
			<section id="user">
				{!isLoading &&
					(!userSuccess ? null : (
						<React.Fragment>
							<h2>{user.alias}</h2>
							<Shout alias={alias} user={user} isFollowing={selfSuccess ? self.following.indexOf(user.alias) != -1 : false} />
							{user.following.length > 0 && (
								<React.Fragment>
									<h3>Following:</h3>
									<ul>
										{user.following.map((following) => (
											<li key={following}>
												<a href={`/user/${following}`}>{following}</a>
											</li>
										))}
									</ul>
								</React.Fragment>
							)}
						</React.Fragment>
					))}
			</section>
		</React.Fragment>
	);
}
export default PageUser;
