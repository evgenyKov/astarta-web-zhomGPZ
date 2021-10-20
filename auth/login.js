const { querySQL, sqlBase, safeTrim } = require('../sql.js');

const login = (req, res, next) => {
	const { login, password } = req.body;	
	let first = true;
	const sqltext = `SELECT login, operatorname, rolename, pagename, title, operator, parentName, ord 
		FROM ${sqlBase}.Operator_Pages_View WHERE login='${login}' AND pass = '${password}' 
		ORDER by role, ord`; 

	req.session.pages=[];
	req.session.roles=[];	
	req.session.parentPages = {};
	querySQL(res,
		sqltext,
		null,
		columns => {
			if (first) {
				first = false;	
				req.session.user_id		=	columns[5].value;
				req.session.login		=	columns[0].value;
				req.session.user		=	safeTrim(columns[1]);
				req.session.defPage		=	safeTrim(columns[3]);
				var userElements		=	safeTrim(columns[1]).split(" ");
				req.session.fio			=	userElements[0];
				if (userElements[1])
					req.session.fio = `${req.session.fio} ${userElements[1].substr(0,1)}`;
				if (userElements[2])
					req.session.fio = `${req.session.fio} ${userElements[2].substr(0,1)}`;
			}

			const role = safeTrim(columns[2]);
			const page = safeTrim(columns[3]);
			const title = safeTrim(columns[4]);
			const parentPage = safeTrim(columns[6]);
			const ord = columns[7].value;
			if (!req.session.roles.includes(role)) {
				req.session.roles.push(role);
			}

			if (parentPage) {
				if (!req.session.parentPages[parentPage])
					req.session.parentPages[parentPage] = [];
				let pageExist = req.session.parentPages[parentPage].find(p => p.page === page);
				if (!pageExist) {
					req.session.parentPages[parentPage].push({ page, title, ord })
				}
			} else {
				let pageExist = req.session.pages.find(p => p.page === page);
				if (!pageExist) {
					req.session.pages.push({ page, title, childs: [] })
				}
			}

		},
		(res, count) => {
			req.session.pages.map( sessionPage => {
				const { page } = sessionPage;
				if (req.session.parentPages[page]) {
					sessionPage.childs = req.session.parentPages[page];
				}
			})
			if (count != 0) {
				if (req.session.requestedPage)	{
					req.session.badUser = false;
					var temp = req.session.requestedPage;
					req.session.requestedPage = null;
					res.redirect(temp);
				} else {	
					res.redirect("/" + req.session.defPage + ".html");
				}
				next();					
			} else {
				req.session.badUser = true;
				res.redirect("login.html");
			}
		}
	) 	
}

module.exports = login;
