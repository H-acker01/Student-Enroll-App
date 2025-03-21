from django import forms
from .models import Student

class StudentForm(forms.ModelForm):
    class Meta:
        model = Student
        fields = ['name', 'email', 'phone']
        widgets = {
            'name':forms.TextInput(attrs={'class':'form-control', 'id':'nameid'}),
            'email':forms.EmailInput(attrs={'class':'form-control', 'id':'emailid'}),
            'phone':forms.TextInput(attrs={'class':'form-control', 'id':'phoneid'}),
        }