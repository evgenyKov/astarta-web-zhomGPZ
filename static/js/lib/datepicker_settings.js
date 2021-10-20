$.datepicker.regional['ua'] = {clearText: 'Очистити', clearStatus: '',
     closeText: 'Закрити', closeStatus: '',
     prevText: '&lt;&lt;',  prevStatus: '',
     nextText: '&gt;&gt;', nextStatus: '',
     currentText: 'Сьогодні', currentStatus: '',
     monthNames: ['Січень','Лютий','Березень','Квітень','Травень','Червень',
     'Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'],
     monthNamesShort: ['Січ','Лют','Бер','Кві','Тра','Чер',
     'Лип','Сер','Вер','Жов','Лис','Гру'],
     monthStatus: '', yearStatus: '',
     weekHeader: 'Не', weekStatus: '',
     dayNames: ['неділя','понеділок','вівторок','середа','четвер','пятниця','суббота'],
     dayNamesShort: ['нед','пнд','вів','срд','чтв','птн','сбт'],
     dayNamesMin: ['Нд','Пн','Вт','Ср','Чт','Пт','Сб'],
     dayStatus: 'DD', dateStatus: 'D, M d',
     dateFormat: 'yy-mm-dd', firstDay: 1, 
	initStatus: '', isRTL: false};
$.datepicker.setDefaults($.datepicker.regional['ua']);

function cleanDatepicker() {
   var old_fn = $.datepicker._updateDatepicker;

   $.datepicker._updateDatepicker = function(inst) {
      old_fn.call(this, inst);

      var buttonPane = $(this).datepicker("widget").find(".ui-datepicker-buttonpane");

      $("<button type='button' class='ui-datepicker-clean ui-state-default ui-priority-primary ui-corner-all' style='color:red;width:70px;'>X</button>").appendTo(buttonPane).click(function(ev) {
          $.datepicker._clearDate(inst.input);
      }) ;
   }
//	$('<style type="text/css"> .ui-datepicker-current { display: none; } </style>').appendTo("head");   
}
