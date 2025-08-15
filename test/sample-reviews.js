require("dotenv").config();
const mongoose = require("mongoose");
const Review = require("../models/reviews");
const User = require("../models/users");
const Product = require("../models/products");

// Sample reviews data with detailed reviews
const sampleReviews = [
  // MSI Model 100 Reviews (P100)
  {
    title: "Perfect for Software Development",
    content:
      "As a full-stack developer, I needed something that could handle multiple IDEs, Docker containers, and Chrome with 20+ tabs. The i5-13420H and 16GB DDR5 RAM combo is fantastic for my workflow. Code compilation is noticeably faster than my old laptop. The keyboard is comfortable for long coding sessions, and the numeric keypad is a nice touch. Only complaint is that the fans can get a bit noisy during intensive tasks, but the performance makes up for it.",
    rating: 4,
    isVerified: true,
    isHelpful: 15,
    isNotHelpful: 2,
    tags: ["verified purchase", "developer"],
    productId: "P100",
  },
  {
    title: "Game-changer for CAD Work",
    content:
      "This laptop has been a game-changer for my CAD work. AutoCAD and Revit run smoothly, and the 100% sRGB display is perfect for accurate color representation in my architectural renderings. The Gen4 SSD makes loading large project files super quick. At 1.78kg, it's light enough to carry to university daily. Battery easily lasts through my 6-hour class schedule. Excellent value for a student budget!",
    rating: 5,
    isVerified: true,
    isHelpful: 22,
    isNotHelpful: 1,
    tags: ["verified purchase", "student"],
    productId: "P100",
  },
  {
    title: "Surprised by Design Performance",
    content:
      "Coming from a MacBook, I was skeptical about switching to Windows for design work. The Model 100 surprised me! Photoshop and Illustrator run beautifully, and the color accuracy is spot-on for client work. The dual-fan cooling keeps it cool even during marathon design sessions. My only gripe is that the webcam quality could be better for client video calls, but the AI noise cancellation works well. Overall, great bang for buck.",
    rating: 4,
    isVerified: true,
    isHelpful: 18,
    isNotHelpful: 3,
    tags: ["verified purchase", "designer"],
    productId: "P100",
  },
  {
    title: "Perfect for Business Use",
    content:
      "Perfect laptop for business use. Handles PowerPoint presentations, Excel with large datasets, and video calls simultaneously without breaking a sweat. The fast charging is a lifesaver during back-to-back meetings - 60% charge in an hour is exactly what I needed. The professional look fits well in corporate environments, and colleagues always ask about the specs. Wi-Fi 6 connectivity is reliable even in crowded office networks.",
    rating: 5,
    isVerified: true,
    isHelpful: 25,
    isNotHelpful: 1,
    tags: ["verified purchase", "business user"],
    productId: "P100",
  },
  {
    title: "Great for Content Creation",
    content:
      "I create YouTube videos and Instagram content, and this laptop handles my workflow really well. DaVinci Resolve works smoothly for 1080p editing, and the display colors are vibrant for content review. The backlit keyboard is helpful during late-night editing sessions. Storage fills up quickly with video files, but the Gen4 SSD makes file transfers lightning fast. Wish it had a better webcam for vlogs, but the dual-array mics are surprisingly good.",
    rating: 4,
    isVerified: true,
    isHelpful: 20,
    isNotHelpful: 2,
    tags: ["verified purchase", "content creator"],
    productId: "P100",
  },
  {
    title: "Excellent for Research Work",
    content:
      "As a PhD student in data science, I run Python scripts, Jupyter notebooks, and statistical software daily. The 8-core processor handles my machine learning models efficiently, and the 16GB RAM means I can keep multiple applications open. The ethernet port is crucial for stable connections during online conferences. Battery life is impressive for such powerful specs - easily 7+ hours for research work. MSI Creator Center helps optimize performance based on my tasks.",
    rating: 5,
    isVerified: true,
    isHelpful: 28,
    isNotHelpful: 1,
    tags: ["verified purchase", "researcher"],
    productId: "P100",
  },
  {
    title: "Practical for Professional Work",
    content:
      "Switched from a gaming laptop to this for professional work, and it's much more practical. SketchUp and 3ds Max run well for my interior visualization projects. The IPS display with anti-glare coating reduces eye strain during long design sessions. Love that it doesn't look like a gaming laptop - fits perfectly in client meetings. The thermal management is excellent; never gets uncomfortably hot. Would have liked Thunderbolt support, but USB-C with DisplayPort works fine.",
    rating: 4,
    isVerified: true,
    isHelpful: 16,
    isNotHelpful: 2,
    tags: ["verified purchase", "interior designer"],
    productId: "P100",
  },
  {
    title: "Solid for Financial Analysis",
    content:
      "Crunching numbers all day requires a reliable machine, and the Model 100 delivers. Excel with complex financial models, Bloomberg terminal, and multiple browser tabs run seamlessly. The numeric keypad is essential for my work, and the tactile keyboard feels premium. Fast boot times mean I'm productive immediately. Battery comfortably lasts my work day, and fast charging is convenient. Only minor issue is occasional coil whine under heavy load, but performance is solid.",
    rating: 4,
    isVerified: true,
    isHelpful: 19,
    isNotHelpful: 3,
    tags: ["verified purchase", "finance analyst"],
    productId: "P100",
  },
  {
    title: "Perfect for Photography",
    content:
      "Perfect laptop for photography workflow! Lightroom and Photoshop performance is excellent, and the color-accurate display makes photo editing a joy. RAW file processing is quick thanks to the Gen4 SSD and DDR5 RAM. The build quality feels premium, and I appreciate the subtle design - not too flashy for university. Connectivity options are great for external monitors and storage devices. This laptop has definitely boosted my productivity and creativity.",
    rating: 5,
    isVerified: true,
    isHelpful: 24,
    isNotHelpful: 1,
    tags: ["verified purchase", "photographer"],
    productId: "P100",
  },
  {
    title: "Great for Small Business",
    content:
      "Running a small manufacturing business means juggling accounting software, CAD programs, and lots of documentation. This laptop handles everything I throw at it. The dual-channel RAM makes multitasking smooth, and the reliable build quality gives me confidence for daily business use. HDMI 2.1 is perfect for presentations to clients. The professional appearance and solid performance make it ideal for business meetings. Great investment for productivity-focused users like myself.",
    rating: 4,
    isVerified: true,
    isHelpful: 17,
    isNotHelpful: 2,
    tags: ["verified purchase", "business owner"],
    productId: "P100",
  },
  // Acer Model 101 Reviews (P101)
  {
    title: "Perfect for Engineering Studies",
    content:
      "Perfect laptop for my engineering studies! The i3-1215U handles all my coursework including basic CAD software and programming. Battery life is incredible - easily lasts through my 8-hour class schedule without needing to charge. At 1.45kg, it's so light that I barely notice it in my backpack. The BlueLightShield feature is great for late-night study sessions. Excellent value for a student budget!",
    rating: 5,
    isVerified: true,
    isHelpful: 21,
    isNotHelpful: 1,
    tags: ["verified purchase", "student"],
    productId: "P101",
  },
  {
    title: "Great for Remote Work",
    content:
      "Working from home requires a reliable machine, and the Model 101 delivers perfectly for my needs. Handles video calls, document editing, and web browsing simultaneously without any lag. The 10-hour battery life means I can work from cafes or co-working spaces without worrying about charging. The matte finish is practical - no fingerprints! Only wish it had more storage, but the 256GB SSD is fast enough for my files.",
    rating: 4,
    isVerified: true,
    isHelpful: 18,
    isNotHelpful: 2,
    tags: ["verified purchase", "remote worker"],
    productId: "P101",
  },
  {
    title: "Excellent for Teaching",
    content:
      "Bought this for creating lesson plans and conducting online classes. The webcam and microphone quality are surprisingly good for virtual teaching. Students can hear me clearly, and the display is crisp for sharing presentations. The ComfyView technology really helps during long grading sessions - much less eye strain. Fast charging is a lifesaver between classes. Highly recommend for educators!",
    rating: 5,
    isVerified: true,
    isHelpful: 25,
    isNotHelpful: 1,
    tags: ["verified purchase", "teacher"],
    productId: "P101",
  },
  {
    title: "Perfect for Freelance Writing",
    content:
      "As someone who writes articles and blogs full-time, I needed something portable and efficient. The chiclet keyboard is comfortable for long typing sessions, and the precision touchpad is responsive. Battery easily lasts my entire work day, and the quiet operation means I can work in libraries or cafes. The 14-inch screen is perfect - not too small, not too bulky. Great laptop for content creators on a budget.",
    rating: 4,
    isVerified: true,
    isHelpful: 16,
    isNotHelpful: 2,
    tags: ["verified purchase", "writer"],
    productId: "P101",
  },
  {
    title: "Solid for Small Business",
    content:
      "Running a small retail business means constant juggling of inventory, accounts, and communication. This laptop handles my daily tasks smoothly - Excel spreadsheets, email, and video calls with suppliers work without issues. The build quality feels solid despite the plastic body, and the fast boot-up means I'm productive immediately. Wi-Fi 6 connectivity is reliable even in crowded commercial areas. Good investment for business use.",
    rating: 4,
    isVerified: true,
    isHelpful: 19,
    isNotHelpful: 3,
    tags: ["verified purchase", "business owner"],
    productId: "P101",
  },
  {
    title: "Adequate for Design Students",
    content:
      "For basic design coursework, this laptop is adequate but has limitations. Adobe Creative Suite runs but can be slow with larger files. The color accuracy is decent for a budget laptop, though not professional-grade. Battery life is excellent for campus use, and the lightweight design is perfect for carrying between studios. It's good enough for learning, but I'll need to upgrade for professional work later.",
    rating: 3,
    isVerified: true,
    isHelpful: 12,
    isNotHelpful: 5,
    tags: ["verified purchase", "student"],
    productId: "P101",
  },
  {
    title: "Perfect for Data Entry",
    content:
      "Perfect for my work requirements! The numeric keypad absence isn't an issue since the main keyboard is comfortable for extended data entry. Multiple browser tabs and office applications run smoothly with the 8GB RAM. The fast SSD makes file access quick, which is important when handling large databases. Excellent value for money - does exactly what I need without unnecessary features.",
    rating: 5,
    isVerified: true,
    isHelpful: 22,
    isNotHelpful: 1,
    tags: ["verified purchase", "data entry"],
    productId: "P101",
  },
  {
    title: "Great for Family Use",
    content:
      "Wanted a simple laptop for family use - online shopping, video calls with relatives, and managing household accounts. The Model 101 is perfect! Easy to use, fast startup, and the kids love it for their homework and online classes. The webcam works great for family video calls, and the battery lasts all day. The lightweight design means I can easily move it around the house. Very satisfied with this purchase.",
    rating: 5,
    isVerified: true,
    isHelpful: 28,
    isNotHelpful: 1,
    tags: ["verified purchase", "family user"],
    productId: "P101",
  },
  {
    title: "Good for Accounting Work",
    content:
      "Handles all my accounting software and Excel work perfectly. The 12th gen i3 processor is more than sufficient for financial calculations and report generation. Love the fast charging feature - can quickly top up between client meetings. The matte finish hides fingerprints well, maintaining a professional look. HDMI port is useful for presentations to clients. Only minor complaint is that 256GB storage fills up quickly with client files.",
    rating: 4,
    isVerified: true,
    isHelpful: 17,
    isNotHelpful: 2,
    tags: ["verified purchase", "accountant"],
    productId: "P101",
  },
  {
    title: "Perfect for Online Tutoring",
    content:
      "This laptop has been perfect for my online tutoring business. Crystal clear video calls, smooth screen sharing during lessons, and the battery easily handles 6-7 hours of continuous teaching. The BlueLightShield feature is excellent for reducing eye strain during long teaching sessions. Students appreciate the clear audio quality. The compact size fits perfectly in my small home office setup. Couldn't ask for better value at this price point!",
    rating: 5,
    isVerified: true,
    isHelpful: 24,
    isNotHelpful: 1,
    tags: ["verified purchase", "tutor"],
    productId: "P101",
  },
  // Lenovo Model 102 Reviews (P102)
  {
    title: "Perfect Daily Workhorse",
    content:
      "This is my daily workhorse. Compact, secure, and super reliable. The fingerprint sensor and privacy shutter are very reassuring for work. It runs multiple browser tabs, Slack, Zoom, and Figma without breaking a sweat. The battery life is phenomenal—I charge once in the morning and forget about it.",
    rating: 5,
    isVerified: true,
    isHelpful: 26,
    isNotHelpful: 1,
    tags: ["verified purchase", "startup founder"],
    productId: "P102",
  },
  {
    title: "Great for Corporate Training",
    content:
      "Lightweight and powerful enough to run Zoom, PowerPoint, and Excel during back-to-back sessions. Audio clarity is good, and the keyboard feels premium. Slight heating after long hours but nothing major.",
    rating: 4,
    isVerified: true,
    isHelpful: 19,
    isNotHelpful: 3,
    tags: ["verified purchase", "corporate trainer"],
    productId: "P102",
  },
  {
    title: "Excellent for IT Consulting",
    content:
      "Boots in seconds, handles virtual machines and Office apps simultaneously. Love the fingerprint sensor and TPM security features—very enterprise ready. It's my go-to for client meetings.",
    rating: 5,
    isVerified: true,
    isHelpful: 23,
    isNotHelpful: 1,
    tags: ["verified purchase", "IT consultant"],
    productId: "P102",
  },
  {
    title: "Perfect Student Laptop",
    content:
      "Perfect student laptop! It's light enough to carry everywhere, the display is easy on the eyes, and the battery lasts all day. I use it for research, video calls, and note-taking.",
    rating: 5,
    isVerified: true,
    isHelpful: 27,
    isNotHelpful: 1,
    tags: ["verified purchase", "student"],
    productId: "P102",
  },
  {
    title: "Solid for UI/UX Design",
    content:
      "Figma, Chrome, and Slack work smoothly together. The display is crisp, and the build quality is excellent. Only thing I miss is an SD card reader, but otherwise it's solid.",
    rating: 4,
    isVerified: true,
    isHelpful: 20,
    isNotHelpful: 2,
    tags: ["verified purchase", "designer"],
    productId: "P102",
  },
  {
    title: "Excellent for Data Analysis",
    content:
      "I use Excel, Tableau Public, and Outlook daily—no lags. Battery easily gives 10+ hours. Dolby Audio is decent for work calls, and the mic pickup is very clear. Highly dependable.",
    rating: 5,
    isVerified: true,
    isHelpful: 24,
    isNotHelpful: 1,
    tags: ["verified purchase", "data analyst"],
    productId: "P102",
  },
  {
    title: "Reliable for Banking",
    content:
      "Reliable for banking software, document handling, and secure VPN. Lenovo Vantage keeps everything up to date. Compact form factor is ideal for travel between branches.",
    rating: 4,
    isVerified: true,
    isHelpful: 18,
    isNotHelpful: 2,
    tags: ["verified purchase", "bank manager"],
    productId: "P102",
  },
  {
    title: "Perfect for Digital Marketing",
    content:
      "Handles Canva, Chrome with 15 tabs, and Google Meet at once. Battery life is exceptional. I love the premium look and feel—great for client presentations.",
    rating: 5,
    isVerified: true,
    isHelpful: 25,
    isNotHelpful: 1,
    tags: ["verified purchase", "digital marketer"],
    productId: "P102",
  },
  {
    title: "Great for Legal Work",
    content:
      "Snappy and secure for casework, document reviews, and long typing sessions. Keyboard is one of the best I've used. HDMI and USB-C ports are a huge plus.",
    rating: 4,
    isVerified: true,
    isHelpful: 17,
    isNotHelpful: 3,
    tags: ["verified purchase", "legal associate"],
    productId: "P102",
  },
  {
    title: "Excellent for Teaching",
    content:
      "Great for online classes—webcam and mic quality are excellent. I charge it once in the morning, and it runs till evening with Teams and browser open. Highly recommended for teachers.",
    rating: 5,
    isVerified: true,
    isHelpful: 29,
    isNotHelpful: 1,
    tags: ["verified purchase", "teacher"],
    productId: "P102",
  },
  // Dell Model 103 Reviews (P103)
  {
    title: "Perfect for Accounting",
    content:
      "Perfect laptop for my accounting firm work. The i5-1135G7 handles Tally, Excel with large datasets, and multiple PDF files without any slowdown. The numeric keypad is essential for my number-heavy work, and the anti-glare display reduces eye strain during long audit sessions. Build quality is typical Dell - sturdy and reliable. The 8-9 hour battery life easily covers my workday. Only wish it was a bit lighter for client visits.",
    rating: 4,
    isVerified: true,
    isHelpful: 20,
    isNotHelpful: 2,
    tags: ["verified purchase", "accountant"],
    productId: "P103",
  },
  {
    title: "Excellent for HR Work",
    content:
      "Excellent choice for office productivity! The 12GB RAM handles HR software, video interviews, and document management simultaneously. Love the privacy shutter on the webcam - essential for confidential HR discussions. The ExpressCharge feature is a lifesaver during busy recruitment days. Keyboard is comfortable for typing long employee reports. The matte finish hides fingerprints well, maintaining a professional look in meetings.",
    rating: 5,
    isVerified: true,
    isHelpful: 24,
    isNotHelpful: 1,
    tags: ["verified purchase", "HR executive"],
    productId: "P103",
  },
  {
    title: "Great for Small Business",
    content:
      "Running my textile business requires reliable computing, and the Dell 103 delivers. Inventory management software, supplier communications, and financial planning all run smoothly. The ethernet port is crucial for stable internet in my warehouse office. The 15.6-inch screen provides enough space for spreadsheet work. Build quality inspires confidence - feels like it can handle daily business use for years.",
    rating: 4,
    isVerified: true,
    isHelpful: 18,
    isNotHelpful: 3,
    tags: ["verified purchase", "business owner"],
    productId: "P103",
  },
  {
    title: "Ideal for Education",
    content:
      "Ideal laptop for education work! Creating lesson plans, managing student records, and conducting online classes work flawlessly. The anti-glare display is perfect for classroom use under bright lights. Students can hear me clearly during video lessons thanks to the noise-reducing microphones. The SD card reader is handy for transferring photos from school events. Battery easily lasts through my teaching day without needing to charge.",
    rating: 5,
    isVerified: true,
    isHelpful: 26,
    isNotHelpful: 1,
    tags: ["verified purchase", "teacher"],
    productId: "P103",
  },
  {
    title: "Solid for Sales",
    content:
      "Solid workhorse for sales activities. CRM software, presentation creation, and client video calls all run without issues. The HDMI port is essential for client presentations, and the display quality impresses customers. Appreciate the classic Dell reliability - never had any hardware issues in 8 months of use. The weight is noticeable when traveling, but the performance and battery life make up for it. Great value for business use.",
    rating: 4,
    isVerified: true,
    isHelpful: 19,
    isNotHelpful: 2,
    tags: ["verified purchase", "sales manager"],
    productId: "P103",
  },
  {
    title: "Great for Writing",
    content:
      "Perfect for my writing and content creation needs. Handles Google Docs with multiple tabs, research browsing, and light photo editing smoothly. The backlit keyboard is excellent for late-night writing sessions. ComfortView technology really helps during long editing marathons. The Intel Iris Xe graphics handle basic design work better than expected. Storage fills up quickly with client files, but the SSD speed makes everything responsive.",
    rating: 4,
    isVerified: true,
    isHelpful: 17,
    isNotHelpful: 3,
    tags: ["verified purchase", "writer"],
    productId: "P103",
  },
  {
    title: "Dependable for Operations",
    content:
      "Dependable laptop for managing manufacturing operations. ERP software, production planning tools, and supplier coordination all work seamlessly. The 12GB RAM prevents any slowdowns during busy production periods. Love the ethernet port for stable factory floor connectivity. Build quality is robust enough for the industrial environment. Dell's support software keeps everything running optimally. Exactly what I needed for operations management.",
    rating: 5,
    isVerified: true,
    isHelpful: 22,
    isNotHelpful: 1,
    tags: ["verified purchase", "operations manager"],
    productId: "P103",
  },
  {
    title: "Good for Engineering Studies",
    content:
      "Great laptop for engineering studies! AutoCAD Lite, MATLAB, and programming software run well on the i5 processor. The large 15.6-inch screen is perfect for technical drawings and code editing. Battery life easily covers my college day including labs and lectures. The numeric keypad helps with engineering calculations. It's a bit heavy for daily campus carrying, but the performance makes it worthwhile for technical coursework.",
    rating: 4,
    isVerified: true,
    isHelpful: 21,
    isNotHelpful: 2,
    tags: ["verified purchase", "student"],
    productId: "P103",
  },
  {
    title: "Perfect for Insurance",
    content:
      "Perfect for my insurance business needs. Policy management software, client presentations, and video consultations work flawlessly. The privacy shutter is important when discussing sensitive financial information. ExpressCharge is fantastic - can quickly charge between client meetings. The professional appearance builds client confidence. Waves audio makes phone calls crystal clear. This laptop has definitely improved my client service efficiency.",
    rating: 5,
    isVerified: true,
    isHelpful: 25,
    isNotHelpful: 1,
    tags: ["verified purchase", "insurance agent"],
    productId: "P103",
  },
  {
    title: "Efficient for Marketing",
    content:
      "Handles all my marketing tasks efficiently. Social media management, email campaigns, and presentation creation work smoothly with the 12GB RAM. The anti-glare display is great for long content creation sessions. Light photo editing works better than expected with Intel Iris Xe graphics. The SD card reader is useful for importing campaign photos. Build feels solid and professional. Would prefer it to be lighter, but the performance and reliability are excellent for marketing work.",
    rating: 4,
    isVerified: true,
    isHelpful: 18,
    isNotHelpful: 3,
    tags: ["verified purchase", "marketing coordinator"],
    productId: "P103",
  },
  // Asus Model 104 Reviews (P104)
  {
    title: "Perfect for Digital Marketing",
    content:
      "This laptop has been perfect for my marketing workflow. The i7-1360P handles social media management tools, video editing for campaigns, and multiple browser tabs effortlessly. The 100% sRGB display ensures my visual content looks accurate across platforms. MX550 GPU makes light video editing smooth in Premiere Pro. The ErgoLift hinge is surprisingly comfortable for long work sessions. Battery easily lasts my workday, and fast charging is incredibly convenient.",
    rating: 5,
    isVerified: true,
    isHelpful: 28,
    isNotHelpful: 1,
    tags: ["verified purchase", "digital marketer"],
    productId: "P104",
  },
  {
    title: "Great for Architecture Studies",
    content:
      "Great laptop for my architecture studies! AutoCAD, SketchUp, and Revit run well thanks to the dedicated MX550 graphics. The color-accurate display is essential for design presentations. At 1.75kg, it's light enough for daily campus carrying. The 1TB SSD provides ample space for large project files. Only minor complaint is that the fans can get audible during intensive 3D rendering, but performance is solid. Excellent value for creative coursework.",
    rating: 4,
    isVerified: true,
    isHelpful: 22,
    isNotHelpful: 3,
    tags: ["verified purchase", "student"],
    productId: "P104",
  },
  {
    title: "Perfect for Content Creation",
    content:
      "Perfect laptop for my YouTube channel! Video editing in DaVinci Resolve is smooth, and the MX550 handles 1080p rendering much better than integrated graphics. The Harman/Kardon speakers are surprisingly good for audio editing. Webcam with Windows Hello makes quick logins convenient during live streams. The NanoEdge display looks fantastic for content review. Battery life is excellent for on-location shoots. This laptop has boosted my productivity significantly.",
    rating: 5,
    isVerified: true,
    isHelpful: 30,
    isNotHelpful: 1,
    tags: ["verified purchase", "content creator"],
    productId: "P104",
  },
  {
    title: "Excellent for Graphic Design",
    content:
      "Coming from a desktop setup, I needed something portable without compromising design work quality. The Model 104 delivers beautifully! Adobe Creative Suite runs smoothly, and the 100% sRGB color accuracy is crucial for client work. The MX550 handles complex Illustrator files and light 3D work well. Love the slim bezels and premium aluminum build. Storage is generous for design assets. Only wish the screen was a bit brighter for outdoor work, but overall excellent.",
    rating: 4,
    isVerified: true,
    isHelpful: 25,
    isNotHelpful: 2,
    tags: ["verified purchase", "designer"],
    productId: "P104",
  },
  {
    title: "Solid for Business Analysis",
    content:
      "Solid laptop for data analysis and presentations. The i7 processor handles large Excel datasets and Power BI dashboards without lag. Multiple virtual machines run smoothly with 16GB RAM. The display quality makes data visualization work enjoyable. Fast charging is a lifesaver during client meetings. The professional aluminum design fits well in corporate environments. MyAsus software keeps everything optimized. Great balance of performance and portability for business use.",
    rating: 4,
    isVerified: true,
    isHelpful: 20,
    isNotHelpful: 3,
    tags: ["verified purchase", "business analyst"],
    productId: "P104",
  },
  {
    title: "Transformed Video Editing",
    content:
      "This laptop has transformed my video editing workflow! The MX550 GPU handles 1080p footage beautifully in Premiere Pro and After Effects. Color grading looks accurate on the sRGB display. The 12-core processor makes rendering much faster than my old laptop. 1TB storage is perfect for video projects. The cooling system keeps temperatures reasonable during long editing sessions. At this price point, it's unbeatable for video professionals.",
    rating: 5,
    isVerified: true,
    isHelpful: 32,
    isNotHelpful: 1,
    tags: ["verified purchase", "video editor"],
    productId: "P104",
  },
  {
    title: "Excellent Development Machine",
    content:
      "Excellent development machine! Multiple IDEs, Docker containers, and browsers run simultaneously without issues. The i7-1360P compiles code quickly, boosting my productivity. The large trackpad and backlit keyboard are comfortable for long coding sessions. Good port selection for external monitors and peripherals. Battery life is impressive for such powerful specs. The premium build quality gives confidence for daily professional use. Highly recommend for developers.",
    rating: 4,
    isVerified: true,
    isHelpful: 26,
    isNotHelpful: 2,
    tags: ["verified purchase", "developer"],
    productId: "P104",
  },
  {
    title: "Perfect for Photography",
    content:
      "Perfect laptop for photography coursework! Lightroom and Photoshop performance is excellent with the dedicated graphics. RAW file processing is noticeably faster than integrated graphics laptops. The color-accurate display is essential for photo editing - images look true to life. MicroSD card reader is convenient for camera imports. The slim design fits easily in my photography bag. This laptop has definitely improved my workflow and creativity.",
    rating: 5,
    isVerified: true,
    isHelpful: 29,
    isNotHelpful: 1,
    tags: ["verified purchase", "photographer"],
    productId: "P104",
  },
  {
    title: "Great for Marketing Work",
    content:
      "Great all-around laptop for marketing work. Handles presentation creation, campaign design, and video conferences seamlessly. The MX550 helps with light graphic design work for marketing materials. Display quality impresses clients during presentations. Fast charging means I'm never worried about battery during back-to-back meetings. The professional appearance and solid build quality reflect well in business settings. Excellent investment for marketing professionals.",
    rating: 4,
    isVerified: true,
    isHelpful: 23,
    isNotHelpful: 2,
    tags: ["verified purchase", "marketing manager"],
    productId: "P104",
  },
  {
    title: "Perfect for UI/UX Design",
    content:
      "This laptop is perfect for design work! Figma, Adobe XD, and Sketch run flawlessly. The color-accurate display ensures my designs look consistent across devices. The MX550 handles complex prototypes and animations smoothly. ErgoLift hinge reduces wrist strain during long design sessions. The premium aluminum build feels durable and professional. Battery life easily covers my workday. For designers needing portability without sacrificing performance, this is ideal.",
    rating: 5,
    isVerified: true,
    isHelpful: 27,
    isNotHelpful: 1,
    tags: ["verified purchase", "UI/UX designer"],
    productId: "P104",
  },
  // Mouse Reviews
  // Logitech MX200 Reviews (M001)
  {
    title: "Transformed My Design Workflow",
    content:
      "The Logitech MX200 has transformed my workflow as a graphic designer. Working on intricate designs in Illustrator has never been smoother, thanks to the 1600 DPI precision. The ergonomic design fits perfectly in my hand, reducing the wrist strain I often experienced with other mice, especially during long design marathons. Battery life is just as advertised—the convenience of not worrying about charging it often is a massive relief.",
    rating: 5,
    isVerified: true,
    isHelpful: 31,
    isNotHelpful: 2,
    tags: ["verified purchase", "designer"],
    productId: "M001",
  },
  {
    title: "Efficient for Financial Analysis",
    content:
      "As a financial analyst, the MX200 helps me navigate through extensive Excel files efficiently with its hyper-fast scrolling feature. The wireless setup keeps my desk clutter-free, and the battery, which has already lasted several months, shows no sign of slowing down. It's a reliable tool in a high-pressure work environment.",
    rating: 4,
    isVerified: true,
    isHelpful: 24,
    isNotHelpful: 3,
    tags: ["verified purchase", "financial analyst"],
    productId: "M001",
  },
  {
    title: "Perfect for Marketing",
    content:
      "Customizability is crucial in my line of work, and the MX200 delivers with its programmable buttons. Switching between marketing tools with ease saves significant amounts of time. The Logitech Options software is intuitive, making it simple to configure the mouse to my specific needs. I highly recommend it for anyone in marketing.",
    rating: 5,
    isVerified: true,
    isHelpful: 28,
    isNotHelpful: 1,
    tags: ["verified purchase", "marketing executive"],
    productId: "M001",
  },
  {
    title: "Excellent for IT Consulting",
    content:
      "Juggling multiple devices in my IT consultancy business is a breeze with the MX200's Logitech Flow feature. I can seamlessly control two computers without switching peripherals, which is a huge efficiency booster. The build quality feels premium, and it has been working flawlessly across both macOS and Windows.",
    rating: 5,
    isVerified: true,
    isHelpful: 26,
    isNotHelpful: 2,
    tags: ["verified purchase", "IT consultant"],
    productId: "M001",
  },
  {
    title: "Great for Students",
    content:
      "The MX200 is the perfect companion for my studies. It's lightweight, making it easy to carry around campus. The soft rubber grips are comfortable for extended use during lectures and all-night study sessions. The battery life is impressive—no need to worry about it dying during crucial moments.",
    rating: 4,
    isVerified: true,
    isHelpful: 22,
    isNotHelpful: 2,
    tags: ["verified purchase", "student"],
    productId: "M001",
  },
  {
    title: "Perfect for Development",
    content:
      "I often work across multiple monitors, and the MX200 enhances my productivity with its precise tracking and responsiveness. Developing software and debugging code requires accuracy, and this mouse delivers. The lightweight build ensures my hand doesn't tire after long coding sessions. Excellent choice for developers.",
    rating: 5,
    isVerified: true,
    isHelpful: 29,
    isNotHelpful: 1,
    tags: ["verified purchase", "developer"],
    productId: "M001",
  },
  {
    title: "Dependable for Writing",
    content:
      "Writing and editing content daily means I need a dependable mouse, and the MX200 has consistently delivered. No lag, excellent grip, and the quiet clicks help me maintain focus. The battery life is exactly what I hoped for—it lasts long enough to not disrupt my workflow.",
    rating: 4,
    isVerified: true,
    isHelpful: 20,
    isNotHelpful: 3,
    tags: ["verified purchase", "writer"],
    productId: "M001",
  },
  {
    title: "Good for Casual Gaming",
    content:
      "While the MX200 isn't marketed as a gaming mouse, I find it perfectly capable for casual gaming. The smooth tracking and responsive buttons handle my needs in games like CS:GO and Dota 2. For someone who mixes work with play, this is a balanced option.",
    rating: 4,
    isVerified: true,
    isHelpful: 18,
    isNotHelpful: 4,
    tags: ["verified purchase", "gamer"],
    productId: "M001",
  },
  {
    title: "Artist's Reliable Companion",
    content:
      "The precise optical sensor of the MX200 is a boon for my artwork. Whether it's digital painting or sketching, the accuracy is stellar. The ergonomic shape supports my hand well, preventing fatigue during hours of creation. It's an artist's reliable companion.",
    rating: 5,
    isVerified: true,
    isHelpful: 25,
    isNotHelpful: 1,
    tags: ["verified purchase", "artist"],
    productId: "M001",
  },
  {
    title: "Efficient for Project Management",
    content:
      "Managing multiple projects requires swift navigation between documents, emails, and apps, and the MX200's speed and reliability shine. The design fits well in a professional setting, and the battery-saving features ensure it's always ready for the day's challenges.",
    rating: 5,
    isVerified: true,
    isHelpful: 23,
    isNotHelpful: 2,
    tags: ["verified purchase", "project manager"],
    productId: "M001",
  },
  // HP Z3700 Reviews (M002)
  {
    title: "Perfect for Development Work",
    content:
      "The HP Z3700 is my daily driver for development work. Its portability and seamless tracking make it perfect for moving between my desktop and laptop. The battery has lasted an entire academic term without needing a change—excellent for my mobile lifestyle.",
    rating: 5,
    isVerified: true,
    isHelpful: 24,
    isNotHelpful: 2,
    tags: ["verified purchase", "developer"],
    productId: "M002",
  },
  {
    title: "Effective for Accounting Tasks",
    content:
      "In my day-to-day accounting tasks, the Z3700 serves its purpose effectively. The sleek, compact design is perfect for my cluttered desk, and it pairs well with my HP laptop. Battery longevity is a major plus—reduced maintenance means I can focus on work.",
    rating: 4,
    isVerified: true,
    isHelpful: 19,
    isNotHelpful: 3,
    tags: ["verified purchase", "accountant"],
    productId: "M002",
  },
  {
    title: "Ideal for Students on the Go",
    content:
      "For a student constantly on the go, the Z3700 is ideal. It fits snugly into my backpack pocket and performs well on various lecture hall desks. It's reliable and stylish, and the color choices allowed me to pick one that matched my personality.",
    rating: 4,
    isVerified: true,
    isHelpful: 21,
    isNotHelpful: 2,
    tags: ["verified purchase", "student"],
    productId: "M002",
  },
  {
    title: "Fantastic for Classroom Presentations",
    content:
      "I use the Z3700 in my classroom, and it's fantastic for presentations. Its portability is a key feature as I move from the staff room to different classrooms. The precision is great, and the subtle design complements professional settings beautifully.",
    rating: 5,
    isVerified: true,
    isHelpful: 26,
    isNotHelpful: 1,
    tags: ["verified purchase", "teacher"],
    productId: "M002",
  },
  {
    title: "Efficient for Office Management",
    content:
      "The Z3700 manages daily office tasks with ease. It's neat, efficient, and the battery life means less downtime fiddling with replacements. A great choice for a neat and tidy workstation.",
    rating: 4,
    isVerified: true,
    isHelpful: 18,
    isNotHelpful: 2,
    tags: ["verified purchase", "office manager"],
    productId: "M002",
  },
  {
    title: "Perfect Travel Companion for Photography",
    content:
      "Traveling for photoshoots, the Z3700 accompanies me everywhere. It's compact yet functional, and the precise sensor helps when editing photos on the go. The variety of colors adds a personal touch to my tech gear.",
    rating: 5,
    isVerified: true,
    isHelpful: 23,
    isNotHelpful: 1,
    tags: ["verified purchase", "photographer"],
    productId: "M002",
  },
  {
    title: "Handy for Light Graphic Work",
    content:
      "While it primarily serves as a personal device, it's handy for light graphic work. The Z3700's DPI is just right for Illustrator and Photoshop when I'm away from my studio setup. The design fits well with my minimalist office decor.",
    rating: 4,
    isVerified: true,
    isHelpful: 17,
    isNotHelpful: 3,
    tags: ["verified purchase", "designer"],
    productId: "M002",
  },
  {
    title: "Dependable for Journalism",
    content:
      "The Z3700 is dependable for work in different environments, whether I'm reporting from a café or the press room. It's simple, effective, and I appreciate that it's never let me down during live coverage.",
    rating: 4,
    isVerified: true,
    isHelpful: 20,
    isNotHelpful: 2,
    tags: ["verified purchase", "journalist"],
    productId: "M002",
  },
  {
    title: "Compact Solution for Engineers",
    content:
      "As an engineer on the move, I needed something compact that doesn't compromise on functionality. The Z3700 is it! The design is clean, battery life is impressive, and I've had no issues with tracking on any surface.",
    rating: 5,
    isVerified: true,
    isHelpful: 25,
    isNotHelpful: 1,
    tags: ["verified purchase", "engineer"],
    productId: "M002",
  },
  {
    title: "Perfect for HR Duties",
    content:
      "This mouse is perfect for HR duties throughout the office. The long battery life and plug-and-play setup make onboarding and training quick and efficient. Highly recommend it for office environments.",
    rating: 4,
    isVerified: true,
    isHelpful: 22,
    isNotHelpful: 2,
    tags: ["verified purchase", "HR specialist"],
    productId: "M002",
  },
  // Razer Basilisk X Reviews (M003)
  {
    title: "Excellent for Game Development",
    content:
      "Using the Razer Basilisk X for game development has been excellent. The low latency in HyperSpeed Wireless mode keeps up with my fast-paced workflow, and the flexibility to switch to Bluetooth helps conserve power when needed. It's a must-have for developers handling dual-purpose tasks.",
    rating: 5,
    isVerified: true,
    isHelpful: 28,
    isNotHelpful: 1,
    tags: ["verified purchase", "game developer"],
    productId: "M003",
  },
  {
    title: "High-Performing Gaming Mouse",
    content:
      "I've been gaming for years, and the Basilisk X stands out as a high-performing, versatile mouse. The DPI sensitivity is incredible for competitive play, and it's ergonomic for those long gaming marathons. Battery life tops it off as a best-in-class option.",
    rating: 5,
    isVerified: true,
    isHelpful: 32,
    isNotHelpful: 2,
    tags: ["verified purchase", "professional gamer"],
    productId: "M003",
  },
  {
    title: "Perfect for Gaming Students",
    content:
      "As an avid gamer and student, the Razer Basilisk X handles my transition from game time to study sessions perfectly. Its durability and dual connectivity modes make it highly adaptable. The battery life suits my busy, gaming-heavy schedule well.",
    rating: 4,
    isVerified: true,
    isHelpful: 24,
    isNotHelpful: 3,
    tags: ["verified purchase", "student"],
    productId: "M003",
  },
  {
    title: "Great Crossover Product",
    content:
      "I was initially hesitant about using a gaming mouse for work, but the Basilisk X has proved itself. Programmed buttons help manage multiple tasks, while the ergonomic design ensures comfort during long project planning sessions. Great crossover product!",
    rating: 4,
    isVerified: true,
    isHelpful: 21,
    isNotHelpful: 2,
    tags: ["verified purchase", "product manager"],
    productId: "M003",
  },
  {
    title: "Superb for Data Analysis",
    content:
      "Installed the Razer Basilisk X for my data work at home, and it has been a superb experience. HyperSpeed Wireless truly minimizes lag, even when I'm deep into data visualization tasks. Highly recommend it for anyone juggling data-heavy applications and games.",
    rating: 5,
    isVerified: true,
    isHelpful: 26,
    isNotHelpful: 1,
    tags: ["verified purchase", "data analyst"],
    productId: "M003",
  },
  {
    title: "Perfect for Writing and Editing",
    content:
      "Though primarily marketed for gaming, the Basilisk X serves my writing and editing needs perfectly with its precision and endurance. The programmable buttons also speed up repetitive tasks, which is a blessing during tight deadlines.",
    rating: 5,
    isVerified: true,
    isHelpful: 23,
    isNotHelpful: 2,
    tags: ["verified purchase", "writer"],
    productId: "M003",
  },
  {
    title: "Comfortable for Long Coding Sessions",
    content:
      "The design is comfortable for long coding sprints, and its performance in HyperSpeed mode eliminates latency issues. The Basilisk X is indeed a gamer's gem, but its reliability makes it indispensable for software development too.",
    rating: 4,
    isVerified: true,
    isHelpful: 25,
    isNotHelpful: 3,
    tags: ["verified purchase", "software engineer"],
    productId: "M003",
  },
  {
    title: "Unexpected Bonus for Design Work",
    content:
      "An unexpected bonus for design work—the precision and responsiveness are fantastic. Beyond gaming, it complements my daily tasks in design software. Well worth the investment for dual proficiency in artistic and gaming worlds.",
    rating: 5,
    isVerified: true,
    isHelpful: 27,
    isNotHelpful: 1,
    tags: ["verified purchase", "designer"],
    productId: "M003",
  },
  {
    title: "Efficient for Architectural Design",
    content:
      "Handles architectural design applications efficiently. The Basilisk X's smooth wireless operation keeps desktop clutter to a minimum, which is vital for design studios. It's fantastic for anyone who likes to pause work for some leisure gaming.",
    rating: 4,
    isVerified: true,
    isHelpful: 20,
    isNotHelpful: 2,
    tags: ["verified purchase", "architect"],
    productId: "M003",
  },
  {
    title: "Versatile for Freelancers",
    content:
      "A strong performer in both the professional and gaming arenas. The Razer Basilisk X gives me the flexibility needed to switch between my drawing apps and gaming sessions without missing a beat! Very pleased with its versatility.",
    rating: 5,
    isVerified: true,
    isHelpful: 29,
    isNotHelpful: 1,
    tags: ["verified purchase", "freelancer"],
    productId: "M003",
  },
  // Dell WM126 Reviews (M004)
  {
    title: "Reliable for IT Tasks",
    content:
      "The Dell WM126 is a no-frills, reliable mouse that suits all my technical needs perfectly. Affordably priced, it provides efficient performance for IT troubleshooting and day-to-day office tasks without any fuss.",
    rating: 4,
    isVerified: true,
    isHelpful: 22,
    isNotHelpful: 3,
    tags: ["verified purchase", "IT technician"],
    productId: "M004",
  },
  {
    title: "Staple Office Mouse",
    content:
      "This mouse is a staple in our office for good reasons—it's easy to set up and remarkably reliable. Its lightweight design and durable build make it ideal for a busy office vibe. The battery has also been very long-lasting.",
    rating: 5,
    isVerified: true,
    isHelpful: 28,
    isNotHelpful: 1,
    tags: ["verified purchase", "administrative assistant"],
    productId: "M004",
  },
  {
    title: "Perfect for Medical Work",
    content:
      "As a doctor, I'm constantly bouncing between patient files. The WM126 handles the basics without any issues, and the wireless aspect helps maintain hygiene standards by reducing cord clutter at my workstation.",
    rating: 4,
    isVerified: true,
    isHelpful: 24,
    isNotHelpful: 2,
    tags: ["verified purchase", "doctor"],
    productId: "M004",
  },
  {
    title: "Simple and Effective for Legal Work",
    content:
      "I prefer simplicity, and the Dell WM126 delivers that perfectly without any complexities. It's steady and has good tactile feedback, helping me manage extensive research and documentation work effectively.",
    rating: 4,
    isVerified: true,
    isHelpful: 19,
    isNotHelpful: 3,
    tags: ["verified purchase", "lawyer"],
    productId: "M004",
  },
  {
    title: "Compact and Effective for Recipe Management",
    content:
      "I handle a lot of recipe organization digitally, and the Dell WM126 is precisely what I needed—compact and effective. Amazing battery life means it works whenever required without needing constant attention.",
    rating: 5,
    isVerified: true,
    isHelpful: 25,
    isNotHelpful: 1,
    tags: ["verified purchase", "chef"],
    productId: "M004",
  },
  {
    title: "Reliable for Freelance Work",
    content:
      "As a freelancer, I need reliable equipment I'm not perpetually worried about. The WM126 is quietly efficient, performing consistently well across various tasks. A great and simple choice for anyone working remotely.",
    rating: 5,
    isVerified: true,
    isHelpful: 26,
    isNotHelpful: 1,
    tags: ["verified purchase", "freelancer"],
    productId: "M004",
  },
  {
    title: "Smooth Tracking for Research",
    content:
      "Smooth tracking makes data analysis at work straightforward. It's portable enough to carry and set up in different laboratory environments—an excellent choice for someone who occasionally changes workspaces.",
    rating: 4,
    isVerified: true,
    isHelpful: 21,
    isNotHelpful: 2,
    tags: ["verified purchase", "researcher"],
    productId: "M004",
  },
  {
    title: "Efficient for Pharmacy Work",
    content:
      "In a fast-paced pharmacy, the WM126 makes order management a lot easier. It's durable, simple to use, and battery replacement is almost never needed due to its efficiency. Double thumbs up from me.",
    rating: 5,
    isVerified: true,
    isHelpful: 27,
    isNotHelpful: 1,
    tags: ["verified purchase", "pharmacist"],
    productId: "M004",
  },
  {
    title: "Always in Travel Kit",
    content:
      "This mouse is always part of my travel kit. The compact size and wireless capability are perfect as I need to set up quickly across different locations. The performance is steady, even on slightly uneven surfaces.",
    rating: 4,
    isVerified: true,
    isHelpful: 23,
    isNotHelpful: 2,
    tags: ["verified purchase", "photographer"],
    productId: "M004",
  },
  {
    title: "Fantastic for Classroom Use",
    content:
      "Using this mouse in the classroom has been fantastic—it's lightweight and robust, and even kids find it easy to maneuver. The long-lasting battery life means it's always ready for lessons.",
    rating: 5,
    isVerified: true,
    isHelpful: 29,
    isNotHelpful: 1,
    tags: ["verified purchase", "teacher"],
    productId: "M004",
  },
  // Microsoft BT5600 Reviews (M005)
  {
    title: "Game-Changer for Consultancy",
    content:
      "The Bluetooth connectivity of the Microsoft BT5600 is a game-changer. Switching devices without hassle makes multi-tasking far smoother for my consultancy business. It's a compact gem in my tech toolkit.",
    rating: 5,
    isVerified: true,
    isHelpful: 30,
    isNotHelpful: 1,
    tags: ["verified purchase", "consultant"],
    productId: "M005",
  },
  {
    title: "Precise Tracking for Film Editing",
    content:
      "For editing frames, the BT5600 offers precise tracking. I've used it on different surfaces without issues, but prefer using it on a mouse pad for the best results. Compact, reliable, and exactly what I needed.",
    rating: 4,
    isVerified: true,
    isHelpful: 24,
    isNotHelpful: 3,
    tags: ["verified purchase", "film editor"],
    productId: "M005",
  },
  {
    title: "Perfect for Economic Analysis",
    content:
      "The ability to connect to different devices simultaneously is perfect for analysing large datasets. The Bluetooth performance is seamless and helps keep my workspace neat.",
    rating: 5,
    isVerified: true,
    isHelpful: 26,
    isNotHelpful: 1,
    tags: ["verified purchase", "economist"],
    productId: "M005",
  },
  {
    title: "Portable Tech for Entrepreneurs",
    content:
      "Traveling frequently means I need portable yet reliable tech, and the BT5600 fits that bill perfectly. It's compact, easy to carry, and functional on any device with Bluetooth.",
    rating: 4,
    isVerified: true,
    isHelpful: 22,
    isNotHelpful: 2,
    tags: ["verified purchase", "entrepreneur"],
    productId: "M005",
  },
  {
    title: "Consistent Precision for Data Science",
    content:
      "Daily data crunching requires precision, and the BT5600 delivers consistently. The long battery life ensures I can conduct lengthy analysis sessions undisturbed.",
    rating: 5,
    isVerified: true,
    isHelpful: 28,
    isNotHelpful: 1,
    tags: ["verified purchase", "data scientist"],
    productId: "M005",
  },
  {
    title: "Big Plus for Medical Research",
    content:
      "Having a research mouse that connects via Bluetooth is a big plus in the lab environment, eliminating the need for USB ports and keeping things clean and organized.",
    rating: 4,
    isVerified: true,
    isHelpful: 25,
    isNotHelpful: 2,
    tags: ["verified purchase", "medical researcher"],
    productId: "M005",
  },
  {
    title: "Beautiful for Dual Boot Setup",
    content:
      "Works beautifully with my dual boot office setup, handling architecture designs flawlessly. It's a compact, stress-reducing companion for any architect seeking flexibility.",
    rating: 5,
    isVerified: true,
    isHelpful: 27,
    isNotHelpful: 1,
    tags: ["verified purchase", "architect"],
    productId: "M005",
  },
  {
    title: "Great for Artists",
    content:
      "The slim design and Bluetooth connectivity are great for when I'm switching between drawing tablets and my laptop. Easy to carry without compromising on functionality.",
    rating: 4,
    isVerified: true,
    isHelpful: 23,
    isNotHelpful: 2,
    tags: ["verified purchase", "artist"],
    productId: "M005",
  },
  {
    title: "Perfect for University Lectures",
    content:
      "Perfect for lectures, seamless when maneuvering slides or presenting material. Bluetooth connectivity clears away the mess of wires and keeps my presentation area tidy.",
    rating: 5,
    isVerified: true,
    isHelpful: 29,
    isNotHelpful: 1,
    tags: ["verified purchase", "university lecturer"],
    productId: "M005",
  },
  {
    title: "Reliable for Project Coordination",
    content:
      "Reliable and efficient, the BT5600 fulfills its promises of stable Bluetooth connectivity. Perfect for coordinating across multiple devices when organizing project details. The easy setup also saves time.",
    rating: 5,
    isVerified: true,
    isHelpful: 31,
    isNotHelpful: 1,
    tags: ["verified purchase", "project coordinator"],
    productId: "M005",
  },
  {
    title: "Absolute Gaming Beast!",
    content:
      "This mouse is incredible for competitive gaming. The HERO 25K sensor is ridiculously accurate, and the LIGHTSPEED wireless connection feels faster than my old wired mouse. The ultra-lightweight design makes flick shots so much easier. Battery life is amazing - I've been using it for 3 days straight and still have 40% left. Worth every penny for serious gamers!",
    rating: 5,
    isVerified: true,
    isHelpful: 12,
    isNotHelpful: 1,
    tags: ["verified purchase", "gamer"],
    productId: "M006",
  },
  {
    title: "Perfect for FPS Games",
    content:
      "Been using this for Valorant and CS2. The 25,600 DPI sensor is overkill but the precision is unmatched. The LIGHTFORCE switches feel crisp and responsive. Only minor issue is the lack of RGB, but that's actually better for battery life. The weight is perfect for my claw grip style.",
    rating: 5,
    isVerified: true,
    isHelpful: 8,
    isNotHelpful: 0,
    tags: ["verified purchase", "competitive gamer"],
    productId: "M006",
  },
  {
    title: "Great but expensive",
    content:
      "The performance is outstanding and the wireless freedom is amazing. However, the price tag is quite steep. If you're a casual gamer, you might want to look at cheaper options. But for competitive players, this is definitely worth the investment.",
    rating: 4,
    isVerified: true,
    isHelpful: 5,
    isNotHelpful: 2,
    tags: ["verified purchase", "gamer"],
    productId: "M006",
  },

  // Reviews for M007 - Corsair Sabre Elite RGB
  {
    title: "RGB Masterpiece with Performance",
    content:
      "The RGB lighting is absolutely stunning and the 2,000Hz polling rate makes everything feel incredibly responsive. The 8 programmable buttons are perfect for MMO games. The Omron switches feel great and the braided cable is high quality. iCUE software is powerful but can be overwhelming at first.",
    rating: 5,
    isVerified: true,
    isHelpful: 15,
    isNotHelpful: 1,
    tags: ["verified purchase", "gamer"],
    productId: "M007",
  },
  {
    title: "Solid Gaming Mouse",
    content:
      "Good performance and the RGB looks great. The 18,000 DPI sensor is more than enough for my needs. The weight feels balanced and the ergonomic design is comfortable for long gaming sessions. The onboard memory is a nice touch for saving profiles.",
    rating: 4,
    isVerified: true,
    isHelpful: 6,
    isNotHelpful: 0,
    tags: ["verified purchase", "gamer"],
    productId: "M007",
  },
  {
    title: "Decent but could be better",
    content:
      "The mouse performs well and the RGB is nice, but I find the iCUE software to be buggy sometimes. The cable is good quality but I wish it was detachable. For the price, it's a solid choice but there are better options out there.",
    rating: 3,
    isVerified: true,
    isHelpful: 3,
    isNotHelpful: 1,
    tags: ["verified purchase", "gamer"],
    productId: "M007",
  },

  // Reviews for M008 - Dell Essential WM301 Wireless Mouse
  {
    title: "Perfect for Office Work",
    content:
      "This mouse is exactly what I needed for my office setup. The 18-month battery life is incredible - I've been using it for 6 months and haven't changed the battery yet! The ambidextrous design is comfortable and the 1000 DPI is perfect for productivity tasks. Great value for money.",
    rating: 5,
    isVerified: true,
    isHelpful: 20,
    isNotHelpful: 0,
    tags: ["verified purchase", "office worker"],
    productId: "M008",
  },
  {
    title: "Simple and Reliable",
    content:
      "No fancy features, just a solid wireless mouse that works. Perfect for students and basic office work. The setup is plug-and-play, no drivers needed. The compact size makes it great for travel. Battery life is impressive as advertised.",
    rating: 4,
    isVerified: true,
    isHelpful: 12,
    isNotHelpful: 0,
    tags: ["verified purchase", "student"],
    productId: "M008",
  },
  {
    title: "Good budget option",
    content:
      "For the price, this is a decent wireless mouse. It's comfortable to use and the battery life is good. However, the tracking could be more precise and the scroll wheel feels a bit cheap. But for basic tasks, it gets the job done.",
    rating: 3,
    isVerified: true,
    isHelpful: 7,
    isNotHelpful: 1,
    tags: ["verified purchase", "casual user"],
    productId: "M008",
  },

  // Reviews for P105 - Acer Aspire Lite AL105
  {
    title: "Great for Students",
    content:
      "Perfect laptop for my college studies. The Intel i3 processor handles all my coursework smoothly - Word, Excel, PowerPoint, and web browsing work great. The 15.6-inch screen is comfortable for long study sessions. Battery life is decent for a full day of classes. Great value for students on a budget!",
    rating: 4,
    isVerified: true,
    isHelpful: 18,
    isNotHelpful: 2,
    tags: ["verified purchase", "student"],
    productId: "P105",
  },
  {
    title: "Solid Entry-Level Laptop",
    content:
      "This laptop exceeded my expectations for the price. The 12th Gen i3 processor is surprisingly capable for everyday tasks. The 512GB SSD makes everything fast and the 8GB RAM is sufficient for multitasking. The build quality is decent for a budget laptop. Perfect for basic computing needs.",
    rating: 4,
    isVerified: true,
    isHelpful: 14,
    isNotHelpful: 1,
    tags: ["verified purchase", "casual user"],
    productId: "P105",
  },
  {
    title: "Good but limited",
    content:
      "The laptop works well for basic tasks like browsing and office work. However, it struggles with anything more demanding. The lack of backlit keyboard is disappointing for the price. Battery life is okay but not great. It's a decent choice for light users.",
    rating: 3,
    isVerified: true,
    isHelpful: 9,
    isNotHelpful: 0,
    tags: ["verified purchase", "casual user"],
    productId: "P105",
  },

  // Reviews for P106 - Lenovo Ideapad Slim 3(2025)
  {
    title: "Excellent for Programming",
    content:
      "This laptop is perfect for my software development work. The AMD Ryzen 5 processor with 16GB RAM handles multiple IDEs, Docker containers, and browser tabs without any lag. The 14-inch screen is portable yet productive. The fingerprint reader and privacy shutter are nice security features. RapidCharge is a lifesaver!",
    rating: 5,
    isVerified: true,
    isHelpful: 25,
    isNotHelpful: 1,
    tags: ["verified purchase", "developer"],
    productId: "P106",
  },
  {
    title: "Powerful and Portable",
    content:
      "Great balance of performance and portability. The 6-core Ryzen 5 processor is fast and the 16GB RAM ensures smooth multitasking. The IPS display has good colors and viewing angles. The backlit keyboard is comfortable for long typing sessions. Battery life is impressive with RapidCharge technology.",
    rating: 5,
    isVerified: true,
    isHelpful: 19,
    isNotHelpful: 0,
    tags: ["verified purchase", "professional"],
    productId: "P106",
  },
  {
    title: "Good but expensive",
    content:
      "The performance is excellent and the build quality is solid. However, the price is quite high for what you get. The soldered RAM means no future upgrades. The 14-inch screen might be too small for some users. Overall good laptop but consider your needs before buying.",
    rating: 4,
    isVerified: true,
    isHelpful: 11,
    isNotHelpful: 2,
    tags: ["verified purchase", "professional"],
    productId: "P106",
  },

  // Reviews for P107 - Asus VivoBook 14
  {
    title: "Perfect for Online Classes",
    content:
      "Bought this for my daughter's online schooling and it's been perfect! The 10-hour battery life means she can attend all her classes without charging. The lightweight design makes it easy for her to carry around. The Celeron processor handles Zoom calls and basic school work smoothly. Great value for students!",
    rating: 5,
    isVerified: true,
    isHelpful: 22,
    isNotHelpful: 0,
    tags: ["verified purchase", "student"],
    productId: "P107",
  },
  {
    title: "Excellent Budget Laptop",
    content:
      "For under 30k, this laptop offers great value. The battery life is outstanding - I can work all day without charging. The lightweight design is perfect for travel. The HD screen is adequate for basic tasks. The 256GB SSD is fast and the 8GB RAM handles everyday tasks well. Perfect for casual users.",
    rating: 4,
    isVerified: true,
    isHelpful: 16,
    isNotHelpful: 1,
    tags: ["verified purchase", "casual user"],
    productId: "P107",
  },
  {
    title: "Basic but functional",
    content:
      "This laptop does what it's supposed to do - basic computing tasks. The battery life is impressive and the portability is great. However, the Celeron processor is quite slow and the HD screen resolution is low. The lack of backlit keyboard is disappointing. Good for very basic needs only.",
    rating: 3,
    isVerified: true,
    isHelpful: 8,
    isNotHelpful: 0,
    tags: ["verified purchase", "casual user"],
    productId: "P107",
  },

  // Additional reviews for variety
  {
    title: "Tournament Ready",
    content:
      "Used this in my last esports tournament and it performed flawlessly. The wireless connection was stable throughout the entire event. The lightweight design reduced fatigue during long gaming sessions. The HERO sensor is incredibly accurate for precise aiming. Highly recommended for competitive players.",
    rating: 5,
    isVerified: true,
    isHelpful: 30,
    isNotHelpful: 0,
    tags: ["verified purchase", "competitive gamer"],
    productId: "M006",
  },
  {
    title: "Content Creator's Dream",
    content:
      "As a YouTuber, I need a laptop that can handle video editing and this one delivers! The Ryzen 5 processor with 16GB RAM handles 1080p editing smoothly. The IPS display has good color accuracy. The fingerprint reader is convenient and the privacy shutter gives peace of mind during video calls.",
    rating: 5,
    isVerified: true,
    isHelpful: 28,
    isNotHelpful: 1,
    tags: ["verified purchase", "content creator"],
    productId: "P106",
  },
  {
    title: "Travel Companion",
    content:
      "Perfect mouse for business travel. The compact design fits easily in my laptop bag. The 18-month battery life means I don't need to carry spare batteries. The nano receiver stores inside the mouse so I never lose it. Works perfectly with my MacBook and Windows laptop.",
    rating: 5,
    isVerified: true,
    isHelpful: 15,
    isNotHelpful: 0,
    tags: ["verified purchase", "business traveler"],
    productId: "M008",
  },
  {
    title: "First Laptop Experience",
    content:
      "This is my first laptop and I'm very happy with it. The setup was easy and it handles all my basic needs - browsing, watching videos, and using Microsoft Office. The 15.6-inch screen is comfortable for watching movies. The price was perfect for my budget as a first-time buyer.",
    rating: 4,
    isVerified: true,
    isHelpful: 13,
    isNotHelpful: 0,
    tags: ["verified purchase", "first-time buyer"],
    productId: "P105",
  },
  {
    title: "RGB Enthusiast's Choice",
    content:
      "The RGB lighting is absolutely gorgeous and the iCUE software offers endless customization options. The 2,000Hz polling rate makes gaming feel incredibly responsive. The 8 programmable buttons are perfect for my MMO gaming needs. The braided cable is high quality and the mouse feels premium.",
    rating: 5,
    isVerified: true,
    isHelpful: 21,
    isNotHelpful: 1,
    tags: ["verified purchase", "gamer"],
    productId: "M007",
  },
  {
    title: "Family Laptop",
    content:
      "Bought this for the whole family to use. It's perfect for everyone's needs - kids use it for online classes, wife uses it for browsing and social media, and I use it for basic work tasks. The battery life is amazing and the lightweight design makes it easy to move around the house.",
    rating: 4,
    isVerified: true,
    isHelpful: 17,
    isNotHelpful: 0,
    tags: ["verified purchase", "family user"],
    productId: "P107",
  },
  
];

