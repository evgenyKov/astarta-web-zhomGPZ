/*var validate = {
	fields	:	{
				},
	forms	:	{
			formId		:	{
				fields	: {
					fieldId:	{
						valid		:	boolean|"group"|предустановленный тип валидации|function ,
						mandatory	:	boolean|function,
						before		:	function() {
										},
						after		:	function() {
										}
						},......
					},
				before	:	function() {
					},
				after	:	function()	{
					},
				valid	:	function()	{	
					}
				},
			},
	onlyGroups	:	[
						[
						fieldId|{fieldId:function},
						],
					],
	anyGroups	:	[
						{
						master: [{field:fieldId,valid:function} | fieldId]  | fieldId
						slave:	[{field:fieldId,valid:function} | fieldId]	| fieldId
						}
						|
						
						
						
					],
	subGroups	:	[
					],
// в начале события		
	before		:	function() {
		},
// в конце события				
	after		:	function() {
		},
// дефолтные валидаторы 		
	defValid	:	[
					{"id": function},
					]
	}
	
field: only
		subs:	value: func
				masters [
						{field:
						value:	
						]
				slaves,
				add	

*/

function isButton(key) {
	for (var butt in validate.buttons) {
		if (butt == key)
			return true;
		}
	return false;	
	}
	
function isNoEmpty(id) {
	var val = getValue(id);
	if ((val == "") || (val == []) || (val == "[object Object]")) 	
		return false;
	return true;	
	}	

function checkValid(id) {
	if (validate.fields[id].group === null) {
		if (validate.fields[id].valid) {
			return validate.fields[id].valid.call(this,id)
			}
		else {
			return true
			}
		}
	else {
		return validate.fields[id].group.value.call(this,id);
		}
	}
	
function getMandatory(id) {
	var mandatory = validate.fields[id].mandatory;
	if (mandatory == null)
		mandatory = false;
	if (typeof(mandatory) == "function")
		mandatory = mandatory.call(this);
	return mandatory;	
	}

function toggleValid(id, set) {
	if (set == null)
		set = true;
	var valid = checkValid(id);
	var group = validate.fields[id].group;
	if (group === null)
		var fields = [id]
	else
		var fields = group.fields;
	for (i in fields) {
		var nextId = $("#" + fields[i]);
		if (!nextId.hasClass("hidden")) {
			var target = nextId.parent();
			if (nextId.attr("type") == "file") {
				target = $(target.parent().children()[0]);
				var errClass = (getMandatory(id))? 'error':'warning';	
				if (valid) {
					target.removeClass('error');
					target.removeClass('warning');
					if (set)
						target.addClass("success");
					}	
				else {
					target.removeClass("success");
					if (set) {
						target.addClass(errClass);
						}
					}
				}
			else {	
				if (set) {
					var errClass = (getMandatory(id))? 'has-error':'has-warning';
					target.removeClass('has-error');
					target.removeClass('has-warning');
					target.removeClass('has-success');				
					if (valid)
						target.addClass("has-success")
					else
						target.addClass(errClass);
					}
				}
			}	
		}	
	return valid;	
	}
	
function setValidClasses(id) {
	var isValid = toggleValid(id);
//only	
	var only = validate.fields[id].only;
	for (var i in only) {
		var key = only[i].field;
		if (only[i].value == null){
			setEnable(key,!isValid);
			if (isValid) {
				var data = $("#" + key).data("events");
				setEmpty(key);
				toggleValid(key,false);
				}
			else
				toggleValid(key);
			}
		else
			only[i].value.call(this,key);
		}
//subs	

	var subs = validate.fields[id].subs;
	for (var i in subs) {
		var sub =  subs[i],
			value = sub.value,
			valid;
		if (value == null)
			valid = validate.fields[id].valid.call(this,id)
		else
			valid = value.call(this,id);
		if (valid) {
			if (!sub.anyMaster) {
				for (j in sub.masters) {
					var master = sub.masters[j];
					if (master.value == null)
						valid = validate.fields[id].valid.call(this,master.field)
					else
						valid = master.value.call(this, master.field);
					if (!valid) 
						break;
					}
				}
			}	
		else if (sub.anyMaster) {
				for (j in sub.masters) {
					var master = sub.masters[j];
					if (master.value == null)
						valid = validate.fields[id].valid.call(this,master.field)
					else
						valid = master.value.call(this, master.field);
					if (valid) 
						break;
					}	
			};	
		for (j in sub.slaves) {
			var slave = sub.slaves[j];
			var noButton = !(isButton(slave.field) || $("#" + slave.field).hasClass("hidden"));
			if (noButton) {
				if (valid) {
					if (slave.value !== null)
						slave.value.call(this,slave.field); 
						setValidClasses(slave.field);		
					}
				else {
					setEmpty(slave.field);
					$("#" + slave.field).trigger("change");
					}
				}
			setEnable(slave.field,valid);
			if (noButton) {
				if (valid)
					toggleValid(slave.field)
				else {
					var div = $("#" + slave.field).parent();
					div.removeClass('has-error');
					div.removeClass('has-warning');
					}
				}
			else {
//				console.log(slave.field);
				}	
			}
		}
	toggleValid(id, false);					
	}	

