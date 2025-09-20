 
    
    
    function showLoginView() {
        document.getElementById('loginSection').classList.remove('hidden');
        document.getElementById('signUpSection').classList.add('hidden');
        document.getElementById('mainApp').classList.add('hidden');
    }
 
    function toggleAuthView() {
        document.getElementById('loginSection').classList.toggle('hidden');
        document.getElementById('signUpSection').classList.toggle('hidden');
    }

     
    function showAppView(user) {
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('signUpSection').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');

         
        if (user) {
            const profilePicSidebar = document.getElementById('userProfilePicSidebar');
            const profileEmailSidebar = document.getElementById('userProfileEmailSidebar');
            
            const photo = user.photoURL || 'https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png';
            const email = user.email || 'User';

            profilePicSidebar.src = photo;
            profileEmailSidebar.textContent = email;
            
            let userName = user.displayName;
            if (!userName && user.email) {
                const emailName = user.email.split('@')[0];
                const cleanedName = emailName.replace(/[^a-zA-Z].*$/, '').replace(/[^a-zA-Z]/g, '');
                if (cleanedName) {
                    userName = cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1);
                }
            }
            userName = userName || localStorage.getItem('manatractorDashboardUserName') || 'User';
            
            localStorage.setItem('manatractorDashboardUserName', userName);

            document.getElementById('userProfileNameDisplay').textContent = userName;
            document.getElementById('welcomeHeading').innerHTML = T('welcome_heading').replace('{userName}', userName);
        }
        
        showDashboardView();
        startTypingAnimation();
    }





    
    function signInWithGoogle() {
        const provider = new window.GoogleAuthProvider();
        window.signInWithPopup(window.auth, provider)
            .then((result) => {
                const user = result.user;
                showMessage(`Welcome, ${user.displayName}!`, 'success');
            }).catch((error) => {
                const errorMessage = error.message;
                showMessage(`Google Sign-In Error: ${errorMessage}`, 'error');
            });
    }
    
    
    function signUpWithEmail() {
        const email = document.getElementById('signUpEmail').value;
        const password = document.getElementById('signUpPassword').value;
        
        if (!email || !password) {
            showMessage('Please enter both email and password.', 'error');
            return;
        }

        window.createUserWithEmailAndPassword(window.auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                showMessage('Account created successfully!', 'success');
            })
            .catch((error) => {
                const errorMessage = error.message;
                showMessage(`Sign-up Error: ${errorMessage}`, 'error');
            });
    }







   
    function signInWithEmail() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            showMessage('Please enter both email and password.', 'error');
            return;
        }

        window.signInWithEmailAndPassword(window.auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                showMessage(`Welcome back!`, 'success');
            })
            .catch((error) => {
                const errorMessage = error.message;
                showMessage(`Login Error: ${errorMessage}`, 'error');
            });
    }
    
     
    function logout() {
        window.auth.signOut().then(() => {
            showLoginView();
            showMessage('You have been logged out.', 'success');
        }).catch((error) => {
            showMessage(`Logout Error: ${error.message}`, 'error');
        });
    }
     
    function checkAuthState() {
        window.onAuthStateChanged(window.auth, (user) => {
            if (user) {
                showAppView(user);
            } else {
                showLoginView();
            }
        });
    }

     



    let currentUserName = '';
    let currentUserPhoneNumber = '';
    let currentLang = 'te';  
    let currentSpeechTargetId = null; 

     
    let currentHourlyEarnings = 0;
    let currentTripEarnings = 0;
    let currentCombinedEarnings = 0;
    let currentHourlyTime = '0 hrs';

    
    const translations = {
       
      welcome_heading: {
        te: "స్వాగతం, <span id='userNameEditable' contenteditable='true' onblur='saveUserName()'>{userName}</span> అన్న  ",
        en: "Welcome, <span id='userNameEditable' contenteditable='true' onblur='saveUserName()'>{userName}</span> Anna 🚜",
        hi: "स्वागत है, <span id='userNameEditable' contenteditable='true' onblur='saveUserName()'>{userName}</span> अन्ना 🚜",
        ar: "أهلاً بك، <span id='userNameEditable' contenteditable='true' onblur='saveUserName()'>{userName}</span> أنا🚜 "
      },
      tagline: {
        te: "మీ ట్రాక్టర్ పని, సమయం & ఆదాయాన్ని సులభంగా ట్రాక్ చేయండి.",
        en: "Track your tractor work, time & earnings with ease.",
        hi: "अपने ट्रैक्टर के काम, समय और कमाई को आसानी से ट्रैक करें।",
        ar: "تتبع عمل جرارك، وقته وأرباحه بسهولة."
      },
      name_label: {
        te: "పేరు నమోదు చేయండి",
        en: "Enter Name",
        hi: "नाम दर्ज करें",
        ar: "أدخل الاسم"
      },
      name_placeholder: {
        te: "ఉదా: రాము",
        en: "e.g., John Doe",
        hi: "उदा: जॉन डो",
        ar: "مثال: جون دو"
      },
       name_placeholder_dynamic: {
        te: ["రైతు పేరు", "కస్టమర్ పేరు"],
        en: ["Farmer Name", "Customer Name"],
        hi: ["किसान का नाम", "ग्राहक का नाम"],
        ar: ["اسم المزارع", "اسم العميل"]
      },
      phone_label: {
        te: "ఫోన్ నంబర్",
        en: "Phone Number",
        hi: "फ़ोन नंबर",
        ar: "رقم الهاتف"
      },
      phone_placeholder: {
        te: "ఉదా: 9876543210",
        en: "e.g., 9876543210",
        hi: "उदा: 9876543210",
        ar: "مثال: 9876543210"
      },
      phone_placeholder_dynamic: {
        te: ["9xxxxxxxxx", "8xxxxxxxxx"],
        en: ["9xxxxxxxxx", "8xxxxxxxxx"],
        hi: ["9xxxxxxxxx", "8xxxxxxxxx"],
        ar: ["9xxxxxxxxx", "8xxxxxxxxx"]
      },
      phone_invalid: {
        te: "దయచేసి చెల్లుబాటు అయ్యే ఫోన్ నంబర్‌ను నమోదు చేయండి (కనీసం 10 అంకెలు).",
        en: "Please enter a valid phone number (at least 10 digits).",
        hi: "कृपया एक मान्य फ़ोन नंबर दर्ज करें (कम से कम 10 अंक)।",
        ar: "يرجى إدخال رقم هاتف صالح (10 أرقام على الأقل)."
      },
      date_label: {
        te: "తేదీ",
        en: "Date",
        hi: "तारीख",
        ar: "التاريخ"
      },
      start_time_label: {
        te: "ప్రారంభ సమయం",
        en: "Start Time",
        hi: "शुरू करने का समय",
        ar: "وقت البدء"
      },
      end_time_label: {
        te: "ముగింపు సమయం",
        en: "End Time",
        hi: "समाप्ति का समय",
        ar: "وقت ख़त्म होने का"
      },
      rate_per_hour_label: {
        te: "గంటకు రేటు (₹)",
        en: "Rate per Hour (₹)",
        hi: "प्रति घंटा दर (₹)",
        ar: "السعر بالساعة (₹)"
      },
      rate_per_hour_placeholder: {
        te: "ఉదా: 2000", en: "e.g., 2000", hi: "उदा: 2000", ar: "مثال: 2000"
      },
      calculate_button_title: {
        te: "లెక్కించు",
        en: "Calculate",
        hi: "गणना करें",
        ar: "احسب"
      },
      save_button_title: {
        te: "సేవ్ చేయి",
        en: "Save",
        hi: "सहेजें",
        ar: "حفظ"
      },
      logout_button_title: {
        te: "లాగ్ అవుట్",
        en: "Logout",
        hi: "लॉग आउट",
        ar: "تسجيل الخروج"
      },
      hourly_time_label: {
        te: "గంటల సమయం",
        en: "Hourly Time",
        hi: "घंटे का समय",
        ar: "وقت بالساعة"
      },
      hourly_earnings_label: {
        te: "గంటల ఆదాయం",
        en: "Hourly Earnings",
        hi: "घंटे की कमाई",
        ar: "أرباح بالساعة"
      },
      total_trips_label: {
        te: "ట్రిప్పుల సంఖ్య",
        en: "Number of Trips",
        hi: "ट्रिपों की संख्या",
        ar: "عدد الرحلات"
      },
       trips_placeholder: {
        te: "ఉదా: 5", en: "e.g., 5", hi: "उदा: 5", ar: "مثال: 5"
      },
      cost_per_trip_label: {
        te: "ఒక ట్రిప్‌కు ధర (₹)",
        en: "Cost per Trip (₹)",
        hi: "प्रति ट्रिप लागत (₹)",
        ar: "التكلفة لكل رحلة (₹)"
      },
      cost_per_trip_placeholder: {
        te: "ఉదా: 500", en: "e.g., 500", hi: "उदा: 500", ar: "مثال: 500"
      },
      trip_count_display_label: {
        te: "మొత్తం ట్రిప్పులు",
        en: "Total Trips",
        hi: "कुल ट्रिप",
        ar: "إجمالي الرحلات"
      },
      trip_earnings_label: {
        te: "ట్రిప్ ఆదాయం",
        en: "Trip Earnings",
        hi: "ट्रिप की कमाई",
        ar: "أرباح الرحلة"
      },
      combined_earnings_label: {
        te: "మొత్తం",
        en: "Total Amount",
        hi: "कुल राशि",
        ar: "المبلغ الإجمالي"
      },
       view_logs_button_title: {
        te: "సేవ్ చేసిన వివరాలు",
        en: "View Saved Logs",
        hi: "सहेजे गए लॉग देखें",
        ar: "عرض السجلات المحفوظة"
      },
       
      logs_heading: {
        te: "ట్రాక్టర్ పని వివరాలు సేవ్ చేయబడ్డాయి",
        en: "Saved Tractor Work Logs",
        hi: "सहेजे गए ट्रैक्टर कार्य लॉग",
        ar: "سجلات عمل الجرار المحفوظة"
      },
      logs_tagline: {
        te: "ఇక్కడ మీ సేవ్ చేసిన పని యొక్క రికార్డు ఉంది.",
        en: "Here is the record of your saved work.",
        hi: "यहाँ आपके सहेजे गए कार्य का रिकॉर्ड है।",
        ar: "هنا سجل عملك المحفوظ."
      },
      no_logs_saved: {
        te: "ఇంకా లాగ్‌లు సేవ్ చేయబడలేదు.",
        en: "No logs saved yet.",
        hi: "साफ़ करने के लिए कोई लॉग नहीं है।",
        ar: "لا توجد سجلات لمسحها."
      },
      work_time: {
        te: "పని సమయం",
        en: "Work Time",
        hi: "कार्य समय",
        ar: "وقت العمل"
      },
      rate: {
        te: "రేటు",
        en: "Rate",
        hi: "दर",
        ar: "السعر"
      },
      duration: {
        te: "వ్యవధి",
        en: "Duration",
        hi: "अवधि",
        ar: "المدة"
      },
      trips_count_log: { 
        te: "ట్రిప్పులు",
        en: "Trips",
        hi: "ट्रिप",
        ar: "الرحلات"
      },
      cost_per_trip_log: { 
        te: "ఒక ట్రిప్‌కు ధర",
        en: "Cost per Trip",
        hi: "प्रति ट्रिप लागत",
        ar: "التكلفة لكل رحلة"
      },
      total_trips_display_log: { 
        te: "మొత్తం ట్రిప్పులు",
        en: "Total Trips",
        hi: "कुल ट्रिप",
        ar: "إجمالي الرحلات"
      },
      earnings: {
        te: "ఆదాయం",
        en: "Earnings",
        hi: "कमाई",
        ar: "الأرباح"
      },
      saved_on: {
        te: "సేవ్ చేయబడింది",
        en: "Saved on",
        hi: "पर सहेजा गया",
        ar: "تم الحفظ في"
      },
      name: {
        te: "పేరు",
        en: "Name",
        hi: "नाम",
        ar: "الاسم"
      },
      phone: {
        te: "ఫోన్",
        en: "Phone",
        hi: "फ़ोन",
        ar: "الهاتف"
      },
      note_content_label: {
        te: "నోట్ కంటెంట్",
        en: "Note Content",
        hi: "नोट सामग्री",
        ar: "محتوى الملاحظة"
      },
      note_content_placeholder: {
        te: "దయచేసి పని సమాచార వివరాలను నమోదు చేయండి",
        en: "Please enter the work info details",
        hi: "कृपया कार्य जानकारी विवरण दर्ज करें",
        ar: "الرجاء إدخال تفاصيل معلومات العمل"
      },
       
      leaderboard_button_title: { te: "లీడర్‌బోర్డ్", en: "Leaderboard", hi: "लीडरबोर्ड", ar: "لوحة الصدارة" },
      leaderboard_heading: { te: "లీడర్‌బోర్డ్", en: "Leaderboard", hi: "लीडरबोर्ड", ar: "لوحة الصدارة" },
      leaderboard_tagline: { te: "ఎక్కువగా సేవ్ చేయబడిన కస్టమర్‌లు", en: "Most Frequently Saved Customers", hi: "सबसे ज़्यादा सहेजे गए ग्राहक", ar: "العملاء الأكثر حفظًا" },
      no_leaderboard_data: { te: "లీడర్‌బోర్డ్ కోసం డేటా లేదు.", en: "No data for the leaderboard yet.", hi: "लीडरबोर्ड के लिए अभी कोई डेटा नहीं है।", ar: "لا توجد بيانات للوحة الصدارة بعد." },
      saves: { te: "సేవ్‌లు", en: "Saves", hi: "सहेजें", ar: "الحفظ" },
      customer_logs_heading: { te: "{name} యొక్క లాగ్‌లు", en: "Logs for {name}", hi: "{name} के लॉग", ar: "سجلات {name}" },
       
      monthly_dashboard_button_title: { te: "నెలవారీ డేటా", en: "Monthly Data", hi: "मासिक डैशबोर्ड", ar: "لوحة القيادة الشهرية" },
      monthly_dashboard_heading: { te: "నెలవారీ సారాంశం", en: "Monthly Summary", hi: "मासिक सारांश", ar: "ملخص شهري" },
      monthly_dashboard_tagline: { te: "మీ నెలవారీ పనితీరును ట్రాక్ చేయండి", en: "Track your monthly performance", hi: "अपने मासिक प्रदर्शन को ट्रैक करें", ar: "تتبع أدائك الشهري" },
      month_selector_label: { te: "నెల ఎంచుకోండి:", en: "Select Month:", hi: "महीना चुनें:", ar: "اختر الشهر:" },
      total_amount_label: { te: "మొత్తం ఆదాయం", en: "Total Earnings", hi: "कुल कमाई", ar: "إجمالي الأرباح" },
      total_hours_label: { te: "మొత్తం గంటలు", en: "Total Hours", hi: "कुल घंटे", ar: "إجمالي الساعات" },
      total_trips_label: { te: "మొత్తం ట్రిప్పులు", en: "Total Trips", hi: "कुल यात्राएं", ar: "إجمالي الرحلات" },
       
      name_updated_success: {
        te: "పేరు విజయవంతంగా నవీకరించబడింది!",
        en: "Name updated successfully!",
        hi: "नाम सफलतापूर्वक अपडेट किया गया!",
        ar: "تم تحديث الاسم بنجاح!"
      },
      name_phone_missing_error: {
        te: "దయచేసి మొదట పేరు మరియు ఫోన్ నంబర్‌ను నమోదు చేయండి.",
        en: "Please enter the name and phone number first.",
        hi: "कृपया पहले नाम और फोन नंबर दर्ज करें।",
        ar: "الرجاء إدخال الاسم ورقم الهاتف أولاً."
      },
      phone_exists_error: {
        te: "ఈ ఫోన్ నంబర్ ఇప్పటికే '{name}' పేరుతో ఉంది. దయచేసి వేరే నంబర్‌ను ఉపయోగించండి.",
        en: "This phone number already exists with the name '{name}'. Please use a different number.",
        hi: "यह फ़ोन नंबर पहले से ही '{name}' नाम से मौजूद है। कृपया एक अलग नंबर का उपयोग करें।",
        ar: "رقم الهاتف هذا موجود بالفعل بالاسم '{name}'. الرجاء استخدام رقم مختلف."
      },
      fill_time_rate_error: {
        te: "దయచేసి సమయం మరియు రేటు నింపండి.",
        en: "Please fill time and rate.",
        hi: "कृपया समय और दर भरें।",
        ar: "الرجاء تعبئة الوقت والسعر."
      },
      end_time_error: {
        te: "ముగింపు సమయం ప్రారంభ సమయం తర్వాత లేదా కనీసం 1 నిమిషం వ్యవధి ఉండాలి.",
        en: "End time must be after start time or have at least 1 minute duration.",
        hi: "समाप्ति का समय शुरू होने के समय के बाद या कम से कम 1 मिनट की अवधि का होना चाहिए।",
        ar: "يجب أن يكون وقت الانتهاء بعد وقت البدء أو أن تكون المدة دقيقة واحدة على الأقل."
      },
      hourly_calculation_success: {
        te: "గంటకు ఆదాయం విజయవంతంగా లెక్కించబడింది!",
        en: "Hourly earnings calculated successfully!",
        hi: "घंटे की कमाई सफलतापूर्वक गणना की गई!",
        ar: "تم حساب الأرباح بالساعة بنجاح!"
      },
      enter_valid_trips_cost_error: {
        te: "దయచేసి ట్రిప్పులు మరియు ట్రిప్ ధర కోసం సరైన సంఖ్యలను నమోదు చేయండి.",
        en: "Please enter valid numbers for trips and trip cost.",
        hi: "कृपया ट्रिप और ट्रिप लागत के लिए मान्य संख्याएँ दर्ज करें।",
        ar: "الرجاء إدخال أرقام صالحة للرحلات وتكلفة الرحلة."
      },
      trip_calculation_success: {
        te: "ట్రిప్ ఆదాయం విజయవంతంగా లెక్కించబడింది!",
        en: "Trip earnings calculated successfully!",
        hi: "ट्रिप की कमाई सफलतापूर्वक गणना की गई!",
        ar: "تم حساب أرباح الرحلة بنجاح!"
      },
      combined_calculation_success: {
        te: "మొత్తం ఆదాయం విజయవంతంగా లెక్కించబడింది!",
        en: "Combined earnings calculated successfully!",
        hi: "कुल कमाई सफलतापूर्वक गणना की गई!",
        ar: "تم حساب الأرباح المجمعة بنجاح!"
      },
      fill_all_details_calculate_save_error: {
        te: "దయచేసి అన్ని వివరాలను నింపి, సేవ్ చేయడానికి ముందు ఆదాయాన్ని లెక్కించండి.",
        en: "Please fill all details and calculate earnings before saving.",
        hi: "कृपया सभी विवरण भरें और सहेजने से पहले कमाई की गणना करें।",
        ar: "الرجاء تعبئة جميع التفاصيل وحساب الأرباح قبل الحفظ."
      },
      data_saved_success: {
        te: "డేటా విజయవంతంగా సేవ్ చేయబడింది!",
        en: "Data saved successfully!",
        hi: "डेटा सफलतापूर्वक सहेजा गया!",
        ar: "تم حفظ البيانات بنجاح!"
      },
        
      calculation_talkback: {
        te: "మొత్తం {amount} రూపాయలు",
        en: "Total Amount {amount} rupees",
        hi: "कुल राशि {amount} रुपये",
        ar: "المبلغ الإجمالي {amount} روبية"
      },
      saved_talkback: {
        te: "డేటా విజయవంతంగా సేవ్ చేయబడింది",
        en: "Data saved successfully",
        hi: "डेटा सफलतापूर्वक सहेजा गया",
        ar: "تم حفظ البيانات بنجاح"
      },
      back_button: {
        te: "వెనుకకు",
        en: "Back",
        hi: "पीछे",
        ar: "عودة"
      },
      cancel_button: {
        te: "రద్దు చేయి",
        en: "Cancel",
        hi: "रद्द करें",
        ar: "إلغاء"
      },
      confirm_button: {
        te: "నిర్ధారించు",
        en: "Confirm",
        hi: "पुष्टि करें",
        ar: "تأكيد"
      },
      note_details_missing: { 
        te: "దయచేసి నోట్ కంటెంట్ నింపండి.",
        en: "Please fill note content.",
        hi: "कृपया नोट सामग्री भरें।",
        ar: "الرجاء تعبئة محتوى الملاحظة."
      },
      search_logs_placeholder: {
        te: "పేరు లేదా ఫోన్ ద్వారా శోధించండి...",
        en: "Search by name or phone...",
        hi: "नाम या फ़ोन से खोजें...",
        ar: "البحث بالاسم أو الهاتف..."
      },
      contact_picker_not_supported: {
        te: "ఈ బ్రౌజర్‌లో కాంటాక్ట్ పికర్ APIకి మద్దతు లేదు.",
        en: "Contact Picker API not supported on this browser.",
        hi: "इस ब्राउज़र पर संपर्क पिकर एपीआई समर्थित नहीं है।",
        ar: "واجهة برمجة تطبيقات منتقي جهات الاتصال غير مدعومة في هذا المتصفح."
      },
      speech_not_supported: {
        te: "ఈ బ్రౌజర్‌లో స్పీచ్ రికగ్నిషన్‌కు మద్దతు లేదు.",
        en: "Speech recognition is not supported in this browser.",
        hi: "इस ब्राउज़र में वाक् पहचान समर्थित नहीं है।",
        ar: "التعرف على الكلام غير مدعوم في هذا المتصفح."
      },
       speech_synthesis_not_supported: {
        te: "ఈ బ్రౌజర్‌లో టెక్స్ట్-టు-స్పీచ్‌కు మద్దతు లేదు.",
        en: "Text-to-speech is not supported in this browser.",
        hi: "इस ब्राउज़र में टेक्स्ट-टू-स्पीच समर्थित नहीं है।",
        ar: "تحويل النص إلى كلام غير مدعوم في هذا المتصفح."
      },
      speech_error: {
        te: "స్పీచ్ ఎర్రర్: {error}",
        en: "Speech Error: {error}",
        hi: "वाक् त्रुटि: {error}",
        ar: "خطأ في الكلام: {error}"
      },
      paid_status: { te: "చెల్లించారు", en: "Paid", hi: "भुगतान किया गया", ar: "مدفوع" },
      due_status: { te: "చెల్లించవలసినది", en: "Due", hi: "देय", ar: "مستحق" },
      advance_status: { te: "అడ్వాన్స్", en: "Advance", hi: "अग्रिम", ar: "مقدم" },
      sms_button: { te: "SMS పంపండి", en: "Send SMS", hi: "एसएमएस भेजें", ar: "إرسال رسالة نصية" },
      whatsapp_button: { te: "WhatsApp పంపండి", en: "Send WhatsApp", hi: "व्हाट्सएप भेजें", ar: "إرسال واتساب" },
      call_button: { te: "కాల్ చేయండి", en: "Call", hi: "कॉल करें", ar: "اتصل" },
      download_button: { te: "డౌన్‌లోడ్", en: "Download", hi: "डाउनलोड", ar: "تحميل" },
       read_aloud_button: { te: "గట్టిగా చదువు", en: "Read Aloud", hi: "जोर से पढ़ें", ar: "اقرأ بصوت عالٍ" },
      download_error: { te: "లాగ్‌ను డౌన్‌లోడ్ చేయడంలో విఫలమైంది.", en: "Failed to download log.", hi: "लॉग डाउनलोड करने में विफल।", ar: "فشل تنزيل السجل." },
      call_error: { te: "కాల్ చేయడానికి ఫోన్ నంబర్ లేదు.", en: "No phone number available to call.", hi: "कॉल करने के लिए कोई फ़ोन नंबर उपलब्ध नहीं है।", ar: "لا يوجد رقم هاتف متاح للاتصال به." },
      sms_send_error: { te: "SMS పంపడానికి ఫోన్ నంబర్ లేదు.", en: "No phone number available to send SMS.", hi: "SMS भेजने के लिए कोई फ़ोन नंबर उपलब्ध नहीं है।", ar: "لا يوجد رقم هاتف متاح لإرسال رسالة نصية." },
      sms_body_template: {
        te: "మీ ట్రాక్టర్ పని వివరాలు:\nతేదీ: {date}\nపేరు: {name}\nఫోన్: {phone}\n{hourlyDetails}\n{tripDetails}\nమొత్తం: {totalEarnings}\nనోట్: {noteContent}\nచెల్లింపు స్థితి: {paymentStatus}",
        en: "Your Tractor Work Details:\nDate: {date}\nName: {name}\nPhone: {phone}\n{hourlyDetails}\n{tripDetails}\nTotal Amount: {totalEarnings}\nNote: {noteContent}\nPayment Status: {paymentStatus}",
        hi: "आपके ट्रैक्टर के काम का विवरण:\nतारीख: {date}\nनाम: {name}\nफ़ोन: {phone}\n{hourlyDetails}\n{tripDetails}\nकुल राशि: {totalEarnings}\nनोट: {noteContent}\nभुगतान की स्थिति: {paymentStatus}",
        ar: "تفاصيل عمل الجرار الخاص بك:\nالتاريخ: {date}\nالاسم: {name}\nالهاتف: {phone}\n{hourlyDetails}\n{tripDetails}\nالمبلغ الإجمالي: {totalEarnings}\nملاحظة: {noteContent}\nحالة الدفع: {paymentStatus}"
      },
      sms_hourly_template: {
        te: "పని సమయం: {startTime} - {endTime} ({duration})\nగంటకు రేటు: ₹{rate} / hr\nగంటల ఆదాయం: ₹{earnings}",
        en: "Work Time: {startTime} - {endTime} ({duration})\nRate per Hour: ₹{rate} / hr\nHourly Earnings: ₹{earnings}",
        hi: "कार्य समय: {startTime} - {endTime} ({duration})\nप्रति घंटा दर: ₹{rate} / hr\nघंटे की कमाई: ₹{earnings}",
        ar: "وقت العمل: {startTime} - {endTime} ({duration})\nالسعر بالساعة: ₹{rate} / hr\nأرباح بالساعة: ₹{earnings}"
      },
      sms_trip_template: {
        te: "ట్రిప్పులు: {trips} ({tripsDisplay})\nఒక ట్రిప్‌కు ధర: ₹{costPerTrip}\nట్రిప్ ఆదాయం: ₹{earnings}",
        en: "Trips: {trips} ({tripsDisplay})\nCost per Trip: ₹{costPerTrip}\nTrip Earnings: ₹{earnings}",
        hi: "ट्रिप: {trips} ({tripsDisplay})\nप्रति ट्रिप लागत: ₹{costPerTrip}\nट्रिप की कमाई: ₹{earnings}",
        ar: "الرحلات: {trips} ({tripsDisplay})\nالتكلفة لكل رحلة: ₹{costPerTrip}\nأرباح الرحلة: ₹{earnings}"
      },
      footer_text: {
        te: "© {year} మన ట్రాక్టర్. అన్ని హక్కులు ప్రత్యేకించబడ్డాయి.",
        en: "© {year} ManaTractor. All rights reserved.",
        hi: "© {year} मन ट्रैक्टर। सर्वाधिकार सुरक्षित।",
        ar: "© {year} مانا تراكتور. كل الحقوق محفوظة."
      }
    };

    
    function T(key) {
      return translations[key]?.[currentLang] || key;  
    }

     
    function showMessage(message, type = 'success') {
      const messageBox = document.getElementById('messageBox');
      messageBox.textContent = message;
      messageBox.className = `message-box show ${type}`; 

      setTimeout(() => {
        messageBox.classList.remove('show');
      }, 3000); 
    }

     
    function sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }









     
    function formatTime12Hour(timeString) {
      if (!timeString) return '';
      const [hours, minutes] = timeString.split(':').map(Number);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;  
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }

    
    function formatNumberWithCommas(number) {
        if (number === null || number === undefined) return '0';
        let num = number;
        if (typeof num === 'string') {
            num = parseFloat(num.replace(/[₹,]/g, ''));
        }
        if (isNaN(num)) {
            return '0';
        }
        return Math.round(num).toLocaleString('en-US');
    }
    
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;
    let activeMicButton = null;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = function() {
            if (activeMicButton) {
                activeMicButton.classList.add('mic-listening');
            }
        };
        
        recognition.onend = function() {
            if (activeMicButton) {
                activeMicButton.classList.remove('mic-listening');
                activeMicButton = null;
            }
        };






        recognition.onerror = function(event) {
            console.error('Speech recognition error', event.error);
            showMessage(T('speech_error').replace('{error}', event.error), 'error');
            if (activeMicButton) {
                activeMicButton.classList.remove('mic-listening');
                activeMicButton = null;
            }
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript.replace(/\.$/, '');  
            const targetElement = document.getElementById(currentSpeechTargetId);

            if (!targetElement) return;

            
            if (targetElement.type === 'number' || targetElement.type === 'tel') {
                const numbers = transcript.replace(/[^0-9]/g, '');
                targetElement.value = numbers;
            } else if(targetElement.tagName.toLowerCase() === 'textarea') {
                 
                targetElement.value += (targetElement.value.length > 0 ? ' ' : '') + transcript;
            } else {
                  
                 targetElement.value = transcript;
            }
        };
    }

    function startSpeechRecognition(targetId) {
        if (!SpeechRecognition) {
            return showMessage(T('speech_not_supported'), 'error');
        }
        
        try { recognition.stop(); } catch(e) {}

        const micButtonId = 'mic' + targetId.charAt(0).toUpperCase() + targetId.slice(1);
        activeMicButton = document.getElementById(micButtonId);
        
        currentSpeechTargetId = targetId;
        
        const langMap = { 'te': 'te-IN', 'en': 'en-US', 'hi': 'hi-IN', 'ar': 'ar-SA' };
        recognition.lang = langMap[currentLang] || 'en-US';
        
        recognition.start();
    }


    
    let uniqueCustomers = [];

    function populateUniqueCustomers() {
        const allRecords = JSON.parse(localStorage.getItem('tractorRecords') || '[]');
        const customerMap = new Map();
        
        allRecords.forEach(record => {
            if (record.userName && record.userPhoneNumber) {
                const key = `${record.userName.trim().toLowerCase()}|${record.userPhoneNumber.trim()}`;
                if (!customerMap.has(key)) {
                    customerMap.set(key, {
                        name: record.userName.trim(),
                        phone: record.userPhoneNumber.trim()
                    });
                }
            }
        });
        
        uniqueCustomers = Array.from(customerMap.values());
    }








    function selectCustomer(name, phone) {
        document.getElementById('userName').value = name;
        document.getElementById('userPhoneNumber').value = phone;
        const autocompleteList = document.getElementById('autocomplete-list');
        autocompleteList.classList.add('hidden');
        autocompleteList.innerHTML = '';
    }

    function setupAutocomplete() {
        const userNameInput = document.getElementById('userName');
        const autocompleteList = document.getElementById('autocomplete-list');

        userNameInput.addEventListener('input', function() {
            const inputText = this.value.trim().toLowerCase();
            
            autocompleteList.innerHTML = '';
            
            if (inputText.length < 3) {
                autocompleteList.classList.add('hidden');
                return;
            }
            
            const suggestions = uniqueCustomers.filter(customer => 
                customer.name.toLowerCase().includes(inputText)
            );

            if (suggestions.length === 1 && suggestions[0].name.toLowerCase() === inputText) {
                 autocompleteList.classList.add('hidden');
                 return;
            }
            
            if (suggestions.length > 0) {
                suggestions.forEach(customer => {
                    const item = document.createElement('div');
                    item.className = 'p-3 border-b border-gray-100 hover:bg-green-50 cursor-pointer';
                    
                    const regex = new RegExp(`(${inputText})`, 'gi');
                    const highlightedName = customer.name.replace(regex, '<span class="font-bold text-green-700">$1</span>');

                    item.innerHTML = `
                        <p class="text-sm font-medium text-gray-800">${highlightedName}</p>
                        <p class="text-xs text-gray-500">${customer.phone}</p>
                    `;

                    item.addEventListener('mousedown', function() {
                        selectCustomer(customer.name, customer.phone);
                    });
                    autocompleteList.appendChild(item);
                });
                autocompleteList.classList.remove('hidden');
            } else {
                autocompleteList.classList.add('hidden');
            }
        });

        userNameInput.addEventListener('blur', function() {
            setTimeout(() => {
                autocompleteList.classList.add('hidden');
            }, 150);
        });
    }
    
    function saveUserName() {
        const userNameElement = document.getElementById('userNameEditable');
        if (userNameElement) {
            const newName = userNameElement.textContent.trim();
            if (newName) {
                localStorage.setItem('manatractorDashboardUserName', newName);
                showMessage(T('name_updated_success'), 'success');
            }
        }
    }

     
    function setLanguage(langCode) {
      currentLang = langCode;
      localStorage.setItem('manatractorLang', langCode);  

      document.getElementById('languageSelectorMenu').value = langCode;
      
      const user = window.auth.currentUser;
      const userName = (user ? user.displayName : null) || localStorage.getItem('manatractorDashboardUserName') || 'User';
      document.getElementById('welcomeHeading').innerHTML = T('welcome_heading').replace('{userName}', userName);

       
      document.getElementById('tagline').textContent = T('tagline');
      document.getElementById('nameLabel').textContent = T('name_label');
      document.getElementById('userName').placeholder = T('name_placeholder');
      document.getElementById('phoneLabel').textContent = T('phone_label');
      document.getElementById('userPhoneNumber').placeholder = T('phone_placeholder');
      document.getElementById('dateLabel').textContent = T('date_label');
      document.getElementById('startTimeLabel').textContent = T('start_time_label');
      document.getElementById('endTimeLabel').textContent = T('end_time_label');
      document.getElementById('ratePerHourLabel').textContent = T('rate_per_hour_label');
      document.getElementById('ratePerHour').placeholder = T('rate_per_hour_placeholder');
      document.getElementById('numberOfTripsLabel').textContent = T('total_trips_label');
      document.getElementById('numberOfTrips').placeholder = T('trips_placeholder');
      document.getElementById('costPerTripLabel').textContent = T('cost_per_trip_label');
      document.getElementById('costPerTrip').placeholder = T('cost_per_trip_placeholder');
      
       
      document.getElementById('calculateBtn').title = T('calculate_button_title');
      document.getElementById('calculateBtnText').textContent = T('calculate_button_title');
      document.getElementById('saveBtn').title = T('save_button_title');
      document.getElementById('saveBtnText').textContent = T('save_button_title');
      
     
      document.getElementById('viewLogsBtnMenu').title = T('view_logs_button_title');
      document.getElementById('viewLogsBtnMenuText').textContent = T('view_logs_button_title');
      document.getElementById('leaderboardBtnMenu').title = T('leaderboard_button_title');
      document.getElementById('leaderboardBtnMenuText').textContent = T('leaderboard_button_title');
      document.getElementById('monthlyDashboardBtnMenu').title = T('monthly_dashboard_button_title');
      document.getElementById('monthlyDashboardBtnMenuText').textContent = T('monthly_dashboard_button_title');
      document.getElementById('logoutBtnText').textContent = T('logout_button_title');
      
      document.getElementById('hourlyTimeLabel').textContent = T('hourly_time_label');
      document.getElementById('hourlyEarningsLabel').textContent = T('hourly_earnings_label');
      document.getElementById('tripCountLabel').textContent = T('trip_count_display_label');
      document.getElementById('tripEarningsLabel').textContent = T('trip_earnings_label');
      document.getElementById('combinedEarningsLabel').textContent = T('combined_earnings_label');
      document.getElementById('noteContentLabelText').textContent = T('note_content_label');
      document.getElementById('noteContent').placeholder = T('note_content_placeholder');
      
      document.getElementById('logsHeading').textContent = T('logs_heading');
      document.getElementById('logsTagline').textContent = T('logs_tagline');
      document.getElementById('logSearchInput').placeholder = T('search_logs_placeholder');
      
      document.getElementById('leaderboardHeading').textContent = T('leaderboard_heading');
      document.getElementById('leaderboardTagline').textContent = T('leaderboard_tagline');

      document.getElementById('monthlyDashboardHeading').textContent = T('monthly_dashboard_heading');
      document.getElementById('monthlyDashboardTagline').textContent = T('monthly_dashboard_tagline');
      document.getElementById('monthSelectorLabel').textContent = T('month_selector_label');
      document.getElementById('totalAmountLabel').textContent = T('total_amount_label');
      document.getElementById('totalHoursLabel').textContent = T('total_hours_label');
      document.getElementById('totalTripsLabel').textContent = T('total_trips_label');

      document.getElementById('confirmModalCancelBtn').textContent = T('cancel_button');
      document.getElementById('confirmModalConfirmBtn').textContent = T('confirm_button');
      
      const footerYearText = T('footer_text').replace('{year}', new Date().getFullYear());
      document.querySelectorAll('[id^="footerText"]').forEach(el => el.textContent = footerYearText);

       
      if (!document.getElementById('logsSection').classList.contains('hidden')) loadLogs();
      if (!document.getElementById('leaderboardSection').classList.contains('hidden')) generateLeaderboard();
      if (!document.getElementById('monthlyDashboardSection').classList.contains('hidden')) { populateMonthSelector(); renderMonthlyDashboard(); }
      if (!document.getElementById('customerLogsSection').classList.contains('hidden')) {
        const heading = document.getElementById('customerLogsHeading');
        const customerName = heading.getAttribute('data-customer-name');
        const customerPhone = heading.getAttribute('data-customer-phone');
        if (customerName && customerPhone) showCustomerLogs(customerName, customerPhone);
      }
      
      startTypingAnimation();  
    }
    
     
    let typingInterval;
    function startTypingAnimation() {
        if (typingInterval) clearInterval(typingInterval);
        
        const nameEl = document.getElementById('userName');
        const phoneEl = document.getElementById('userPhoneNumber');
        const namePlaceholders = T('name_placeholder_dynamic');
        const phonePlaceholders = T('phone_placeholder_dynamic');

        let nameIndex = 0;
        let phoneIndex = 0;

        const type = (element, placeholders, index) => {
            let text = placeholders[index];
            let i = 0;
            element.placeholder = '';
            
            const typingEffect = () => {
                if (i < text.length) {
                    element.placeholder += text.charAt(i);
                    i++;
                    setTimeout(typingEffect, 120);
                }
            };
            typingEffect();
        };
        
        const changePlaceholder = () => {
            type(nameEl, namePlaceholders, nameIndex);
            type(phoneEl, phonePlaceholders, phoneIndex);
            nameIndex = (nameIndex + 1) % namePlaceholders.length;
            phoneIndex = (phoneIndex + 1) % phonePlaceholders.length;
        };

        changePlaceholder();
        typingInterval = setInterval(changePlaceholder, 5000);  
    }


    
    function showSection(sectionId) {
        stopSpeech();  
        const sections = ['dashboardSection', 'logsSection', 'leaderboardSection', 'customerLogsSection', 'monthlyDashboardSection'];
        sections.forEach(id => {
            const section = document.getElementById(id);
            if (section) {
                if (id === sectionId) {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            }
        });
    }

    function showDashboardView() {
      showSection('dashboardSection');
      document.getElementById('userName').value = '';
      document.getElementById('userPhoneNumber').value = '';
      document.getElementById('noteContent').value = localStorage.getItem('manatractorLastNoteContent') || '';
      setCurrentDateAndStartTime();
      document.getElementById('logSearchInput').value = '';
      document.getElementById('hourlyTotalTime').textContent = '0 hrs';
      document.getElementById('hourlyTotalEarnings').textContent = '₹0';
      document.getElementById('tripTotalTrips').textContent = '0 trips';
      document.getElementById('tripTotalEarnings').textContent = '₹0';
      document.getElementById('combinedTotalEarnings').textContent = '₹0';
      currentHourlyEarnings = 0;
      currentTripEarnings = 0;
      currentCombinedEarnings = 0;
      currentHourlyTime = '0 hrs';
    }

    function showLogsView() {
      showSection('logsSection');
      loadLogs();
    }

    function showLeaderboardView() {
      showSection('leaderboardSection');
      generateLeaderboard();
    }

     
    function showMonthlyDashboardView() {
        showSection('monthlyDashboardSection');
        populateMonthSelector();
        renderMonthlyDashboard();
    }

    function populateMonthSelector() {
        const allRecords = JSON.parse(localStorage.getItem('tractorRecords') || '[]');
        const monthSelector = document.getElementById('monthSelector');
        
        const uniqueMonths = new Set();
        allRecords.forEach(record => {
            if (!record.date) return;
            const recordDate = new Date(record.date);
            if (isNaN(recordDate.getTime())) return;
            uniqueMonths.add(`${recordDate.getFullYear()}-${recordDate.getMonth()}`);
        });

        const now = new Date();
        uniqueMonths.add(`${now.getFullYear()}-${now.getMonth()}`);

        const sortedMonths = Array.from(uniqueMonths).sort((a, b) => {
            const [yearA, monthA] = a.split('-').map(Number);
            const [yearB, monthB] = b.split('-').map(Number);
            return yearB - yearA || monthB - monthA;
        });

        const selectedValue = monthSelector.value;
        monthSelector.innerHTML = '';
        sortedMonths.forEach(monthStr => {
            const [year, month] = monthStr.split('-').map(Number);
            const date = new Date(year, month);
            const option = document.createElement('option');
            option.value = monthStr;
            option.textContent = date.toLocaleString(currentLang, { month: 'long', year: 'numeric' });
            monthSelector.appendChild(option);
        });
        if (sortedMonths.includes(selectedValue)) {
            monthSelector.value = selectedValue;
        }
    }

    function parseDurationStringToMinutes(durationString) {
        if (!durationString || typeof durationString !== 'string') return 0;
        
        let totalMinutes = 0;
        const hoursMatch = durationString.match(/(\d+)\s*hr/);
        const minutesMatch = durationString.match(/(\d+)\s*min/);

        if (hoursMatch) {
            totalMinutes += parseInt(hoursMatch[1], 10) * 60;
        }
        if (minutesMatch) {
            totalMinutes += parseInt(minutesMatch[1], 10);
        }
        return totalMinutes;
    }

    function formatMinutesToDurationString(totalMinutes) {
        if (isNaN(totalMinutes) || totalMinutes <= 0) return '0 hrs';
        
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);
        
        let parts = [];
        if (hours > 0) parts.push(`${hours} hr${hours > 1 ? 's' : ''}`);
        if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? 's' : ''}`);
        
        return parts.length > 0 ? parts.join(' ') : '0 hrs';
    }

    function renderMonthlyDashboard() {
        const monthSelector = document.getElementById('monthSelector');
        const selectedMonthStr = monthSelector.value;
        
        const totalAmountEl = document.getElementById('totalAmountValue');
        const totalHoursEl = document.getElementById('totalHoursValue');
        const totalTripsEl = document.getElementById('totalTripsValue');

        totalAmountEl.textContent = '₹0';
        totalHoursEl.textContent = '0 hrs';
        totalTripsEl.textContent = '0';

        if (!selectedMonthStr) return;

        const [selectedYear, selectedMonth] = selectedMonthStr.split('-').map(Number);
        const allRecords = JSON.parse(localStorage.getItem('tractorRecords') || '[]');
        
        const filteredRecords = allRecords.filter(record => {
            if (!record.date) return false;
            const recordDate = new Date(record.date);
            if (isNaN(recordDate.getTime())) return false;
            return recordDate.getFullYear() === selectedYear && recordDate.getMonth() === selectedMonth;
        });

        let totalAmount = 0;
        let totalMinutes = 0;
        let totalTrips = 0;

        filteredRecords.forEach(record => {
            if (record.combinedTotalEarnings) {
                totalAmount += record.combinedTotalEarnings;
            }
            if (record.hourly && record.hourly.time) {
                totalMinutes += parseDurationStringToMinutes(record.hourly.time);
            }
            if (record.trip && record.trip.numberOfTrips) {
                totalTrips += record.trip.numberOfTrips;
            }
        });

        totalAmountEl.textContent = `₹${formatNumberWithCommas(totalAmount)}`;
        totalHoursEl.textContent = formatMinutesToDurationString(totalMinutes);
        totalTripsEl.textContent = totalTrips;
    }
    
    function setCurrentDateAndStartTime() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const hours = String(today.getHours()).padStart(2, '0');
        const minutes = String(today.getMinutes()).padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;

        document.getElementById('workDate').value = formattedDate;
        document.getElementById('startTime').value = formattedTime;
    }

     
    function calculateAllEarnings() {
      const start = document.getElementById('startTime').value;
      const end = document.getElementById('endTime').value;
      const rate = parseFloat(document.getElementById('ratePerHour').value);

      let hourlyEarnings = 0;
      let hourlyCalculationSuccessful = false;

      if (start && end && !isNaN(rate) && rate >= 0) {
        const startMinutes = new Date(`1970-01-01T${start}`).getTime() / 60000;
        let endMinutes = new Date(`1970-01-01T${end}`).getTime() / 60000;
        if (endMinutes < startMinutes) endMinutes += 24 * 60;
        const durationMinutes = endMinutes - startMinutes;

        if (durationMinutes >= 0) {
            const hours = Math.floor(durationMinutes / 60);
            const minutes = durationMinutes % 60;
            let timeParts = [];
            if (hours > 0) timeParts.push(`${hours} hr${hours > 1 ? 's' : ''}`);
            if (minutes > 0) timeParts.push(`${minutes} min${minutes > 1 ? 's' : ''}`);
            const durationString = timeParts.length > 0 ? timeParts.join(' ') : '0 mins';

            hourlyEarnings = Math.round((durationMinutes / 60) * rate);
            currentHourlyTime = durationString;
            currentHourlyEarnings = hourlyEarnings;
            document.getElementById('hourlyTotalTime').textContent = durationString;
            document.getElementById('hourlyTotalEarnings').textContent = `₹${formatNumberWithCommas(hourlyEarnings)}`;
            hourlyCalculationSuccessful = true;
        } else {
            currentHourlyTime = '0 hrs'; currentHourlyEarnings = 0;
            document.getElementById('hourlyTotalTime').textContent = '0 hrs';
            document.getElementById('hourlyTotalEarnings').textContent = '₹0';
            showMessage(T('end_time_error'), 'error');
        }
      } else {
        currentHourlyTime = '0 hrs'; currentHourlyEarnings = 0;
        document.getElementById('hourlyTotalTime').textContent = '0 hrs';
        document.getElementById('hourlyTotalEarnings').textContent = '₹0';
        if (start || end || rate > 0) showMessage(T('fill_time_rate_error'), 'error');
      }

      const numberOfTrips = parseInt(document.getElementById('numberOfTrips').value);
      const costPerTrip = parseFloat(document.getElementById('costPerTrip').value);
      let tripEarnings = 0;
      let tripCalculationSuccessful = false;

      if (!isNaN(numberOfTrips) && numberOfTrips >= 0 && !isNaN(costPerTrip) && costPerTrip >= 0) {
        tripEarnings = Math.round(numberOfTrips * costPerTrip);
        currentTripEarnings = tripEarnings;
        document.getElementById('tripTotalTrips').textContent = `${numberOfTrips} ${T('trips_count_log').toLowerCase()}`;
        document.getElementById('tripTotalEarnings').textContent = `₹${formatNumberWithCommas(tripEarnings)}`;
        tripCalculationSuccessful = true;
      } else {
        currentTripEarnings = 0;
        document.getElementById('tripTotalTrips').textContent = '0 trips';
        document.getElementById('tripTotalEarnings').textContent = '₹0';
        if (numberOfTrips > 0 || costPerTrip > 0) showMessage(T('enter_valid_trips_cost_error'), 'error');
      }

      currentCombinedEarnings = hourlyEarnings + tripEarnings;
      document.getElementById('combinedTotalEarnings').textContent = `₹${formatNumberWithCommas(currentCombinedEarnings)}`;

      if (hourlyCalculationSuccessful || tripCalculationSuccessful) {
        showMessage(T('combined_calculation_success'), 'success');
        const talkbackText = T('calculation_talkback').replace('{amount}', formatNumberWithCommas(currentCombinedEarnings));
        speakText(talkbackText, 'combinedTotalEarnings');  
      }
    }







    
    function saveCombinedData() {
      const userNameInput = document.getElementById('userName');
      const userPhoneNumberInput = document.getElementById('userPhoneNumber');
      userNameInput.classList.remove('input-error');
      userPhoneNumberInput.classList.remove('input-error');

      currentUserName = userNameInput.value.trim();
      currentUserPhoneNumber = userPhoneNumberInput.value.trim();

      if (!currentUserName) {
        showMessage(T('name_phone_missing_error'), 'error');
        userNameInput.classList.add('input-error');
        userNameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      
      const cleanedPhoneNumber = currentUserPhoneNumber.replace(/\D/g, '');
      if (cleanedPhoneNumber.length < 10) {
        showMessage(T('phone_invalid'), 'error');
        userPhoneNumberInput.classList.add('input-error');
        userPhoneNumberInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const allRecords = JSON.parse(localStorage.getItem('tractorRecords') || '[]');
      const existingRecord = allRecords.find(record => record.userPhoneNumber === currentUserPhoneNumber && record.userName.toLowerCase() !== currentUserName.toLowerCase());

      if (existingRecord) {
          showMessage(T('phone_exists_error').replace('{name}', existingRecord.userName), 'error');
          userPhoneNumberInput.classList.add('input-error');
          return;
      }
      
      const isHourlyDataValid = currentHourlyEarnings > 0;
      const isTripDataValid = currentTripEarnings > 0;

      if (!isHourlyDataValid && !isTripDataValid) {
          showMessage(T('fill_all_details_calculate_save_error'), 'error');
          return;
      }
      
      const noteContent = document.getElementById('noteContent').value.trim();
      localStorage.setItem('manatractorLastNoteContent', noteContent);

      const record = {
        type: 'combined',
        userName: currentUserName,
        userPhoneNumber: currentUserPhoneNumber,
        date: document.getElementById('workDate').value,
        noteContent: noteContent,
        timestamp: new Date().toISOString(),
        combinedTotalEarnings: currentCombinedEarnings,
        paymentStatus: 'default',
        hourly: isHourlyDataValid ? { start: document.getElementById('startTime').value, end: document.getElementById('endTime').value, rate: parseFloat(document.getElementById('ratePerHour').value), time: currentHourlyTime, earnings: currentHourlyEarnings } : null,
        trip: isTripDataValid ? { numberOfTrips: parseInt(document.getElementById('numberOfTrips').value), costPerTrip: parseFloat(document.getElementById('costPerTrip').value), tripsDisplay: document.getElementById('tripTotalTrips').textContent, earnings: currentTripEarnings } : null
      };

      const existing = JSON.parse(localStorage.getItem('tractorRecords') || '[]');
      existing.push(record);
      localStorage.setItem('tractorRecords', JSON.stringify(existing));
      
      populateUniqueCustomers();

      showMessage(T('data_saved_success'), 'success');
      speakText(T('saved_talkback'));
      
       
      document.getElementById('noteContent').value = '';
      localStorage.removeItem('manatractorLastNoteContent');

      document.getElementById('startTime').value = '';
      document.getElementById('endTime').value = '';
      document.getElementById('ratePerHour').value = '2000';
      document.getElementById('numberOfTrips').value = '0';
      document.getElementById('costPerTrip').value = '500';
      showDashboardView(); 
    }

    
    function filterLogs() {
        const searchTerm = document.getElementById('logSearchInput').value.toLowerCase();
        const allRecords = JSON.parse(localStorage.getItem('tractorRecords') || '[]');
        const filteredRecords = allRecords.filter(record => 
            record.userName.toLowerCase().includes(searchTerm) || 
            record.userPhoneNumber.includes(searchTerm)
        );
        renderLogs(filteredRecords);
    }







    
    function renderLogs(recordsToDisplay) {
      const logsContainer = document.getElementById('logsContainer');
      logsContainer.innerHTML = '';

      if (recordsToDisplay.length === 0) {
        logsContainer.innerHTML = `<p class="text-center text-gray-500">${T('no_logs_saved')}</p>`;
        return;
      }
      
      recordsToDisplay.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      recordsToDisplay.forEach(record => {
        const logCard = document.createElement('div');
        logCard.className = 'bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative overflow-hidden';  
        const ts = record.timestamp;  
        let hourlyDetailsHtml = '';
        if (record.hourly) {
          hourlyDetailsHtml = `
            <div id="hourly_details_${ts}">
                <h4 id="hourly_details_heading_${ts}" class="font-semibold text-gray-700 mt-2 mb-1">${T('hourly_time_label')}</h4>
                <p id="hourly_details_work_time_${ts}" class="text-sm text-gray-700 mb-1"><span class="font-bold">${T('work_time')}:</span> ${formatTime12Hour(record.hourly.start)} - ${formatTime12Hour(record.hourly.end)}</p>
                <p id="hourly_details_rate_${ts}" class="text-sm text-gray-700 mb-1"><span class="font-bold">${T('rate')}:</span> ₹${formatNumberWithCommas(record.hourly.rate)} / hr</p>
                <p id="hourly_details_duration_${ts}" class="text-base text-gray-800"><span class="font-bold">${T('duration')}:</span> ${record.hourly.time}</p>
                <p id="hourly_details_earnings_${ts}" class="text-base text-gray-800"><span class="font-bold">${T('earnings')}:</span> ₹${formatNumberWithCommas(record.hourly.earnings)}</p>
            </div>
          `;
        }

        let tripDetailsHtml = '';
        if (record.trip) {
          tripDetailsHtml = `
            <div id="trip_details_${ts}">
                <h4 id="trip_details_heading_${ts}" class="font-semibold text-gray-700 mt-2 mb-1">${T('trip_earnings_label')}</h4>
                <p id="trip_details_count_${ts}" class="text-sm text-gray-700 mb-1"><span class="font-bold">${T('trips_count_log')}:</span> ${record.trip.numberOfTrips}</p>
                <p id="trip_details_cost_${ts}" class="text-sm text-gray-700 mb-1"><span class="font-bold">${T('cost_per_trip_log')}:</span> ₹${formatNumberWithCommas(record.trip.costPerTrip)}</p>
                <p id="trip_details_total_display_${ts}" class="text-base text-gray-800"><span class="font-bold">${T('total_trips_display_log')}:</span> ${record.trip.tripsDisplay}</p>
                <p id="trip_details_earnings_${ts}" class="text-base text-gray-800"><span class="font-bold">${T('earnings')}:</span> ₹${formatNumberWithCommas(record.trip.earnings)}</p>
            </div>
          `;
        }
        
        let noteDetailsHtml = '';
        if (record.noteContent) {
          noteDetailsHtml = `
            <div id="note_content_${ts}" class="mt-3 pt-3 border-t border-gray-100">
              <h4 id="note_content_heading_${ts}" class="font-semibold text-gray-700 mb-1"><span class="font-bold">${T('note_content_label')}:</span></h4>
              <p id="note_content_text_${ts}" class="text-sm text-gray-700 whitespace-pre-wrap">${sanitizeHTML(record.noteContent)}</p>
            </div>
          `;
        }

        let paymentColorClass = 'text-blue-700';
        if (record.paymentStatus === 'paid') paymentColorClass = 'text-green-600';
        else if (record.paymentStatus === 'due') paymentColorClass = 'text-red-600';
        else if (record.paymentStatus === 'advance') paymentColorClass = 'text-pink-600';
        
        const paidOverlayClass = record.paymentStatus === 'paid' ? 'visible' : '';

        logCard.innerHTML = `
          <div id="paid-overlay-${ts}" class="paid-overlay ${paidOverlayClass}">
            <div class="cross-line cross-line-1"></div>
            <div class="cross-line cross-line-2"></div>
          </div>
          <div class="flex items-center justify-between mb-2">
            <h3 id="date_${ts}" class="font-semibold text-lg text-green-800">${record.date}</h3>
            <span id="saved_on_${ts}" class="text-sm text-gray-500">${T('saved_on')}: ${new Date(record.timestamp).toLocaleString(currentLang)}</span>
          </div>
          <p id="name_${ts}" class="text-sm text-gray-700 mb-1"><span class="font-bold">${T('name')}:</span> ${sanitizeHTML(record.userName)}</p>
          <p id="phone_${ts}" class="text-sm text-gray-700 mb-1"><span class="font-bold">${T('phone')}:</span> ${sanitizeHTML(record.userPhoneNumber)}</p>
          ${hourlyDetailsHtml}
          ${tripDetailsHtml}
          <p class="text-xl font-bold ${paymentColorClass} mt-2 border-t pt-2 border-gray-200" id="combinedEarnings_${ts}">${T('combined_earnings_label')}: ₹${formatNumberWithCommas(record.combinedTotalEarnings)}</p>
          ${noteDetailsHtml}
          <div class="flex justify-end items-center gap-2 mt-3" style="flex-wrap: wrap;">
            <button onclick="updatePaymentStatus('${ts}', 'paid')" class="px-3 py-1 text-sm font-semibold rounded-md bg-green-100 text-green-700 hover:bg-green-200">${T('paid_status')}</button>
            <button onclick="updatePaymentStatus('${ts}', 'due')" class="px-3 py-1 text-sm font-semibold rounded-md bg-red-100 text-red-700 hover:bg-red-200">${T('due_status')}</button>
            <button onclick="updatePaymentStatus('${ts}', 'advance')" class="px-3 py-1 text-sm font-semibold rounded-md bg-pink-100 text-pink-700 hover:bg-pink-200">${T('advance_status')}</button>
            <button onclick="callLoggedNumber('${record.userPhoneNumber}')" class="p-2 text-sm font-semibold rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200" title="${T('call_button')}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.103 6.103l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
            </button>
            <button onclick="sendLogViaSms('${ts}')" class="p-2 text-sm font-semibold rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200" title="${T('sms_button')}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2h-8zM9 4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM9 8a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM9 12a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" /><path d="M2 6a2 2 0 012-2h3v12H4a2 2 0 01-2-2V6z" /></svg>
            </button>
            <button onclick="sendLogViaWhatsApp('${ts}')" class="p-1 rounded-full hover:opacity-80 transition-opacity" title="${T('whatsapp_button')}">
                 <svg viewBox="0 0 24 24" class="h-6 w-6">
                    <path fill="#25D366" d="M19.7,4.3c-1.9-1.9-4.4-2.9-7.1-2.9c-5.5,0-10,4.5-10,10c0,1.8,0.5,3.5,1.3,5l-1.5,5.5l5.6-1.5 c1.4,0.8,3,1.3,4.7,1.3h0c5.5,0,10-4.5,10-10C22.6,8.7,21.6,6.2,19.7,4.3z"/>
                    <path fill="#FFFFFF" d="M16.5,13.3c-0.2-0.1-1.2-0.6-1.4-0.7c-0.2-0.1-0.3-0.1-0.5,0.1c-0.1,0.2-0.5,0.7-0.7,0.8 c-0.1,0.1-0.3,0.2-0.5,0.1c-0.2-0.1-0.9-0.3-1.7-1c-0.6-0.6-1-1.3-1.2-1.5c-0.1-0.2,0-0.3,0.1-0.4c0.1-0.1,0.2-0.3,0.4-0.4 c0.1-0.1,0.1-0.2,0.2-0.3c0.1-0.1,0-0.3-0.1-0.4c-0.1-0.1-0.5-1.2-0.7-1.6c-0.2-0.4-0.3-0.4-0.5-0.4C9.6,7.6,9.5,7.6,9.3,7.6 c-0.2,0-0.4,0.1-0.6,0.3c-0.2,0.2-0.8,0.8-0.8,1.9c0,1.1,0.8,2.2,0.9,2.4c0.1,0.2,1.6,2.5,3.9,3.4c0.5,0.2,1,0.4,1.3,0.5 c0.5,0.2,1.1,0.1,1.5,0.1c0.4-0.1,1.3-0.5,1.5-1.1c0.2-0.5,0.2-1,0.1-1.1C16.8,13.5,16.7,13.4,16.5,13.3z"/>
                </svg>
            </button>
            <button onclick="downloadLog('${ts}')" class="p-2 text-sm font-semibold rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200" title="${T('download_button')}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
            </button>
            <button id="speakBtn_${ts}" onclick="speakLogEntry('${ts}')" class="p-2 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200" title="${T('read_aloud_button')}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" /></svg>
            </button>
          </div>
        `;
        logsContainer.appendChild(logCard);
      });
    }






    function loadLogs() {
        populateUniqueCustomers();
        document.getElementById('logSearchInput').value = '';
        filterLogs();
    }
    
     
    function generateLeaderboard() {
        const leaderboardContainer = document.getElementById('leaderboardContainer');
        leaderboardContainer.innerHTML = '';
        const allRecords = JSON.parse(localStorage.getItem('tractorRecords') || '[]');

        if (allRecords.length === 0) {
            leaderboardContainer.innerHTML = `<p class="text-center text-gray-500">${T('no_leaderboard_data')}</p>`;
            return;
        }

        const customerCounts = {};
        allRecords.forEach(record => {
            const key = `${record.userName.trim().toLowerCase()}|${record.userPhoneNumber.trim()}`;
            if (!customerCounts[key]) {
                customerCounts[key] = { name: record.userName, phone: record.userPhoneNumber, count: 0 };
            }
            customerCounts[key].count++;
        });

        const rankedCustomers = Object.values(customerCounts).sort((a, b) => b.count - a.count);

        rankedCustomers.forEach((customer, index) => {
            const rank = index + 1;
            const card = document.createElement('div');
            card.className = 'flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer';
            card.setAttribute('onclick', `showCustomerLogs('${customer.name.replace(/'/g, "\\'")}', '${customer.phone.replace(/'/g, "\\'")}')`);

            let iconHtml = (rank === 1) ? `<svg class="h-8 w-8 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.16 8.45L2 9.27L7.5 14.14L5.82 21.02L12 17.27L18.18 21.02L16.5 14.14L22 9.27L14.84 8.45L12 2Z" /></svg>`
                                      : `<span class="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-gray-600 font-bold">${rank}</span>`;
            card.innerHTML = `
                <div class="flex-shrink-0 w-10 text-center">${iconHtml}</div>
                <div class="ml-4 flex-grow">
                    <p class="font-bold text-gray-800">${sanitizeHTML(customer.name)}</p>
                    <p class="text-sm text-gray-500">${sanitizeHTML(customer.phone)}</p>
                </div>
                <div class="text-right">
                    <p class="text-lg font-bold text-green-600">${customer.count}</p>
                    <p class="text-xs text-gray-500">${T('saves')}</p>
                </div>
            `;
            leaderboardContainer.appendChild(card);
        });
    }

    
    function showCustomerLogs(name, phone) {
        showSection('customerLogsSection');
        const heading = document.getElementById('customerLogsHeading');
        heading.innerHTML = T('customer_logs_heading').replace('{name}', sanitizeHTML(name));
        heading.setAttribute('data-customer-name', name);
        heading.setAttribute('data-customer-phone', phone);
        const allRecords = JSON.parse(localStorage.getItem('tractorRecords') || '[]');
        const customerRecords = allRecords.filter(record => record.userName === name && record.userPhoneNumber === phone);
        renderCustomerLogs(customerRecords);
    }

     
    function renderCustomerLogs(recordsToDisplay) {
        const logsContainer = document.getElementById('customerLogsContainer');
        logsContainer.innerHTML = '';

        if (recordsToDisplay.length === 0) {
            logsContainer.innerHTML = `<p class="text-center text-gray-500">${T('no_logs_saved')}</p>`;
            return;
        }
      
        recordsToDisplay.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        recordsToDisplay.forEach(record => {
            const logCard = document.createElement('div');
            logCard.className = 'bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative overflow-hidden';
            const ts = record.timestamp;

            let hourlyDetailsHtml = '';
            if (record.hourly) {
                hourlyDetailsHtml = `<div id="hourly_details_${ts}"><h4 id="hourly_details_heading_${ts}" class="font-semibold text-gray-700 mt-2 mb-1">${T('hourly_time_label')}</h4><p id="hourly_details_work_time_${ts}" class="text-sm text-gray-700 mb-1"><span class="font-bold">${T('work_time')}:</span> ${formatTime12Hour(record.hourly.start)} - ${formatTime12Hour(record.hourly.end)}</p><p id="hourly_details_rate_${ts}" class="text-sm text-gray-700 mb-1"><span class="font-bold">${T('rate')}:</span> ₹${formatNumberWithCommas(record.hourly.rate)} / hr</p><p id="hourly_details_duration_${ts}" class="text-base text-gray-800"><span class="font-bold">${T('duration')}:</span> ${record.hourly.time}</p><p id="hourly_details_earnings_${ts}" class="text-base text-gray-800"><span class="font-bold">${T('earnings')}:</span> ₹${formatNumberWithCommas(record.hourly.earnings)}</p></div>`;
            }

            let tripDetailsHtml = '';
            if (record.trip) {
                tripDetailsHtml = `<div id="trip_details_${ts}"><h4 id="trip_details_heading_${ts}" class="font-semibold text-gray-700 mt-2 mb-1">${T('trip_earnings_label')}</h4><p id="trip_details_count_${ts}" class="text-sm text-gray-700 mb-1"><span class="font-bold">${T('trips_count_log')}:</span> ${record.trip.numberOfTrips}</p><p id="trip_details_cost_${ts}" class="text-sm text-gray-700 mb-1"><span class="font-bold">${T('cost_per_trip_log')}:</span> ₹${formatNumberWithCommas(record.trip.costPerTrip)}</p><p id="trip_details_total_display_${ts}" class="text-base text-gray-800"><span class="font-bold">${T('total_trips_display_log')}:</span> ${record.trip.tripsDisplay}</p><p id="trip_details_earnings_${ts}" class="text-base text-gray-800"><span class="font-bold">${T('earnings')}:</span> ₹${formatNumberWithCommas(record.trip.earnings)}</p></div>`;
            }
            
            let noteDetailsHtml = '';
            if (record.noteContent) {
                noteDetailsHtml = `<div id="note_content_${ts}" class="mt-3 pt-3 border-t border-gray-100"><h4 id="note_content_heading_${ts}" class="font-semibold text-gray-700 mb-1"><span class="font-bold">${T('note_content_label')}:</span></h4><p id="note_content_text_${ts}" class="text-sm text-gray-700 whitespace-pre-wrap">${sanitizeHTML(record.noteContent)}</p></div>`;
            }

            let paymentColorClass = 'text-blue-700';
            if (record.paymentStatus === 'paid') paymentColorClass = 'text-green-600';
            else if (record.paymentStatus === 'due') paymentColorClass = 'text-red-600';
            else if (record.paymentStatus === 'advance') paymentColorClass = 'text-pink-600';
            
            const paidOverlayClass = record.paymentStatus === 'paid' ? 'visible' : '';

            logCard.innerHTML = `
                <div id="paid-overlay-${ts}" class="paid-overlay ${paidOverlayClass}"><div class="cross-line cross-line-1"></div><div class="cross-line cross-line-2"></div></div>
                <div class="flex items-center justify-between mb-2"><h3 id="date_${ts}" class="font-semibold text-lg text-green-800">${record.date}</h3><span id="saved_on_${ts}" class="text-sm text-gray-500">${T('saved_on')}: ${new Date(record.timestamp).toLocaleString(currentLang)}</span></div>
                <p id="name_${ts}" class="text-sm text-gray-700 mb-1"><span class="font-bold">${T('name')}:</span> ${sanitizeHTML(record.userName)}</p>
                <p id="phone_${ts}" class="text-sm text-gray-700 mb-1"><span class="font-bold">${T('phone')}:</span> ${sanitizeHTML(record.userPhoneNumber)}</p>
                ${hourlyDetailsHtml}${tripDetailsHtml}
                <p class="text-xl font-bold ${paymentColorClass} mt-2 border-t pt-2 border-gray-200" id="combinedEarnings_${ts}">${T('combined_earnings_label')}: ₹${formatNumberWithCommas(record.combinedTotalEarnings)}</p>
                ${noteDetailsHtml}
                <div class="flex justify-end items-center gap-2 mt-3" style="flex-wrap: wrap;">
                    <button onclick="updatePaymentStatus('${ts}', 'paid')" class="px-3 py-1 text-sm font-semibold rounded-md bg-green-100 text-green-700 hover:bg-green-200">${T('paid_status')}</button>
                    <button onclick="updatePaymentStatus('${ts}', 'due')" class="px-3 py-1 text-sm font-semibold rounded-md bg-red-100 text-red-700 hover:bg-red-200">${T('due_status')}</button>
                    <button onclick="updatePaymentStatus('${ts}', 'advance')" class="px-3 py-1 text-sm font-semibold rounded-md bg-pink-100 text-pink-700 hover:bg-pink-200">${T('advance_status')}</button>
                    <button onclick="callLoggedNumber('${record.userPhoneNumber}')" class="p-2 text-sm font-semibold rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200" title="${T('call_button')}"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.103 6.103l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg></button>
                    <button onclick="sendLogViaSms('${ts}')" class="p-2 text-sm font-semibold rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200" title="${T('sms_button')}"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2h-8zM9 4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM9 8a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM9 12a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" /><path d="M2 6a2 2 0 012-2h3v12H4a2 2 0 01-2-2V6z" /></svg></button>
                    <button onclick="sendLogViaWhatsApp('${ts}')" class="p-1 rounded-full hover:opacity-80 transition-opacity" title="${T('whatsapp_button')}"><svg viewBox="0 0 24 24" class="h-6 w-6"><path fill="#25D366" d="M19.7,4.3c-1.9-1.9-4.4-2.9-7.1-2.9c-5.5,0-10,4.5-10,10c0,1.8,0.5,3.5,1.3,5l-1.5,5.5l5.6-1.5 c1.4,0.8,3,1.3,4.7,1.3h0c5.5,0,10-4.5,10-10C22.6,8.7,21.6,6.2,19.7,4.3z"/><path fill="#FFFFFF" d="M16.5,13.3c-0.2-0.1-1.2-0.6-1.4-0.7c-0.2-0.1-0.3-0.1-0.5,0.1c-0.1,0.2-0.5,0.7-0.7,0.8 c-0.1,0.1-0.3,0.2-0.5,0.1c-0.2-0.1-0.9-0.3-1.7-1c-0.6-0.6-1-1.3-1.2-1.5c-0.1-0.2,0-0.3,0.1-0.4c0.1-0.1,0.2-0.3,0.4-0.4 c0.1-0.1,0.1-0.2,0.2-0.3c0.1-0.1,0-0.3-0.1-0.4c-0.1-0.1-0.5-1.2-0.7-1.6c-0.2-0.4-0.3-0.4-0.5-0.4C9.6,7.6,9.5,7.6,9.3,7.6 c-0.2,0-0.4,0.1-0.6,0.3c-0.2,0.2-0.8,0.8-0.8,1.9c0,1.1,0.8,2.2,0.9,2.4c0.1,0.2,1.6,2.5,3.9,3.4c0.5,0.2,1,0.4,1.3,0.5 c0.5,0.2,1.1,0.1,1.5,0.1c0.4-0.1,1.3-0.5,1.5-1.1c0.2-0.5,0.2-1,0.1-1.1C16.8,13.5,16.7,13.4,16.5,13.3z"/></svg></button>
                    <button onclick="downloadLog('${ts}')" class="p-2 text-sm font-semibold rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200" title="${T('download_button')}"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" /></svg></button>
                    <button id="speakBtn_${ts}" onclick="speakLogEntry('${ts}')" class="p-2 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200" title="${T('read_aloud_button')}"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" /></svg></button>
                </div>
            `;
            logsContainer.appendChild(logCard);
        });
    }

     
    function toggleHamburgerMenu() {
        document.getElementById('hamburgerSidebar').classList.toggle('show');
        document.getElementById('hamburgerOverlay').classList.toggle('show');
    }

     
    function updatePaymentStatus(timestamp, newStatus) {
        const allRecords = JSON.parse(localStorage.getItem('tractorRecords') || '[]');
        const recordIndex = allRecords.findIndex(record => record.timestamp === timestamp);
        if (recordIndex > -1) {
            allRecords[recordIndex].paymentStatus = newStatus;
            localStorage.setItem('tractorRecords', JSON.stringify(allRecords));
            
             
            if (!document.getElementById('logsSection').classList.contains('hidden')) {
                filterLogs();  
            }
            if (!document.getElementById('customerLogsSection').classList.contains('hidden')) {
                const heading = document.getElementById('customerLogsHeading');
                const customerName = heading.getAttribute('data-customer-name');
                const customerPhone = heading.getAttribute('data-customer-phone');
                if (customerName && customerPhone) {
                    showCustomerLogs(customerName, customerPhone);  
                }
            }

            showMessage(`${T(newStatus + '_status')} status updated!`, 'success');
        } else {
            showMessage('Error: Log record not found.', 'error');
        }
    }

     
    function callPhoneNumber() {
      const phoneNumber = document.getElementById('userPhoneNumber').value.trim();
      if (phoneNumber) window.location.href = `tel:${phoneNumber}`;
      else showMessage(T('call_error'), 'error');
    }
    function callLoggedNumber(phoneNumber) {
      if (phoneNumber && phoneNumber.trim() !== '') window.location.href = `tel:${phoneNumber}`;
      else showMessage(T('call_error'), 'error');
    }
    
     
    async function getContact() {
      if ('contacts' in navigator && 'ContactsManager' in window) {
        try {
          const contacts = await navigator.contacts.select(['name', 'tel'], { multiple: false });
          if (contacts.length > 0) {
            if (contacts[0].name.length) document.getElementById('userName').value = contacts[0].name[0];
            if (contacts[0].tel.length) document.getElementById('userPhoneNumber').value = contacts[0].tel[0];
          }
        } catch (error) { console.error('Contact picker failed.', error); }
      } else { showMessage(T('contact_picker_not_supported'), 'error'); }
    }

     
    function getLogTextContent(record) {
        if (!record) return '';
        let hourlySms = record.hourly ? T('sms_hourly_template').replace('{startTime}', formatTime12Hour(record.hourly.start)).replace('{endTime}', formatTime12Hour(record.hourly.end)).replace('{duration}', record.hourly.time).replace('{rate}', formatNumberWithCommas(record.hourly.rate)).replace('{earnings}', formatNumberWithCommas(record.hourly.earnings)) : '';
        let tripSms = record.trip ? T('sms_trip_template').replace('{trips}', record.trip.numberOfTrips).replace('{tripsDisplay}', record.trip.tripsDisplay).replace('{costPerTrip}', formatNumberWithCommas(record.trip.costPerTrip)).replace('{earnings}', formatNumberWithCommas(record.trip.earnings)) : '';
        return T('sms_body_template').replace('{date}', record.date).replace('{name}', record.userName).replace('{phone}', record.userPhoneNumber).replace('{hourlyDetails}\n{tripDetails}', [hourlySms, tripSms].filter(Boolean).join('\n')).replace('{totalEarnings}', `₹${formatNumberWithCommas(record.combinedTotalEarnings)}`).replace('{noteContent}', record.noteContent || 'N/A').replace('{paymentStatus}', T(record.paymentStatus + '_status')).replace(/\n\n+/g, '\n');
    }

     
    function sendLogViaSms(timestamp) {
        const record = JSON.parse(localStorage.getItem('tractorRecords') || '[]').find(rec => rec.timestamp === timestamp);
        if (!record) return showMessage('Error: Log not found.', 'error');
        if (!record.userPhoneNumber) return showMessage(T('sms_send_error'), 'error');
        window.location.href = `sms:${record.userPhoneNumber}?body=${encodeURIComponent(getLogTextContent(record))}`;
    }

    
    function sendLogViaWhatsApp(timestamp) {
        const record = JSON.parse(localStorage.getItem('tractorRecords') || '[]').find(rec => rec.timestamp === timestamp);
        if (!record) return showMessage('Error: Log not found.', 'error');
        if (!record.userPhoneNumber) return showMessage(T('sms_send_error'), 'error');  
        const message = getLogTextContent(record);
        const phoneNumber = record.userPhoneNumber.replace(/[^0-9]/g, ''); 
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
 
    function downloadLog(timestamp) {
        const record = JSON.parse(localStorage.getItem('tractorRecords') || '[]').find(rec => rec.timestamp === timestamp);
        if (!record) return showMessage(T('download_error'), 'error');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([getLogTextContent(record)], { type: 'text/plain;charset=utf-8' }));
        a.download = `ManaTractor-Log-${record.date}-${record.userName}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    
    let currentSpeakingTimestamp = null;
    const speakerIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" /></svg>`;
    const stopIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 5a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" clip-rule="evenodd" /></svg>`;

    function stopSpeech() {
        speechSynthesis.cancel();
        if (currentSpeakingTimestamp) {
            const prevButton = document.getElementById(`speakBtn_${currentSpeakingTimestamp}`);
            if (prevButton) prevButton.innerHTML = speakerIconSVG;
            const highlighted = document.querySelectorAll('.speaking-highlight');
            highlighted.forEach(el => el.classList.remove('speaking-highlight'));
        }
        currentSpeakingTimestamp = null;
    }

    function speakText(text, highlightElementId = null) {
        if (!('speechSynthesis' in window)) {
            return;
        }
        stopSpeech(); 

        const utterance = new SpeechSynthesisUtterance(text);
        const langMap = { 'te': 'te-IN', 'en': 'en-US', 'hi': 'hi-IN', 'ar': 'ar-SA' };
        utterance.lang = langMap[currentLang] || 'en-US';

        let elementToHighlight = null;
        if (highlightElementId) {
            elementToHighlight = document.getElementById(highlightElementId);
        }

        utterance.onstart = () => {
            if (elementToHighlight) {
                elementToHighlight.classList.add('speaking-highlight');
            }
        };

        utterance.onend = () => {
            if (elementToHighlight) {
                setTimeout(() => elementToHighlight.classList.remove('speaking-highlight'), 500);
            }
        };

        utterance.onerror = (e) => {
            console.error("Speech synthesis error:", e);
            if (elementToHighlight) {
                elementToHighlight.classList.remove('speaking-highlight');
            }
        };

        speechSynthesis.speak(utterance);
    }
    
     
    function formatTimeForTeluguSpeech(timeString) {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':').map(Number);
        
        const period = hours >= 12 ? 'మధ్యాహ్నం' : 'ఉదయం';  
        let formattedHours = hours % 12 || 12;

        let timeText = `${period} ${formattedHours} గంటల`;
        if (minutes > 0) {
            timeText += ` ${minutes} నిమిషాలు`;
        }
        return timeText;
    }

    function speakLogEntry(timestamp) {
        if (!('speechSynthesis' in window)) {
            return showMessage(T('speech_synthesis_not_supported'), 'error');
        }

        if (currentSpeakingTimestamp === timestamp) {
            stopSpeech();
            return;
        }
        
        stopSpeech();  
        currentSpeakingTimestamp = timestamp;
        
        const speakButton = document.getElementById(`speakBtn_${timestamp}`);
        if(speakButton) speakButton.innerHTML = stopIconSVG;

        const record = JSON.parse(localStorage.getItem('tractorRecords') || '[]').find(rec => rec.timestamp === timestamp);
        if (!record) {
            stopSpeech();
            return;
        }

        const partsToSpeak = [];
        const ts = record.timestamp;

        partsToSpeak.push({ text: `${T('name')}: ${record.userName}`, elementId: `name_${ts}` });
        const phoneNumberAsDigits = record.userPhoneNumber.split('').join(' ');
        partsToSpeak.push({ text: `${T('phone')}: ${phoneNumberAsDigits}`, elementId: `phone_${ts}` });

        if (record.hourly) {
            let workTimeText;
            if (currentLang === 'te') {
                const teluguStartTime = formatTimeForTeluguSpeech(record.hourly.start);
                const teluguEndTime = formatTimeForTeluguSpeech(record.hourly.end);
                // Using "nundi" for "from" and "varaku" for "to"
                workTimeText = `${T('work_time')}: ${teluguStartTime} నుండి ${teluguEndTime} వరకు`;
            } else {
                const startTimeForSpeech = formatTime12Hour(record.hourly.start).replace(':', ' ');
                const endTimeForSpeech = formatTime12Hour(record.hourly.end).replace(':', ' ');
                workTimeText = `${T('work_time')}: from ${startTimeForSpeech} to ${endTimeForSpeech}`;
            }

            partsToSpeak.push({ text: T('hourly_time_label'), elementId: `hourly_details_heading_${ts}` });
            partsToSpeak.push({ text: workTimeText, elementId: `hourly_details_work_time_${ts}` });
            partsToSpeak.push({ text: `${T('rate')}: ${formatNumberWithCommas(record.hourly.rate)} rupees per hour`, elementId: `hourly_details_rate_${ts}` });
            partsToSpeak.push({ text: `${T('duration')}: ${record.hourly.time}`, elementId: `hourly_details_duration_${ts}` });
            partsToSpeak.push({ text: `${T('earnings')}: ${formatNumberWithCommas(record.hourly.earnings)} rupees`, elementId: `hourly_details_earnings_${ts}` });
        }

        if (record.trip) {
            partsToSpeak.push({ text: T('trip_earnings_label'), elementId: `trip_details_heading_${ts}` });
            partsToSpeak.push({ text: `${T('trips_count_log')}: ${record.trip.numberOfTrips}`, elementId: `trip_details_count_${ts}` });
            partsToSpeak.push({ text: `${T('cost_per_trip_log')}: ${formatNumberWithCommas(record.trip.costPerTrip)} rupees per trip`, elementId: `trip_details_cost_${ts}` });
            partsToSpeak.push({ text: `${T('total_trips_display_log')}: ${record.trip.tripsDisplay}`, elementId: `trip_details_total_display_${ts}` });
            partsToSpeak.push({ text: `${T('earnings')}: ${formatNumberWithCommas(record.trip.earnings)} rupees`, elementId: `trip_details_earnings_${ts}` });
        }

        partsToSpeak.push({ text: `${T('combined_earnings_label')}: ${formatNumberWithCommas(record.combinedTotalEarnings)} rupees`, elementId: `combinedEarnings_${ts}` });

        if (record.noteContent) {
            partsToSpeak.push({ text: `${T('note_content_label')}: ${record.noteContent}`, elementId: `note_content_text_${ts}` });
        }

        let currentIndex = 0;
        let lastHighlightedElement = null;

        function speakNextPart() {
            if (lastHighlightedElement) {
                lastHighlightedElement.classList.remove('speaking-highlight');
            }

            if (currentIndex >= partsToSpeak.length) {
                stopSpeech();
                return;
            }

            const part = partsToSpeak[currentIndex];
            const element = document.getElementById(part.elementId);
            
            if (element) {
                element.classList.add('speaking-highlight');
                lastHighlightedElement = element;
            }

            const utterance = new SpeechSynthesisUtterance(part.text);
            const langMap = { 'te': 'te-IN', 'en': 'en-US', 'hi': 'hi-IN', 'ar': 'ar-SA' };
            utterance.lang = langMap[currentLang] || 'en-US';
            
            utterance.onend = () => {
                currentIndex++;
                speakNextPart();
            };
            
            utterance.onerror = (e) => {
                console.error("Speech synthesis error:", e);
                stopSpeech();
            };
            
            speechSynthesis.speak(utterance);
        }

        speakNextPart();
    }

     
    window.signInWithGoogle = signInWithGoogle;
    window.signUpWithEmail = signUpWithEmail;
    window.signInWithEmail = signInWithEmail;
    window.toggleAuthView = toggleAuthView;
    window.logout = logout;
    window.saveUserName = saveUserName;
    window.setLanguage = setLanguage;
    window.showDashboardView = showDashboardView;
    window.showLogsView = showLogsView;
    window.showLeaderboardView = showLeaderboardView;
    window.showMonthlyDashboardView = showMonthlyDashboardView;
    window.renderMonthlyDashboard = renderMonthlyDashboard;
    window.showCustomerLogs = showCustomerLogs;
    window.calculateAllEarnings = calculateAllEarnings;
    window.saveCombinedData = saveCombinedData;
    window.filterLogs = filterLogs;
    window.toggleHamburgerMenu = toggleHamburgerMenu;
    window.updatePaymentStatus = updatePaymentStatus;
    window.callPhoneNumber = callPhoneNumber;
    window.callLoggedNumber = callLoggedNumber;
    window.getContact = getContact;
    window.sendLogViaSms = sendLogViaSms;
    window.sendLogViaWhatsApp = sendLogViaWhatsApp;
    window.downloadLog = downloadLog;
    window.startSpeechRecognition = startSpeechRecognition;
    window.speakLogEntry = speakLogEntry;
    window.speakText = speakText;


     
    document.addEventListener('DOMContentLoaded', function() {
      currentLang = localStorage.getItem('manatractorLang') || 'te';
      setLanguage(currentLang);
      checkAuthState();
      document.getElementById('noteContent').value = localStorage.getItem('manatractorLastNoteContent') || '';
      setCurrentDateAndStartTime();
      populateUniqueCustomers();
      setupAutocomplete();
      
       
      window.addEventListener('beforeunload', stopSpeech);

      
      const manifest = {
        "name": "ManaTractor Dashboard",
        "short_name": "ManaTractor",
        "start_url": ".",
        "display": "standalone",
        "background_color": "#f0fdf4",
        "theme_color": "#16a34a",
        "description": "Track your tractor work, time & earnings with ease.",
        "icons": [
          { "src": "https://img.icons8.com/color/192/tractor.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
          { "src": "https://img.icons8.com/color/512/tractor.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
        ]
      };

      const manifestString = JSON.stringify(manifest);
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = 'data:application/json;base64,' + btoa(unescape(encodeURIComponent(manifestString)));
      document.head.appendChild(manifestLink);

      if ('serviceWorker' in navigator) {
        const serviceWorkerScript = `
          const CACHE_NAME = 'manatractor-cache-v2';
          const urlsToCache = [
              '/',
              'https://cdn.tailwindcss.com',
              'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js',
              'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js',
              'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js',
              'https://img.icons8.com/color/192/tractor.png',
              'https://img.icons8.com/color/512/tractor.png',
              'icons/diskette.png',
              'icons/podium.png',
              'icons/wages.png',
              'icons/music.png'
          ];

          self.addEventListener('install', event => {
              event.waitUntil(
                  caches.open(CACHE_NAME)
                      .then(cache => {
                          console.log('Opened cache');
                          return Promise.all(urlsToCache.map(url => {
                              return fetch(new Request(url, {cache: 'reload'}))
                                  .then(response => cache.put(url, response))
                                  .catch(err => console.warn('Failed to cache:', url, err));
                          }));
                      })
              );
          });

          self.addEventListener('fetch', event => {
              event.respondWith(
                  caches.match(event.request)
                      .then(response => {
                          if (response) {
                              return response;
                          }
                          return fetch(event.request).then(
                              response => {
                                  if (!response || response.status !== 200) {
                                      return response;
                                  }
                                  // Don't cache firebase auth requests
                                  if (event.request.url.includes('firebase')) {
                                      return response;
                                  }
                                  const responseToCache = response.clone();
                                  caches.open(CACHE_NAME)
                                      .then(cache => {
                                          cache.put(event.request, responseToCache);
                                      });
                                  return response;
                              }
                          ).catch(error => {
                            console.log('Fetch failed; returning offline page instead.', error);
                            // You can return a custom offline page/resource here if you have one cached.
                            // For a single-page app, returning the cached '/' is often sufficient.
                            return caches.match('/');
                          });
                      })
              );
          });

          self.addEventListener('activate', event => {
              const cacheWhitelist = [CACHE_NAME];
              event.waitUntil(
                  caches.keys().then(cacheNames => {
                      return Promise.all(
                          cacheNames.map(cacheName => {
                              if (cacheWhitelist.indexOf(cacheName) === -1) {
                                  return caches.delete(cacheName);
                              }
                          })
                      );
                  })
              );
          });
        `;

        const blob = new Blob([serviceWorkerScript], { type: 'application/javascript' });
        const swUrl = URL.createObjectURL(blob);

        navigator.serviceWorker.register(swUrl)
            .then(registration => console.log('ServiceWorker registration successful with scope: ', registration.scope))
            .catch(err => console.log('ServiceWorker registration failed: ', err));
      }
    });