// Function to seed reviews
const seedReviews = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    // Get users and products for references
    const users = await User.find({});
    const products = await Product.find({});

    if (users.length === 0) {
      console.log("No users found. Please run the user seeding script first.");
      process.exit(1);
    }

    if (products.length === 0) {
      console.log(
        "No products found. Please run the product seeding script first."
      );
      process.exit(1);
    }

    // Clear existing reviews
    await Review.deleteMany({});
    console.log("Cleared existing reviews");

    // Create reviews with proper references
    const reviewsToInsert = [];
    const usedUserProductPairs = new Set(); // Track used user-product combinations

    // Map productId to actual product ObjectId
    const productIdMap = {};
    products.forEach((product) => {
      productIdMap[product.productId] = product._id;
    });

    // Create reviews with proper product references
    sampleReviews.forEach((review, index) => {
      const productId = review.productId;
      const productObjectId = productIdMap[productId];

      if (productObjectId) {
        // Find a user who hasn't reviewed this product yet
        let userIndex = 0;
        let userProductPair = `${users[userIndex]._id}-${productObjectId}`;

        // Try to find an available user for this product
        while (
          usedUserProductPairs.has(userProductPair) &&
          userIndex < users.length - 1
        ) {
          userIndex++;
          userProductPair = `${users[userIndex]._id}-${productObjectId}`;
        }

        // Only add review if we found an available user
        if (!usedUserProductPairs.has(userProductPair)) {
          usedUserProductPairs.add(userProductPair);

          reviewsToInsert.push({
            title: review.title,
            content: review.content,
            rating: review.rating,
            isVerified: review.isVerified,
            isHelpful: review.isHelpful,
            isNotHelpful: review.isNotHelpful,
            tags: review.tags,
            user: users[userIndex]._id,
            product: productObjectId,
          });
        } else {
          console.log(
            `Warning: No available user for product ${productId}, skipping review "${review.title}"`
          );
        }
      } else {
        console.log(`Warning: Product with ID ${productId} not found`);
      }
    });

    // Insert reviews
    const reviews = await Review.insertMany(reviewsToInsert);
    console.log(`Inserted ${reviews.length} sample reviews`);

    // Display some sample reviews
    console.log("\nSample Reviews Created:");
    for (let i = 0; i < Math.min(5, reviews.length); i++) {
      const review = reviews[i];
      const user = users.find((u) => u._id.equals(review.user));
      const product = products.find((p) => p._id.equals(review.product));
      console.log(
        `- "${review.title}" by ${user.firstName} ${user.lastName} for ${product.name} (${review.rating}/5)`
      );
    }

    mongoose.connection.close();
    console.log("\nReview seeding completed!");
  } catch (error) {
    console.error("Error seeding reviews:", error);
    process.exit(1);
  }
};

// Run the seeding function
seedReviews();