function prepareValidation() {
	for (var i in validate.subGroups) {
		var subgroup=validate.subGroups[i];
		for (var j in subgroup.master) {
			if (typeof(subgroup.master[j]) == "string") {
				subgroup.master[j] = {
					field: subgroup.master[j],
					value: null
					}
				}
			}
		for (var j in subgroup.slave) {
			if (typeof(subgroup.slave[j]) == "string") {
				subgroup.slave[j] = {
					field: subgroup.slave[j],
					value: null
					}
				}
			}		
		}
	validate.defaultValidators = {
		"noempty" : function(id) {
			return isNoEmpty(id)
			}
		}
	validate.fields = {};
	validate.buttons = {};
	for (var formKey in validate.forms) {
		var form = validate.forms[formKey];
		for (var fieldKey in form.fields) {
			if (typeof(form.fields[fieldKey]))
				validate.fields[fieldKey] = form.fields[fieldKey];
			if (form.fields[fieldKey] == "validateNoEmpty") {
				validate.fields[fieldKey] = {
					valid:	"noempty",
					mandatory:	false
					}
				}
			if (form.fields[fieldKey] == "validateNoEmptyMandatory") {
				validate.fields[fieldKey] = {
					valid:	"noempty",
					mandatory:	true
					}
				}
			if (typeof(validate.fields[fieldKey].valid)	=="string")
				validate.fields[fieldKey].valid = validate.defaultValidators[validate.fields[fieldKey].valid]
			validate.fields[fieldKey].formKey=formKey;
			validate.fields[fieldKey].only = [];
			validate.fields[fieldKey].any = [];
			validate.fields[fieldKey].subs = [];
			validate.fields[fieldKey].group = null;
			validate.fields[fieldKey].initValue = null;
			var initEnable=true;
			for (var i in form.disabled) {
				if (fieldKey == form.disabled[i]) {
					initEnable = false;
					break;
					}
				}
			validate.fields[fieldKey].initEnable = initEnable;
			}
// устанавливаем массив кнопок			
		for (var i in form.buttons) {
			buttonKey = form.buttons[i];
			validate.buttons[buttonKey] = true;
			for (var k in form.disabled) {
				if (form.disabled[k] == buttonKey) {
					validate.buttons[buttonKey] = false;
					break;
					}
				}
			}
		}
/*		
	if 	(validate.anyGroups != null) {
		for (var i in validate.anyGroups) {
			var anyGroup = validate.anyGroups[i];
			var group = [];
			var keys = [];
			for (var j in anyGroup) {
				if (typeof(anyGroup[j]) == "string") {
					var key = anyGroup[j]
					group.push({
						field: key,
						value: null
						});
					}
				else {
					var key = anyGroup[j][0];
					group.push({
						field:	key,
						value:	anyGroup[j][1]
						})
					}
				keys.push(key);	
				}
			for (var j in keys) {
				for (var k in group) {
					if (group[k].field != keys[j]) {
						validate.fields[keys[j]].any.push(group[k]);
						}
					}
				}
			}
		}
*/		
	if 	(validate.onlyGroups != null) {
		for (var i in validate.onlyGroups) {
			var onlyGroup = validate.onlyGroups[i];
			var group = [];
			var keys = [];
			for (var j in onlyGroup) {
				if (typeof(onlyGroup[j]) == "string") {
					var key = onlyGroup[j]
					group.push({
						field: key,
						value: null
						});
					}
				else {
					var key = onlyGroup[j][0];
					group.push({
						field:	key,
						value:	onlyGroup[j][1]
						})
					}
				keys.push(key);	
				}
			for (var j in keys) {
				for (var k in group) {
					if (group[k].field != keys[j]) {
						validate.fields[keys[j]].only.push(group[k]);
						}
					}
				}
			}
		}
	if 	(validate.subGroups != null) {
		for (var i in validate.subGroups) {
			var subGroup = validate.subGroups[i];
			var any = validate.subGroups[i].any;
			var masterKeys = [];
			for (j in subGroup.master) {
				masterKeys.push(subGroup.master[j]);
				}
			for (j in masterKeys) {
				var anotherMasters = [];
				if (!any) 
					any = false;	
				
				for (k in masterKeys) {
					if (masterKeys[k].field != masterKeys[j].field)
						anotherMasters.push(masterKeys[k]);
					};
				validate.fields[masterKeys[j].field].subs.push({
					value:		masterKeys[j].value,
					slaves:		subGroup.slave,
					anyMaster:	any,
					masters:	anotherMasters
					})
				}
			}	
		}	
	var groups = validate.groups;
	if 	(groups != null) {
		for (var i in groups) {
			var group = groups[i];
			for (j in group.fields) {
				var fieldId = group.fields[j];
				validate.fields[fieldId].group = group;
				}
			}
		}	
	}	
	
	
