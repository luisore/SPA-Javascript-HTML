function AddNewTask() {
	/**Adds a new task to the table
	**/
	var name = $('#name_input').val();
	var description = $('#description_input').val();
	var estimate = $('#estimate_input').val();
	var status = $('#status_input').val();


	if( [name,description,estimate,status].some(function (element) { return element === undefined || element === null || element ==="";}) ){
		console.log("one or more fields are empty");

		return 0;
	}
	console.log("Success adding row")
	console.log(name,description,estimate,status);
	//adding row logic                                                             
    var table = document.getElementById("tasks_table");
    var rowCount = $('#tasks_table tr').length;
    var row = table.insertRow(rowCount-1);
    var row_id = "row_"+(rowCount-1);
    $(row).attr("Id", row_id).attr("class", "task_row");
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);

	$(cell1).html(name);
	$(cell2).html(description);
	$(cell3).html(estimate);
	$(cell4).html(getStatusString(status)).attr( 'hidden_value', status );
	$(cell5).html(	'<button type="button" class="btn btn-success" onclick="EditRow(' + "'"+row_id+"'" + ')">Edit</button> ' +
					'<button type="button" class="btn btn-danger" onclick="DeleteRow(' + "'"+row_id+"'" + ')">Delete</button>');		

    //clean inputs
    [$('#name_input'), $('#description_input'), $('#estimate_input'), $('#status_input')].map(element => element.val(""));

    UpdateTotals(status);
}

function DeleteRow(row_name){
	/**hides a row
	**/
	$('#'+row_name).hide();
	status = $('#'+row_name).find("td").eq(3).attr('hidden_value');
	UpdateTotals(status);
}

function EditRow(row_name){
	/**hides a row and shows all the necessary inputs and a save button
	**/
	$('#'+row_name).hide();

	var trInput = 	'<tr id="edit_row_'+row_name+'">\n' +
						'<td><input id="name_input_'+ row_name +'" type="text" class="form-control" placeholder="Name" aria-label="Name" aria-describedby="basic-addon1"></td>\n' +
						'<td><input id="description_input_'+ row_name +'" type="text" class="form-control" placeholder="Description" aria-label="Description" aria-describedby="basic-addon1"></td>\n' +
						'<td><input id="estimate_input_'+ row_name +'" type="number" class="form-control" placeholder="Estimate" aria-label="Estimate" aria-describedby="basic-addon1"></td>\n' +
						'<td>\n' +
							'<div class="input-group mb-3">\n' +
							  '<select id="status_input_'+ row_name +'" class="custom-select" id="inputGroupSelect01">\n' +
							    '<option value="" selected>Choose...</option>\n' +
							    '<option value="planned">Planned</option>\n' +
							    '<option value="progress">in Progress</option>\n' +
							    '<option value="completed">Completed</option>\n' +
							  '</select>\n' +
							'</div>\n' +
						'</td>\n' +
						'<td><button type="button" class="btn btn-info" onclick="SaveEdit('+ "'"+row_name+"'" +')">Save</button></td>\n' +
					'</tr>'

	$(trInput).insertAfter('#'+row_name);

	$('#name_input_' + row_name).val($('#'+row_name).find("td").eq(0).html());
	$('#description_input_' + row_name).val($('#'+row_name).find("td").eq(1).html());
	$('#estimate_input_' + row_name).val($('#'+row_name).find("td").eq(2).html());
	var status = $('#'+row_name).find("td").eq(3).attr('hidden_value');
	$('#status_input_' + row_name).val(status);

}

function getStatusString(number){
	console.log(number);
	var status_string;
	switch (number) {
	    case 'planned':
	        status_string = "Planned";
	        break;
	    case 'progress':
	        status_string = "in Progress";
	        break;
	    case 'completed':
	        status_string = "Completed";
	    }
	console.log(status_string);
	return status_string;
}


function SaveEdit(row_name){
	/**saves all the data in the specific row
		and deletes the edit inputs
	**/
	var name = $('#name_input_' + row_name).val();
	var description = $('#description_input_' + row_name).val();
	var estimate = $('#estimate_input_' + row_name).val();
	var status = $('#status_input_' + row_name).val();

	if( [name,description,estimate,status].some(function (element) { return element === undefined || element === null || element ==="";}) ){
		console.log("one or more fields are empty");
		return 0;
	}

	$('#'+row_name).find("td").eq(0).html(name);
	$('#'+row_name).find("td").eq(1).html(description);
	$('#'+row_name).find("td").eq(2).html(estimate);
	$('#'+row_name).find("td").eq(3).html(getStatusString(status)).attr( 'hidden_value', status );
	$('#'+row_name).show();
	$('#edit_row_'+row_name).remove();
	UpdateTotals(status)
}

function UpdateTotals(status){
	/**sums an array of all the visible rows with the status criteria and puts it in the task totals table
	**/
	console.log(status);
	var values = $('.task_row').filter(":visible").filter( function() { return $(this).find("td").eq(3).attr('hidden_value') == status ;}).map( function() {return $(this).find("td").eq(2).html();});
	var total = Object.values(values).slice(0, values.length).map(Number).reduce(function add(a, b) {return a + b;}, 0);
	$('#'+status+'_hours').html(total);
}