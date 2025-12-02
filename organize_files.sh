#!/bin/bash

# Create base directory
mkdir -p Team_Work_Distribution

# 1. Suryansh (Backend)
echo "Organizing Suryansh's files..."
mkdir -p Team_Work_Distribution/1_Suryansh_Backend/Opd_flow/src/services
mkdir -p Team_Work_Distribution/1_Suryansh_Backend/Opd_flow/src/pages

# Copy entire backend excluding node_modules
rsync -av --exclude='node_modules' backend Team_Work_Distribution/1_Suryansh_Backend/

# Copy frontend auth files
cp Opd_flow/src/services/api.js Team_Work_Distribution/1_Suryansh_Backend/Opd_flow/src/services/
cp Opd_flow/src/pages/Login.jsx Team_Work_Distribution/1_Suryansh_Backend/Opd_flow/src/pages/
cp Opd_flow/src/pages/Login.css Team_Work_Distribution/1_Suryansh_Backend/Opd_flow/src/pages/


# 2. Teammate 2 (Frontend Base)
echo "Organizing Teammate 2's files..."
mkdir -p Team_Work_Distribution/2_Teammate2_Frontend_Base/Opd_flow/src/components
mkdir -p Team_Work_Distribution/2_Teammate2_Frontend_Base/Opd_flow/src/pages
mkdir -p Team_Work_Distribution/2_Teammate2_Frontend_Base/Opd_flow/src/styles
mkdir -p Team_Work_Distribution/2_Teammate2_Frontend_Base/Opd_flow/src/context

# Copy base files
cp Opd_flow/src/App.jsx Opd_flow/src/main.jsx Opd_flow/index.html Opd_flow/package.json Team_Work_Distribution/2_Teammate2_Frontend_Base/Opd_flow/

# Copy styles
cp -r Opd_flow/src/styles/* Team_Work_Distribution/2_Teammate2_Frontend_Base/Opd_flow/src/styles/
cp Opd_flow/src/pages/pages.css Team_Work_Distribution/2_Teammate2_Frontend_Base/Opd_flow/src/pages/

# Copy components (excluding specific ones for other teammates if needed, but copying all for base is safer)
# Actually, let's copy specific ones to be precise
cp Opd_flow/src/components/Navbar.* Team_Work_Distribution/2_Teammate2_Frontend_Base/Opd_flow/src/components/
cp Opd_flow/src/components/Footer.* Team_Work_Distribution/2_Teammate2_Frontend_Base/Opd_flow/src/components/
cp Opd_flow/src/components/Hero.* Team_Work_Distribution/2_Teammate2_Frontend_Base/Opd_flow/src/components/
cp Opd_flow/src/components/FeatureGrid.* Team_Work_Distribution/2_Teammate2_Frontend_Base/Opd_flow/src/components/
cp Opd_flow/src/components/HowItWorks.* Team_Work_Distribution/2_Teammate2_Frontend_Base/Opd_flow/src/components/
cp Opd_flow/src/components/Stats.* Team_Work_Distribution/2_Teammate2_Frontend_Base/Opd_flow/src/components/
cp Opd_flow/src/components/Testimonials.* Team_Work_Distribution/2_Teammate2_Frontend_Base/Opd_flow/src/components/
cp Opd_flow/src/components/FAQ.* Team_Work_Distribution/2_Teammate2_Frontend_Base/Opd_flow/src/components/
cp Opd_flow/src/components/Modal.* Team_Work_Distribution/2_Teammate2_Frontend_Base/Opd_flow/src/components/
cp Opd_flow/src/components/Toast.* Team_Work_Distribution/2_Teammate2_Frontend_Base/Opd_flow/src/components/
cp Opd_flow/src/components/CookieConsent.* Team_Work_Distribution/2_Teammate2_Frontend_Base/Opd_flow/src/components/

# Copy pages
cp Opd_flow/src/pages/Home.* Team_Work_Distribution/2_Teammate2_Frontend_Base/Opd_flow/src/pages/
cp Opd_flow/src/pages/Dashboard.* Team_Work_Distribution/2_Teammate2_Frontend_Base/Opd_flow/src/pages/
cp Opd_flow/src/pages/Admin.jsx Team_Work_Distribution/2_Teammate2_Frontend_Base/Opd_flow/src/pages/
cp Opd_flow/src/pages/Intake.jsx Team_Work_Distribution/2_Teammate2_Frontend_Base/Opd_flow/src/pages/
cp Opd_flow/src/context/ToastContext.jsx Team_Work_Distribution/2_Teammate2_Frontend_Base/Opd_flow/src/context/


# 3. Shikhar (Patient Features)
echo "Organizing Shikhar's files..."
mkdir -p Team_Work_Distribution/3_Shikhar_Patient_Features/Opd_flow/src/pages
mkdir -p Team_Work_Distribution/3_Shikhar_Patient_Features/Opd_flow/src/components
mkdir -p Team_Work_Distribution/3_Shikhar_Patient_Features/Opd_flow/src/utils

# Copy pages
cp Opd_flow/src/pages/Video.* Team_Work_Distribution/3_Shikhar_Patient_Features/Opd_flow/src/pages/
cp Opd_flow/src/pages/Request.* Team_Work_Distribution/3_Shikhar_Patient_Features/Opd_flow/src/pages/
cp Opd_flow/src/pages/DoctorList.* Team_Work_Distribution/3_Shikhar_Patient_Features/Opd_flow/src/pages/
cp Opd_flow/src/pages/Appointments.* Team_Work_Distribution/3_Shikhar_Patient_Features/Opd_flow/src/pages/

# Copy components
cp Opd_flow/src/components/Calendar.* Team_Work_Distribution/3_Shikhar_Patient_Features/Opd_flow/src/components/
cp Opd_flow/src/components/DoctorCard.* Team_Work_Distribution/3_Shikhar_Patient_Features/Opd_flow/src/components/

# Copy utils
cp Opd_flow/src/utils/slotHelpers.js Team_Work_Distribution/3_Shikhar_Patient_Features/Opd_flow/src/utils/


# 4. Teammate 4 (Doctor Portal)
echo "Organizing Teammate 4's files..."
mkdir -p Team_Work_Distribution/4_Teammate4_Doctor_Portal/Opd_flow/src/pages
mkdir -p Team_Work_Distribution/4_Teammate4_Doctor_Portal/backend/routes

# Copy pages
cp Opd_flow/src/pages/DoctorRegistration.* Team_Work_Distribution/4_Teammate4_Doctor_Portal/Opd_flow/src/pages/
cp Opd_flow/src/pages/DoctorProfile.* Team_Work_Distribution/4_Teammate4_Doctor_Portal/Opd_flow/src/pages/
cp Opd_flow/src/pages/Consultation.* Team_Work_Distribution/4_Teammate4_Doctor_Portal/Opd_flow/src/pages/

# Copy backend route
cp backend/routes/doctor.js Team_Work_Distribution/4_Teammate4_Doctor_Portal/backend/routes/

echo "Organization complete! Check Team_Work_Distribution folder."
