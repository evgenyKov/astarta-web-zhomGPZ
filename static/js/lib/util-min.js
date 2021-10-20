var pagePrepared=false;
jQuery.fn.extend({
    disable: function(state) {
        return this.each(function() {
            var $this = $(this);
            if($this.is('input, button'))
              this.disabled = state;
            else
              $this.toggleClass('disabled', state);
        });
    }
});
$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
                }
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
            }
		});
		return o;
	};
	


// ??????????	
var showPage, alfTicket;		
	 
function trimStr(str,length)
{
	if (str.length <= length+2)
		return str;
	return 	str.substr(0,length-3) + "...";
}

$.ui.dialog.prototype._allowInteraction = function(e)
{
    return !!$(e.target).closest('.ui-dialog, .ui-datepicker, .select2-drop').length;
};

function setEnable(el, value)
{
	if (value === null)
		value = true;
	if (typeof(el) == "string")
		el = $("#" + el);

	var isSel2 = (typeof(el.select2("val")) == "string") || (el.select2("val") instanceof Array);

	if (!value) {
		var div = el.parent();
		div.removeClass("has-warning");
		div.removeClass("has-error");
		div.removeClass("has-success");
		}
	if (isSel2) {
		el.select2("enable",value);
		}
	else if (el.hasClass("file")) {
		var parentSpan = el.parent();
		if (value)
			parentSpan.removeClass("disabled")
		else	
			parentSpan.addClass("disabled");		
		}
	else
		el.disable(!value);	
}	

function setValue(el,val)
{
	if (typeof(el) == "string")
		el = $("#" + el);
	var valSel2	= el.select2("val");
	var isArr = (valSel2 instanceof Array) ;
	var isStr = (typeof(valSel2)=="string");
	if (isStr || isArr) {
		el.select2("val",val)
		}
	else
		el.val(val);		
	}	
	
function setEmpty(el)
{
	setValue(el,"");
}	


function setEmtyFileInput(id)
{	
	$("#" +id + "name").html("");
	$("#" +id).val("").replaceWith($("#" +id).clone(true));
	$("#" +id).trigger("change");
}
	
	
function getValue(el)
{
	if (typeof(el) == "string")
		el = $("#" + el);
	var val = el.select2("val");
	if 	((typeof(val) == "string") || (val instanceof Array))
		return val;
	return el.val();	
}
	
function alertSuc(title,message,callback)
{
	if (!callback)
	{
		BootstrapDialog.alert({
			animate: false,
			title: title,
			message: message,
			type: BootstrapDialog.TYPE_SUCCESS
		})
	}
	else
	{
		BootstrapDialog.show({
			animate: false,
			title: title,
			message: message,
			type: BootstrapDialog.TYPE_SUCCESS,
			buttons: [
				{
				label: "Ok",
				action: function() {
					callback();
					}
				}
				]
		})
	}
}	

function alertErr(title,message) {
	BootstrapDialog.alert({
		animate: false,
		title: title,
        message: message,
        type: BootstrapDialog.TYPE_DANGER
	})
	}	
	
	
function confirmDialog(title, message, callbackOk, callbackNo, button1, button2)
	{
	BootstrapDialog.show(
			{
			animate: false,
			title: title,
			message: message,
			type: BootstrapDialog.TYPE_WARNING,
			buttons: [
				{
				cssClass: 'btn-success',
				label: button1 || "Так",
				icon: 'glyphicon glyphicon-ok',
				action: function(dialogRef) {
					if (callbackOk)
						{	
						callbackOk(dialogRef)
						}
					dialogRef.close();	
					}	
				},	
				{
				cssClass: 'btn-danger',
				label: button2 || "Ні",
				icon: 'glyphicon glyphicon-remove',
				action: function(dialogRef)
					{
					if (callbackNo)
						{
						callbackNo(dialogRef)
						}
					dialogRef.close();	
					}	
				}	
				]
			})
	}

/*				Вывод числа в строку с разделителями и 
				заданным количеством знаков после запятой
ГЛЮЧИТ!!!				*/
function numberToTriad(val,triadSeparator, decSeparator, fractNum) {
if (typeof(fractNum)=='undefined') fractNum = 2;
if (typeof(decSeparator)=='undefined') decSeparator = ".";
if (typeof(triadSeparator)=='undefined') triadSeparator = " ";

var num = parseInt(val).toString();
var numd = val.toString();
numd = numd.toString().substr(numd.indexOf('.')+1, fractNum);
while (numd.length<fractNum) 
  numd += '0';
var regEx = /(-?\d+)(\d{3})/;
while (regEx.test(num)) { num = num.replace(regEx,"$1"+triadSeparator+"$2"); }
if (numd) { num += decSeparator+numd; }
return num;
}
	
function fixed(s) {
var s1=s.replace(/\s/g,"");
var s2=s1.replace(",","\.");
if (s2 == "")
	return "";
return Number(s2).toFixed(2);
}
		
function prepareSelect2(fieldKey,dataArr)
	{
	var data;
	if (dataArr == null) 
		{
		data = []
		}
	else
		{
		data = dataArr;
		}
	var selector = (fieldKey.charAt(0)==".")? fieldKey : "#"+fieldKey;
	$(selector).select2({
		allowClear: true,
		data: data
		});
	if (dataArr == null)
		setEnable(fieldKey,false);
	}		
		
