import React, {useRef, useState, useMemo} from "react";

import AuthService from "../services/AuthService";

const DEFAULT_SHOUT = "Speak your mind!";
const DEFAULT_TAG = "#soapbox";

function Shout({alias, user, isFollowing}) {
	const [stateIsEditing, setStateIsEditing] = useState(false);
	const [stateTxtEdit, setStateTxtEdit] = useState("");
	const [stateTxtTag, setStateTxtTag] = useState("");

	const refTxtEdit = useRef();

	function handler_btnEdit_click(evt) {
		const shout = user ? user.shout : DEFAULT_SHOUT;
		const tag = user ? user.tag : DEFAULT_TAG;

		setStateIsEditing(true);
		setStateTxtEdit(shout);
		setStateTxtTag(tag);
		requestAnimationFrame(() => {
			//Focus
			refTxtEdit.current.focus();
		});
	}
	function handler_btnCancel_click(evt) {
		setStateIsEditing(false);
	}

	function handler_frmEdit_submit(evt) {
		evt.preventDefault();

		setStateIsEditing(false);
		AuthService.action({
			name: "shout",
			data: {
				alias,
				shout: stateTxtEdit,
				tag: stateTxtTag
			}
		});

		return false;
	}
	function handler_txt_keyDown(evt) {
		switch (evt.keyCode) {
			case 13: //Enter
				handler_frmEdit_submit(evt);
				break;
			case 27: //Escape
				setStateIsEditing(false);
				break;
		}
	}
	function handler_txt_focus(evt) {
		evt.target.setSelectionRange(0, evt.target.value.length);
	}

	function handler_btnUnfollow_click(evt) {
		AuthService.action({
			name: "unfollow",
			data: {
				alias,
				unfollow: user.alias
			}
		});
	}
	function handler_btnFollow_click(evt) {
		AuthService.action({
			name: "follow",
			data: {
				alias,
				follow: user.alias
			}
		});
	}

	const dateModified = useMemo(() => {
		if (user) {
			return new Date(user.date_modified * 1000);
		} else {
			return null;
		}
	}, [user]);
	const isEditable = useMemo(() => {
		return user ? user.alias == alias : true;
	}, [alias, user]);

	return (
		<div className="shout">
			{!stateIsEditing ? (
				<div className="row">
					<div className="col grow">
						<div className="row">
							<strong>
								<a href={user ? `/user/${user.alias}` : `/user/${alias}`}>{user ? user.alias : alias}</a>
							</strong>
						</div>
						<div className="row">
							<span>{user ? user.shout : DEFAULT_SHOUT}</span>
						</div>
						<div className="row">
							<span>{user ? user.tag : DEFAULT_TAG}</span>
						</div>
					</div>
					<div className="col">
						<div className="col align-right">
							{dateModified && (
								<React.Fragment>
									<span className="row">{dateModified.toLocaleDateString()}</span>
									<span className="row">{dateModified.toLocaleTimeString()}</span>
								</React.Fragment>
							)}
						</div>
						{isEditable ? (
							<div className="row align-right">
								<button type="button" title="Edit" className="btn-edit" onClick={handler_btnEdit_click}>
									<i className="fa fa-edit"></i>
									<span className="hide-text">Edit</span>
								</button>
							</div>
						) : alias ? (
							isFollowing ? (
								<div className="row align-right">
									<button type="button" title="Unfollow" className="btn-unfollow" onClick={handler_btnUnfollow_click}>
										<i className="fa fa-user-minus"></i>
										<span className="hide-text">Unfollow</span>
									</button>
								</div>
							) : (
								<div className="row align-right">
									<button type="button" title="Follow" className="btn-follow" onClick={handler_btnFollow_click}>
										<i className="fa fa-user-plus"></i>
										<span className="hide-text">Follow</span>
									</button>
								</div>
							)
						) : null}
					</div>
				</div>
			) : (
				<form className="frm-edit" onSubmit={handler_frmEdit_submit}>
					<div className="row">
						<div className="col grow">
							<div className="row">
								<strong>
									<span>{user ? user.alias : alias}</span>
								</strong>
							</div>
							<div className="grid">
								<div className="grid-cell">
									<label htmlFor="txtEditShout">Shout</label>
								</div>
								<div className="grid-cell">
									<textarea
										ref={refTxtEdit}
										id="txtEditShout"
										name="txtEditShout"
										value={stateTxtEdit}
										onChange={(evt) => setStateTxtEdit(evt.target.value)}
										onKeyDown={handler_txt_keyDown}
										onFocus={handler_txt_focus}
										rows="4"
										maxlength="256"
									></textarea>
								</div>
								<div className="grid-cell">
									<label htmlFor="txtTag">Tag</label>
								</div>
								<div className="grid-cell">
									<input
										type="text"
										id="txtTag"
										name="txtTag"
										value={stateTxtTag}
										onChange={(evt) => setStateTxtTag(evt.target.value)}
										onKeyDown={handler_txt_keyDown}
										onFocus={handler_txt_focus}
										maxlength="32"
									/>
								</div>
							</div>
						</div>
						<div className="col">
							<div className="col align-right">{user && user.balance}</div>
							{isEditable && (
								<div className="row align-right">
									<button type="submit" className="btn-edit-submit" title="Shout">
										<i className="fa fa-check-circle"></i>
										<span className="hide-text">Shout</span>
									</button>
									<button type="button" title="Cancel" className="btn-cancel" onClick={handler_btnCancel_click}>
										<i className="fa fa-ban"></i>
										<span className="hide-text">Cancel</span>
									</button>
								</div>
							)}
						</div>
					</div>
				</form>
			)}
		</div>
	);
}
export default Shout;
