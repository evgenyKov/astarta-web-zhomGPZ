$(document).ready(() => {
	$.getJSON("/api/params", (resp) => {
		$.getJSON("/api/operator", (operators) => {
			$("#login").select2({
				data: operators.list
			})
		})
	})
})
