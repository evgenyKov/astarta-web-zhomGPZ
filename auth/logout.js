const logout = (req,res) => {
	req.session.user_id = null;
	req.session.login = null;	
	req.session.user = null;
	req.session.defPage = null;
	req.session.pages = null;
	req.session.roles = null;
	req.session.badUser = false;
	res.redirect('login.html');
};

module.exports = logout;
