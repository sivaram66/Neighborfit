from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth import get_user_model
from django.contrib.auth import logout as auth_logout
from .utils import send_otp

User = get_user_model()


def register(request):
    if request.method == 'POST':
        full_name = request.POST.get('full_name')
        email = request.POST.get('email')
        phone = request.POST.get('phone') 
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')

        if password != confirm_password:
            messages.error(request, "Passwords do not match.")
            return redirect('signup')

        if not phone:
            messages.error(request, "Phone number is required.")
            return redirect('signup')

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email is already taken.")
            return redirect('signup')
        if User.objects.filter(phone=phone).exists():
            messages.error(request, "Phone number is already taken.")
            return redirect('signup')

        otp = send_otp(email)
        request.session['signup_otp'] = otp
        request.session['signup_email'] = email
        request.session['signup_full_name'] = full_name
        request.session['signup_password'] = password
        request.session['signup_phone'] = phone  

        messages.success(request, "OTP sent to your email.")
        return redirect('validate_otp')

    return render(request, 'register.html')

def validate_otp(request):
    if request.method == 'POST':
        otp_entered = ''.join([request.POST.get(f'otp{i}', '') for i in range(1, 7)])
        session_otp = str(request.session.get('signup_otp'))

        if otp_entered == session_otp:
            email = request.session.get('signup_email')
            full_name = request.session.get('signup_full_name')
            password = request.session.get('signup_password')
            phone = request.session.get('signup_phone')
            if not phone:
                messages.error(request, "Phone number missing in session. Please try again.")
                return redirect('signup')

            user = User.objects.create_user(email=email, password=password, phone=phone)
            user.full_name = full_name
            user.save()
            for key in ['signup_otp', 'signup_email', 'signup_full_name', 'signup_password', 'signup_phone']:
                if key in request.session:
                    del request.session[key]

            messages.success(request, "Registration successful! Please log in.")
            return redirect('login')
        else:
            messages.error(request, "Invalid OTP. Please try again.")
            return redirect('validate_otp')

    return render(request, 'validate_otp.html')

def login_view(request):
    if request.method == 'POST':
        email_or_phone = request.POST.get('emailOrPhone')
        password = request.POST.get('password')

        user_obj = None
        try:
            user_obj = User.objects.get(email=email_or_phone)
        except User.DoesNotExist:
            try:
                user_obj = User.objects.get(phone=email_or_phone)
            except User.DoesNotExist:
                messages.error(request, "No account found with this email or phone number.")
                return redirect('login')

        user = authenticate(request, email=user_obj.email, password=password)

        if user is not None:
            auth_login(request, user)
            messages.success(request, "Logged in successfully.")
            return redirect('home')
        else:
            messages.error(request, "Incorrect password.")
            return redirect('login')

    return render(request, 'login.html')

def logout_view(request):
    auth_logout(request)
    messages.success(request, "Logged out successfully.")
    return redirect('home')

def resend_otp(request):
    email = request.session.get('email')
    if email:
        otp = send_otp(email)
        request.session['otp'] = otp
        messages.success(request, "A new OTP has been sent to your email.")
    else:
        messages.error(request, "Unable to resend OTP. Please try again.")
    return redirect('validate_otp')
