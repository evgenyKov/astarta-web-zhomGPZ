const checkAuthorityApi = (req, res, next) => {
	if (req.session.user_id) {
		next();
	} else {
		res.write('{success: false, mess: "Access denied"}');
	}
}

module.exports = checkAuthorityApi;
