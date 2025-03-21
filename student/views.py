from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.views.decorators.http import require_POST
from .models import Student
from .forms import StudentForm


def home(request):
    form = StudentForm()
    students = Student.objects.all() 
    context = {
        'form':form,
        'students':students,
    }
    return render(request, 'home.html', context)

@csrf_protect
def save_data(request):
    if request.method == 'POST':
        form = StudentForm(request.POST)
        if form.is_valid():
            # Save the data to the database
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            phone = form.cleaned_data['phone']
            student = Student(name=name, email=email, phone=phone)
            student.save()

            # Retrieve all the data from the database
            queryset = Student.objects.values()
            students = list(queryset)
            return JsonResponse({'status': 'success', 'message': 'Data saved successfully!', 'students':students})
        else:
            return JsonResponse({'status':'failure', 'message':'Unable to save the data'})
    else:
        return JsonResponse({'status':'failure', 'message':'Unable to save the data'})

@csrf_exempt
@require_POST
def delete_data(request):
    rowID = request.POST.get('row_id')

     # delete the row from the database
    try:
        student = Student.objects.get(id=rowID)
        student.delete()
        return JsonResponse({'success': True})
    except Student.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'User not found'})
    
@csrf_protect
@require_POST
def edit_data(request):
    rowID = request.POST.get('row_id')
    student = Student.objects.get(pk=rowID)
    student_data = {'id':student.id, 'name':student.name, 'email':student.email, 'phone':student.phone}
    return JsonResponse(student_data)

@csrf_protect
@require_POST
def update_data(request):
    form = StudentForm(request.POST)
    if form.is_valid():
        rowID = request.POST.get('studentid')
        name = form.cleaned_data['name']
        email = form.cleaned_data['email']
        phone = form.cleaned_data['phone']
        student = Student(id=rowID, name=name, email=email, phone=phone)
        student.save()

        querset = Student.objects.values()
        students = list(querset)
        return JsonResponse({'status': True, 'message': 'Data Updated successfully!', 'students':students})
    else:
        return JsonResponse({'status': False, 'message':'Unable to Update the data'})