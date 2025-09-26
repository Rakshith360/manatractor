// --- AUTHENTICATION LOGIC ---
    function showLoadingView() {
        document.getElementById('loadingSection').classList.remove('hidden');
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('signUpSection').classList.add('hidden');
        document.getElementById('languageSection').classList.add('hidden');
        document.getElementById('mainApp').classList.add('hidden');
    }
    
    // Function to show the login view
    function showLoginView() {
        document.getElementById('loadingSection').classList.add('hidden');
        document.getElementById('loginSection').classList.remove('hidden');
        document.getElementById('signUpSection').classList.add('hidden');
        document.getElementById('languageSection').classList.add('hidden');
        document.getElementById('mainApp').classList.add('hidden');
    }

    // Function to toggle between login and sign-up views
    function toggleAuthView() {
        document.getElementById('loginSection').classList.toggle('hidden');
        document.getElementById('signUpSection').classList.toggle('hidden');
    }

    function showLanguageSelectionView() {
        document.getElementById('loadingSection').classList.add('hidden');
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('signUpSection').classList.add('hidden');
        document.getElementById('languageSection').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
    }

    // Function to show the main app and hide other views
    function showAppView(user) {
        document.getElementById('loadingSection').classList.add('hidden');
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('signUpSection').classList.add('hidden');
        document.getElementById('languageSection').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');

        // Update UI with user info
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

    // Google Sign-In
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
    
    // Email/Password Sign-Up
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

    // Email/Password Sign-In
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
    
    // Logout function
    function logout() {
        window.auth.signOut().then(() => {
            showLoginView();
            showMessage('You have been logged out.', 'success');
        }).catch((error) => {
            showMessage(`Logout Error: ${error.message}`, 'error');
        });
    }
    
    // Check authentication state on page load
    function checkAuthState() {
        showLoadingView(); // Show loader immediately

        window.onAuthStateChanged(window.auth, (user) => {
            if (user) {
                // User is signed in. Check if they have set a language before.
                const hasSelectedLanguage = localStorage.getItem('hasSelectedLanguage');
                
                if (hasSelectedLanguage) {
                    // Returning user, show the main app.
                    showAppView(user);
                } else {
                    // First-time user, show the language selection screen.
                    showLanguageSelectionView();
                }

            } else {
                // User is signed out. Show the login page.
                showLoginView();
            }
        });
    }

    // --- END OF AUTHENTICATION LOGIC ---

    // --- LANGUAGE SELECTION FOR FIRST-TIME USERS ---
    function selectInitialLanguage(langCode) {
        setLanguage(langCode); // This already sets the language and saves it
        localStorage.setItem('hasSelectedLanguage', 'true');
        
        // Hide language section and show the main app
        document.getElementById('languageSection').classList.add('hidden');
        showAppView(window.auth.currentUser);
    }

    // Global variables
    let currentUserName = '';
    let currentUserPhoneNumber = '';
    let currentLang = 'te'; // Default language
    let currentSpeechTargetId = null; // For tracking speech recognition target

    // Global variables for holding calculated values before saving
    let currentHourlyEarnings = 0;
    let currentTripEarnings = 0;
    let currentCombinedEarnings = 0;
    let currentHourlyTime = '0 hrs';
    let mapScreenshot = null; // To hold the base64 screenshot data

      // --- Translation Data ---
    const translations = {
      // Dashboard Section
      welcome_heading: {
        te: "స్వాగతం, <span id='userNameEditable' contenteditable='true' onblur='saveUserName()'>{userName}</span> అన్న 🚜",
        en: "Welcome, <span id='userNameEditable' contenteditable='true' onblur='saveUserName()'>{userName}</span> Anna 🚜",
        hi: "नमस्ते, <span id='userNameEditable' contenteditable='true' onblur='saveUserName()'>{userName}</span> अन्ना 🚜",
        ar: "أهلاً بك، <span id='userNameEditable' contenteditable='true' onblur='saveUserName()'>{userName}</span> آنا 🚜",
        ml: "സ്വാഗതം, <span id='userNameEditable' contenteditable='true' onblur='saveUserName()'>{userName}</span> അണ്ണാ 🚜",
        kn: "ಸ್ವಾಗತ, <span id='userNameEditable' contenteditable='true' onblur='saveUserName()'>{userName}</span> ಅಣ್ಣಾ 🚜",
        ta: "வணக்கம், <span id='userNameEditable' contenteditable='true' onblur='saveUserName()'>{userName}</span> அண்ணா 🚜",
        bn: "স্বাগতম, <span id='userNameEditable' contenteditable='true' onblur='saveUserName()'>{userName}</span> আন্না 🚜",
        mr: "स्वागत आहे, <span id='userNameEditable' contenteditable='true' onblur='saveUserName()'>{userName}</span> अण्णा 🚜",
        gu: "આપનું સ્વાગત છે, <span id='userNameEditable' contenteditable='true' onblur='saveUserName()'>{userName}</span> અન્ના 🚜",
        zh: "欢迎, <span id='userNameEditable' contenteditable='true' onblur='saveUserName()'>{userName}</span> 安娜 🚜",
        ja: "ようこそ、<span id='userNameEditable' contenteditable='true' onblur='saveUserName()'>{userName}</span> アンナ 🚜",
        es: "Bienvenido, <span id='userNameEditable' contenteditable='true' onblur='saveUserName()'>{userName}</span> 🚜",
        fr: "Bienvenue, <span id='userNameEditable' contenteditable='true' onblur='saveUserName()'>{userName}</span> 🚜",
        de: "Willkommen, <span id='userNameEditable' contenteditable='true' onblur='saveUserName()'>{userName}</span> 🚜",
        ru: "Добро пожаловать, <span id='userNameEditable' contenteditable='true' onblur='saveUserName()'>{userName}</span> 🚜",
        pt: "Bem-vindo, <span id='userNameEditable' contenteditable='true' onblur='saveUserName()'>{userName}</span> 🚜",
        ko: "환영합니다, <span id='userNameEditable' contenteditable='true' onblur='saveUserName()'>{userName}</span>님 🚜"
      },
      tagline: {
        te: "మీ ట్రాక్టర్ పని, సమయం & ఆదాయాన్ని సులభంగా ట్రాక్ చేయండి.",
        en: "Track your tractor work, time & earnings with ease.",
        hi: "अपने ट्रैक्टर के काम, समय और कमाई को आसानी से ट्रैक करें।",
        ar: "تتبع عمل جرارك ووقته وأرباحه بسهولة.",
        ml: "നിങ്ങളുടെ ട്രാക്ടർ ജോലി, സമയം, വരുമാനം എന്നിവ എളുപ്പത്തിൽ ട്രാക്ക് ചെയ്യുക.",
        kn: "ನಿಮ್ಮ ಟ್ರ್ಯಾಕ್ಟರ್ ಕೆಲಸ, ಸಮಯ ಮತ್ತು ಗಳಿಕೆಯನ್ನು ಸುಲಭವಾಗಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",
        ta: "உங்கள் டிராக்டர் வேலை, நேரம் மற்றும் வருமானத்தை எளிதாகக் கண்காணிக்கவும்.",
        bn: "আপনার ট্র্যাক্টরের কাজ, সময় এবং আয় সহজেই ট্র্যাক করুন।",
        mr: "तुमच्या ट्रॅक्टरचे काम, वेळ आणि कमाई सहजपणे ट्रॅक करा.",
        gu: "તમારા ટ્રેક્ટરના કામ, સમય અને કમાણીને સરળતાથી ટ્રૅક કરો.",
        zh: "轻松跟踪您的拖拉机工作、时间和收入。",
        ja: "トラクターの作業、時間、収益を簡単に追跡します。",
        es: "Rastree el trabajo, el tiempo y las ganancias de su tractor con facilidad.",
        fr: "Suivez facilement le travail, le temps et les revenus de votre tracteur.",
        de: "Verfolgen Sie Ihre Traktorarbeit, Zeit und Einnahmen mit Leichtigkeit.",
        ru: "Легко отслеживайте работу, время и доходы вашего трактора.",
        pt: "Acompanhe o trabalho, o tempo e os ganhos do seu trator com facilidade.",
        ko: "트랙터 작업, 시간 및 수입을 쉽게 추적하세요."
      },
      name_label: {
        te: "పేరు నమోదు చేయండి",
        en: "Enter Name",
        hi: "नाम दर्ज करें",
        ar: "أدخل الاسم",
        ml: "പേര് നൽകുക",
        kn: "ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
        ta: "பெயரை உள்ளிடவும்",
        bn: "নাম লিখুন",
        mr: "नाव टाका",
        gu: "નામ દાખલ કરો",
        zh: "输入姓名",
        ja: "名前を入力",
         es: "Ingrese su nombre",
        fr: "Entrez le nom",
        de: "Name eingeben",
        ru: "Введите имя",
        pt: "Digite o nome",
        ko: "이름 입력"
      },
      name_placeholder: {
        te: "ఉదా: రాము",
        en: "e.g., John Doe",
        hi: "उदा: रामू",
        ar: "مثال: جون دو",
        ml: "ഉദാ: ജോൺ ഡോ",
        kn: "ಉದಾ: ಜಾನ್ ಡೋ",
        ta: "எ.கா., ஜான் டோ",
        bn: "उदा: জন ডো",
        mr: "उदा: जॉन डो",
        gu: "દા.ત., જ્હોન ડો",
        zh: "例如：约翰·多伊",
        ja: "例：ジョン・ドウ",
        es: "ej., Juan Pérez",
        fr: "ex., Jean Dupont",
        de: "z.B., Max Mustermann",
        ru: "напр., Иван Иванов",
        pt: "ex., João da Silva",
        ko: "예: 홍길동"
      },
       name_placeholder_dynamic: {
        te: ["రైతు పేరు", "కస్టమర్ పేరు"],
        en: ["Farmer Name", "Customer Name"],
        hi: ["किसान का नाम", "ग्राहक का नाम"],
        ar: ["اسم المزارع", "اسم العميل"],
        ml: ["കർഷകന്റെ പേര്", "ഉപഭോക്താവിന്റെ പേര്"],
        kn: ["ರೈತರ ಹೆಸರು", "ಗ್ರಾಹಕರ ಹೆಸರು"],
        ta: ["விவசாயி பெயர்", "வாடிக்கையாளர் பெயர்"],
        bn: ["কৃষকের নাম", "গ্রাহকের নাম"],
        mr: ["शेतकऱ्याचे नाव", "ग्राहकाचे नाव"],
        gu: ["ખેડૂતનું નામ", "ગ્રાહકનું નામ"],
        zh: ["农民姓名", "客户姓名"],
        ja: ["農家の名前", "顧客名"],
        es: ["Nombre del agricultor", "Nombre del cliente"],
        fr: ["Nom de l'agriculteur", "Nom du client"],
        de: ["Name des Landwirts", "Kundenname"],
        ru: ["Имя фермера", "Имя клиента"],
        pt: ["Nome do Agricultor", "Nome do Cliente"],
        ko: ["농부 이름", "고객 이름"]
      },
      phone_label: {
        te: "ఫోన్ నంబర్",
        en: "Phone Number",
        hi: "फ़ोन नंबर",
        ar: "رقم الهاتف",
        ml: "ഫോൺ നമ്പർ",
        kn: "ದೂರವಾಣಿ ಸಂಖ್ಯೆ",
        ta: "தொலைபேசி எண்",
        bn: "ফোন নম্বর",
        mr: "फोन नंबर",
        gu: "ફોન નંબર",
        zh: "电话号码",
        ja: "電話番号",
        es: "Número de teléfono",
        fr: "Numéro de téléphone",
        de: "Telefonnummer",
        ru: "Номер телефона",
        pt: "Número de telefone",
        ko: "전화번호"
      },
      phone_placeholder: {
        te: "ఉదా: 9876543210",
        en: "e.g., 9876543210",
        hi: "उदा: 9876543210",
        ar: "مثال: 9876543210",
        ml: "ഉദാ: 9876543210",
        kn: "ಉದಾ: 9876543210",
        ta: "எ.கா., 9876543210",
        bn: "उदा: 9876543210",
        mr: "उदा: 9876543210",
        gu: "દા.ત., 9876543210",
        zh: "例如：9876543210",
        ja: "例：9876543210",
        es: "ej., 9876543210",
        fr: "ex., 0612345678",
        de: "z.B., 01512345678",
        ru: "напр., 9123456789",
        pt: "ex., 912345678",
        ko: "예: 01012345678"
      },
      phone_placeholder_dynamic: {
        te: ["9xxxxxxxxx", "8xxxxxxxxx"],
        en: ["9xxxxxxxxx", "8xxxxxxxxx"],
        hi: ["9xxxxxxxxx", "8xxxxxxxxx"],
        ar: ["9xxxxxxxxx", "8xxxxxxxxx"],
        ml: ["9xxxxxxxxx", "8xxxxxxxxx"],
        kn: ["9xxxxxxxxx", "8xxxxxxxxx"],
        ta: ["9xxxxxxxxx", "8xxxxxxxxx"],
        bn: ["9xxxxxxxxx", "8xxxxxxxxx"],
        mr: ["9xxxxxxxxx", "8xxxxxxxxx"],
        gu: ["9xxxxxxxxx", "8xxxxxxxxx"],
        zh: ["9xxxxxxxxx", "8xxxxxxxxx"],
        ja: ["9xxxxxxxxx", "8xxxxxxxxx"],
        es: ["9xxxxxxxx", "6xxxxxxxx"],
        fr: ["06xxxxxxxx", "07xxxxxxxx"],
        de: ["015xxxxxxx", "017xxxxxxx"],
        ru: ["9xxxxxxxxx", "8xxxxxxxxx"],
        pt: ["9xxxxxxxx", "2xxxxxxxx"],
        ko: ["010xxxxxxxx", "011xxxxxxxx"]
      },
      phone_invalid: {
        te: "దయచేసి చెల్లుబాటు అయ్యే ఫోన్ నంబర్‌ను నమోదు చేయండి (కనీసం 10 అంకెలు).",
        en: "Please enter a valid phone number (at least 10 digits).",
        hi: "कृपया एक मान्य फ़ोन नंबर दर्ज करें (कम से कम 10 अंक)।",
        ar: "يرجى إدخال رقم هاتف صالح (10 أرقام على الأقل).",
        ml: "ദയവായി സാധുവായ ഒരു ഫോൺ നമ്പർ നൽകുക (കുറഞ്ഞത് 10 അക്കങ്ങൾ).",
        kn: "ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ (ಕನಿಷ್ಠ 10 ಅಂಕೆಗಳು).",
        ta: "சரியான தொலைபேசி எண்ணை உள்ளிடவும் (குறைந்தது 10 இலக்கங்கள்).",
        bn: "অনুগ্রহ করে একটি বৈধ ফোন নম্বর লিখুন (কমপক্ষে ১০টি সংখ্যা)।",
        mr: "कृपया वैध फोन नंबर टाका (किमान 10 अंक).",
        gu: "કૃપા કરીને માન્ય ફોન નંબર દાખલ કરો (ઓછામાં ઓછા 10 અંકો).",
        zh: "请输入有效的电话号码（至少10位）。",
        ja: "有効な電話番号（最低10桁）を入力してください。",
        es: "Por favor, ingrese un número de teléfono válido (al menos 10 dígitos).",
        fr: "Veuillez entrer un numéro de téléphone valide (au moins 10 chiffres).",
        de: "Bitte geben Sie eine gültige Telefonnummer ein (mindestens 10 Ziffern).",
        ru: "Пожалуйста, введите действительный номер телефона (не менее 10 цифр).",
        pt: "Por favor, insira um número de telefone válido (pelo menos 10 dígitos).",
        ko: "유효한 전화번호(최소 10자리)를 입력하세요."
      },
      date_label: {
        te: "తేదీ",
        en: "Date",
        hi: "तारीख",
        ar: "تاريخ",
        ml: "തീയതി",
        kn: "ದಿನಾಂಕ",
        ta: "தேதி",
        bn: "তারিখ",
        mr: "तारीख",
        gu: "તારીખ",
        zh: "日期",
        ja: "日付",
        es: "Fecha",
        fr: "Date",
        de: "Datum",
        ru: "Дата",
        pt: "Data",
        ko: "날짜"
      },
      start_time_label: {
        te: "ప్రారంభ సమయం",
        en: "Start Time",
        hi: "आरंभ समय",
        ar: "وقت البدء",
        ml: "തുടങ്ങുന്ന സമയം",
        kn: "ಪ್ರಾರಂಭ ಸಮಯ",
        ta: "தொடக்க நேரம்",
        bn: "শুরুর সময়",
        mr: "सुरुवातीची वेळ",
        gu: "શરૂ કરવાનો સમય",
        zh: "开始时间",
        ja: "開始時間",
        es: "Hora de inicio",
        fr: "Heure de début",
        de: "Startzeit",
        ru: "Время начала",
        pt: "Hora de início",
        ko: "시작 시간"
      },
      end_time_label: {
        te: "ముగింపు సమయం",
        en: "End Time",
        hi: "अंतिम समय",
        ar: "وقت النهاية",
        ml: "അവസാനിക്കുന്ന സമയം",
        kn: "ಮುಕ್ತಾಯ ಸಮಯ",
        ta: "முடிவு நேரம்",
        bn: "শেষ সময়",
        mr: "शेवटची वेळ",
        gu: "સમાપ્તિ સમય",
        zh: "结束时间",
        ja: "終了時間",
        es: "Hora de finalización",
        fr: "Heure de fin",
        de: "Endzeit",
        ru: "Время окончания",
        pt: "Hora de término",
        ko: "종료 시간"
      },
      rate_per_hour_label: {
        te: "గంటకు రేటు (₹)",
        en: "Rate per Hour (₹)",
        hi: "प्रति घंटा दर (₹)",
        ar: "المعدل لكل ساعة (₹)",
        ml: "മണിക്കൂറിന് നിരക്ക് (₹)",
        kn: "ಪ್ರತಿ ಗಂಟೆಗೆ ದರ (₹)",
        ta: "மணிக்கு விகிதம் (₹)",
        bn: "প্রতি ঘন্টা হার (₹)",
        mr: "प्रति तास दर (₹)",
        gu: "કલાક દીઠ દર (₹)",
        zh: "每小时费率 (₹)",
        ja: "時給 (₹)",
        es: "Tarifa por hora (€)",
        fr: "Taux par heure (€)",
        de: "Stundensatz (€)",
        ru: "Ставка в час (₽)",
        pt: "Taxa por hora (R$)",
        ko: "시간당 요금 (₩)"
        
      },
      rate_per_hour_placeholder: {
        te: "ఉదా: 2000", en: "e.g., 2000", hi: "उदा: 2000", ar: "مثال: 2000", ml: "ഉദാ: 2000", kn: "ಉದಾ: 2000", ta: "எ.கா., 2000", bn: "उदा: 2000", mr: "उदा: 2000", gu: "દા.ત., 2000", zh: "例如：2000", ja: "例：2000",es: "ej., 50", fr: "ex., 50", de: "z.B., 50", ru: "напр., 1000", pt: "ex., 50", ko: "예: 10000"
      },
      calculate_button_title: {
        te: "లెక్కించు",
        en: "Calculate",
        hi: "गणना करें",
        ar: "احسب",
        ml: "കണക്കാക്കുക",
        kn: "ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ",
        ta: "கணக்கிடு",
        bn: "হিসাব করুন",
        mr: "गणना करा",
        gu: "ગણતરી કરો",
        zh: "计算",
        ja: "計算する",
        es: "Calcular",
        fr: "Calculer",
        de: "Berechnen",
        ru: "Рассчитать",
        pt: "Calcular",
        ko: "계산"
      },
      save_button_title: {
        te: "సేవ్ చేయి",
        en: "Save",
        hi: "सहेजें",
        ar: "حفظ",
        ml: "സേവ് ചെയ്യുക",
        kn: "ಉಳಿಸಿ",
        ta: "சேமி",
        bn: "সংরক্ষণ করুন",
        mr: "जतन करा",
        gu: "સાચવો",
        zh: "保存",
        ja: "保存",
        es: "Guardar",
        fr: "Enregistrer",
        de: "Speichern",
        ru: "Сохранить",
        pt: "Salvar",
        ko: "저장"
      },
      logout_button_title: {
        te: "లాగ్ అవుట్",
        en: "Logout",
        hi: "लॉग आउट",
        ar: "تسجيل الخروج",
        ml: "ലോഗ് ഔട്ട്",
        kn: "ಲಾಗ್ ಔಟ್",
        ta: "வெளியேறு",
        bn: "লগ আউট",
        mr: "लॉग आउट",
        gu: "લૉગ આઉટ",
        zh: "登出",
        ja: "ログアウト",
        es: "Cerrar sesión",
        fr: "Déconnexion",
        de: "Abmelden",
        ru: "Выйти",
        pt: "Sair",
        ko: "로그아웃"
      },
      hourly_time_label: {
        te: "గంటల సమయం",
        en: "Hourly Time",
        hi: "घंटे का समय",
        ar: "الوقت بالساعة",
        ml: "മണിക്കൂർ സമയം",
        kn: "ಗಂಟೆಯ ಸಮಯ",
        ta: "மணிநேர நேரம்",
        bn: "ঘন্টার সময়",
        mr: "तासाभराचा वेळ",
        gu: "કલાકનો સમય",
        zh: "每小时时间",
        ja: "時間",
        es: "Tiempo por hora",
        fr: "Temps horaire",
        de: "Stundenzeit",
        ru: "Почасовое время",
        pt: "Tempo por hora",
        ko: "시간"
      },
      hourly_earnings_label: {
        te: "గంటల ఆదాయం",
        en: "Hourly Earnings",
        hi: "घंटे की कमाई",
        ar: "الأرباح بالساعة",
        ml: "മണിക്കൂർ വരുമാനം",
        kn: "ಗಂಟೆಯ ಗಳಿಕೆ",
        ta: "மணிநேர வருவாய்",
        bn: "ঘন্টার আয়",
        mr: "तासाभराची कमाई",
        gu: "કલાકની કમાણી",
        zh: "每小时收入",
        ja: "時給",
        es: "Ganancias por hora",
        fr: "Gains horaires",
        de: "Stundenverdienst",
        ru: "Почасовой заработок",
        pt: "Ganhos por hora",
        ko: "시간당 수입"
      },
      total_trips_label: {
        te: "ట్రిప్పుల సంఖ్య",
        en: "Number of Trips",
        hi: "ट्रिप की संख्या",
        ar: "عدد الرحلات",
        ml: "ട്രിപ്പുകളുടെ എണ്ണം",
        kn: "ಪ್ರಯಾಣಗಳ ಸಂಖ್ಯೆ",
        ta: "பயணங்களின் எண்ணிக்கை",
        bn: "ট্রিপের সংখ্যা",
        mr: "ट्रिपची संख्या",
        gu: "ટ્રિપ્સની સંખ્યા",
        zh: "行程次数",
        ja: "旅行回数",
        es: "Número de viajes",
        fr: "Nombre de voyages",
        de: "Anzahl der Fahrten",
        ru: "Количество поездок",
        pt: "Número de viagens",
        ko: "여행 횟수"
      },
       trips_placeholder: {
        te: "ఉదా: 5", en: "e.g., 5", hi: "उदा: 5", ar: "مثال: 5", ml: "ഉദാ: 5", kn: "ಉದಾ: 5", ta: "எ.கா., 5", bn: "उदा: 5", mr: "उदा: 5", gu: "દા.ત., 5", zh: "例如：5", ja: "例：5",es: "ej., 5", fr: "ex., 5", de: "z.B., 5", ru: "напр., 5", pt: "ex., 5", ko: "예: 5"
      },
      cost_per_trip_label: {
        te: "ఒక ట్రిప్‌కు ధర (₹)",
        en: "Cost per Trip (₹)",
        hi: "प्रति ट्रिप लागत (₹)",
        ar: "التكلفة لكل رحلة (₹)",
        ml: "ഒരു ട്രിപ്പിന് ചെലവ് (₹)",
        kn: "ಪ್ರತಿ ಪ್ರಯಾಣಕ್ಕೆ ವೆಚ್ಚ (₹)",
        ta: "ஒரு பயணத்திற்கான செலவு (₹)",
        bn: "ট্রিপ প্রতি খরচ (₹)",
        mr: "प्रति ट्रिप खर्च (₹)",
        gu: "ટ્રીપ દીઠ ખર્ચ (₹)",
        zh: "每次行程费用 (₹)",
        ja: "旅行あたりの費用 (₹)",
        es: "Costo por viaje (€)",
        fr: "Coût par voyage (€)",
        de: "Kosten pro Fahrt (€)",
        ru: "Стоимость поездки (₽)",
        pt: "Custo por viagem (R$)",
        ko: "여행당 비용 (₩)"
      },
      cost_per_trip_placeholder: {
        te: "ఉదా: 500", en: "e.g., 500", hi: "उदा: 500", ar: "مثال: 500", ml: "ഉദാ: 500", kn: "ಉದಾ: 500", ta: "எ.கா., 500", bn: "उदा: 500", mr: "उदा: 500", gu: "દા.ત., 500", zh: "例如：500", ja: "例：500", es: "ej., 10", fr: "ex., 10", de: "z.B., 10", ru: "напр., 500", pt: "ex., 10", ko: "예: 5000"
      },
      trip_count_display_label: {
        te: "మొత్తం ట్రిప్పులు",
        en: "Total Trips",
        hi: "कुल ट्रिप",
        ar: "إجمالي الرحلات",
        ml: "ആകെ ട്രിപ്പുകൾ",
        kn: "ಒಟ್ಟು ಪ್ರಯಾಣಗಳು",
        ta: "மொத்த பயணங்கள்",
        bn: "মোট ট্রিপ",
        mr: "एकूण ट्रिप",
        gu: "કુલ ટ્રિપ્સ",
        zh: "总行程",
        ja: "総旅行回数",
        es: "Viajes totales",
        fr: "Voyages totaux",
        de: "Gesamtfahrten",
        ru: "Всего поездок",
        pt: "Total de viagens",
        ko: "총 여행"
      },
      trip_earnings_label: {
        te: "ట్రిప్ ఆదాయం",
        en: "Trip Earnings",
        hi: "ट्रिप की कमाई",
        ar: "أرباح الرحلة",
        ml: "ട്രിപ്പ് വരുമാനം",
        kn: "ಪ್ರಯಾಣದ ಗಳಿಕೆ",
        ta: "பயண வருவாய்",
        bn: "ট্রিপের আয়",
        mr: "ट्रिपची कमाई",
        gu: "ટ્રિપની કમાણી",
        zh: "行程收入",
        ja: "旅行収益",
        es: "Ganancias del viaje",
        fr: "Gains du voyage",
        de: "Fahrteinnahmen",
        ru: "Доход от поездки",
        pt: "Ganhos da viagem",
        ko: "여행 수입"
      },
      combined_earnings_label: {
        te: "మొత్తం",
        en: "Total Amount",
        hi: "कुल राशि",
        ar: "المبلغ الإجمالي",
        ml: "ആകെ തുക",
        kn: "ಒಟ್ಟು ಮೊತ್ತ",
        ta: "மொத்த தொகை",
        bn: "মোট পরিমাণ",
        mr: "एकूण रक्कम",
        gu: "કુલ રકમ",
        zh: "总金额",
        ja: "合計金額",
        es: "Monto total",
        fr: "Montant total",
        de: "Gesamtbetrag",
        ru: "Итоговая сумма",
        pt: "Valor total",
        ko: "총액"
      },
       view_logs_button_title: {
        te: "సేవ్ చేసిన వివరాలు",
        en: "View Saved Logs",
        hi: "सहेजे गए लॉग देखें",
        ar: "عرض السجلات المحفوظة",
        ml: "സേവ് ചെയ്ത ലോഗുകൾ കാണുക",
        kn: "ಉಳಿಸಿದ ಲಾಗ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
        ta: "சேமிக்கப்பட்ட பதிவுகளைக் காண்க",
        bn: "সংরক্ষিত লগ দেখুন",
        mr: "जतन केलेले लॉग पहा",
        gu: "સાચવેલા લોગ્સ જુઓ",
        zh: "查看已保存的日志",
        ja: "保存されたログを表示",
        es: "Ver registros guardados",
        fr: "Afficher les journaux enregistrés",
        de: "Gespeicherte Protokolle anzeigen",
        ru: "Просмотреть сохраненные журналы",
        pt: "Ver registros salvos",
        ko: "저장된 로그 보기"
      },
      // Logs Section
      logs_heading: {
        te: "ట్రాక్టర్ పని వివరాలు సేవ్ చేయబడ్డాయి",
        en: "Saved Tractor Work Logs",
        hi: "सहेजे गए ट्रैक्टर कार्य लॉग",
        ar: "سجلات عمل الجرار المحفوظة",
        ml: "സേവ് ചെയ്ത ട്രാക്ടർ വർക്ക് ലോഗുകൾ",
        kn: "ಉಳಿಸಿದ ಟ್ರ್ಯಾಕ್ಟರ್ ಕೆಲಸದ ಲಾಗ್‌ಗಳು",
        ta: "சேமிக்கப்பட்ட டிராக்டர் வேலை பதிவுகள்",
        bn: "সংরক্ষিত ট্র্যাক্টর কাজের লগ",
        mr: "जतन केलेले ट्रॅक्टर कामाचे लॉग",
        gu: "સાચવેલા ટ્રેક્ટર વર્ક લોગ્સ",
        zh: "已保存的拖拉机工作日志",
        ja: "保存されたトラクター作業ログ",
        es: "Registros de trabajo de tractor guardados",
        fr: "Journaux de travail de tracteur enregistrés",
        de: "Gespeicherte Traktor-Arbeitsprotokolle",
        ru: "Сохраненные журналы работ трактора",
        pt: "Registros de trabalho de trator salvos",
        ko: "저장된 트랙터 작업 로그"
      },
      logs_tagline: {
        te: "ఇక్కడ మీ సేవ్ చేసిన పని యొక్క రికార్డు ఉంది.",
        en: "Here is the record of your saved work.",
        hi: "यहाँ आपके सहेजे गए काम का रिकॉर्ड है।",
        ar: "هذا هو سجل عملك المحفوظ.",
        ml: "നിങ്ങൾ സേവ് ചെയ്ത ജോലിയുടെ രേഖ ഇവിടെയുണ്ട്.",
        kn: "ನಿಮ್ಮ ಉಳಿಸಿದ ಕೆಲಸದ ದಾಖಲೆ ಇಲ್ಲಿದೆ.",
        ta: "உங்கள் சேமிக்கப்பட்ட வேலையின் பதிவு இங்கே உள்ளது.",
        bn: "আপনার সংরক্ষিত কাজের রেকর্ড এখানে।",
        mr: "तुमच्या जतन केलेल्या कामाची नोंद येथे आहे.",
        gu: "તમારા સાચવેલા કામનો રેકોર્ડ અહીં છે.",
        zh: "这是您已保存工作的记录。",
        ja: "保存された作業の記録です。",
        es: "Aquí está el registro de su trabajo guardado.",
        fr: "Voici l'enregistrement de votre travail sauvegardé.",
        de: "Hier ist die Aufzeichnung Ihrer gespeicherten Arbeit.",
        ru: "Вот запись вашей сохраненной работы.",
        pt: "Aqui está o registro do seu trabalho salvo.",
        ko: "저장된 작업 기록입니다."
      },
      no_logs_saved: {
        te: "ఇంకా లాగ్‌లు సేవ్ చేయబడలేదు.",
        en: "No logs saved yet.",
        hi: "अभी तक कोई लॉग सहेजा नहीं गया है।",
        ar: "لم يتم حفظ أي سجلات حتى الآن.",
        ml: "ലോഗുകളൊന്നും ഇതുവരെ സേവ് ചെയ്തിട്ടില്ല.",
        kn: "ಯಾವುದೇ ಲಾಗ್‌ಗಳನ್ನು ಇನ್ನೂ ಉಳಿಸಲಾಗಿಲ್ಲ.",
        ta: "இன்னும் பதிவுகள் எதுவும் சேமிக்கப்படவில்லை.",
        bn: "এখনও কোন লগ সংরক্ষণ করা হয়নি।",
        mr: "अद्याप कोणतेही लॉग जतन केलेले नाहीत.",
        gu: "હજી સુધી કોઈ લોગ સાચવવામાં આવ્યા નથી.",
        zh: "尚无已保存的日志。",
        ja: "ログはまだ保存されていません。",
        es: "Aún no hay registros guardados.",
        fr: "Aucun journal enregistré pour le moment.",
        de: "Noch keine Protokolle gespeichert.",
        ru: "Журналы еще не сохранены.",
        pt: "Nenhum registro salvo ainda.",
        ko: "아직 저장된 로그가 없습니다."
      },
      work_time: {
        te: "పని సమయం",
        en: "Work Time",
        hi: "कार्य समय",
        ar: "وقت العمل",
        ml: "ജോലി സമയം",
        kn: "ಕೆಲಸದ ಸಮಯ",
        ta: "வேலை நேரம்",
        bn: "কাজের সময়",
        mr: "कामाची वेळ",
        gu: "કામનો સમય",
        zh: "工作时间",
        ja: "作業時間",
        es: "Tiempo de trabajo",
        fr: "Temps de travail",
        de: "Arbeitszeit",
        ru: "Рабочее время",
        pt: "Tempo de trabalho",
        ko: "작업 시간"
      },
      rate: {
        te: "రేటు",
        en: "Rate",
        hi: "दर",
        ar: "معدل",
        ml: "നിരക്ക്",
        kn: "ದರ",
        ta: "விகிதம்",
        bn: "হার",
        mr: "दर",
        gu: "દર",
        zh: "费率",
        ja: "料金",
        es: "Tarifa",
        fr: "Taux",
        de: "Satz",
        ru: "Ставка",
        pt: "Taxa",
        ko: "요금"
      },
      duration: {
        te: "వ్యవధి",
        en: "Duration",
        hi: "अवधि",
        ar: "مدة",
        ml: "ദൈർഘ്യം",
        kn: "ಅವಧಿ",
        ta: "காலம்",
        bn: "স্থিতিকাল",
        mr: "कालावधी",
        gu: "અવધિ",
        zh: "期间",
        ja: "期間",
        es: "Duración",
        fr: "Durée",
        de: "Dauer",
        ru: "Продолжительность",
        pt: "Duração",
        ko: "기간"
      },
      trips_count_log: { 
        te: "ట్రిప్పులు",
        en: "Trips",
        hi: "ट्रिप",
        ar: "رحلات",
        ml: "ട്രിപ്പുകൾ",
        kn: "ಪ್ರಯಾಣಗಳು",
        ta: "பயணங்கள்",
        bn: "ট্রিপ",
        mr: "ट्रिप",
        gu: "ટ્રિપ્સ",
        zh: "行程",
        ja: "旅行",
        es: "Viajes",
        fr: "Voyages",
        de: "Fahrten",
        ru: "Поездки",
        pt: "Viagens",
        ko: "여행"
      },
      cost_per_trip_log: { 
        te: "ఒక ట్రిప్‌కు ధర",
        en: "Cost per Trip",
        hi: "प्रति ट्रिप लागत",
        ar: "التكلفة لكل رحلة",
        ml: "ഒരു ട്രിപ്പിന് ചെലവ്",
        kn: "ಪ್ರತಿ ಪ್ರಯಾಣಕ್ಕೆ ವೆಚ್ಚ",
        ta: "ஒரு பயணத்திற்கான செலவு",
        bn: "ট্রিপ প্রতি খরচ",
        mr: "प्रति ट्रिप खर्च",
        gu: "ટ્રીપ દીઠ ખર્ચ",
        zh: "每次行程费用",
        ja: "旅行あたりの費用",
        es: "Costo por viaje",
        fr: "Coût par voyage",
        de: "Kosten pro Fahrt",
        ru: "Стоимость поездки",
        pt: "Custo por viagem",
        ko: "여행당 비용"
      },
      total_trips_display_log: { 
        te: "మొత్తం ట్రిప్పులు",
        en: "Total Trips",
        hi: "कुल ट्रिप",
        ar: "إجمالي الرحلات",
        ml: "ആകെ ട്രിപ്പുകൾ",
        kn: "ಒಟ್ಟು ಪ್ರಯಾಣಗಳು",
        ta: "மொத்த பயணங்கள்",
        bn: "মোট ট্রিপ",
        mr: "एकूण ट्रिप",
        gu: "કુલ ટ્રિપ્સ",
        zh: "总行程",
        ja: "総旅行回数",
        es: "Viajes totales",
        fr: "Voyages totaux",
        de: "Gesamtfahrten",
        ru: "Всего поездок",
        pt: "Total de viagens",
        ko: "총 여행"
      },
      earnings: {
        te: "ఆదాయం",
        en: "Earnings",
        hi: "कमाई",
        ar: "أرباح",
        ml: "വരുമാനം",
        kn: "ಗಳಿಕೆ",
        ta: "வருவாய்",
        bn: "আয়",
        mr: "कमाई",
        gu: "કમાણી",
        zh: "收入",
        ja: "収益",
         es: "Ganancias",
        fr: "Gains",
        de: "Einnahmen",
        ru: "Заработок",
        pt: "Ganhos",
        ko: "수입"
      },
      saved_on: {
        te: "సేవ్ చేయబడింది",
        en: "Saved on",
        hi: "सहेजा गया",
        ar: "تم الحفظ في",
        ml: "സേവ് ചെയ്തത്",
        kn: "ಉಳಿಸಲಾಗಿದೆ",
        ta: "சேமிக்கப்பட்டது",
        bn: "সংরক্ষিত",
        mr: "जतन केले",
        gu: "સાચવેલ",
        zh: "保存在",
        ja: "保存日",
        es: "Guardado el",
        fr: "Enregistré le",
        de: "Gespeichert am",
        ru: "Сохранено",
        pt: "Salvo em",
        ko: "저장 날짜"
      },
      name: {
        te: "పేరు",
        en: "Name",
        hi: "नाम",
        ar: "اسم",
        ml: "പേര്",
        kn: "ಹೆಸರು",
        ta: "பெயர்",
        bn: "নাম",
        mr: "नाव",
        gu: "નામ",
        zh: "姓名",
        ja: "名前",
        es: "Nombre",
        fr: "Nom",
        de: "Name",
        ru: "Имя",
        pt: "Nome",
        ko: "이름"
      },
      phone: {
        te: "ఫోన్",
        en: "Phone",
        hi: "फ़ोन",
        ar: "هاتف",
        ml: "ഫോൺ",
        kn: "ದೂರವಾಣಿ",
        ta: "தொலைபேசி",
        bn: "ফোন",
        mr: "फोन",
        gu: "ફોન",
        zh: "电话",
        ja: "電話",
        es: "Teléfono",
        fr: "Téléphone",
        de: "Telefon",
        ru: "Телефон",
        pt: "Telefone",
        ko: "전화"
      },
      note_content_label: {
        te: "నోట్ కంటెంట్",
        en: "Note Content",
        hi: "नोट सामग्री",
        ar: "محتوى الملاحظة",
        ml: "കുറിപ്പ് ഉള്ളടക്കം",
        kn: "ಟಿಪ್ಪಣಿ ವಿಷಯ",
        ta: "குறிப்பு உள்ளடக்கம்",
        bn: "নোটের বিষয়বস্তু",
        mr: "टीप सामग्री",
        gu: "નોંધ સામગ્રી",
        zh: "笔记内容",
        ja: "メモ内容",
        es: "Contenido de la nota",
        fr: "Contenu de la note",
        de: "Notizinhalt",
        ru: "Содержание заметки",
        pt: "Conteúdo da nota",
        ko: "메모 내용"
      },
      note_content_placeholder: {
        te: "దయచేసి పని సమాచార వివరాలను నమోదు చేయండి",
        en: "Please enter the work info details",
        hi: "कृपया कार्य जानकारी विवरण दर्ज करें",
        ar: "يرجى إدخال تفاصيل معلومات العمل",
        ml: "ദയവായി പ്രവൃത്തി വിവരങ്ങൾ നൽകുക",
        kn: "ದಯವಿಟ್ಟು ಕೆಲಸದ ಮಾಹಿತಿಯ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ",
        ta: "வேலை தகவல் விவரங்களை உள்ளிடவும்",
        bn: "অনুগ্রহ করে কাজের তথ্যের বিবরণ লিখুন",
        mr: "कृपया कामाची माहिती तपशील प्रविष्ट करा",
        gu: "કૃપા કરીને કામની માહિતીની વિગતો દાખલ કરો",
        zh: "请输入工作信息详情",
        ja: "作業情報の詳細を入力してください",
        es: "Por favor, ingrese los detalles de la información del trabajo",
        fr: "Veuillez saisir les détails des informations sur le travail",
        de: "Bitte geben Sie die Details zu den Arbeitsinformationen ein",
        ru: "Пожалуйста, введите подробную информацию о работе",
        pt: "Por favor, insira os detalhes das informações de trabalho",
        ko: "작업 정보 세부 정보를 입력하세요"
      },
      // Leaderboard Section
      leaderboard_button_title: { te: "లీడర్‌బోర్డ్", en: "Leaderboard", hi: "लीडरबोर्ड", ar: "لوحة المتصدرين", ml: "ലീഡർബോർഡ്", kn: "ಲೀಡರ್‌ಬೋರ್ಡ್", ta: "முன்னிலை", bn: "লিডারবোর্ড", mr: "लीडरबोर्ड", gu: "લીડરબોર્ડ", zh: "排行榜", ja: "リーダーボード",es: "Clasificación", fr: "Classement", de: "Bestenliste", ru: "Таблица лидеров", pt: "Quadro de líderes",   ko: "리더보드" },
      leaderboard_heading: { te: "లీడర్‌బోర్డ్", en: "Leaderboard", hi: "लीडरबोर्ड", ar: "لوحة المتصدرين", ml: "ലീഡർബോർഡ്", kn: "ಲೀಡರ್‌ಬೋರ್ಡ್", ta: "முன்னிலை", bn: "লিডারবোর্ড", mr: "लीडरबोर्ड", gu: "લીડરબોર્ડ", zh: "排行榜", ja: "リーダーボード",es: "Clasificación", fr: "Classement", de: "Bestenliste", ru: "Таблица лидеров", pt: "Quadro de líderes", ko: "리더보드" },
      leaderboard_tagline: { te: "ఎక్కువగా సేవ్ చేయబడిన కస్టమర్‌లు", en: "Most Frequently Saved Customers", hi: "सबसे अधिक बार सहेजे गए ग्राहक", ar: "العملاء الأكثر حفظًا", ml: "ഏറ്റവും കൂടുതൽ സേവ് ചെയ്ത ഉപഭോക്താക്കൾ", kn: "ಹೆಚ್ಚು ಬಾರಿ ಉಳಿಸಲಾದ ಗ್ರಾಹಕರು", ta: "அடிக்கடி சேமிக்கப்பட்ட வாடிக்கையாளர்கள்", bn: "সর্বাধিক ঘন ঘন সংরক্ষিত গ্রাহক", mr: "सर्वात जास्त वेळा जतन केलेले ग्राहक", gu: "સૌથી વધુ વારંવાર સાચવેલા ગ્રાહકો", zh: "最常保存的客户", ja: "最も頻繁に保存される顧客",es: "Clientes guardados con más frecuencia", fr: "Clients les plus fréquemment enregistrés", de: "Am häufigsten gespeicherte Kunden", ru: "Наиболее часто сохраняемые клиенты", pt: "Clientes salvos com mais frequência",  ko: "가장 자주 저장된 고객" },
      no_leaderboard_data: { te: "లీడర్‌బోర్డ్ కోసం డేటా లేదు.", en: "No data for the leaderboard yet.", hi: "लीडरबोर्ड के लिए अभी कोई डेटा नहीं है।", ar: "لا توجد بيانات للوحة المتصدرين حتى الآن.", ml: "ലീഡർബോർഡിനായി ഇതുവരെ ഡാറ്റയില്ല.", kn: "ಲೀಡರ್‌ಬೋರ್ಡ್‌ಗಾಗಿ ಇನ್ನೂ ಯಾವುದೇ ಡೇಟಾ ಇಲ್ಲ.", ta: "முன்னிலைக்கான தரவு இன்னும் இல்லை.", bn: "লিডারবোর্ডের জন্য এখনও কোন ডেটা নেই।", mr: "लीडरबोर्डसाठी अद्याप कोणताही डेटा नाही.", gu: "લીડરબોર્ડ માટે હજી કોઈ ડેટા નથી.", zh: "排行榜尚无数据。", ja: "リーダーボードのデータはまだありません。",es: "Aún no hay datos para la clasificación.", fr: "Pas encore de données pour le classement.", de: "Noch keine Daten für die Bestenliste.", ru: "Данных для таблицы лидеров пока нет.", pt: "Ainda não há dados para o quadro de líderes.",  ko: "리더보드 데이터가 아직 없습니다."  },
      saves: { te: "సేవ్‌లు", en: "Saves", hi: "सहेजें", ar: "يحفظ", ml: "സേവുകൾ", kn: "ಉಳಿಸುತ್ತದೆ", ta: "சேமிப்புகள்", bn: "সংরক্ষণ", mr: "जतन करते", gu: "સાચવે છે", zh: "保存", ja: "保存",es: "Guardados", fr: "Enreg.", de: "Sp.", ru: "Сохр.", pt: "Salvos", ko: "저장"    },
      customer_logs_heading: { te: "{name} యొక్క లాగ్‌లు", en: "Logs for {name}", hi: "{name} के लिए लॉग", ar: "سجلات {name}", ml: "{name}-നുള്ള ലോഗുകൾ", kn: "{name} ಗಾಗಿ ಲಾಗ್‌ಗಳು", ta: "{name} க்கான பதிவுகள்", bn: "{name} এর জন্য লগ", mr: "{name} साठी लॉग", gu: "{name} માટે લોગ્સ", zh: "{name} 的日志", ja: "{name} のログ",es: "Registros para {name}", fr: "Journaux pour {name}", de: "Protokolle für {name}", ru: "Журналы для {name}", pt: "Registros para {name}",ko: "{name}의 로그"   },
      // Monthly Dashboard Translations
      monthly_dashboard_button_title: { te: "నెలవారీ డేటా", en: "Monthly Data", hi: "मासिक डेटा", ar: "البيانات الشهرية", ml: "പ്രതിമാസ ഡാറ്റ", kn: "ಮಾಸಿಕ ಡೇಟಾ", ta: "மாதாந்திர தரவு", bn: "মাসিক ডেটা", mr: "मासिक डेटा", gu: "માસિક ડેટા", zh: "每月数据", ja: "月次データ",es: "Datos mensuales", fr: "Données mensuelles", de: "Monatsdaten", ru: "Месячные данные", pt: "Dados mensais",ko: "월간 데이터"  },
      monthly_dashboard_heading: { te: "నెలవారీ సారాంశం", en: "Monthly Summary", hi: "मासिक सारांश", ar: "ملخص شهري", ml: "പ്രതിമാസ സംഗ്രഹം", kn: "ಮಾಸಿಕ ಸಾರಾಂಶ", ta: "மாதாந்திர சுருக்கம்", bn: "মাসিক সারসংক্ষেপ", mr: "मासिक सारांश", gu: "માસિક સારાંશ", zh: "月度总结", ja: "月次サマリー",es: "Resumen mensual", fr: "Résumé mensuel", de: "Monatsübersicht", ru: "Месячный отчет", pt: "Resumo mensal",ko: "월간 요약" },
      monthly_dashboard_tagline: { te: "మీ నెలవారీ పనితీరును ట్రాక్ చేయండి", en: "Track your monthly performance", hi: "अपने मासिक प्रदर्शन को ट्रैक करें", ar: "تتبع أدائك الشهري", ml: "നിങ്ങളുടെ പ്രതിമാസ പ്രകടനം ട്രാക്ക് ചെയ്യുക", kn: "ನಿಮ್ಮ ಮಾಸಿಕ ಕಾರ್ಯಕ್ಷಮತೆಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ", ta: "உங்கள் மாதாந்திர செயல்திறனைக் கண்காணிக்கவும்", bn: "আপনার মাসিক কর্মক্ষমতা ট্র্যাক করুন", mr: "तुमची मासिक कामगिरी ट्रॅक करा", gu: "તમારા માસિક પ્રદર્શનને ટ્રૅક કરો", zh: "跟踪您的每月表现", ja: "毎月のパフォーマンスを追跡する", es: "Siga su rendimiento mensual", fr: "Suivez vos performances mensuelles", de: "Verfolgen Sie Ihre monatliche Leistung", ru: "Отслеживайте свою ежемесячную производительность", pt: "Acompanhe seu desempenho mensal",ko: "월간 실적 추적"  },
      month_selector_label: { te: "నెల ఎంచుకోండి:", en: "Select Month:", hi: "महीना चुनें:", ar: "اختر الشهر:", ml: "മാസം തിരഞ്ഞെടുക്കുക:", kn: "ತಿಂಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ:", ta: "மாதத்தைத் தேர்ந்தெடுக்கவும்:", bn: "মাস নির্বাচন করুন:", mr: "महिना निवडा:", gu: "મહિનો પસંદ કરો:", zh: "选择月份：", ja: "月を選択：", es: "Seleccione el mes:", fr: "Sélectionnez le mois :", de: "Monat auswählen:", ru: "Выберите месяц:", pt: "Selecione o mês:", ko: "월 선택:" },
      total_amount_label: { te: "మొత్తం ఆదాయం", en: "Total Earnings", hi: "कुल कमाई", ar: "إجمالي الأرباح", ml: "ആകെ വരുമാനം", kn: "ಒಟ್ಟು ಗಳಿಕೆ", ta: "மொத்த வருவாய்", bn: "মোট আয়", mr: "एकूण कमाई", gu: "કુલ કમાણી", zh: "总收入", ja: "総収益", es: "Ganancias totales", fr: "Gains totaux", de: "Gesamteinnahmen", ru: "Общий заработок", pt: "Ganhos totais", ko: "총 수입"  },
      total_hours_label: { te: "మొత్తం గంటలు", en: "Total Hours", hi: "कुल घंटे", ar: "إجمالي الساعات", ml: "ആകെ മണിക്കൂർ", kn: "ಒಟ್ಟು ಗಂಟೆಗಳು", ta: "மொத்த மணிநேரம்", bn: "মোট ঘন্টা", mr: "एकूण तास", gu: "કુલ કલાકો", zh: "总小时数", ja: "総時間",es: "Horas totales", fr: "Heures totales", de: "Gesamtstunden", ru: "Всего часов", pt: "Total de horas",  ko: "총 시간"   },
      total_trips_label: { te: "మొత్తం ట్రిప్పులు", en: "Total Trips", hi: "कुल ट्रिप", ar: "إجمالي الرحلات", ml: "ആകെ ട്രിപ്പുകൾ", kn: "ಒಟ್ಟು ಪ್ರಯಾಣಗಳು", ta: "மொத்த பயணங்கள்", bn: "মোট ট্রিপ", mr: "एकूण ट्रिप", gu: "કુલ ટ્રિપ્સ", zh: "总行程", ja: "総旅行回数",es: "Viajes totales", fr: "Voyages totaux", de: "Gesamtfahrten", ru: "Всего поездок", pt: "Total de viagens", ko: "총 여행" },
      // GPS Tracker
      gps_tracker_button_title: { te: "GPS ట్రాకర్", en: "GPS Tracker", hi: "जीपीएस ट्रैकर", ar: "جهاز تعقب GPS", ml: "ജിപിഎസ് ട്രാക്കർ", kn: "ಜಿಪಿಎಸ್ ಟ್ರ್ಯಾಕರ್", ta: "ஜிபிஎஸ் டிராக்கர்", bn: "জিপিএস ট্র্যাকার", mr: "जीपीएस ट्रॅकर", gu: "જીપીએસ ટ્રેકર", zh: "GPS追踪器", ja: "GPSトラッカー",es: "Rastreador GPS", fr: "Traceur GPS", de: "GPS-Tracker", ru: "GPS-трекер", pt: "Rastreador GPS", ko: "GPS 추적기"  },
      gps_tracker_heading: { te: "లైవ్ ట్రాక్టర్ ట్రాకింగ్", en: "Live Tractor Tracking", hi: "लाइव ट्रैक्टर ट्रैकिंग", ar: "تتبع الجرار المباشر", ml: "ലൈവ് ട്രാക്ടർ ട്രാക്കിംഗ്", kn: "ಲೈವ್ ಟ್ರ್ಯಾಕ್ಟರ್ ಟ್ರ್ಯಾಕಿಂಗ್", ta: "நேரடி டிராக்டர் கண்காணிப்பு", bn: "লাইভ ট্র্যাক্টর ট্র্যাকিং", mr: "थेट ट्रॅक्टर ट्रॅकिंग", gu: "લાઇવ ટ્રેક્ટર ટ્રેકિંગ", zh: "实时拖拉机跟踪", ja: "ライブトラクタートラッキング",es: "Seguimiento de tractores en vivo", fr: "Suivi de tracteur en direct", de: "Live-Traktor-Tracking", ru: "Отслеживание трактора в реальном времени", pt: "Rastreamento de trator ao vivo", ko: "실시간 트랙터 추적"  },
      distance_covered: { te: "దూరం", en: "Distance", hi: "दूरी", ar: "مسافة", ml: "ദൂരം", kn: "ದೂರ", ta: "தூரம்", bn: "দূরত্ব", mr: "अंतर", gu: "અંતર", zh: "距离", ja: "距離",es: "Distancia", fr: "Distance", de: "Entfernung", ru: "Расстояние", pt: "Distância", ja: "距離", ko: "거리"  },
      gps_error: { te: "GPS స్థానాన్ని పొందడం సాధ్యం కాలేదు. దయచేసి అనుమతులను తనిఖీ చేయండి.", en: "Could not get GPS location. Please check permissions.", hi: "जीपीएस स्थान प्राप्त नहीं किया जा सका। कृपया अनुमतियों की जाँच करें।", ar: "تعذر الحصول على موقع GPS. يرجى التحقق من الأذونات.", ml: "ജിപിഎസ് ലൊക്കേഷൻ ലഭിച്ചില്ല. ദയവായി അനുമതികൾ പരിശോധിക്കുക.", kn: "ಜಿಪಿಎಸ್ ಸ್ಥಳವನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಅನುಮತಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.", ta: "ஜிபிஎஸ் இருப்பிடத்தைப் பெற முடியவில்லை. அனுமதிகளைச் சரிபார்க்கவும்.", bn: "জিপিএস অবস্থান পাওয়া যায়নি। অনুগ্রহ করে অনুমতি পরীক্ষা করুন।", mr: "जीपीएस स्थान मिळू शकले नाही. कृपया परवानग्या तपासा.", gu: "જીપીએસ સ્થાન મેળવી શકાયું નથી. કૃપા કરીને પરવાનગીઓ તપાસો.", zh: "无法获取GPS位置。请检查权限。", ja: "GPS位置を取得できませんでした。権限を確認してください。",es: "No se pudo obtener la ubicación GPS. Por favor, verifique los permisos.", fr: "Impossible d'obtenir la position GPS. Veuillez vérifier les autorisations.", de: "GPS-Standort konnte nicht abgerufen werden. Bitte überprüfen Sie die Berechtigungen.", ru: "Не удалось получить местоположение GPS. Пожалуйста, проверьте разрешения.", pt: "Não foi possível obter a localização GPS. Por favor, verifique as permissões.",ko: "GPS 위치를 가져올 수 없습니다. 권한을 확인하십시오."  },
      path_proof: { te: "మార్గం యొక్క రుజువు", en: "Proof of Path", hi: "पथ का प्रमाण", ar: "إثبات المسار", ml: "പാതയുടെ തെളിവ്", kn: "ಮಾರ್ಗದ ಪುರಾವೆ", ta: "பாதையின் சான்று", bn: "পথের প্রমাণ", mr: "मार्गाचा पुरावा", gu: "પાથનો પુરાવો", zh: "路径证明", ja: "経路の証明",es: "Prueba de ruta", fr: "Preuve de parcours", de: "Wegnachweis", ru: "Доказательство пути", pt: "Prova de caminho", ko: "경로 증명" },

      // Log Date Headers
      today_saved: {
          te: "ఈరోజు",
          en: "Today",
          hi: "आज",
          ar: "اليوم",
          ml: "ഇന്ന്",
          kn: "ಇಂದು",
          ta: "இன்று",
          bn: "আজ",
          mr: "आज",
          gu: "આજે",
          zh: "今天",
          ja: "今日",
          es: "Hoy",
          fr: "Aujourd'hui",
          de: "Heute", 
          ru: "Сегодня", 
          pt: "Hoje", 
          ko: "오늘"
      },
      yesterday_saved: {
          te: "నిన్న",
          en: "Yesterday",
          hi: "कल",
          ar: "أمس",
          ml: "ഇന്നലെ",
          kn: "ನಿನ್ನೆ",
          ta: "நேற்று",
          bn: "গতকাল",
          mr: "काल",
          gu: "ગઈકાલે",
          zh: "昨天",
          ja: "昨日",
          es: "Ayer",
          fr: "Hier",
          de: "Gestern", 
          ru: "Вчера",
          pt: "Ontem", 
          ko: "어제" 
      },
      date_saved_format: {
          te: "{date}",
          en: "{date}",
          hi: "{date}",
          ar: "{date}",
          ml: "{date}",
          kn: "{date}",
          ta: "{date}",
          bn: "{date}",
          mr: "{date}",
          gu: "{date}",
          zh: "{date}",
          ja: "{date}",
          es: "{date}", 
          fr: "{date}",
          de: "{date}", 
          ru: "{date}", 
          pt: "{date}", 
          ko: "{date}" 
      },
       // Message Box Messages
      name_updated_success: {
        te: "పేరు విజయవంతంగా నవీకరించబడింది!",
        en: "Name updated successfully!",
        hi: "नाम सफलतापूर्वक अपडेट किया गया!",
        ar: "تم تحديث الاسم بنجاح!",
        ml: "പേര് വിജയകരമായി അപ്ഡേറ്റ് ചെയ്തു!",
        kn: "ಹೆಸರನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!",
        ta: "பெயர் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!",
        bn: "নাম সফলভাবে আপডেট করা হয়েছে!",
        mr: "नाव यशस्वीरित्या अद्यतनित केले!",
        gu: "નામ સફળતાપૂર્વક અપડેટ થયું!",
        zh: "姓名更新成功！",
        ja: "名前が正常に更新されました！",
        es: "¡Nombre actualizado con éxito!",
        fr: "Nom mis à jour avec succès !",
        de: "Name erfolgreich aktualisiert!",
        ru: "Имя успешно обновлено!",
        pt: "Nome atualizado com sucesso!",
        ko: "이름이 성공적으로 업데이트되었습니다!" 
      },
      name_phone_missing_error: {
        te: "దయచేసి మొదట పేరు మరియు ఫోన్ నంబర్‌ను నమోదు చేయండి.",
        en: "Please enter the name and phone number first.",
        hi: "कृपया पहले नाम और फ़ोन नंबर दर्ज करें।",
        ar: "يرجى إدخال الاسم ورقم الهاتف أولاً.",
        ml: "ദയവായി ആദ്യം പേരും ഫോൺ നമ്പറും നൽകുക.",
        kn: "ದಯವಿಟ್ಟು ಮೊದಲು ಹೆಸರು ಮತ್ತು ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
        ta: "முதலில் பெயர் மற்றும் தொலைபேசி எண்ணை உள்ளிடவும்.",
        bn: "অনুগ্রহ করে প্রথমে নাম এবং ফোন নম্বর লিখুন।",
        mr: "कृपया आधी नाव आणि फोन नंबर टाका.",
        gu: "કૃપા કરીને પહેલા નામ અને ફોન નંબર દાખલ કરો.",
        zh: "请先输入姓名和电话号码。",
        ja: "最初に名前と電話番号を入力してください。",
        es: "Por favor, ingrese primero el nombre y el número de teléfono.",
       fr: "Veuillez d'abord saisir le nom et le numéro de téléphone.", 
       de: "Bitte geben Sie zuerst den Namen und die Telefonnummer ein.", 
       ru: "Пожалуйста, сначала введите имя и номер телефона.",
       pt: "Por favor, insira primeiro o nome e o número de telefone.", 
       ko: "먼저 이름과 전화번호를 입력하세요." 
        
      },
      phone_exists_error: {
        te: "ఈ ఫోన్ నంబర్ ఇప్పటికే '{name}' పేరుతో ఉంది. దయచేసి వేరే నంబర్‌ను ఉపయోగించండి.",
        en: "This phone number already exists with the name '{name}'. Please use a different number.",
        hi: "यह फ़ोन नंबर पहले से ही '{name}' नाम से मौजूद है। कृपया एक अलग नंबर का उपयोग करें।",
        ar: "رقم الهاتف هذا موجود بالفعل بالاسم '{name}'. يرجى استخدام رقم مختلف.",
        ml: "ഈ ഫോൺ നമ്പർ '{name}' എന്ന പേരിൽ ഇതിനകം നിലവിലുണ്ട്. ദയവായി മറ്റൊരു നമ്പർ ഉപയോഗിക്കുക.",
        kn: "ಈ ಫೋನ್ ಸಂಖ್ಯೆ ಈಗಾಗಲೇ '{name}' ಹೆಸರಿನೊಂದಿಗೆ ಅಸ್ತಿತ್ವದಲ್ಲಿದೆ. ದಯವಿಟ್ಟು ಬೇರೆ ಸಂಖ್ಯೆಯನ್ನು ಬಳಸಿ.",
        ta: "இந்த தொலைபேசி எண் ஏற்கனவே '{name}' என்ற பெயரில் உள்ளது. வேறு எண்ணைப் பயன்படுத்தவும்.",
        bn: "এই ফোন নম্বরটি ইতিমধ্যে '{name}' নামে বিদ্যমান। অনুগ্রহ করে একটি ভিন্ন নম্বর ব্যবহার করুন।",
        mr: "हा फोन नंबर आधीपासून '{name}' नावाने अस्तित्वात आहे. कृपया वेगळा नंबर वापरा.",
        gu: "આ ફોન નંબર '{name}' નામથી પહેલેથી અસ્તિત્વમાં છે. કૃપા કરીને બીજો નંબર વાપરો.",
        zh: "此电话号码已存在于姓名“{name}”下。请使用其他号码。",
        ja: "この電話番号はすでに「{name}」という名前で存在します。別の番号を使用してください。",
        es: "Este número de teléfono ya existe con el nombre '{name}'. Utilice un número diferente.",
        fr: "Ce numéro de téléphone existe déjà avec le nom « {name} ». Veuillez utiliser un autre numéro.",
        de: "Diese Telefonnummer existiert bereits mit dem Namen „{name}“. Bitte verwenden Sie eine andere Nummer.", 
        ru: "Этот номер телефона уже существует с именем «{name}». Пожалуйста, используйте другой номер.",
        pt: "Este número de telefone já existe com o nome '{name}'. Por favor, use um número diferente.",
        ko: "이 전화번호는 '{name}'이라는 이름으로 이미 존재합니다. 다른 번호를 사용하십시오."
      },
      fill_time_rate_error: {
        te: "దయచేసి సమయం మరియు రేటు నింపండి.",
        en: "Please fill time and rate.",
        hi: "कृपया समय और दर भरें।",
        ar: "يرجى ملء الوقت والمعدل.",
        ml: "ദയവായി സമയവും നിരക്കും പൂരിപ്പിക്കുക.",
        kn: "ದಯವಿಟ್ಟು ಸಮಯ ಮತ್ತು ದರವನ್ನು ಭರ್ತಿ ಮಾಡಿ.",
        ta: "நேரம் மற்றும் விகிதத்தை நிரப்பவும்.",
        bn: "অনুগ্রহ করে সময় এবং হার পূরণ করুন।",
        mr: "कृपया वेळ आणि दर भरा.",
        gu: "કૃપા કરીને સમય અને દર ભરો.",
        zh: "请填写时间和费率。",
        ja: "時間と料金を記入してください。",
        es: "Por favor, complete el tiempo y la tarifa.", 
        fr: "Veuillez indiquer l'heure et le tarif.", 
        de: "Bitte Zeit und Tarif ausfüllen.",
        ru: "Пожалуйста, укажите время и ставку.",
        pt: "Por favor, preencha o tempo e a taxa.", 
        ko: "시간과 요금을 입력하세요." 
        
      },
      end_time_error: {
        te: "ముగింపు సమయం ప్రారంభ సమయం తర్వాత లేదా కనీసం 1 నిమిషం వ్యవధి ఉండాలి.",
        en: "End time must be after start time or have at least 1 minute duration.",
        hi: "अंतिम समय आरंभ समय के बाद या कम से कम 1 मिनट की अवधि का होना चाहिए।",
        ar: "يجب أن يكون وقت النهاية بعد وقت البدء أو أن تكون مدته دقيقة واحدة على الأقل.",
        ml: "അവസാനിക്കുന്ന സമയം ആരംഭിക്കുന്ന സമയത്തിന് ശേഷമോ അല്ലെങ്കിൽ കുറഞ്ഞത് 1 മിനിറ്റ് ദൈർഘ്യമോ ഉണ്ടായിരിക്കണം.",
        kn: "ಮುಕ್ತಾಯ ಸಮಯವು ಪ್ರಾರಂಭದ ಸಮಯದ ನಂತರ ಅಥವಾ ಕನಿಷ್ಠ 1 ನಿಮಿಷದ ಅವಧಿಯನ್ನು ಹೊಂದಿರಬೇಕು.",
        ta: "முடிவு நேரம் தொடக்க நேரத்திற்குப் பிறகு அல்லது குறைந்தது 1 நிமிட கால அளவு இருக்க வேண்டும்.",
        bn: "শেষ সময় শুরুর সময়ের পরে হতে হবে বা কমপক্ষে ১ মিনিটের সময়কাল থাকতে হবে।",
        mr: "शेवटची वेळ सुरुवातीच्या वेळेनंतर किंवा किमान 1 मिनिटाचा कालावधी असावा.",
        gu: "સમાપ્તિ સમય પ્રારંભ સમય પછી અથવા ઓછામાં ઓછો 1 મિનિટનો સમયગાળો હોવો જોઈએ.",
        zh: "结束时间必须晚于开始时间或至少持续1分钟。",
        ja: "終了時刻は開始時刻より後であるか、少なくとも1分間の期間が必要です。",
        es: "La hora de finalización debe ser posterior a la hora de inicio o tener una duración de al menos 1 minuto.", 
        fr: "L'heure de fin doit être postérieure à l'heure de début ou avoir une durée d'au moins 1 minute.",
        de: "Die Endzeit muss nach der Startzeit liegen oder eine Dauer von mindestens 1 Minute haben.",
        ru: "Время окончания должно быть позже времени начала или иметь продолжительность не менее 1 минуты.", 
        pt: "A hora de término deve ser posterior à hora de início ou ter pelo menos 1 minuto de duração.", 
        ko: "종료 시간은 시작 시간 이후이거나 최소 1분 이상이어야 합니다." 
      },
      hourly_calculation_success: {
        te: "గంటకు ఆదాయం విజయవంతంగా లెక్కించబడింది!",
        en: "Hourly earnings calculated successfully!",
        hi: "घंटे की कमाई सफलतापूर्वक गणना की गई!",
        ar: "تم حساب الأرباح بالساعة بنجاح!",
        ml: "മണിക്കൂർ വരുമാനം വിജയകരമായി കണക്കാക്കി!",
        kn: "ಗಂಟೆಯ ಗಳಿಕೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ!",
        ta: "மணிநேர வருவாய் வெற்றிகரமாக கணக்கிடப்பட்டது!",
        bn: "ঘন্টার আয় সফলভাবে গণনা করা হয়েছে!",
        mr: "तासाभराची कमाई यशस्वीरित्या मोजली!",
        gu: "કલાકની કમાણી સફળતાપૂર્વક ગણવામાં આવી!",
        zh: "每小时收入计算成功！",
        ja: "時給が正常に計算されました！",
        es: "¡Ganancias por hora calculadas con éxito!",
       fr: "Gains horaires calculés avec succès !", 
       de: "Stundenverdienst erfolgreich berechnet!", 
       ru: "Почасовой заработок успешно рассчитан!",
       pt: "Ganhos por hora calculados com sucesso!",
       ko: "시간당 수입이 성공적으로 계산되었습니다!" 
      },
      enter_valid_trips_cost_error: {
        te: "దయచేసి ట్రిప్పులు మరియు ట్రిప్ ధర కోసం సరైన సంఖ్యలను నమోదు చేయండి.",
        en: "Please enter valid numbers for trips and trip cost.",
        hi: "कृपया यात्राओं और यात्रा लागत के लिए मान्य संख्याएँ दर्ज करें।",
        ar: "يرجى إدخال أرقام صالحة للرحلات وتكلفة الرحلة.",
        ml: "ട്രിപ്പുകൾക്കും ട്രിപ്പ് ചെലവിനും ദയവായി സാധുവായ നമ്പറുകൾ നൽകുക.",
        kn: "ಪ್ರಯಾಣಗಳು ಮತ್ತು ಪ್ರಯಾಣದ ವೆಚ್ಚಕ್ಕಾಗಿ ದಯವಿಟ್ಟು ಮಾನ್ಯ ಸಂಖ್ಯೆಗಳನ್ನು ನಮೂದಿಸಿ.",
        ta: "பயணங்கள் மற்றும் பயணச் செலவுகளுக்கு சரியான எண்களை உள்ளிடவும்.",
        bn: "ট্রিপ এবং ট্রিপ খরচের জন্য অনুগ্রহ করে বৈধ সংখ্যা লিখুন।",
        mr: "कृपया ट्रिप आणि ट्रिप खर्चासाठी वैध क्रमांक प्रविष्ट करा.",
        gu: "કૃપા કરીને ટ્રિપ્સ અને ટ્રિપના ખર્ચ માટે માન્ય નંબરો દાખલ કરો.",
        zh: "请输入有效的行程次数和行程费用。",
        ja: "旅行回数と旅行費用に有効な数値を入力してください。",
        es: "Por favor, ingrese números válidos para los viajes y el costo del viaje.", 
       fr: "Veuillez saisir des numéros valides pour les voyages et le coût du voyage.",
       de: "Bitte geben Sie gültige Nummern für Fahrten und Fahrtkosten ein.", 
       ru: "Пожалуйста, введите действительные числа для поездок и стоимости поездки.",
       pt: "Por favor, insira números válidos para viagens e custo da viagem.", 
       ko: "여행 및 여행 비용에 유효한 숫자를 입력하십시오." 
      },
      trip_calculation_success: {
        te: "ట్రిప్ ఆదాయం విజయవంతంగా లెక్కించబడింది!",
        en: "Trip earnings calculated successfully!",
        hi: "यात्रा की कमाई सफलतापूर्वक गणना की गई!",
        ar: "تم حساب أرباح الرحلة بنجاح!",
        ml: "ട്രിപ്പ് വരുമാനം വിജയകരമായി കണക്കാക്കി!",
        kn: "ಪ್ರಯಾಣದ ಗಳಿಕೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ!",
        ta: "பயண வருவாய் வெற்றிகரமாக கணக்கிடப்பட்டது!",
        bn: "ট্রিপের আয় সফলভাবে গণনা করা হয়েছে!",
        mr: "ट्रिपची कमाई यशस्वीरित्या मोजली!",
        gu: "ટ્રિપની કમાણી સફળતાપૂર્વક ગણવામાં આવી!",
        zh: "行程收入计算成功！",
        ja: "旅行収益が正常に計算されました！",
        es: "¡Ganancias del viaje calculadas con éxito!", 
       fr: "Gains du voyage calculés avec succès !",
       de: "Fahrteinnahmen erfolgreich berechnet!",
       ru: "Доход от поездки успешно рассчитан!",
       pt: "Ganhos da viagem calculados com sucesso!",
       ko: "여행 수입이 성공적으로 계산되었습니다!"
      },
      combined_calculation_success: {
        te: "మొత్తం ఆదాయం విజయవంతంగా లెక్కించబడింది!",
        en: "Combined earnings calculated successfully!",
        hi: "संयुक्त कमाई सफलतापूर्वक गणना की गई!",
        ar: "تم حساب الأرباح المجمعة بنجاح!",
        ml: "സംയോജിത വരുമാനം വിജയകരമായി കണക്കാക്കി!",
        kn: "ಸಂಯೋಜಿತ ಗಳಿಕೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ!",
        ta: "ஒருங்கிணைந்த வருவாய் வெற்றிகரமாக கணக்கிடப்பட்டது!",
        bn: "সম্মিলিত আয় সফলভাবে গণনা করা হয়েছে!",
        mr: "एकत्रित कमाई यशस्वीरित्या मोजली!",
        gu: "સંયુક્ત કમાણી સફળતાપૂર્વક ગણવામાં આવી!",
        zh: "合并收入计算成功！",
        ja: "合算収益が正常に計算されました！",
         es: "¡Ganancias combinadas calculadas con éxito!",
        fr: "Gains combinés calculés avec succès !",
        de: "Kombinierte Einnahmen erfolgreich berechnet!",
        ru: "Совокупный доход успешно рассчитан!",
        pt: "Ganhos combinados calculados com sucesso!",
       ko: "결합 수입이 성공적으로 계산되었습니다!" 
        
      },
      fill_all_details_calculate_save_error: {
        te: "దయచేసి అన్ని వివరాలను నింపి, సేవ్ చేయడానికి ముందు ఆదాయాన్ని లెక్కించండి.",
        en: "Please fill all details and calculate earnings before saving.",
        hi: "सहेजने से पहले कृपया सभी विवरण भरें और कमाई की गणना करें।",
        ar: "يرجى ملء جميع التفاصيل وحساب الأرباح قبل الحفظ.",
        ml: "സേവ് ചെയ്യുന്നതിന് മുമ്പ് ദയവായി എല്ലാ വിവരങ്ങളും പൂരിപ്പിച്ച് വരുമാനം കണക്കാക്കുക.",
        kn: "ಉಳಿಸುವ ಮೊದಲು ದಯವಿಟ್ಟು ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ ಮತ್ತು ಗಳಿಕೆಗಳನ್ನು ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ.",
        ta: "சேமிப்பதற்கு முன் அனைத்து விவரங்களையும் பூர்த்தி செய்து வருவாயைக் கணக்கிடவும்.",
        bn: "সংরক্ষণের আগে অনুগ্রহ করে সমস্ত বিবরণ পূরণ করুন এবং আয় গণনা করুন।",
        mr: "कृपया सर्व तपशील भरा आणि जतन करण्यापूर्वी कमाईची गणना करा.",
        gu: "સાચવતા પહેલા કૃપા કરીને બધી વિગતો ભરો અને કમાણીની ગણતરી કરો.",
        zh: "请填写所有详细信息并在保存前计算收入。",
        ja: "保存する前にすべての詳細を記入し、収益を計算してください。",
        es: "Por favor, complete todos los detalles y calcule las ganancias antes de guardar.", 
        fr: "Veuillez remplir tous les détails et calculer les gains avant d'enregistrer.",
         de: "Bitte füllen Sie alle Details aus und berechnen Sie die Einnahmen, bevor Sie speichern.", 
        ru: "Пожалуйста, заполните все данные и рассчитайте заработок перед сохранением.",
         pt: "Por favor, preencha todos os detalhes e calcule os ganhos antes de salvar.",
         ko: "저장하기 전에 모든 세부 정보를 입력하고 수입을 계산하십시오."
      },
      data_saved_success: {
        te: "డేటా విజయవంతంగా సేవ్ చేయబడింది!",
        en: "Data saved successfully!",
        hi: "डेटा सफलतापूर्वक सहेजा गया!",
        ar: "تم حفظ البيانات بنجاح!",
        ml: "ഡാറ്റ വിജയകരമായി സേവ് ചെയ്തു!",
        kn: "ಡೇಟಾವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!",
        ta: "தரவு வெற்றிகரமாக சேமிக்கப்பட்டது!",
        bn: "ডেটা সফলভাবে সংরক্ষিত হয়েছে!",
        mr: "डेटा यशस्वीरित्या जतन केला!",
        gu: "ડેટા સફળતાપૂર્વક સાચવવામાં આવ્યો!",
        zh: "数据保存成功！",
        ja: "データが正常に保存されました！",
        es: "¡Datos guardados con éxito!",
       fr: "Données enregistrées avec succès !", 
       de: "Daten erfolgreich gespeichert!", 
       ru: "Данные успешно сохранены!",
       pt: "Dados salvos com sucesso!", 
       ko: "데이터가 성공적으로 저장되었습니다!"
      },
       // NEW: Talkback translations
      calculation_talkback: {
        te: "మొత్తం {amount} రూపాయలు",
        en: "Total Amount {amount} rupees",
        hi: "कुल राशि {amount} रुपये",
        ar: "المبلغ الإجمالي {amount} روبية",
        ml: "ആകെ തുക {amount} രൂപ",
        kn: "ಒಟ್ಟು ಮೊತ್ತ {amount} ರೂಪಾಯಿಗಳು",
        ta: "மொத்த தொகை {amount} ரூபாய்",
        bn: "মোট পরিমাণ {amount} টাকা",
        mr: "एकूण रक्कम {amount} रुपये",
        gu: "કુલ રકમ {amount} રૂપિયા",
        zh: "总金额 {amount} 卢比",
        ja: "合計金額 {amount} ルピー",
        es: "Monto total {amount} euros",
       fr: "Montant total {amount} euros",
       de: "Gesamtbetrag {amount} Euro",
       ru: "Итоговая сумма {amount} рублей",
       pt: "Valor total {amount} reais", 
       ko: "총액 {amount} 원"
      },
      saved_talkback: {
        te: "డేటా విజయవంతంగా సేవ్ చేయబడింది",
        en: "Data saved successfully",
        hi: "डेटा सफलतापूर्वक सहेजा गया",
        ar: "تم حفظ البيانات بنجاح",
        ml: "ഡാറ്റ വിജയകരമായി സേവ് ചെയ്തു",
        kn: "ಡೇಟಾವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ",
        ta: "தரவு வெற்றிகரமாக சேமிக்கப்பட்டது",
        bn: "ডেটা সফলভাবে সংরক্ষিত হয়েছে",
        mr: "डेटा यशस्वीरित्या जतन केला",
        gu: "ડેટા સફળતાપૂર્વક સાચવવામાં આવ્યો",
        zh: "数据保存成功",
        ja: "データが正常に保存されました",
        es: "Datos guardados con éxito", 
        fr: "Données enregistrées avec succès", 
        de: "Daten erfolgreich gespeichert", 
        ru: "Данные успешно сохранены",
        pt: "Dados salvos com sucesso",
        ko: "데이터가 성공적으로 저장되었습니다" 
      },
      back_button: {
        te: "వెనుకకు",
        en: "Back",
        hi: "वापस",
        ar: "عودة",
        ml: "പുറകോട്ട്",
        kn: "ಹಿಂದೆ",
        ta: "பின்",
        bn: "পিছনে",
        mr: "मागे",
        gu: "પાછા",
        zh: "返回",
        ja: "戻る",
        es: "Atrás", 
       fr: "Retour",
       de: "Zurück", 
       ru: "Назад", 
       pt: "Voltar",
       ko: "뒤로" 
      },
      cancel_button: {
        te: "రద్దు చేయి",
        en: "Cancel",
        hi: "रद्द करें",
        ar: "إلغاء",
        ml: "റദ്ദാക്കുക",
        kn: "ರದ್ದುಮಾಡಿ",
        ta: "ரத்துசெய்",
        bn: "বাতিল করুন",
        mr: "रद्द करा",
        gu: "રદ કરો",
        zh: "取消",
        ja: "キャンセル",
        es: "Cancelar", 
        fr: "Annuler",
         de: "Abbrechen", 
         ru: "Отмена", 
         pt: "Cancelar",
         ko: "취소" 
      },
      confirm_button: {
        te: "నిర్ధారించు",
        en: "Confirm",
        hi: "पुष्टि करें",
        ar: "تأكيد",
        ml: "സ്ഥിരീകരിക്കുക",
        kn: "ದೃಢೀಕರಿಸಿ",
        ta: "உறுதிப்படுத்தவும்",
        bn: "নিশ্চিত করুন",
        mr: "पुष्टी करा",
        gu: "પુષ્ટિ કરો",
        zh: "确认",
        ja: "確認",
        es: "Confirmar", 
        fr: "Confirmer", 
        de: "Bestätigen", 
        ru: "Подтвердить", 
        pt: "Confirmar",  
        ko: "확인"
      },
      note_details_missing: { 
        te: "దయచేసి నోట్ కంటెంట్ నింపండి.",
        en: "Please fill note content.",
        hi: "कृपया नोट सामग्री भरें।",
        ar: "يرجى ملء محتوى الملاحظة.",
        ml: "ദയവായി കുറിപ്പ് ഉള്ളടക്കം പൂരിപ്പിക്കുക.",
        kn: "ದಯವಿಟ್ಟು ಟಿಪ್ಪಣಿ ವಿಷಯವನ್ನು ಭರ್ತಿ ಮಾಡಿ.",
        ta: "குறிப்பு உள்ளடக்கத்தை நிரப்பவும்.",
        bn: "অনুগ্রহ করে নোটের বিষয়বস্তু পূরণ করুন।",
        mr: "कृपया टीप सामग्री भरा.",
        gu: "કૃપા કરીને નોંધ સામગ્રી ભરો.",
        zh: "请填写笔记内容。",
        ja: "メモ内容を記入してください。",
        es: "Por favor, complete el contenido de la nota.", 
        fr: "Veuillez remplir le contenu de la note.", 
        de: "Bitte füllen Sie den Notizinhalt aus.", 
        ru: "Пожалуйста, заполните содержание заметки.", 
        pt: "Por favor, preencha o conteúdo da nota.", 
        ko: "메모 내용을 입력하세요."
      },
      search_logs_placeholder: {
        te: "పేరు లేదా ఫోన్ ద్వారా శోధించండి...",
        en: "Search by name or phone...",
        hi: "नाम या फ़ोन द्वारा खोजें...",
        ar: "البحث بالاسم أو الهاتف ...",
        ml: "പേര് അല്ലെങ്കിൽ ഫോൺ ഉപയോഗിച്ച് തിരയുക...",
        kn: "ಹೆಸರು ಅಥವಾ ಫೋನ್ ಮೂಲಕ ಹುಡುಕಿ...",
        ta: "பெயர் அல்லது தொலைபேசி மூலம் தேடவும்...",
        bn: "নাম বা ফোন দ্বারা অনুসন্ধান করুন...",
        mr: "नाव किंवा फोनद्वारे शोधा...",
        gu: "નામ અથવા ફોન દ્વારા શોધો...",
        zh: "按姓名或电话搜索...",
        ja: "名前または電話で検索...",
        es: "Buscar por nombre o teléfono...", 
        fr: "Rechercher par nom ou téléphone...",
         de: "Suche nach Name oder Telefon...", 
         ru: "Поиск по имени или телефону...", 
         pt: "Pesquisar por nome ou telefone...", 
         ko: "이름 또는 전화로 검색..."
      },
      contact_picker_not_supported: {
        te: "ఈ బ్రౌజర్‌లో కాంటాక్ట్ పికర్ APIకి మద్దతు లేదు.",
        en: "Contact Picker API not supported on this browser.",
        hi: "इस ब्राउज़र पर संपर्क पिकर एपीआई समर्थित नहीं है।",
        ar: "Contact Picker API غير مدعوم في هذا المتصفح.",
        ml: "ഈ ബ്രൗസറിൽ കോൺടാക്റ്റ് പിക്കർ API പിന്തുണയ്ക്കുന്നില്ല.",
        kn: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಸಂಪರ್ಕ ಪಿಕ್ಕರ್ API ಬೆಂಬಲಿತವಾಗಿಲ್ಲ.",
        ta: "இந்த உலாவியில் தொடர்பு தேர்வி ஏபிஐ ஆதரிக்கப்படவில்லை.",
        bn: "এই ব্রাউজারে পরিচিতি পিকার API সমর্থিত নয়।",
        mr: "या ब्राउझरवर संपर्क निवडक API समर्थित नाही.",
        gu: "આ બ્રાઉઝર પર સંપર્ક પીકર API સમર્થિત નથી.",
        zh: "此浏览器不支持联系人选择器 API。",
        ja: "このブラウザでは連絡先ピッカーAPIはサポートされていません。",
        es: "La API de Contact Picker no es compatible con este navegador.",
         fr: "L'API Contact Picker n'est pas prise en charge par ce navigateur.", 
         de: "Die Contact Picker API wird von diesem Browser nicht unterstützt.", 
         ru: "API Contact Picker не поддерживается в этом браузере.",
          pt: "A API Contact Picker não é suportada neste navegador.",
         ko: "이 브라우저에서는 Contact Picker API가 지원되지 않습니다."
      },
      speech_not_supported: {
        te: "ఈ బ్రౌజర్‌లో స్పీచ్ రికగ్నిషన్‌కు మద్దతు లేదు.",
        en: "Speech recognition is not supported in this browser.",
        hi: "इस ब्राउज़र में वाक् पहचान समर्थित नहीं है।",
        ar: "التعرف على الكلام غير مدعوم في هذا المتصفح.",
        ml: "ഈ ബ്രൗസറിൽ സംഭാഷണ തിരിച്ചറിയൽ പിന്തുണയ്ക്കുന്നില്ല.",
        kn: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮಾತಿನ ಗುರುತಿಸುವಿಕೆ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ.",
        ta: "இந்த உலாவியில் பேச்சு அறிதல் ஆதரிக்கப்படவில்லை.",
        bn: "এই ব্রাউজারে স্পিচ রিকগনিশন সমর্থিত নয়।",
        mr: "या ब्राउझरमध्ये भाषण ओळख समर्थित नाही.",
        gu: "આ બ્રાઉઝરમાં વાણી ઓળખ સપોર્ટેડ નથી.",
        zh: "此浏览器不支持语音识别。",
        ja: "このブラウザでは音声認識はサポートされていません。",
        es: "El reconocimiento de voz no es compatible con este navegador.", 
        fr: "La reconnaissance vocale n'est pas prise en charge par ce navigateur.", 
        de: "Die Spracherkennung wird in diesem Browser nicht unterstützt.", 
        ru: "Распознавание речи не поддерживается в этом браузере.", 
        pt: "O reconhecimento de fala não é suportado neste navegador.",
         ko: "이 브라우저에서는 음성 인식이 지원되지 않습니다."
      },
       speech_synthesis_not_supported: {
        te: "ఈ బ్రౌజర్‌లో టెక్స్ట్-టు-స్పీచ్‌కు మద్దతు లేదు.",
        en: "Text-to-speech is not supported in this browser.",
        hi: "इस ब्राउज़र में टेक्स्ट-टू-स्पीच समर्थित नहीं है।",
        ar: "تحويل النص إلى كلام غير مدعوم في هذا المتصفح.",
        ml: "ഈ ബ്രൗസറിൽ ടെക്സ്റ്റ്-ടു-സ്പീച്ച് പിന്തുണയ്ക്കുന്നില്ല.",
        kn: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಪಠ್ಯದಿಂದ ಭಾಷಣಕ್ಕೆ ಬೆಂಬಲವಿಲ್ಲ.",
        ta: "இந்த உலாவியில் உரையிலிருந்து பேச்சு ஆதரிக்கப்படவில்லை.",
        bn: "এই ব্রাউজারে টেক্সট-টু-স্পিচ সমর্থিত নয়।",
        mr: "या ब्राउझरमध्ये टेक्स्ट-टू-स्पीच समर्थित नाही.",
        gu: "આ બ્રાઉઝરમાં ટેક્સ્ટ-ટુ-સ્પીચ સપોર્ટેડ નથી.",
        zh: "此浏览器不支持文本到语音转换。",
        ja: "このブラウザではテキスト読み上げはサポートされていません。", 
        es: "La conversión de texto a voz no es compatible con este navegador.",
         fr: "La synthèse vocale n'est pas prise en charge par ce navigateur.", 
         de: "Text-zu-Sprache wird in diesem Browser nicht unterstützt.", 
         ru: "Преобразование текста в речь не поддерживается в этом браузере.", 
         pt: "A conversão de texto em fala não é suportada neste navegador.",
          ko: "이 브라우저에서는 텍스트 음성 변환이 지원되지 않습니다."
      },
      speech_error: {
        te: "స్పీచ్ ఎర్రర్: {error}",
        en: "Speech Error: {error}",
        hi: "वाणी त्रुटि: {error}",
        ar: "خطأ في الكلام: {error}",
        ml: "സംഭാഷണ പിശക്: {error}",
        kn: "ಮಾತಿನ ದೋಷ: {error}",
        ta: "பேச்சு பிழை: {error}",
        bn: "কথোপকথন ত্রুটি: {error}",
        mr: "भाषण त्रुटी: {error}",
        gu: "વાણી ભૂલ: {error}",
        zh: "语音错误：{error}",
        ja: "音声エラー：{error}",
        es: "Error de voz: {error}", 
        fr: "Erreur vocale : {error}",
         de: "Sprachfehler: {error}",
          ru: "Ошибка речи: {error}",
           pt: "Erro de fala: {error}", 
         ko: "음성 오류: {error}" 
      },
      paid_status: { te: "చెల్లించారు", en: "Paid", hi: "भुगतान किया", ar: "مدفوع", ml: "പണം നൽകി", kn: "ಪಾವತಿಸಲಾಗಿದೆ", ta: "செலுத்தப்பட்டது", bn: "পরিশোধিত", mr: "पैसे दिले", gu: "ચૂકવેલ", zh: "已付款", ja: "支払い済み",es: "Pagado", fr: "Payé", de: "Bezahlt", ru: "Оплачено", pt: "Pago", ko: "지불됨" },
      due_status: { te: "చెల్లించవలసినది", en: "Due", hi: "देय", ar: "مستحق", ml: "അടയ്‌ക്കേണ്ടത്", kn: "ಬಾಕಿ", ta: "நிலுவை", bn: "বকেয়া", mr: "देय", gu: "બાકી", zh: "到期", ja: "期日",es: "Pendiente", fr: "Dû", de: "Fällig", ru: "К оплате", pt: "Vencido",  ko: "미납"  },
      advance_status: { te: "అడ్వాన్స్", en: "Advance", hi: "अग्रिम", ar: "مقدم", ml: "അഡ്വാൻസ്", kn: "ಮುಂಗಡ", ta: "முன்பணம்", bn: "অগ্রিম", mr: "ॲडव्हान्स", gu: "એડવાન્સ", zh: "预付款", ja: "前払い",es: "Adelanto", fr: "Avance", de: "Vorschuss", ru: "Аванс", pt: "Adiantamento", ja: "前払い", ko: "선금",es: "Enviar SMS", fr: "Envoyer SMS", de: "SMS senden", ru: "Отправить SMS", pt: "Enviar SMS",  ko: "SMS 보내기"  },
      sms_button: { te: "SMS పంపండి", en: "Send SMS", hi: "एसएमएस भेजें", ar: "إرسال رسالة قصيرة", ml: "എസ്എംഎസ് അയയ്ക്കുക", kn: "SMS ಕಳುಹಿಸಿ", ta: "எஸ்எம்எஸ் அனுப்பு", bn: "এসএমএস পাঠান", mr: "एसएमएस पाठवा", gu: "એસએમએસ મોકલો", zh: "发送短信", ja: "SMSを送信",es: "Enviar WhatsApp", fr: "Envoyer WhatsApp", de: "WhatsApp senden", ru: "Отправить WhatsApp", pt: "Enviar WhatsApp", ko: "WhatsApp 보내기"  },
      whatsapp_button: { te: "WhatsApp పంపండి", en: "Send WhatsApp", hi: "व्हाट्सएप भेजें", ar: "إرسال واتساب", ml: "വാട്ട്‌സ്ആപ്പ് അയയ്ക്കുക", kn: "WhatsApp ಕಳುಹಿಸಿ", ta: "வாட்ஸ்அப் அனுப்பு", bn: "হোয়াটসঅ্যাপ পাঠান", mr: "व्हॉट्सॲप पाठवा", gu: "વોટ્સએપ મોકલો", zh: "发送WhatsApp", ja: "WhatsAppを送信",es: "Llamar", fr: "Appeler", de: "Anrufen", ru: "Позвонить", pt: "Ligar", ko: "전화"  },
      call_button: { te: "కాల్ చేయండి", en: "Call", hi: "कॉल करें", ar: "اتصال", ml: "വിളിക്കുക", kn: "ಕರೆ ಮಾಡಿ", ta: "அழை", bn: "কল করুন", mr: "कॉल करा", gu: "કૉલ કરો", zh: "呼叫", ja: "電話",es: "Descargar", fr: "Télécharger", de: "Herunterladen", ru: "Скачать", pt: "Baixar",  ko: "다운로드"   },
      download_button: { te: "డౌన్‌లోడ్", en: "Download", hi: "डाउनलोड", ar: "تحميل", ml: "ഡൗൺലോഡ്", kn: "ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ", ta: "பதிவிறக்க Tamil", bn: "ডাউনলোড করুন", mr: "डाउनलोड करा", gu: "ડાઉનલોડ કરો", zh: "下载", ja: "ダウンロード", es: "Descargar", fr: "Télécharger", de: "Herunterladen", ru: "Скачать", pt: "Baixar",  ko: "다운로드"    },
       read_aloud_button: { te: "గట్టిగా చదువు", en: "Read Aloud", hi: "जोर से पढ़ें", ar: "اقرأ بصوت عالٍ", ml: "ഉറക്കെ വായിക്കുക", kn: "ಗಟ್ಟಿಯಾಗಿ ಓದಿ", ta: "உரக்கப்படி", bn: "জোরে পড়ুন", mr: "मोठ्याने वाचा", gu: "મોટેથી વાંચો", zh: "朗读", ja: "読み上げ", es: "Leer en voz alta", fr: "Lire à voix haute", de: "Vorlesen", ru: "Читать вслух", pt: "Ler em voz alta",   ko: "소리 내어 읽기" },
      download_error: { te: "లాగ్‌ను డౌన్‌లోడ్ చేయడంలో విఫలమైంది.", en: "Failed to download log.", hi: "लॉग डाउनलोड करने में विफल।", ar: "فشل في تنزيل السجل.", ml: "ലോഗ് ഡൗൺലോഡ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു.", kn: "ಲಾಗ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ.", ta: "பதிவைப் பதிவிறக்க முடியவில்லை.", bn: "লগ ডাউনলোড করতে ব্যর্থ হয়েছে।", mr: "लॉग डाउनलोड करण्यात अयशस्वी.", gu: "લોગ ડાઉનલોડ કરવામાં નિષ્ફળ.", zh: "下载日志失败。", ja: "ログのダウンロードに失敗しました。",es: "Error al descargar el registro.", fr: "Échec du téléchargement du journal.", de: "Fehler beim Herunterladen des Protokolls.", ru: "Не удалось скачать журнал.", pt: "Falha ao baixar o registro.",  ko: "로그 다운로드에 실패했습니다."  },
      call_error: { te: "కాల్ చేయడానికి ఫోన్ నంబర్ లేదు.", en: "No phone number available to call.", hi: "कॉल करने के लिए कोई फ़ोन नंबर उपलब्ध नहीं है।", ar: "لا يوجد رقم هاتف متاح للاتصال به.", ml: "വിളിക്കാൻ ഫോൺ നമ്പർ ലഭ്യമല്ല.", kn: "ಕರೆ ಮಾಡಲು ಯಾವುದೇ ಫೋನ್ ಸಂಖ್ಯೆ ಲಭ್ಯವಿಲ್ಲ.", ta: "அழைக்க தொலைபேசி எண் இல்லை.", bn: "কল করার জন্য কোন ফোন নম্বর উপলব্ধ নেই।", mr: "कॉल करण्यासाठी कोणताही फोन नंबर उपलब्ध नाही.", gu: "કૉલ કરવા માટે કોઈ ફોન નંબર ઉપલબ્ધ નથી.", zh: "没有可用的电话号码可以拨打。", ja: "電話をかけるための電話番号がありません。",es: "No hay número de teléfono disponible para llamar.", fr: "Aucun numéro de téléphone disponible pour appeler.", de: "Keine Telefonnummer zum Anrufen verfügbar.", ru: "Нет доступного номера телефона для звонка.", pt: "Nenhum número de telefone disponível para ligar.",ko: "전화할 수 있는 전화번호가 없습니다."   },
      sms_send_error: { te: "SMS పంపడానికి ఫోన్ నంబర్ లేదు.", en: "No phone number available to send SMS.", hi: "एसएमएस भेजने के लिए कोई फ़ोन नंबर उपलब्ध नहीं है।", ar: "لا يوجد رقم هاتف متاح لإرسال رسالة قصيرة.", ml: "എസ്എംഎസ് അയയ്ക്കാൻ ഫോൺ നമ്പർ ലഭ്യമല്ല.", kn: "SMS ಕಳುಹಿಸಲು ಯಾವುದೇ ಫೋನ್ ಸಂಖ್ಯೆ ಲಭ್ಯವಿಲ್ಲ.", ta: "எஸ்எம்எஸ் அனுப்ப தொலைபேசி எண் இல்லை.", bn: "এসএমএস পাঠানোর জন্য কোন ফোন নম্বর উপলব্ধ নেই।", mr: "एसएमएस पाठवण्यासाठी कोणताही फोन नंबर उपलब्ध नाही.", gu: "એસએમએસ મોકલવા માટે કોઈ ફોન નંબર ઉપલબ્ધ નથી.", zh: "没有可用的电话号码可以发送短信。", ja: "SMSを送信するための電話番号がありません。",es: "No hay número de teléfono disponible para enviar SMS.", fr: "Aucun numéro de téléphone disponible pour envoyer des SMS.", de: "Keine Telefonnummer zum Senden von SMS verfügbar.", ru: "Нет доступного номера телефона для отправки SMS.", pt: "Nenhum número de telefone disponível para enviar SMS.", ko: "SMS를 보낼 수 있는 전화번호가 없습니다."  },
      sms_body_template: {
        te: "మీ ట్రాక్టర్ పని వివరాలు:\nతేదీ: {date}\nపేరు: {name}\nఫోన్: {phone}\n{hourlyDetails}\n{tripDetails}\nమొత్తం: {totalEarnings}\nనోట్: {noteContent}\nచెల్లింపు స్థితి: {paymentStatus}",
        en: "Your Tractor Work Details:\nDate: {date}\nName: {name}\nPhone: {phone}\n{hourlyDetails}\n{tripDetails}\nTotal Amount: {totalEarnings}\nNote: {noteContent}\nPayment Status: {paymentStatus}",
        hi: "आपके ट्रैक्टर के काम का विवरण:\nदिनांक: {date}\nनाम: {name}\nफ़ोन: {phone}\n{hourlyDetails}\n{tripDetails}\nकुल राशि: {totalEarnings}\nनोट: {noteContent}\nभुगतान की स्थिति: {paymentStatus}",
        ar: "تفاصيل عمل جرارك:\nالتاريخ: {date}\nالاسم: {name}\nالهاتف: {phone}\n{hourlyDetails}\n{tripDetails}\nالمبلغ الإجمالي: {totalEarnings}\nملاحظة: {noteContent}\nحالة الدفع: {paymentStatus}",
        ml: "നിങ്ങളുടെ ട്രാക്ടർ ജോലിയുടെ വിശദാംശങ്ങൾ:\nതീയതി: {date}\nപേര്: {name}\nഫോൺ: {phone}\n{hourlyDetails}\n{tripDetails}\nആകെ തുക: {totalEarnings}\nകുറിപ്പ്: {noteContent}\nപേയ്‌മെന്റ് നില: {paymentStatus}",
        kn: "ನಿಮ್ಮ ಟ್ರ್ಯಾಕ್ಟರ್ ಕೆಲಸದ ವಿವರಗಳು:\nದಿನಾಂಕ: {date}\nಹೆಸರು: {name}\nದೂರವಾಣಿ: {phone}\n{hourlyDetails}\n{tripDetails}\nಒಟ್ಟು ಮೊತ್ತ: {totalEarnings}\nಟಿಪ್ಪಣಿ: {noteContent}\nಪಾವತಿ ಸ್ಥಿತಿ: {paymentStatus}",
        ta: "உங்கள் டிராக்டர் வேலை விவரங்கள்:\nதேதி: {date}\nபெயர்: {name}\nதொலைபேசி: {phone}\n{hourlyDetails}\n{tripDetails}\nமொத்த தொகை: {totalEarnings}\nகுறிப்பு: {noteContent}\nபணம் செலுத்தும் நிலை: {paymentStatus}",
        bn: "আপনার ট্র্যাক্টর কাজের বিবরণ:\nতারিখ: {date}\nনাম: {name}\nফোন: {phone}\n{hourlyDetails}\n{tripDetails}\nমোট পরিমাণ: {totalEarnings}\nনোট: {noteContent}\nপেমেন্টের অবস্থা: {paymentStatus}",
        mr: "तुमच्या ट्रॅक्टर कामाचा तपशील:\nतारीख: {date}\nनाव: {name}\nफोन: {phone}\n{hourlyDetails}\n{tripDetails}\nएकूण रक्कम: {totalEarnings}\nटीप: {noteContent}\nपेमेंटची स्थिती: {paymentStatus}",
        gu: "તમારા ટ્રેક્ટરના કામની વિગતો:\nતારીખ: {date}\nનામ: {name}\nફોન: {phone}\n{hourlyDetails}\n{tripDetails}\nકુલ રકમ: {totalEarnings}\nનોંધ: {noteContent}\nચુકવણીની સ્થિતિ: {paymentStatus}",
        zh: "您的拖拉机工作详情：\n日期：{date}\n姓名：{name}\n电话：{phone}\n{hourlyDetails}\n{tripDetails}\n总金额：{totalEarnings}\n备注：{noteContent}\n付款状态：{paymentStatus}",
        ja: "トラクター作業の詳細：\n日付：{date}\n名前：{name}\n電話：{phone}\n{hourlyDetails}\n{tripDetails}\n合計金額：{totalEarnings}\nメモ：{noteContent}\n支払い状況：{paymentStatus}",
         es: "Detalles de su trabajo de tractor:\nFecha: {date}\nNombre: {name}\nTeléfono: {phone}\n{hourlyDetails}\n{tripDetails}\nMonto total: {totalEarnings}\nNota: {noteContent}\nEstado del pago: {paymentStatus}",
        fr: "Détails de votre travail de tracteur :\nDate : {date}\nNom : {name}\nTéléphone : {phone}\n{hourlyDetails}\n{tripDetails}\nMontant total : {totalEarnings}\nNote : {noteContent}\nStatut du paiement : {paymentStatus}",
        de: "Ihre Traktor-Arbeitsdetails:\nDatum: {date}\nName: {name}\nTelefon: {phone}\n{hourlyDetails}\n{tripDetails}\nGesamtbetrag: {totalEarnings}\nHinweis: {noteContent}\nZahlungsstatus: {paymentStatus}",
        ru: "Детали вашей работы на тракторе:\nДата: {date}\nИмя: {name}\nТелефон: {phone}\n{hourlyDetails}\n{tripDetails}\nИтоговая сумма: {totalEarnings}\nПримечание: {noteContent}\nСтатус оплаты: {paymentStatus}",
        pt: "Detalhes do seu trabalho de trator:\nData: {date}\nNome: {name}\nTelefone: {phone}\n{hourlyDetails}\n{tripDetails}\nValor total: {totalEarnings}\nNota: {noteContent}\nStatus do pagamento: {paymentStatus}",
        ko: "트랙터 작업 세부 정보:\n날짜: {date}\n이름: {name}\n전화: {phone}\n{hourlyDetails}\n{tripDetails}\n총액: {totalEarnings}\n메모: {noteContent}\n결제 상태: {paymentStatus}"
      },
      sms_hourly_template: {
        te: "పని సమయం: {startTime} - {endTime} ({duration})\nగంటకు రేటు: ₹{rate} / hr\nగంటల ఆదాయం: ₹{earnings}",
        en: "Work Time: {startTime} - {endTime} ({duration})\nRate per Hour: ₹{rate} / hr\nHourly Earnings: ₹{earnings}",
        hi: "कार्य समय: {startTime} - {endTime} ({duration})\nप्रति घंटा दर: ₹{rate} / घंटा\nघंटे की कमाई: ₹{earnings}",
        ar: "وقت العمل: {startTime} - {endTime} ({duration})\nالمعدل لكل ساعة: ₹{rate} / ساعة\nالأرباح بالساعة: ₹{earnings}",
        ml: "ജോലി സമയം: {startTime} - {endTime} ({duration})\nമണിക്കൂറിന് നിരക്ക്: ₹{rate} / മണിക്കൂർ\nമണിക്കൂർ വരുമാനം: ₹{earnings}",
        kn: "ಕೆಲಸದ ಸಮಯ: {startTime} - {endTime} ({duration})\nಪ್ರತಿ ಗಂಟೆಗೆ ದರ: ₹{rate} / ಗಂಟೆ\nಗಂಟೆಯ ಗಳಿಕೆ: ₹{earnings}",
        ta: "வேலை நேரம்: {startTime} - {endTime} ({duration})\nமணிக்கு விகிதம்: ₹{rate} / மணி\nமணிநேர வருவாய்: ₹{earnings}",
        bn: "কাজের সময়: {startTime} - {endTime} ({duration})\nপ্রতি ঘন্টা হার: ₹{rate} / ঘন্টা\nঘন্টার আয়: ₹{earnings}",
        mr: "कामाची वेळ: {startTime} - {endTime} ({duration})\nप्रति तास दर: ₹{rate} / तास\nतासाभराची कमाई: ₹{earnings}",
        gu: "કામનો સમય: {startTime} - {endTime} ({duration})\nકલાક દીઠ દર: ₹{rate} / કલાક\nકલાકની કમાણી: ₹{earnings}",
        zh: "工作时间：{startTime} - {endTime} ({duration})\n每小时费率：₹{rate} / 小时\n每小时收入：₹{earnings}",
        ja: "作業時間：{startTime} - {endTime} ({duration})\n時給：₹{rate} / 時\n時給：₹{earnings}",
         es: "Tiempo de trabajo: {startTime} - {endTime} ({duration})\nTarifa por hora: €{rate} / hr\nGanancias por hora: €{earnings}",
        fr: "Temps de travail : {startTime} - {endTime} ({duration})\nTaux horaire : {rate}€ / h\nGains horaires : {earnings}€",
        de: "Arbeitszeit: {startTime} - {endTime} ({duration})\nStundensatz: {rate}€ / Std\nStundenverdienst: {earnings}€",
        ru: "Рабочее время: {startTime} - {endTime} ({duration})\nСтавка в час: {rate}₽ / час\nПочасовой заработок: {earnings}₽",
        pt: "Tempo de trabalho: {startTime} - {endTime} ({duration})\nTaxa por hora: R${rate} / h\nGanhos por hora: R${earnings}",
        ko: "작업 시간: {startTime} - {endTime} ({duration})\n시간당 요금: ₩{rate} / 시간\n시간당 수입: ₩{earnings}"
      },
      sms_trip_template: {
        te: "ట్రిప్పులు: {trips} ({tripsDisplay})\nఒక ట్రిప్‌కు ధర: ₹{costPerTrip}\nట్రిప్ ఆదాయం: ₹{earnings}",
        en: "Trips: {trips} ({tripsDisplay})\nCost per Trip: ₹{costPerTrip}\nTrip Earnings: ₹{earnings}",
        hi: "ट्रिप: {trips} ({tripsDisplay})\nप्रति ट्रिप लागत: ₹{costPerTrip}\nट्रिप की कमाई: ₹{earnings}",
        ar: "الرحلات: {trips} ({tripsDisplay})\nالتكلفة لكل رحلة: ₹{costPerTrip}\nأرباح الرحلة: ₹{earnings}",
        ml: "ട്രിപ്പുകൾ: {trips} ({tripsDisplay})\nഒരു ട്രിപ്പിന് ചെലവ്: ₹{costPerTrip}\nട്രിപ്പ് വരുമാനം: ₹{earnings}",
        kn: "ಪ್ರಯಾಣಗಳು: {trips} ({tripsDisplay})\nಪ್ರತಿ ಪ್ರಯಾಣಕ್ಕೆ ವೆಚ್ಚ: ₹{costPerTrip}\nಪ್ರಯಾಣದ ಗಳಿಕೆ: ₹{earnings}",
        ta: "பயணங்கள்: {trips} ({tripsDisplay})\nஒரு பயணத்திற்கான செலவு: ₹{costPerTrip}\nபயண வருவாய்: ₹{earnings}",
        bn: "ট্রিপ: {trips} ({tripsDisplay})\nট্রিপ প্রতি খরচ: ₹{costPerTrip}\nট্রিপের আয়: ₹{earnings}",
        mr: "ट्रिप: {trips} ({tripsDisplay})\nप्रति ट्रिप खर्च: ₹{costPerTrip}\nट्रिपची कमाई: ₹{earnings}",
        gu: "ટ્રિપ્સ: {trips} ({tripsDisplay})\nટ્રીપ દીઠ ખર્ચ: ₹{costPerTrip}\nટ્રિપની કમાણી: ₹{earnings}",
        zh: "行程：{trips} ({tripsDisplay})\n每次行程费用：₹{costPerTrip}\n行程收入：₹{earnings}",
        ja: "旅行：{trips} ({tripsDisplay})\n旅行あたりの費用：₹{costPerTrip}\n旅行収益：₹{earnings}",
         es: "Viajes: {trips} ({tripsDisplay})\nCosto por viaje: €{costPerTrip}\nGanancias del viaje: €{earnings}",
        fr: "Voyages : {trips} ({tripsDisplay})\nCoût par voyage : {costPerTrip}€\nGains du voyage : {earnings}€",
        de: "Fahrten: {trips} ({tripsDisplay})\nKosten pro Fahrt: {costPerTrip}€\nFahrteinnahmen: {earnings}€",
        ru: "Поездки: {trips} ({tripsDisplay})\nСтоимость поездки: {costPerTrip}₽\nДоход от поездки: {earnings}₽",
        pt: "Viagens: {trips} ({tripsDisplay})\nCusto por viagem: R${costPerTrip}\nGanhos da viagem: R${earnings}",
        ko: "여행: {trips} ({tripsDisplay})\n여행당 비용: ₩{costPerTrip}\n여행 수입: ₩{earnings}"
      },
      footer_text: {
        te: "© {year} మన ట్రాక్టర్. అన్ని హక్కులు ప్రత్యేకించబడ్డాయి.",
        en: "© {year} ManaTractor. All rights reserved.",
        hi: "© {year} मन ट्रैक्टर। सर्वाधिकार सुरक्षित।",
        ar: "© {year} مانا تراكتور. كل الحقوق محفوظة.",
        ml: "© {year} മന ട്രാക്ടർ. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.",
        kn: "© {year} ಮನ ಟ್ರ್ಯಾಕ್ಟರ್. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
        ta: "© {year} மன டிராக்டர். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
        bn: "© {year} মানা ট্র্যাক্টর। সর্বস্বত্ব সংরক্ষিত।",
        mr: "© {year} मना ट्रॅक्टर. सर्व हक्क राखीव.",
        gu: "© {year} મન ટ્રેક્ટર. સર્વાધિકાર સુરક્ષિત.",
        zh: "© {year} ManaTractor。保留所有权利。",
        ja: "© {year} ManaTractor. 無断複写・転載を禁じます。",
        es: "© {year} ManaTractor. Todos los derechos reservados.",
        fr: "© {year} ManaTractor. Tous droits réservés.",
        de: "© {year} ManaTractor. Alle Rechte vorbehalten.",
        ru: "© {year} ManaTractor. Все права защищены.",
        pt: "© {year} ManaTractor. Todos os direitos reservados.",
        ko: "© {year} ManaTractor. 모든 권리 보유."
      },
      // Bottom Navigation
      nav_dashboard_button_title: { te: "హోమ్", en: "Home", hi: "होम", ar: "الرئيسية", ml: "ഹോം", kn: "ಮುಖಪುಟ", ta: "முகப்பு", bn: "হোম", mr: "मुख्यपृष्ठ", gu: "ઘર", zh: "首页", ja: "ホーム",es: "Inicio", fr: "Accueil", de: "Start", ru: "Главная",  ko: "홈" },
      nav_gps_button_title: { te: "GPS", en: "GPS", hi: "जीपीएस", ar: "GPS", ml: "ജിപിഎസ്", kn: "ಜಿಪಿಎಸ್", ta: "ஜிபிஎஸ்", bn: "জিপিএস", mr: "जीपीएस", gu: "જીપીએસ", zh: "GPS", ja: "GPS",es: "GPS", fr: "GPS", de: "GPS", ru: "GPS", pt: "GPS", ko: "GPS" },
      nav_logs_button_title: { te: "లాగ్‌లు", en: "Logs", hi: "लॉग", ar: "السجلات", ml: "ലോഗുകൾ", kn: "ಲಾಗ್‌ಗಳು", ta: "பதிவுகள்", bn: "লগ", mr: "लॉग", gu: "લોગ્સ", zh: "日志", ja: "ログ",es: "Registros", fr: "Journaux", de: "Protokolle", ru: "Журналы", pt: "Registros", ko: "로그"  },
      nav_leaderboard_button_title: { te: "బోర్డ్", en: "Board", hi: "बोर्ड", ar: "لوحة", ml: "ബോർഡ്", kn: "ಬೋರ್ಡ್", ta: "பலகை", bn: "বোর্ড", mr: "बोर्ड", gu: "બોર્ડ", zh: "板", ja: "ボード",es: "Clasif.", fr: "Classe.", de: "Liste", ru: "Доска", pt: "Quadro",  ko: "보드" },
      nav_monthly_button_title: { te: "నెలవారీ", en: "Monthly", hi: "मासिक", ar: "شهريا", ml: "പ്രതിമാസം", kn: "ಮಾಸಿಕ", ta: "மாதாந்திர", bn: "মাসিক", mr: "मासिक", gu: "માસિક", zh: "每月", ja: "毎月",es: "Mensual", fr: "Mensuel", de: "Monatl.", ru: "Месяц", pt: "Mensal", ko: "월간"  }
    };



    // --- Helper Functions ---

    // Function to translate a given key based on the current language
    function T(key) {
      return translations[key]?.[currentLang] || key; // Fallback to key if translation not found
    }

    // Function to display messages to the user
    function showMessage(message, type = 'success') {
      const messageBox = document.getElementById('messageBox');
      messageBox.textContent = message;
      messageBox.className = `message-box show ${type}`; 

      setTimeout(() => {
        messageBox.classList.remove('show');
      }, 3000); 
    }

    // Function to sanitize user input to prevent XSS
    function sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    // Helper function to convert 24-hour time (HH:MM) to 12-hour format (HH:MM AM/PM)
    function formatTime12Hour(timeString) {
      if (!timeString) return '';
      const [hours, minutes] = timeString.split(':').map(Number);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      let formattedHours = hours % 12;
      if (formattedHours === 0) {
          formattedHours = 12; // Handle midnight (00:xx) and noon (12:xx)
      }
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }

    // Function to format numbers with commas
    function formatNumberWithCommas(number) {
        if (number === null || number === undefined) return '0';
        let num = number;
        if (typeof num === 'string') {
            num = parseFloat(num.replace(/[₹,]/g, ''));
        }
        if (isNaN(num)) {
            return '0';
        }
        // Handle decimals for trips, but round for currency
        if (Number.isInteger(num)) {
            return num.toLocaleString('en-US');
        } else if (String(num).includes('.')) { // A bit of a check to see if it's meant to be a decimal
             // Check if it's a trip value by checking context, otherwise round it
            return Math.round(num).toLocaleString('en-US');
        }
        return Math.round(num).toLocaleString('en-US');
    }

    // --- TIME CLOCK LOGIC ---
    let startTimeInterval = null;
    let isStartTimeLocked = false;
    let endTimeInterval = null;
    let isEndTimeLocked = false;
    let isStopped = false;
    let stopStartTime = null;
    let totalStoppedMinutes = 0;

    const lockIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" /></svg>`;
    const unlockIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2V7a5 5 0 00-5-5zm-2 5V7a3 3 0 116 0v2H8z" /></svg>`;

    // Start Time Clock
    function updateStartTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        document.getElementById('startTime').value = `${hours}:${minutes}`;
    }

    function startStartTimeClock() {
        if (startTimeInterval) clearInterval(startTimeInterval);
        if (!isStartTimeLocked) {
            updateStartTime();
            startTimeInterval = setInterval(updateStartTime, 1000);
        }
    }

    function stopStartTimeClock() {
        if (startTimeInterval) clearInterval(startTimeInterval);
    }

    function toggleStartTimeLock() {
        isStartTimeLocked = !isStartTimeLocked;
        const lockButton = document.getElementById('startTimeLockBtn');
        if (isStartTimeLocked) { // Paused
            stopStartTimeClock();
            const lockedTime = document.getElementById('startTime').value;
            localStorage.setItem('startTimeLocked', 'true');
            localStorage.setItem('lockedStartTime', lockedTime);
            updateNoteStartTime(lockedTime); // Update note with locked time
            lockButton.innerHTML = unlockIconSVG;
            lockButton.title = 'Unlock Timer';
            lockButton.classList.remove('text-green-600');
            lockButton.classList.add('text-red-500');
            startGpsTracking(); // <-- INTEGRATION: Start GPS tracking
        } else { // Resumed
            localStorage.removeItem('startTimeLocked');
            localStorage.removeItem('lockedStartTime');
            startStartTimeClock();
            lockButton.innerHTML = lockIconSVG;
            lockButton.title = 'Lock Timer';
            lockButton.classList.remove('text-red-500');
            lockButton.classList.add('text-green-600');
            // Note: We don't stop GPS tracking here. It stops on 'Calculate'.
        }
    }

    // End Time Clock
    function updateEndTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        document.getElementById('endTime').value = `${hours}:${minutes}`;
    }

    function startEndTimeClock() {
        if (endTimeInterval) clearInterval(endTimeInterval);
        if (!isEndTimeLocked && !isStopped) {
            updateEndTime();
            endTimeInterval = setInterval(updateEndTime, 1000); 
        }
    }

    function stopEndTimeClock() {
        if (endTimeInterval) clearInterval(endTimeInterval);
    }
    
    function appendToNote(text) {
        const noteContent = document.getElementById('noteContent');
        const existingText = noteContent.value.trim();
        const newText = existingText ? `${existingText}\n${text}` : text;
        noteContent.value = newText;
    }

    function toggleEndTimeLock() {
        isEndTimeLocked = !isEndTimeLocked;
        const lockButton = document.getElementById('endTimeLockBtn');
        const now = new Date();

        if (isEndTimeLocked) {
            // --- STOP ---
            isStopped = true;
            stopEndTimeClock();
            stopStartTime = now;
            lockButton.innerHTML = unlockIconSVG;
            lockButton.title = 'Resume Timer';
            lockButton.classList.remove('text-green-600');
            lockButton.classList.add('text-red-500');
            appendToNote(`Stopped at ${formatTime12Hour(document.getElementById('endTime').value)}.`);
        } else {
            // --- RESUME ---
            isStopped = false;
            if (stopStartTime) {
                const stopDurationMillis = now.getTime() - stopStartTime.getTime();
                totalStoppedMinutes += (stopDurationMillis / (1000 * 60));
                stopStartTime = null;
            }
            startEndTimeClock();
            lockButton.innerHTML = lockIconSVG;
            lockButton.title = 'Stop Timer';
            lockButton.classList.remove('text-red-500');
            lockButton.classList.add('text-green-600');
            appendToNote(`Resumed at ${formatTime12Hour(document.getElementById('endTime').value)}.`);
        }
    }
    // --- END OF TIME CLOCK LOGIC ---
    
    // --- SPEECH RECOGNITION ---
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
            const transcript = event.results[0][0].transcript.replace(/\.$/, ''); // Remove trailing period
            const targetElement = document.getElementById(currentSpeechTargetId);

            if (!targetElement) return;

            // For number fields, try to clean the transcript
            if (targetElement.type === 'number' || targetElement.type === 'tel') {
                const numbers = transcript.replace(/[^0-9.]/g, ''); // Allow decimal point
                targetElement.value = numbers;
            } else if(targetElement.tagName.toLowerCase() === 'textarea') {
                // Append to existing content for textarea
                targetElement.value += (targetElement.value.length > 0 ? ' ' : '') + transcript;
            } else {
                 // Replace content for other inputs
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
        
            const langMap = { 'te': 'te-IN', 'en': 'en-US', 'hi': 'hi-IN', 'ar': 'ar-SA', 'ml': 'ml-IN', 'kn': 'kn-IN', 'ta': 'ta-IN', 'bn': 'bn-IN', 'mr': 'mr-IN', 'gu': 'gu-IN', 'zh': 'zh-CN', 'ja': 'ja-JP','es': 'es-ES', 'fr': 'fr-FR', 'de': 'de-DE', 'ru': 'ru-RU', 'pt': 'pt-PT', 'ko': 'ko-KR' };
        recognition.lang = langMap[currentLang] || 'en-US';
        
        recognition.start();
    }


    // --- Autocomplete Logic ---
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
    // --- End of Autocomplete Logic ---
    
    // --- GPS TRACKER LOGIC ---
    let map = null;
    let tractorMarker = null;
    let pathPolyline = null;
    let watchId = null;
    let totalDistance = 0;
    let lastPosition = null;

    function initMap() {
        if (map) return; // Already initialized

        map = L.map('map').setView([17.3850, 78.4867], 18); // Default to Hyderabad, high zoom

        L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
            maxZoom: 22,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: 'Map data &copy; Google'
        }).addTo(map);

        // Custom Tractor Icon
        const tractorIcon = L.icon({
            iconUrl: 'https://img.icons8.com/color/48/tractor.png',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
        });

        tractorMarker = L.marker([0, 0], { icon: tractorIcon }).addTo(map);
        pathPolyline = L.polyline([], { color: 'red', weight: 4 }).addTo(map);
    }

    function startGpsTracking() {
        if (!navigator.geolocation) {
            showMessage("Geolocation is not supported by your browser.", "error");
            return;
        }

        totalDistance = 0;
        lastPosition = null;
        mapScreenshot = null;
        document.getElementById('distance-display').textContent = '0.00 km';
        if(pathPolyline) pathPolyline.setLatLngs([]);
        
        showGpsTracker(); // Show the map view

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        watchId = navigator.geolocation.watchPosition(updateMapPosition, handleGpsError, options);
    }
    
    function stopGpsTracking() {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
            showMessage("GPS tracking stopped.", "success");
            
            // Capture screenshot
            const mapContainer = document.getElementById('map-container');
            if (mapContainer) {
                html2canvas(mapContainer, { useCORS: true }).then(canvas => {
                    mapScreenshot = canvas.toDataURL('image/jpeg', 0.8);
                    hideGpsTracker(); // Hide after taking screenshot
                }).catch(err => {
                    console.error("Screenshot failed:", err);
                    mapScreenshot = null;
                    hideGpsTracker();
                });
            } else {
                 hideGpsTracker();
            }
        }
    }


    function updateMapPosition(position) {
        const { latitude, longitude } = position.coords;
        const latLng = [latitude, longitude];

        if (!tractorMarker) {
            initMap();
        }

        map.setView(latLng, map.getZoom());
        tractorMarker.setLatLng(latLng);
        pathPolyline.addLatLng(latLng);

        if (lastPosition) {
            totalDistance += calculateDistance(lastPosition.latitude, lastPosition.longitude, latitude, longitude);
            document.getElementById('distance-display').textContent = `${totalDistance.toFixed(2)} km`;
        }
        lastPosition = { latitude, longitude };
    }
    
    function handleGpsError(error) {
        console.warn(`GPS ERROR(${error.code}): ${error.message}`);
        showMessage(T('gps_error'), 'error');
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }

    function showGpsTracker() {
        document.getElementById('gpsTrackerModal').classList.remove('hidden');
        updateActiveNavButton('navGpsBtn'); // Highlight GPS button
        initMap();
        setTimeout(() => { map.invalidateSize() }, 100); // Important for resizing
        if (document.getElementById('hamburgerSidebar').classList.contains('show')) {
          toggleHamburgerMenu();
        }
    }
    
    function hideGpsTracker() {
        document.getElementById('gpsTrackerModal').classList.add('hidden');
        // Find which section is currently visible and highlight its button
        const sections = ['dashboardSection', 'logsSection', 'leaderboardSection', 'monthlyDashboardSection'];
        const visibleSection = sections.find(id => !document.getElementById(id).classList.contains('hidden'));
        showSection(visibleSection || 'dashboardSection'); // Resets the nav button correctly
    }

    // --- END OF GPS TRACKER LOGIC ---

    // --- Core UI Logic Functions ---

    // Function to save the user's name from the contenteditable span
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

    // Function to set the current language and update all UI text
    function setLanguage(langCode) {
      currentLang = langCode;
      localStorage.setItem('manatractorLang', langCode); // Save preference

      document.getElementById('languageSelectorMenu').value = langCode;
      
      const user = window.auth.currentUser;
      const userName = (user ? user.displayName : null) || localStorage.getItem('manatractorDashboardUserName') || 'User';
      document.getElementById('welcomeHeading').innerHTML = T('welcome_heading').replace('{userName}', userName);

      // Update static text elements and placeholders
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
      
      // Update button titles and text
      document.getElementById('calculateBtn').title = T('calculate_button_title');
      document.getElementById('calculateBtnText').textContent = T('calculate_button_title');
      document.getElementById('saveBtn').title = T('save_button_title');
      document.getElementById('saveBtnText').textContent = T('save_button_title');
      
      // Hamburger menu button text
      document.getElementById('logoutBtnText').textContent = T('logout_button_title');
      
      // Bottom nav button text
      document.getElementById('navDashboardBtnText').textContent = T('nav_dashboard_button_title');
      document.getElementById('navGpsBtnText').textContent = T('nav_gps_button_title');
      document.getElementById('navLogsBtnText').textContent = T('nav_logs_button_title');
      document.getElementById('navLeaderboardBtnText').textContent = T('nav_leaderboard_button_title');
      document.getElementById('navMonthlyBtnText').textContent = T('nav_monthly_button_title');

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

      // Re-render dynamic content
      if (!document.getElementById('logsSection').classList.contains('hidden')) loadLogs();
      if (!document.getElementById('leaderboardSection').classList.contains('hidden')) generateLeaderboard();
      if (!document.getElementById('monthlyDashboardSection').classList.contains('hidden')) { populateMonthSelector(); renderMonthlyDashboard(); }
      if (!document.getElementById('customerLogsSection').classList.contains('hidden')) {
        const heading = document.getElementById('customerLogsHeading');
        const customerName = heading.getAttribute('data-customer-name');
        const customerPhone = heading.getAttribute('data-customer-phone');
        if (customerName && customerPhone) showCustomerLogs(customerName, customerPhone);
      }
      
      startTypingAnimation(); // Restart typing animation with new language
    }
    
    // Typing Animation for Placeholders
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
        typingInterval = setInterval(changePlaceholder, 5000); // Change text every 5 seconds
    }

    function updateActiveNavButton(activeButtonId) {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        const activeButton = document.getElementById(activeButtonId);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }


    // Function to show/hide sections
    function showSection(sectionId) {
        stopSpeech(); // Stop any speech when changing views
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

        // Update active nav button
        let activeNavId = '';
        switch(sectionId) {
            case 'dashboardSection':
                activeNavId = 'navDashboardBtn';
                break;
            case 'logsSection':
                activeNavId = 'navLogsBtn';
                break;
            case 'leaderboardSection':
            case 'customerLogsSection': // Also highlight leaderboard when viewing customer logs
                activeNavId = 'navLeaderboardBtn';
                break;
            case 'monthlyDashboardSection':
                activeNavId = 'navMonthlyBtn';
                break;
            // GPS has a modal, not a section, so it's handled differently.
        }
        updateActiveNavButton(activeNavId);
    }

    function showDashboardView() {
      showSection('dashboardSection');
      document.getElementById('userName').value = '';
      document.getElementById('userPhoneNumber').value = '';
      setCurrentDateAndStartTime();
      
      // Reset End Time Lock and Stop State
      isEndTimeLocked = false;
      isStopped = false;
      stopStartTime = null;
      totalStoppedMinutes = 0;
      mapScreenshot = null; // Clear screenshot on new view
      const endLockBtn = document.getElementById('endTimeLockBtn');
      if (endLockBtn) {
          endLockBtn.innerHTML = lockIconSVG;
          endLockBtn.title = 'Stop Timer';
          endLockBtn.classList.add('text-green-600');
          endLockBtn.classList.remove('text-red-500');
      }
      startEndTimeClock();

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

    // --- MONTHLY DASHBOARD FUNCTIONS ---
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
                totalTrips += parseFloat(record.trip.numberOfTrips) || 0;
            }
        });

        totalAmountEl.textContent = `₹${formatNumberWithCommas(totalAmount)}`;
        totalHoursEl.textContent = formatMinutesToDurationString(totalMinutes);
        totalTripsEl.textContent = totalTrips;
    }
    // --- END MONTHLY DASHBOARD FUNCTIONS ---

    // Function to set current date and start time
    function setCurrentDateAndStartTime() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        document.getElementById('workDate').value = formattedDate;
        
        if (!isStartTimeLocked) {
          startStartTimeClock();
        }
        
        // Reset and set initial note
        document.getElementById('noteContent').value = '';
        setTimeout(() => {
          const initialStartTime = document.getElementById('startTime').value;
          updateNoteStartTime(initialStartTime);
        }, 100);
    }

    // Combined calculation function
    function calculateAllEarnings() {
      stopGpsTracking(); // <-- INTEGRATION: Stop GPS and take screenshot
      const start = document.getElementById('startTime').value;
      const end = document.getElementById('endTime').value;
      const rate = parseFloat(document.getElementById('ratePerHour').value);

      let hourlyEarnings = 0;
      let hourlyCalculationSuccessful = false;

      if (start && end && !isNaN(rate) && rate >= 0) {
        const startMinutes = new Date(`1970-01-01T${start}`).getTime() / 60000;
        let endMinutes = new Date(`1970-01-01T${end}`).getTime() / 60000;
        if (endMinutes < startMinutes) endMinutes += 24 * 60;
        
        // Deduct stopped time
        const durationMinutes = endMinutes - startMinutes - totalStoppedMinutes;

        if (durationMinutes >= 0) {
            const hours = Math.floor(durationMinutes / 60);
            const minutes = Math.floor(durationMinutes % 60);
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

      const numberOfTrips = parseFloat(document.getElementById('numberOfTrips').value);
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
        speakText(talkbackText, 'combinedTotalEarnings'); // Speak and highlight the total
      }
    }

    // Function to save combined data
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
      
      // Append final "Ended at" message before saving
      const finalEndTime = isStopped ? formatTime12Hour(document.getElementById('endTime').value) : formatTime12Hour(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit'}));
      appendToNote(`Ended at ${finalEndTime}.`);
      
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
        mapScreenshot: mapScreenshot, // <-- INTEGRATION: Save screenshot
        gpsDistance: totalDistance, // <-- INTEGRATION: Save distance
        hourly: isHourlyDataValid ? { start: document.getElementById('startTime').value, end: document.getElementById('endTime').value, rate: parseFloat(document.getElementById('ratePerHour').value), time: currentHourlyTime, earnings: currentHourlyEarnings } : null,
        trip: isTripDataValid ? { numberOfTrips: parseFloat(document.getElementById('numberOfTrips').value), costPerTrip: parseFloat(document.getElementById('costPerTrip').value), tripsDisplay: document.getElementById('tripTotalTrips').textContent, earnings: currentTripEarnings } : null
      };

      const existing = JSON.parse(localStorage.getItem('tractorRecords') || '[]');
      existing.push(record);
      localStorage.setItem('tractorRecords', JSON.stringify(existing));
      
      populateUniqueCustomers();

      showMessage(T('data_saved_success'), 'success');
      speakText(T('saved_talkback'));
      
      // Clear note content after saving
      localStorage.removeItem('manatractorLastNoteContent');
      mapScreenshot = null; // Clear screenshot data after save

      document.getElementById('ratePerHour').value = '2000';
      document.getElementById('numberOfTrips').value = '0';
      document.getElementById('costPerTrip').value = '500';
      showDashboardView(); 
    }

    // Function to update the "Work started at" line in the note
    function updateNoteStartTime(newTime) {
        const noteContent = document.getElementById('noteContent');
        let lines = noteContent.value.split('\n');
        const newStartTimeLine = `Work started at ${formatTime12Hour(newTime)}`;
        let found = false;
        
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('Work started at')) {
                lines[i] = newStartTimeLine;
                found = true;
                break;
            }
        }
        
        if (!found) {
            // If not found, add to the beginning of the note
            lines.unshift(newStartTimeLine);
        }

        noteContent.value = lines.filter(line => line.trim() !== '').join('\n');
    }
    
    // Function to clear note content
    function clearNoteContent() {
        const noteContent = document.getElementById('noteContent');
        noteContent.value = '';
        // Also need to reset the automatic "Work started at" message
        const initialStartTime = document.getElementById('startTime').value;
        updateNoteStartTime(initialStartTime);
    }

    // Function to filter logs by date and search term
    function filterLogs() {
        const searchTerm = document.getElementById('logSearchInput').value.toLowerCase();
        let allRecords = JSON.parse(localStorage.getItem('tractorRecords') || '[]');
        
        // Apply search term filter
        if (searchTerm) {
             allRecords = allRecords.filter(record => 
                record.userName.toLowerCase().includes(searchTerm) || 
                (record.userPhoneNumber && record.userPhoneNumber.includes(searchTerm))
            );
        }
        
        renderLogs(allRecords);
    }
    
    function getLogDateHeader(dateString, lang) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const parts = dateString.split('-').map(Number);
        const recordDate = new Date(parts[0], parts[1] - 1, parts[2]);
        recordDate.setHours(0, 0, 0, 0);

        if (recordDate.getTime() === today.getTime()) {
            return T('today_saved');
        }
        if (recordDate.getTime() === yesterday.getTime()) {
            return T('yesterday_saved');
        }
        
        const formattedDate = recordDate.toLocaleDateString(lang, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        return T('date_saved_format').replace('{date}', formattedDate);
    }

    // Function to render logs
    function renderLogs(recordsToDisplay) {
      const logsContainer = document.getElementById('logsContainer');
      logsContainer.innerHTML = '';

      if (recordsToDisplay.length === 0) {
        logsContainer.innerHTML = `<p class="text-center text-gray-500">${T('no_logs_saved')}</p>`;
        return;
      }
      
      recordsToDisplay.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      let lastHeaderDate = null;

      recordsToDisplay.forEach(record => {
        const recordDateStr = record.date;
        
        if (recordDateStr !== lastHeaderDate) {
            const headerText = getLogDateHeader(recordDateStr, currentLang);
            const headerDiv = document.createElement('div');
            headerDiv.className = 'text-center text-sm font-semibold text-green-800 py-2 my-2 bg-green-100 rounded-lg sticky top-0 z-10';
            headerDiv.textContent = headerText;
            logsContainer.appendChild(headerDiv);
            lastHeaderDate = recordDateStr;
        }

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
        
        // <-- INTEGRATION: Add screenshot display -->
        let screenshotHtml = '';
        if (record.mapScreenshot) {
            screenshotHtml = `
                <div class="mt-3 pt-3 border-t border-gray-100">
                    <h4 class="font-semibold text-gray-700 mb-2">${T('path_proof')} (${record.gpsDistance.toFixed(2)} km)</h4>
                    <img src="${record.mapScreenshot}" alt="Map of path taken" class="rounded-lg border border-gray-300 w-full" />
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
          ${screenshotHtml}
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
    
    // Function to generate the leaderboard
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

    // Function to show logs for a specific customer
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

    // Function to render customer-specific logs
    function renderCustomerLogs(recordsToDisplay) {
        const logsContainer = document.getElementById('customerLogsContainer');
        logsContainer.innerHTML = '';

        if (recordsToDisplay.length === 0) {
            logsContainer.innerHTML = `<p class="text-center text-gray-500">${T('no_logs_saved')}</p>`;
            return;
        }
      
        recordsToDisplay.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        let lastHeaderDate = null;

        recordsToDisplay.forEach(record => {
            const recordDateStr = record.date;
        
            if (recordDateStr !== lastHeaderDate) {
                const headerText = getLogDateHeader(recordDateStr, currentLang);
                const headerDiv = document.createElement('div');
                headerDiv.className = 'text-center text-sm font-semibold text-green-800 py-2 my-2 bg-green-100 rounded-lg sticky top-0 z-10';
                headerDiv.textContent = headerText;
                logsContainer.appendChild(headerDiv);
                lastHeaderDate = recordDateStr;
            }
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
            
            let screenshotHtml = '';
            if (record.mapScreenshot) {
                screenshotHtml = `
                    <div class="mt-3 pt-3 border-t border-gray-100">
                        <h4 class="font-semibold text-gray-700 mb-2">${T('path_proof')} (${record.gpsDistance.toFixed(2)} km)</h4>
                        <img src="${record.mapScreenshot}" alt="Map of path taken" class="rounded-lg border border-gray-300 w-full" />
                    </div>
                `;
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
                ${screenshotHtml}
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

    // Hamburger menu toggle
    function toggleHamburgerMenu() {
        document.getElementById('hamburgerSidebar').classList.toggle('show');
        document.getElementById('hamburgerOverlay').classList.toggle('show');
    }

    // Update payment status
    function updatePaymentStatus(timestamp, newStatus) {
        const allRecords = JSON.parse(localStorage.getItem('tractorRecords') || '[]');
        const recordIndex = allRecords.findIndex(record => record.timestamp === timestamp);
        if (recordIndex > -1) {
            allRecords[recordIndex].paymentStatus = newStatus;
            localStorage.setItem('tractorRecords', JSON.stringify(allRecords));
            
            // Re-render the correct view if it's open
            if (!document.getElementById('logsSection').classList.contains('hidden')) {
                filterLogs(); // Re-filters and re-renders the main log view
            }
            if (!document.getElementById('customerLogsSection').classList.contains('hidden')) {
                const heading = document.getElementById('customerLogsHeading');
                const customerName = heading.getAttribute('data-customer-name');
                const customerPhone = heading.getAttribute('data-customer-phone');
                if (customerName && customerPhone) {
                    showCustomerLogs(customerName, customerPhone); // Re-renders the customer log view
                }
            }

            showMessage(`${T(newStatus + '_status')} status updated!`, 'success');
        } else {
            showMessage('Error: Log record not found.', 'error');
        }
    }

    // Phone call functions
    function callPhoneNumber() {
      const phoneNumber = document.getElementById('userPhoneNumber').value.trim();
      if (phoneNumber) window.location.href = `tel:${phoneNumber}`;
      else showMessage(T('call_error'), 'error');
    }
    function callLoggedNumber(phoneNumber) {
      if (phoneNumber && phoneNumber.trim() !== '') window.location.href = `tel:${phoneNumber}`;
      else showMessage(T('call_error'), 'error');
    }
    
    // Contact picker
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

    // Get log text for SMS/Download
    function getLogTextContent(record) {
        if (!record) return '';
        let hourlySms = record.hourly ? T('sms_hourly_template').replace('{startTime}', formatTime12Hour(record.hourly.start)).replace('{endTime}', formatTime12Hour(record.hourly.end)).replace('{duration}', record.hourly.time).replace('{rate}', formatNumberWithCommas(record.hourly.rate)).replace('{earnings}', formatNumberWithCommas(record.hourly.earnings)) : '';
        let tripSms = record.trip ? T('sms_trip_template').replace('{trips}', record.trip.numberOfTrips).replace('{tripsDisplay}', record.trip.tripsDisplay).replace('{costPerTrip}', formatNumberWithCommas(record.trip.costPerTrip)).replace('{earnings}', formatNumberWithCommas(record.trip.earnings)) : '';
        return T('sms_body_template').replace('{date}', record.date).replace('{name}', record.userName).replace('{phone}', record.userPhoneNumber).replace('{hourlyDetails}\n{tripDetails}', [hourlySms, tripSms].filter(Boolean).join('\n')).replace('{totalEarnings}', `₹${formatNumberWithCommas(record.combinedTotalEarnings)}`).replace('{noteContent}', record.noteContent || 'N/A').replace('{paymentStatus}', T(record.paymentStatus + '_status')).replace(/\n\n+/g, '\n');
    }

    // Send SMS
    function sendLogViaSms(timestamp) {
        const record = JSON.parse(localStorage.getItem('tractorRecords') || '[]').find(rec => rec.timestamp === timestamp);
        if (!record) return showMessage('Error: Log not found.', 'error');
        if (!record.userPhoneNumber) return showMessage(T('sms_send_error'), 'error');
        window.location.href = `sms:${record.userPhoneNumber}?body=${encodeURIComponent(getLogTextContent(record))}`;
    }

    // Send WhatsApp
    function sendLogViaWhatsApp(timestamp) {
        const record = JSON.parse(localStorage.getItem('tractorRecords') || '[]').find(rec => rec.timestamp === timestamp);
        if (!record) return showMessage('Error: Log not found.', 'error');
        if (!record.userPhoneNumber) return showMessage(T('sms_send_error'), 'error'); // Using same error message for now
        const message = getLogTextContent(record);
        const phoneNumber = record.userPhoneNumber.replace(/[^0-9]/g, ''); // Clean phone number
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    // Download log
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

    // --- SPEECH SYNTHESIS (TALK-BACK) ---
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
          const langMap = { 'te': 'te-IN', 'en': 'en-US', 'hi': 'hi-IN', 'ar': 'ar-SA', 'ml': 'ml-IN', 'kn': 'kn-IN', 'ta': 'ta-IN', 'bn': 'bn-IN', 'mr': 'mr-IN', 'gu': 'gu-IN', 'zh': 'zh-CN', 'ja': 'ja-JP','es': 'es-ES', 'fr': 'fr-FR', 'de': 'de-DE', 'ru': 'ru-RU', 'pt': 'pt-PT', 'ko': 'ko-KR' };
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
    
    // NEW: Helper function for formatting time for Telugu speech
    function formatTimeForTeluguSpeech(timeString) {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':').map(Number);
        
        const period = hours >= 12 ? 'మధ్యాహ్నం' : 'ఉదయం'; // "madhyahnam" for PM, "udhayam" for AM
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
        
        stopSpeech(); // Stop any previous speech
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
              const langMap = { 'te': 'te-IN', 'en': 'en-US', 'hi': 'hi-IN', 'ar': 'ar-SA', 'ml': 'ml-IN', 'kn': 'kn-IN', 'ta': 'ta-IN', 'bn': 'bn-IN', 'mr': 'mr-IN', 'gu': 'gu-IN', 'zh': 'zh-CN', 'ja': 'ja-JP','es': 'es-ES', 'fr': 'fr-FR', 'de': 'de-DE', 'ru': 'ru-RU', 'pt': 'pt-PT', 'ko': 'ko-KR' };
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

    // Make functions globally accessible
    window.signInWithGoogle = signInWithGoogle;
    window.signUpWithEmail = signUpWithEmail;
    window.signInWithEmail = signInWithEmail;
    window.toggleAuthView = toggleAuthView;
    window.logout = logout;
    window.saveUserName = saveUserName;
    window.setLanguage = setLanguage;
    window.selectInitialLanguage = selectInitialLanguage;
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
    window.toggleStartTimeLock = toggleStartTimeLock;
    window.toggleEndTimeLock = toggleEndTimeLock;
    window.showGpsTracker = showGpsTracker;
    window.hideGpsTracker = hideGpsTracker;
    window.clearNoteContent = clearNoteContent;


 // Initial load:
    document.addEventListener('DOMContentLoaded', function() {
      currentLang = localStorage.getItem('manatractorLang') || 'te';
      setLanguage(currentLang);
      checkAuthState(); // This function now handles the entire view logic on startup

      // Initialize Start Time state from localStorage
      const savedLockState = localStorage.getItem('startTimeLocked');
      const lockButton = document.getElementById('startTimeLockBtn');
      if (savedLockState === 'true') {
          isStartTimeLocked = true;
          const savedTime = localStorage.getItem('lockedStartTime');
          document.getElementById('startTime').value = savedTime || '';
          stopStartTimeClock();
          if (lockButton) {
              lockButton.innerHTML = unlockIconSVG;
              lockButton.title = 'Unlock Timer';
              lockButton.classList.remove('text-green-600');
              lockButton.classList.add('text-red-500');
          }
      } else {
          isStartTimeLocked = false;
          startStartTimeClock(); // Start clock if not locked
          if (lockButton) {
              lockButton.innerHTML = lockIconSVG;
              lockButton.title = 'Lock Timer';
              lockButton.classList.add('text-green-600');
              lockButton.classList.remove('text-red-500');
          }
      }
      
      // Set current date
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      document.getElementById('workDate').value = `${year}-${month}-${day}`;

      const endTimeLockBtn = document.getElementById('endTimeLockBtn');
      if (endTimeLockBtn) {
          endTimeLockBtn.innerHTML = lockIconSVG;
          endTimeLockBtn.classList.add('text-green-600');
      }
      startEndTimeClock();

      populateUniqueCustomers();
      setupAutocomplete();
      
      // Stop speech synthesis when navigating away
      window.addEventListener('beforeunload', stopSpeech);

       
      // --- PWA SETUP ---
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
          const CACHE_NAME = 'manatractor-cache-v3'; // increment cache version
          const urlsToCache = [
              '/',
              'https://cdn.tailwindcss.com',
              'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
              'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
              'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
              'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js',
              'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js',
              'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js',
              'https://img.icons8.com/color/192/tractor.png',
              'https://img.icons8.com/color/512/tractor.png',
              'https://img.icons8.com/color/48/tractor.png',
              'https://img.icons8.com/ios-filled/50/ffffff/save.png',
              'https://img.icons8.com/ios-filled/50/ffffff/trophy.png',
              'https://img.icons8.com/ios-filled/50/ffffff/financial-analytics.png'
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