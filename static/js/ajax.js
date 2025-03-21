$(document).ready(function() {
    // Define regular expressions for name, email, and phone fields
    var nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var phoneRegex = /^\d{10}$/;

    // Add custom methods to validate name, email, and phone fields
    $.validator.addMethod("validName", function(value, element) {
        return this.optional(element) || nameRegex.test(value);
    }, "Please enter a valid name");

    $.validator.addMethod("validEmail", function(value, element) {
        return this.optional(element) || emailRegex.test(value);
    }, "Please enter a valid email address");

    $.validator.addMethod("validPhone", function(value, element) {
        return this.optional(element) || phoneRegex.test(value);
    }, "Please enter a valid phone number");

    // Initialize form validation
    $("#formid").validate({
        rules: {
            name: {
                required: true,
                validName: true
            },
            email: {
                required: true,
                validEmail: true
            },
            phone: {
                required: true,
                validPhone: true
            }
        },
        messages: {
            name: {
                required: "Please enter your name"
            },
            email: {
                required: "Please enter your email"
            },
            phone: {
                required: "Please enter your phone number"
            }
        },
        errorPlacement: function(error, element) {
            // display error message in red
            error.addClass('error');
            error.insertAfter(element);

            // change field border on error
            $(element).addClass('error');
        },
        success: function(label, element) {
            $(element).removeClass('error');
        },
    });
    $('#formid').on('click', '#btnsave', function(event){
        event.preventDefault();
        if($('#formid').valid()){
            // submit form data to the function save_data() in views.py using ajax
            // console.log($('#formid').serialize())
            $.ajax({
                url: "/save/", 
                method: "POST",
                data: $('#formid').serialize(),
                success: function (data) { 
                    if(data.status == "success"){
                        x = data.students
                        output = "";
                        for(i=0; i<x.length; i++){
                            output += "<tr id=" + x[i].id + "><td>" + x[i].id + 
                                    "</td><td>" + x[i].name +
                                    "</td><td>" + x[i].email +
                                    "</td><td>" + x[i].phone +
                                    "</td><td> <input type='button' value='Edit' class='btn btn-warning btn-sm btn-edit' data-sid=" + x[i].id + "> <input type='button' value='Delete' class='btn btn-danger btn-sm btn-delete' data-sid=" + x[i].id +">"
                        }
                        $('#tbody').html(output);
                        $('form')[0].reset();
                        $('#formid').validate().resetForm();
                    }
                    else{
                        console.log(data.message)
                    }
                 },
            });
        }else{
            console.log('Form is invalid');
        }
    });
    
    // Bind click event handler to parent element
    $('#tbody').on('click', '.btn-delete', function(){
        rowID = $(this).data('sid')
        csrfToken = $('input[name="csrfmiddlewaretoken"]').val()

        $.ajax({
            url: '/delete/',
            method: 'POST',
            data: {
                'row_id': rowID,
                'csrfmiddlewaretoken':csrfToken,
            },
            success: function(response){
                // remove the row from table
                $('#' + rowID).remove();
                $('form')[0].reset();
                $('#btnupdate').off('click');
                $('#btnupdate').attr({'value': 'Save', 'id':'btnsave'}).removeClass('btn-warning').addClass('btn-success');
                $('#form-title').text('Add Student').removeClass('alert-warning').addClass('alert-info');
                $("#formid").validate().resetForm();
            },
            error: function(xhr, status, error){
                // handle error response
                alert('Error: ' + error);
            }
        });
    });

    // Bind click event handler to parent element
    $('#tbody').on('click', '.btn-edit', function(){
        
        rowID = $(this).data('sid');
        csrfToken = $('input[name="csrfmiddlewaretoken"]').val()
        $.ajax({
            url: '/edit/',
            method: 'POST',
            data: {'row_id':rowID, 'csrfmiddlewaretoken':csrfToken,},
            success: function(response){
                // reset the form
                $("#formid").validate().resetForm();

                // display the data in respective form fields
                $('#studentid').val(response.id)
                $('#nameid').val(response.name)
                $('#emailid').val(response.email)
                $('#phoneid').val(response.phone)

                // change the heading as 'Update Student' and also change the functionality of save button to update button
                $('#btnsave').off('click');
                $('#btnsave').attr({'value': 'Update', 'id':'btnupdate'}).removeClass('btn-success').addClass('btn-warning');
                $('#form-title').text('Update Student').removeClass('alert-info').addClass('alert-warning');
            }
        });
    });
    $('#formid').on('click', '#btnupdate', function(event) {
        event.preventDefault();
        if($('#formid').valid()){
            // submit form data to the function save_data() in views.py using ajax
            // console.log($('#formid').serialize())
            $.ajax({
                url: "/update/", 
                method: "POST",
                data: $('#formid').serialize(),
                success: function (data) { 
                    if(data.status){
                        x = data.students
                        output = "";
                        for(i=0; i<x.length; i++){
                            output += "<tr id=" + x[i].id + "><td>" + x[i].id + 
                                    "</td><td>" + x[i].name +
                                    "</td><td>" + x[i].email +
                                    "</td><td>" + x[i].phone +
                                    "</td><td> <input type='button' value='Edit' class='btn btn-warning btn-sm btn-edit' data-sid=" + x[i].id + "> <input type='button' value='Delete' class='btn btn-danger btn-sm btn-delete' data-sid=" + x[i].id +">"
                        }
                        $('#tbody').html(output);
                        $('form')[0].reset();

                        // change update button to save button
                        $('#btnupdate').off('click');
                        $('#btnupdate').attr({'value': 'Save', 'id':'btnsave'}).removeClass('btn-warning').addClass('btn-success');
                        $('#form-title').text('Add Student').removeClass('alert-warning').addClass('alert-info');
                        // reset the form
                        $("#formid").validate().resetForm();
                    }
                    else{
                        console.log(data.message)
                    }
                 },
            });
        }else{
            console.log('Form is invalid');
        }
    });
    $('#btncancel').click(function () { 
        // change the button text and attributes
        $('#btnupdate').off('click');
        $('#btnupdate').attr({'value': 'Save', 'id':'btnsave'}).removeClass('btn-warning').addClass('btn-success');
        $('#form-title').text('Add Student').removeClass('alert-warning').addClass('alert-info');
        $("#formid").validate().resetForm();
     });
});