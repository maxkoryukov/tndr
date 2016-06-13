$(document).ready(function doc_ready(){

	$('.cl-delete').click(function(){
		var $this = $(this);
		$this.addClass('tndr-load');
		$this.prop('disabled', true);

		var bid = $this.data('builder');

		$.ajax({
			//{{! TODO : url }}
			url: '/builder/',
			context: this,
			dataType: 'json',
			method: 'DELETE',
			data: {
				id: bid,
			}
		})
			.always(function(){
				$(this).removeClass('tndr-load');
				$(this).prop('disabled', false);
			})
			.done(function(data){
				// redirect to the index
				//{{! TODO: url }}
				window.location = '/builder/index';

				showMessage(MSG.success, data.message);
			})
			.fail(function(data){
				$('.modal').modal('hide');

				var resp = data.responseJSON;
				showMessage(MSG.error, resp.error);
			});
	});

	var $eform = $('.cl-builder-edit-main');

	$eform.find('.cl-save').click(function(){
		$(this).addClass('tndr-load');
		$(this).prop('disabled', true);

		var fdata = $eform.serialize();

		$.ajax({
			//{{! TODO : url }}
			url: '/builder/',
			context: this,
			dataType: 'json',
			method: 'PUT',
			data: fdata
		})
			.always(function(){
				$(this).removeClass('tndr-load');
				$(this).prop('disabled', false);
			})
			.done(function(data){
				//$('.modal').modal('hide');

				showMessage(MSG.info, data.message);
				$eform.find('.cl-cancel').click();
			})
			.fail(function(data){
				//$('.modal').modal('hide');

				var resp = data.responseJSON;
				showMessage(MSG.error, resp.error);
			});

	});

	$eform.find('.cl-cancel').click(function(){
		if (mode_create){
			window.history.back();
		} else {
			$eform.find('.cl-state-edit').hide();
			$eform.find('.cl-state-read').show();

			$eform.find('.cl-editable').prop('disabled', true);
		}
	});

	$eform.find('.cl-edit').click(function(){
		$eform.find('.cl-state-edit').show();
		$eform.find('.cl-state-read').hide();

		$eform.find('.cl-editable').prop('disabled', false);
	});

	$eform.find('.cl-create').click(function(){
		$(this).addClass('tndr-load');
		$(this).prop('disabled', true);

		var fdata = $eform.serialize();

		$.ajax({
			//{{! TODO : url }}
			url: '/builder/',
			context: this,
			dataType: 'json',
			method: 'POST',
			data: fdata
		})
			.always(function(){
				$(this).removeClass('tndr-load');
				$(this).prop('disabled', false);
			})
			.done(function(data){
				//$('.modal').modal('hide');

				var b = data.data;

				//{{! TODO : url }}
				window.location = '/builder/' + b.id;
				showMessage(MSG.info, data.message);
			})
			.fail(function(data){
				//$('.modal').modal('hide');

				var resp = data.responseJSON;
				showMessage(MSG.error, resp && resp.error);
			});

	});


	// EMPLOYEE STUFF
	var load_employees = function(){
		// show loader SAFE
		var $sec = $('.employee-list');
		$sec.addClass('tndr-load-block');

		$.ajax({
			//{{! TODO : url }}
			url: '/builder/employees',
			method: 'GET',
			context: $sec,
			data : {
				builder: bid,
			},
			dataType: 'json'
		})
			.always(function(){
				// hide loader
				$sec.removeClass('tndr-load-block');
			})
			.done(function(data){
				ko.mapping.fromJS(data.data, viewModel.employees);
			})
			.fail(function(data){
				//$('.modal').modal('hide');

				var resp = data.responseJSON;
				showMessage(MSG.error, resp && resp.error || 'Error');
			})
		;
	};

	// ======================================================
	// Employee stuff
	$('.cl-employee-add').click(function(){

		viewModel.employees.unshift(ko.mapping.fromJS({
			id:null,
			surname: '',
			name: '',
			phone: null,
			phone_link: null,
			note: null,
			job: null,
		}));

		var $itemroot = $('.employee-list').find('.employee-item').first();
		var currentsel = $itemroot.data('current-state-sel') || '.cl-state-read';
		var newsel = '.cl-state-create';

		$('button.cl-employee-add').prop('disabled', true);

		$itemroot.find(currentsel).hide();
		$itemroot.find(newsel).show();

		$itemroot.data('current-state-sel', newsel);

	});

	$('.employee-list').on('click', '.cl-employee-edit', function(){
		var $itemroot = $(this).parents('.employee-item');
		var currentsel = $itemroot.data('current-state-sel') || '.cl-state-read';
		var newsel = '.cl-state-edit';

		$itemroot.find(currentsel).hide();
		$itemroot.find(newsel).show();

		$itemroot.data('current-state-sel', newsel);
	});

	$('.employee-list').on('click', '.cl-employee-cancel', function(){
		var $itemroot = $(this).parents('.employee-item');
		var currentsel = $itemroot.data('current-state-sel') || '.cl-state-read';
		var newsel = '.cl-state-read';

		if (currentsel === '.cl-state-create'){
			viewModel.employees.shift();
			$('button.cl-employee-add').prop('disabled', false);
		} else {
			$itemroot.find(currentsel).hide();
			$itemroot.find(newsel).show();

			$itemroot.data('current-state-sel', newsel);
		}
	});

	$('.employee-list').on('click', '.cl-employee-save', function(){
		var $itemroot = $(this).parents('.employee-item');
		var currentsel = $itemroot.data('current-state-sel') || '.cl-state-read';

		$itemroot.find(currentsel).hide();

		var $f = $itemroot.find('form.cl-employee-edit-form');
		var fdata = $f.serialize();

		var $sec = $('.employee-list');
		$sec.addClass('tndr-load-block');

		$.ajax({
			//{{! TODO : url }}
			url: '/builder/employees',
			method: 'PUT',
			context: $sec,
			data : fdata,
			dataType: 'json'
		})
			.always(function(){
				// hide loader
				$sec.removeClass('tndr-load-block');
			})
			.done(function(data){
				ko.mapping.fromJS(data.data, viewModel.employees);
				showMessage(MSG.success, data.message);
			})
			.fail(function(data){
				var resp = data.responseJSON;
				showMessage(MSG.error, resp && resp.error || 'Error');
			})
		;
	});

	$('.employee-list').on('click', '.cl-employee-create', function(){
		var $itemroot = $(this).parents('.employee-item');
		var currentsel = $itemroot.data('current-state-sel') || '.cl-state-read';

		$itemroot.find(currentsel).hide();

		var $f = $itemroot.find('form.cl-employee-edit-form');
		var fdata = $f.serialize();

		var $sec = $('.employee-list');
		$sec.addClass('tndr-load-block');

		$.ajax({
			//{{! TODO : url }}
			url: '/builder/employees',
			method: 'POST',
			context: $sec,
			data : fdata,
			dataType: 'json'
		})
			.always(function(){
				// hide loader
				$sec.removeClass('tndr-load-block');
				$('button.cl-employee-add').prop('disabled', false);
			})
			.done(function(data){

				ko.mapping.fromJS(data.data, viewModel.employees);
				showMessage(MSG.success, data.message);
			})
			.fail(function(data){
				var resp = data.responseJSON;
				showMessage(MSG.error, resp && resp.error || 'Error');
			})
		;
	});


	$('.cl-delete-employee-modal').on('show.bs.modal', function (event) {
		var $button = $(event.relatedTarget); // Button that triggered the modal

		var $delbtn = $(this).find('.cl-delete-employee');
		$delbtn.data('builder', $button.data('builder'));
		$delbtn.data('employee', $button.data('employee'));
	});

	$('.cl-delete-employee').click(function(){
		var $this = $(this);
		$this.addClass('tndr-load');
		$this.prop('disabled', true);

		var $sec = $('.employee-list');
		$sec.addClass('tndr-load-block');

		var bid = $this.data('builder');
		var eid = $this.data('employee');

		$.ajax({
			//{{! TODO : url }}
			url: '/builder/employees',
			context: this,
			method: 'UNLINK',
			data : {
				builder: bid,
				employee: eid,
			},
			dataType: 'json',
		})
			.always(function(){
				$(this).removeClass('tndr-load');
				$(this).prop('disabled', false);

				$sec.removeClass('tndr-load-block');
			})
			.done(function(data){
				$('.modal').modal('hide');

				showMessage(MSG.success, data.message);
				ko.mapping.fromJS(data.data, viewModel.employees);
			})
			.fail(function(data){
				$('.modal').modal('hide');

				var resp = data.responseJSON;
				showMessage(MSG.error, resp && resp.error || data.statusText);
			})
		;
	});
	// EMPLOYEE STUFF


	var $esec = $('.cl-employees');
	var bid = $esec.data('builder');

	//{{! HACK: this is very weak point, viewModel is binded to the window... }}
	var viewModel = {};
	window.viewModel = viewModel;

	viewModel.employees = ko.mapping.fromJS([]);
	ko.applyBindings(viewModel);

	if (!mode_create){
		load_employees();
	}
});
