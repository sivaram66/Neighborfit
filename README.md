# NeighborFit

NeighborFit is a modern, user-friendly platform for discovering the perfect home and neighborhood. It combines smart property search, rich neighborhood data, and seamless user experience, powered by a robust Django backend, Neon.tech PostgreSQL database, and Amazon S3 for image storage.

## Table of Contents

- [Demo Walkthrough](#demo-walkthrough)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [How Image Storage Works](#how-image-storage-works)
- [How to Run Locally](#how-to-run-locally)
- [Deployment Notes](#deployment-notes)

## Demo Walkthrough

### 1. Home Page (`index.html`)
- Clean, modern interface with a green gradient theme.
- Navigation bar for Home, About, Preferences, Contact, and authentication.
- Hero section introduces the platform’s mission.
- “Get Started” button leads to the Preferences page.

### 2. About Page (`about.html`)
- Explains NeighborFit’s vision and value proposition for users.

### 3. Preferences Page (`preferences.html`)
- Users select city, area, house type, budget, and lifestyle/amenity preferences.
- Dynamic form: area dropdown updates based on selected city.
- Submitting the form leads to the Results page.

### 4. Results Page (`results.html`)
- Shows properties matching user preferences.
- Listings display price, type, location, and main amenities.
- Filter and sort options available.
- Clicking a listing opens the Property Details page.

### 5. Property Details Page (`property_details.html`)
- Comprehensive property info: gallery, amenities, suitability.
- Shows similar properties and nearby places (schools, hospitals, shopping, etc.).
- Neighborhood context provided for informed decisions.

### 6. Contact Page (`contact.html`)
- Simple form for support, inquiries, or feedback.

### 7. Authentication Pages (`register.html`, `login.html`, `validate_otp.html`)
- Secure registration with Gmail and phone number.
- OTP verification for new users.
- Login via email or phone, with secure password authentication.
- Logout option in navigation.

### 8. Admin Panel (Django Admin)
- Admins can add, edit, or remove properties, upload images, and manage neighborhood locations.
- Inline editing for property images and map locations.

### 9. Image Handling (S3 Integration)
- All property images are stored in a secure Amazon S3 bucket.
- Ensures fast, reliable image access and scalability.

## Tech Stack

| Layer                | Technology/Service         | Purpose                                  |
|----------------------|---------------------------|-------------------------------------------|
| Backend Framework    | Django (Python)           | Core business logic, APIs, admin panel    |
| Database             | Neon.tech PostgreSQL      | Persistent data storage                   |
| Frontend             | HTML, CSS, JavaScript     | User interface and interactivity          |
| Image Storage        | Amazon S3                 | Secure, scalable property image storage   |
| Authentication       | Django Auth + OTP Email   | Secure user login and registration        |
| Deployment           | (e.g., Vercel, Heroku)    | Hosting web application                   |

## Project Structure

```
neighborfit/
│
├── manage.py
├── requirements.txt
├── README.md
├── .env
│
├── neighborfit/           # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── houses/                # Main app for properties
│   ├── models.py
│   ├── views.py
│   ├── forms.py
│   ├── admin.py
│   ├── templates/
│   │   ├── index.html
│   │   ├── about.html
│   │   ├── preferences.html
│   │   ├── results.html
│   │   ├── property_details.html
│   │   ├── contact.html
│   │   ├── register.html
│   │   ├── login.html
│   │   └── validate_otp.html
│   └── static/
│
├── media/                 # (if using local dev storage)
│
└── ...                    # Other Django apps/utilities
```

## Key Features

- **Smart Search:** Dynamic filtering based on user preferences.
- **Location Intelligence:** Displays nearby schools, hospitals, shopping, and transit.
- **Rich Property Details:** Gallery, amenities, suitability, and neighborhood info.
- **Secure Authentication:** OTP verification, password login, and secure session management.
- **Admin Tools:** Powerful Django admin for property and content management.
- **Scalable Image Storage:** Amazon S3 integration for all property images.

## How Image Storage Works

- **Upload:** When an admin uploads a property image, it is sent to an S3 bucket.
- **Storage:** The image URL is stored in Neon.tech PostgreSQL, not the image itself.
- **Display:** The frontend loads images directly from S3 using the stored URLs.
- **Benefits:** Fast loading, global CDN, scalable, and secure.

## How to Run Locally

1. **Clone the Repository:**
   ```sh
   git clone https://github.com/yourusername/neighborfit.git
   cd neighborfit
   ```

2. **Install Dependencies:**
   ```sh
   pip install -r requirements.txt
   ```

3. **Set Up Environment Variables:**
   - Create a `.env` file with your Django secret key, database URL (from Neon.tech), S3 credentials, and email settings.

4. **Apply Migrations:**
   ```sh
   python manage.py migrate
   ```

5. **Run the Development Server:**
   ```sh
   python manage.py runserver
   ```

6. **Access the App:**
   - Visit `http://localhost:8000` in your browser.

## Deployment Notes

- **Database:** Use your Neon.tech PostgreSQL connection string in production.
- **Media Storage:** Ensure your S3 bucket is properly configured and public-read for images.
- **Environment:** Set all secrets and credentials using environment variables.
- **Static Files:** Use Django’s `collectstatic` and a CDN for static assets.
- **Security:** Use HTTPS, secure cookies, and strong passwords for admin accounts.

## Credits

NeighborFit is built with Django, Neon.tech, Amazon S3, and a focus on modern, user-centric real estate search.

**For questions or contributions, please open an issue or contact the NeighborFit team!**
