// fix bug with Select2 focus in modal window		

$.fn.modal.Constructor.prototype.enforceFocus = function ()
{
	var that = this,
		focusCount = 0;
	$(document).on('focusin.modal', function (e)
	{
		if ($(e.target).hasClass('select2-input'))
		{
			return true;
		}

		if (that.$element[0] !== e.target && !that.$element.has(e.target).length)
		{
			if (focusCount > 0)
				return true;
			focusCount++;
			that.$element.focus();
		}
	})
}