function numeric_format(val, thSep, dcSep) {
	if (!thSep) thSep = ' ';
	if (!dcSep) dcSep = '.';
	var lZero = (val < 0);
	var res = "" + val;
	var fLen = res.lastIndexOf('.');
	fLen = (fLen > -1) ? fLen : res.length;
	var tmpRes = res.substring(fLen);
	var cnt = -1;
	for (var ind = fLen; ind > 0; ind--) {
		cnt++;
		if (((cnt % 3) === 0) && (ind !== fLen) && (!lZero || (ind > 1))) {
			tmpRes = thSep + tmpRes;
		}
		tmpRes = res.charAt(ind - 1) + tmpRes;
		}
	return tmpRes.replace('.', dcSep);
	}	
	
function getStrDate(datestr)
	{
	if (datestr=="")
		{
		return null;
		}
	var d=datestr.split("-");
	return new Date(d[1]+"/"+d[2]+"/"+d[0]);
	}	
	
function loadScript(src, callback, appendTo)
	{
	var script = document.createElement('script');
	if (!appendTo)
		{
		appendTo = document.getElementsByTagName('head')[0];
		}
	if (script.readyState && !script.onload)
		{
// IE, Opera
		script.onreadystatechange = function()
			{
			if (script.readyState == "loaded" || script.readyState == "complete")
				{
				script.onreadystatechange = null;
				callback();
				}
			}
		}
	else
		{
 // Rest
		script.onload = callback;
		}
	script.src = src;
	appendTo.appendChild(script);
	}

	
function createDocViewLink(ref,name,ticket)
	{	
	if (!ticket) 
		{
		ticket = alfTicket;
		}
	return '<a target=_blank href="/alfresco/d/d/workspace/SpacesStore/' + ref.substr(24,36) +"/" + 
				name + '?ticket=' + ticket + '">' + name + '</a>';
	}

function docLink(name,ref)
	{
	return "<a target=_blank href='/share/page/context/mine/document-details?nodeRef=" + ref + "'>" + name + "</a>";
	}	

function prepareMain()
	{
	if (pagePrepared)
		return; 
	pagePrepared=true;			
	cleanDatepicker();	
	$(".date").datepicker({
		showButtonPanel: true
		});		

	$('body').on("change",".file", function(event) {
	//		event.stopPropagation();
		$(this).html("");
		var value = $(this).val();
		if (value>"") {
			var id = $(this)[0].id;
			var fileName = value.substring(value.lastIndexOf('/')+1);
//			var names = fileName.split('.');
//			var fileExt = names.pop().toLowerCase();
//			fileName=names.shift();
//			fileName = fileName.substr(0,60);
//			if (fileName.length == 60)
//				fileName=fileName+"...";
			$("#" + id + "name").html('<a href="#" id="del_' + id + '" class="btn-danger btn-mini clearLoadedFile">&nbsp;&nbsp;x&nbsp;&nbsp;</a>&nbsp;&nbsp;' + fileName);
// + "." + fileExt			
			}
		})
		
	$('body').on("click",".clearLoadedFile", function() {
		var id = this.id.substr(4);
		setEmtyFileInput(id);
		});	
	}	
	
function numToFixStr(num,l, crop)
	{
	if (!l)
		l = 2;
	var strNum = num.toString(); 
	if (strNum.length > l) {
		if (crop)
			return strNum.substr(0,l)
		else
			return strNum;
		}
	var nol = "";
	for (var i=0; i< l - strNum.length; i++ )
		nol += "0";
	return nol + strNum;
	}	
	
function getTimestamp()
	{
	var d = new Date();
	return "" + d.getFullYear() + numToFixStr(d.getMonth() + 1) + numToFixStr(d.getDate()) + numToFixStr(d.getHours()) + numToFixStr(d.getMinutes())+ numToFixStr(d.getSeconds()) + numToFixStr(d.getMilliseconds(),3); 
	}	
	
function timestampFormatted()
	{
	var currentDate = new Date();
	return currentDate.toJSON().substr(0,19).replace("T","_");
	}	
	
	
function checkSumma(str,isProcent)
	{
	if (!str)
		return false;
	str = str.replace(",",".");
	str = str.replace(/\s+/,"");
	RE = /^-{0,1}\d*\.{0,1}\d{0,2}$/;
	if (!RE.test(str))
		return false;
	try {
		var ret = parseFloat(str);
		}
	catch(e) {
		return false;
		}	
	if (ret<0)
		return false;	
	if (isProcent && (ret>100))
		return false;	
	return true;
	}  
function downloadLink(fileName,fileRef)
	{
	return '<a href="/share/proxy/alfresco/api/node/content/workspace/SpacesStore/' + fileRef.substr(24,36) +'/' + fileName + '?a=true">' + fileName + '</a>';	
	}
	
function setValidNodeName(str)
	{
	str = str.replace(/^\d+\.\s*/,"");
	str = str.replace(/\.?\;?$/,"");
	str = str.replace(/\\/g,"_");
	str = str.replace(/\//g,"_");
	str = str.replace(/\*/g," ");
	str = str.replace(/\"/g,"'");				
	str = str.replace(/\>/g,"]");
	str = str.replace(/\</g,"[");				
//	str = str.replace(/|/g,"!");						
	return str.trim();
	}
const startTimestamp = getTimestamp();	