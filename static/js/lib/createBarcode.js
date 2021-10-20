function createBarcode(id,pref)
	{
    var cod = pref,
        idStr = id.toString();
    while (idStr.length < 6) {
        idStr = '0' + idStr;
    }
    var ret = cod + idStr;

    var ziphers = [];
    for (let i = 0; i < ret.length; i++)
        ziphers.push(parseInt(ret.charAt(i)));
    var summ = ((+ziphers[0] + ziphers[2] + ziphers[4] + ziphers[6] + ziphers[8] + ziphers[10]) * 1 + (+ziphers[1] + ziphers[3] + ziphers[5] + ziphers[7] + ziphers[9] + ziphers[11]) * 3 ).toString();
    var last = summ.charAt(summ.length - 1);
	var rest = (last==0)? 0:(10 - last);
    return ret + rest;
	}

function setBarCod(avtoId, pref)
{
	$("#printBarCode").off("click");	
	if (avtoId)
	{	
		var barcod = createBarcode(avtoId, pref);
		$("#barcode").attr("src", `/api/barcode?bcid=ean13&text=${barcod}&includetext=true&height=7&width=0.8`);
		$("#printBarCode").on("click", function()
			{
				printImage(barcod);
			});		
	}
	else
	{
	$("#barcode").attr("src", "");
	}	
}	

function printImage(barcod)
	{
	var url = 	`/api/barcode?bcid=ean13&text=${barcod}&includetext=true&height=12&textxalign=center&textfont=Inconsolata`,
		win = window.open(url,"_blank","menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=200, height=100");
    win.onload = function ()
		{
        win.print();
		win.close();
		}
	}