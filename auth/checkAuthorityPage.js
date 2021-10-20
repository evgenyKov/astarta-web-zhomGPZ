
const checkAuthorityPage = (req, res, next) => {
    const { user_id, pages, defPage } = req.session;
	if (user_id) {
		const page = req.path.substr(1).replace('.html', '');
		let allowed;
		for (let i=0; i < pages.length; i++) {
            const pageDef = pages[i];
			if (pageDef.page == page) {
				allowed = true;
				break;
			}
			for (let j=0; j < pageDef.childs.length; j++) {
				if (pageDef.childs[j].page == page) {
					allowed = true;
					break;
				}
			}
		}
		if (allowed) {
			next();
		} else {
			res.redirect(`/${defPage}.html`);
		}
	} else {
		req.session.requestedPage = req.path;
        res.redirect('/login.html');		
	}
}

module.exports = checkAuthorityPage;