function initValidateField(key) {;
	validate.fields[key].initValue = getValue(key);
	setValidClasses(key);	
	}
	
function initValidation(formId,skipSetListener) {
	var form = validate.forms[formId];
	for (var key in form.fields) {
		var el = $("#" + key);
		var mandatory = getMandatory(key);
		var valid = checkValid(key);
		validate.fields[key].initValue = getValue(key);
		if (!el.hasClass("disabled") && !el.hasClass("hidden")) {
			var target = el.parent(),errorClass, successClass, warningClass;
			if (el.attr("type") == "file") {
				target = $(target.parent().children()[0]);
				errorClass = "error";
				successClass = "success";
				warningClass = "warning";				
				}
			else {
				errorClass = "has-error";
				successClass = "has-success";
				warningClass = "has-warning";				
				}	
			
			if (valid) {
				target.removeClass(warningClass);
				target.removeClass(errorClass);
				target.addClass(successClass);
				}
			else {
				if (mandatory) {
					target.removeClass(successClass);
					target.removeClass(warningClass);
					target.addClass(errorClass);
					}
				else {	
					target.removeClass(successClass);
					target.removeClass(errorClass);
					target.addClass(warningClass);
					}
				}
			}	
		if (!skipSetListener) {
			el.on("change",function(event) {
				isFile	=	$(this).hasClass("file");
				if (!isFile) {
					event.stopPropagation();
					validateField(event,this);
					}
				else {
					validateField(event,this);
					}
				});
			if (!el.parent().hasClass("sel2") && !el.hasClass("date") && !el.hasClass("file")) {
				el.on("keyup",function(event) {
					event.stopPropagation();			
					$(this).trigger("change");
					return false;
					});
				}
			}	
		}
	}

function validateField(ev,obj) {	
var field = validate.fields[obj.id];
var form =validate.forms[field.formKey]; 
if (validate.before != null)
	validate.before.call(obj);
if  (form.before != null)
	form.before.call(obj);
if (field.before != null)
	field.before.call(obj);
setValidClasses(obj.id);
if (field.after != null)
	field.after.call(obj);
if  (form.after != null)
	form.after.call(obj);
if (validate.after != null)
	validate.after.call(obj);
return false;
	}
	
	
function clearForm(formKey) {
	for (var field in validate.forms[formKey].fields) {
		setEnable(field,validate.fields[field].initEnable);
		setValue(field,validate.fields[field].initValue);
		}
	for (var i in validate.forms[formKey].buttons) {
		var button = validate.forms[formKey].buttons[i];
		setEnable(button,validate.buttons[button]);
		}
	}
	
function isNumerik(input) {
	var RE = /^-{0,1}\d*\.{0,1}\d+$/;
	return (RE.test(input));
	}	
	
function isInt(val) {
	if (!isNumerik(val))
		return false;
	val = parseInt(val);	
	if (isNaN(val))
		return false;
	return val;	
	}
	
function isFloat(val) {
	if (!isNumerik(val))
		return false;
	val = parseFloat(val);	
	if (isNaN(val))
		return false;
	return val;	
	}
	
function isProcent(val) {
	val = isInt(val);
	if (val ===  false)
		return false;
	if  ((val<0) || (val>100))
		return false;
	return val;	
	}
	
function isProcentOrEmpty(val) {
	if (val === "")
		return 0;
	return isProcent(val);	
	}	