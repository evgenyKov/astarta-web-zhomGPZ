const bwipjs = require('bwip-js');

const barcode = (req, res) => {
        console.log("===REQ===", req.url);
	if (req.url.indexOf('/?bcid=') != 0) {
                res.writeHead(404, { 'Content-Type':'text/plain' });
                res.end('BWIP-JS: Unknown request format.', 'utf8');
	} else {
                bwipjs.request(req, res);
	}
}

module.exports = barcode;
