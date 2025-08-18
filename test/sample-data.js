require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/products");

// Sample data for testing
const sampleProducts = [
  // Mouse Products
  {
    productId: "M001",
    name: "Logitech MX200",
    description:
      "Prepare to redefine your relationship with your digital workspace with the Logitech MX200, an exquisitely engineered wireless mouse conceived for the discerning professional who refuses to compromise. In today's demanding environment, where productivity and comfort are paramount, the MX200 stands apart not merely as a tool, but as a direct extension of your creative and analytical will. It is designed from the ground up for the power user—the graphic designer perfecting a pixel, the developer navigating thousands of lines of code, the financial analyst modeling complex data, and the everyday user who simply demands a superior, more fluid experience. The MX200 is engineered to eliminate friction, transforming every click, scroll, and cursor movement into an act of effortless precision and controlAt the very core of the MX200's exceptional performance is its advanced Optical Sensor Technology, a testament to Logitech's commitment to flawless tracking. Boasting a highly responsive 1600 DPI (Dots Per Inch) resolution, this sensor provides the perfect balance of speed and accuracy for modern high-resolution displays. This means you can glide your cursor across a 4K monitor with minimal hand movement, while retaining the granular control necessary for intricate tasks like photo retouching or precise vector work. The optical engine ensures this precision is available on an extensive variety of surfaces, from finished wood desks and laminate countertops to fabric mouse pads, freeing you from constraints. The connection's minimal latency ensures that every subtle motion of your hand is translated on-screen in real-time, creating a tangible 1:1 connection that makes the cursor feel like an extension of your own fingertips, a crucial feature for tasks where immediate feedback is non-negotiable.Logitech's mastery of ergonomics is on full display in the MX200's design. The chassis is meticulously sculpted with a pronounced contour that is optimized for right-handed users, providing a full, supportive cradle for the palm. This carefully considered shape promotes a neutral, natural wrist posture, drastically reducing the strain and fatigue that often accompany long hours of computer use. Your fingers will rest naturally upon the primary buttons, while a dedicated, scooped-out thumb rest provides a comfortable anchor point, allowing for both relaxation and swift access to the customizable side buttons. The surfaces are finished with soft, durable rubber grips that not only enhance control and prevent slippage but also provide a pleasant tactile experience. Weighing in at a perfectly balanced 100 grams, the mouse is substantial enough to feel stable, yet light enough to be navigated across your workspace with effortless grace.Connectivity is delivered through a robust and reliable 2.4 GHz wireless signal, providing the stability and speed of a wired connection without the clutter. The included Logitech Unifying receiver is a marvel of efficiency; this tiny USB dongle establishes a powerful link from up to 10 meters away and can pair with up to six compatible Logitech devices simultaneously, allowing you to connect a keyboard and mouse while occupying only a single USB port—a priceless feature for laptop and ultrabook users. Power efficiency is a standout feature, as the MX200 operates for an incredible 12 months on a single AA battery. This remarkable longevity is achieved through an intelligent sleep mode that automatically conserves energy when the mouse is idle, combined with a manual power switch for when you're on the go.The experience is completed by Logitech's powerful software suite. Logitech Options unlocks a deep level of customization, allowing you to remap the five programmable buttons to execute virtually any command, from simple copy/paste shortcuts to launching applications or navigating virtual desktops. The hyper-fast scrolling wheel is a productivity game-changer, allowing you to coast through lengthy documents and web pages with a single flick, or switch to a precise click-to-click mode for line-by-line navigation. Furthermore, the MX200 is fully compatible with Logitech Flow, a revolutionary technology that allows for seamless cross-computer control. Imagine moving your cursor off the edge of your Windows laptop screen and onto your MacBook's display, and even copying a file from one and pasting it directly to the other. In summary, the Logitech MX200 is a holistic instrument that fuses ergonomic comfort with precise functionality and powerful customization, providing a truly elite tool for professionals and enthusiasts who are ready to master their workflow.",
    price: 2999,
    brand: "Logitech",
    imageUrl:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdXNlfGVufDB8fDB8fHww",
    stock: 15,
    category: "mouse",
    specs: {
      dpi: "1600",
      connectivity: "Wireless",
      sensorType: "Optical",
      weight: "100g",
      batteryLife: "12 hours",
      wireless: "Yes",
    },
    faq: [
      {
        question: "What is the DPI sensitivity range for the Logitech MX200?",
        answer:
          "The Logitech MX200 has a DPI range of up to 1600, allowing for precise tracking across various surfaces.",
      },
      {
        question:
          "Is the Logitech MX200 suitable for both left-handed and right-handed users?",
        answer:
          "The MX200 is ergonomically designed specifically for right-handed users, providing comfortable use during extended sessions.",
      },
      {
        question: "How does the Logitech MX200 connect to devices?",
        answer:
          "It connects through a 2.4 GHz wireless technology with a unifying receiver, which supports multiple Logitech devices.",
      },
      {
        question:
          "What is the battery life of the Logitech MX200, and what type of battery does it use?",
        answer:
          "The MX200 uses a standard AA battery and offers an impressive battery life of up to 12 hours.",
      },
      {
        question: "Can I customize the buttons on the Logitech MX200?",
        answer:
          "Yes, the Logitech Options software allows you to customize the five programmable buttons, tailoring them to your workflow.",
      },
      {
        question:
          "What operating systems is the Logitech MX200 compatible with?",
        answer:
          "It is compatible with both Windows and macOS, making it a versatile option for users of different systems.",
      },
      {
        question: "Does the Logitech MX200 support fast scrolling?",
        answer:
          "Yes, it features a hyper-fast scrolling wheel, which is perfect for quickly navigating through long documents and web pages.",
      },
      {
        question:
          "What is the weight of the Logitech MX200, and how does it affect usability?",
        answer:
          "Weighing just 100g, the MX200 is lightweight, allowing for easy navigation and control without causing wrist strain.",
      },
      {
        question: "Is the Logitech MX200 suitable for gaming?",
        answer:
          "While it is primarily designed for professional and personal use, the MX200 can handle lightweight gaming thanks to its precision optics and smooth tracking.",
      },
      {
        question: "What are the energy-saving features of the Logitech MX200?",
        answer:
          "It includes an integrated power switch and smart sleep mode to conserve energy when not in use, ensuring the mouse is ready whenever needed.",
      },
    ],
  },
  {
    productId: "M002",
    name: "HP Z3700",
    description:
      "The HP Z3700 Wireless Mouse is more than a simple navigation tool; it is a carefully crafted piece of technology that functions as a statement of personal style and a commitment to efficient, uncluttered work. Conceived for the modern user who values both sophisticated aesthetics and dependable performance, this mouse is designed to seamlessly complement and elevate any home or office environment. Its design philosophy centers on a minimalist yet impactful presence, featuring sleek, flowing lines and a low-profile silhouette that is both visually striking and ergonomically sound. It serves as the ideal companion for anyone seeking to curate a workspace that is as functional as it is beautiful.Design and Ergonomics\nAt the heart of the Z3700's appeal is its elegant and thoughtful physical design. Its slim and perfectly symmetrical body makes it an exceptionally inclusive device, offering an equally comfortable and intuitive experience for both left and right-handed users. This ambidextrous nature makes it an excellent choice for shared workstations, classrooms, or families with multiple users. Available in a diverse palette of vibrant and contemporary colors, the Z3700 empowers you to move beyond generic tech and select a mouse that truly reflects your personality or matches your existing hardware.  The mouse's remarkably compact and lightweight frame is a defining feature, making it the ultimate accessory for mobility. It slips effortlessly into the slimmest laptop sleeve or a crowded handbag, ensuring that professionals, students, and digital nomads can maintain their productivity on the go without being weighed down. For added convenience, a dedicated slot inside the mouse securely stores the USB nano receiver, preventing it from getting lost during travel.Performance and Connectivity\nBeneath its stylish exterior lies a precise and reliable 1200 DPI optical sensor. This resolution is perfectly calibrated to be the \"sweet spot\" for everyday productivity on most laptops and desktop monitors, delivering smooth, accurate, and responsive tracking across a variety of non-glossy surfaces. This level of precision is ideal for navigating detailed spreadsheets, browsing content-rich websites, and managing daily communications with a fluid, predictable cursor movement that feels natural and effortless.The HP Z3700 ensures a clutter-free experience with its robust 2.4 GHz wireless connection, which provides a stable and interference-resistant link up to 10 meters (30 feet) away. This technology offers a more immediate and reliable connection than standard Bluetooth, eliminating frustrating lag or dropouts. The setup is the epitome of simplicity: just plug the tiny USB nano receiver into an available port, and the mouse works instantly—no drivers, software installations, or complex pairing procedures are required. This plug-and-play convenience allows you to focus entirely on your work, not on troubleshooting your peripherals.Efficiency and User Experience\nEfficiency is engineered into the very core of the Z3700. It is designed for incredible longevity, offering an impressive battery life of up to 16 months from a single AA battery. This remarkable endurance is made possible by an intelligent power management system, which includes a multi-stage sleep mode that automatically conserves energy when the mouse is not in use. It wakes from sleep instantly upon movement, ensuring it is always ready when you are. This extended battery life means you can work with confidence for over a year without the annoyance of frequent battery replacements.Furthermore, the mouse is engineered for quiet operation. The muted clicks are soft and unobtrusive, making the Z3700 a considerate choice for noise-sensitive environments like libraries, open-plan offices, or late-night study sessions. HP's commitment to sustainability is reflected in the product's design and minimalist, recyclable packaging. Its universal compatibility with all major operating systems, including Windows, macOS, and ChromeOS, enhances its versatility, making it a reliable and hassle-free choice for any user. In conclusion, the HP Z3700 masterfully blends chic design, dependable performance, and unmatched convenience, offering an exceptional computing experience for anyone who believes that technology should be both beautiful and brilliantly simple.",
    price: 1499,
    brand: "HP",
    imageUrl:
      "https://images.unsplash.com/photo-1639120346883-897e8ea1d4f4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aHAlMjBtb3VzZXxlbnwwfHwwfHx8MA%3D%3D",
    stock: 20,
    category: "mouse",
    specs: {
      dpi: "1200",
      connectivity: "Wireless",
      sensorType: "Optical",
      weight: "78g",
      batteryLife: "16 hours",
      wireless: "Yes",
    },
    faq: [
      {
        question: "What is the DPI setting of the HP Z3700?",
        answer:
          "The HP Z3700 features a 1200 DPI optical sensor for smooth and precise tracking.",
      },
      {
        question:
          "Is the HP Z3700 compatible with both left and right-handed users?",
        answer:
          "Yes, its symmetrical design accommodates both left and right-handed users comfortably.",
      },
      {
        question: "How do I connect the HP Z3700 to my computer?",
        answer:
          "It connects using a USB nano receiver via a 2.4 GHz wireless connection for plug-and-play convenience.",
      },
      {
        question: "What is the battery life of the HP Z3700?",
        answer:
          "The mouse offers up to 16 hours of battery life using a single AA battery.",
      },
      {
        question: "Can I use the HP Z3700 on all surfaces?",
        answer:
          "It tracks well on most surfaces; however, for highly reflective or glass surfaces, a mouse pad is recommended.",
      },
      {
        question: "Is any software required for the HP Z3700 setup?",
        answer:
          "No additional software is required. Simply plug in the USB receiver and start using the mouse.",
      },
      {
        question: "What operating systems are compatible with the HP Z3700?",
        answer:
          "It's compatible with Windows, macOS, and some Linux distributions.",
      },
      {
        question: "Does it come in multiple colors?",
        answer:
          "Yes, the HP Z3700 is available in a variety of colors to match your personal style.",
      },
      {
        question: "What makes the HP Z3700 suitable for office use?",
        answer:
          "Its quiet operation, precision tracking, and long battery life make it ideal for office environments.",
      },
      {
        question: "Is the HP Z3700 suitable for travel?",
        answer:
          "Yes, its compact size and long-lasting battery make it a great travel companion.",
      },
    ],
  },
  {
    productId: "M003",
    name: "Razer Basilisk X",
    description:
      "In the hyper-competitive arena of modern gaming, where victory and defeat are decided in milliseconds, your equipment is not just an accessory—it is an integral part of your arsenal. The Razer Basilisk X HyperSpeed emerges as a definitive weapon for the dedicated gamer, engineered from the ground up to deliver untethered freedom without a single compromise on the lethal precision required to dominate. This mouse is more than a peripheral; it is a direct conduit for your skill, translating every intention and reflex into flawless execution on the digital battlefield. Designed for those who refuse to be bound by wires but demand the performance of a wired connection, the Basilisk X offers an unparalleled fusion of speed, accuracy, and endurance.Ergonomic Design for Peak Performance\nThe Basilisk X immediately asserts its gaming pedigree with a sleek, aggressive design language. Its iconic, right-handed ergonomic form factor has been meticulously sculpted through countless hours of research to provide exceptional comfort and reduce fatigue during marathon gaming sessions. The pronounced thumb rest and textured side grips ensure a secure, confident hold, allowing for both swift, sweeping motions and minute, controlled adjustments with equal ease. This ergonomic foundation is critical for maintaining peak performance and control, ensuring your aim remains steady and your movements precise, even in the most high-pressure, final-circle encounters. Every curve and contour is placed to guide your hand into a natural, relaxed grip, making the mouse feel like a true extension of your arm.Unrivaled Precision with the Razer 5G Sensor. At the heart of the Basilisk X lies the acclaimed Razer 5G Advanced Optical Sensor, a state-of-the-art marvel of engineering that provides an astounding 16,000 DPI. This sensor boasts a 99.4% resolution accuracy and tracks at up to 450 Inches Per Second (IPS), ensuring that even the most rapid and subtle hand movements are registered with absolute fidelity. For the gamer, this translates into tangible advantages: dial down the DPI for pixel-perfect headshots while sniping, and then, with a press of a button, cycle to a higher sensitivity for lightning-fast 180-degree turns in close-quarters combat. This on-the-fly adaptability, fully customizable via the Razer Synapse software, is a tactical necessity, allowing you to seamlessly adjust your playstyle to any in-game scenario without missing a beat.Dual-Mode Freedom: HyperSpeed and Bluetooth The crowning achievement of the Basilisk X is its revolutionary dual-mode wireless capability. For competitive gaming, engage Razer HyperSpeed Wireless technology. Proven to be 25% faster than other leading wireless technologies, HyperSpeed utilizes an optimized data protocol, an ultra-fast radio frequency, and Adaptive Frequency Technology, which scans for interference every millisecond to switch to the cleanest channel. The result is a connection so fast and stable, with such low latency, that it is functionally indistinguishable from a wired connection, giving you the confidence to play at the highest levels without fear of lag or signal drops.When the battle is over and productivity begins, a simple flick of a switch on the mouse’s underside transitions it to Bluetooth (BLE) mode. This low-energy connection is perfect for everyday tasks, web browsing, and office work, and it dramatically extends the mouse's battery life. This dual-mode functionality makes the Basilisk X an incredibly versatile tool, seamlessly shifting from an elite gaming weapon to an efficient daily driver.Marathon Endurance and Customization\nThis dual-mode philosophy extends to its incredible power efficiency. In Bluetooth mode, the Basilisk X delivers a staggering 450 hours of continuous use. For gaming, the high-performance HyperSpeed mode provides an impressive 285 hours of non-stop, lag-free gameplay. Both modes are powered by a single, easily replaceable AA battery, a design choice that keeps the mouse's weight low and nimble while eliminating the downtime associated with recharging.True to the Razer legacy, customization is paramount. The Basilisk X features 6 fully programmable buttons, which can be configured with complex macros and secondary functions through the powerful Razer Synapse 3 software. You can assign intricate spell rotations or build commands to a single click, giving you a decisive edge. The onboard Razer™ Mechanical Mouse Switches, co-developed with Omron, are rated for a lifespan of up to 50 million clicks, ensuring every action is executed with a crisp, tactile, and unfailingly reliable response for years to come. In essence, the Razer Basilisk X HyperSpeed is the definitive answer for gamers seeking wireless liberation without sacrificing the precision, speed, and reliability needed to win.",
    price: 3999,
    brand: "Razer",
    imageUrl:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91c2V8ZW58MHx8MHx8fDA%3D",
    stock: 8,
    category: "mouse",
    specs: {
      dpi: "16000",
      connectivity: "Wireless",
      sensorType: "Optical",
      weight: "83g",
      batteryLife: "450h",
      wireless: "Yes",
    },
    faq: [
      {
        question: "What is the DPI range of the Razer Basilisk X?",
        answer:
          "It features a 16,000 DPI optical sensor, adjustable via Razer Synapse software.",
      },
      {
        question: "What are the connectivity options available?",
        answer:
          "The Basilisk X supports both Razer HyperSpeed Wireless and Bluetooth connectivity.",
      },
      {
        question: "How long does the battery last on a single AA battery?",
        answer:
          "Up to 450 hours in Bluetooth mode and around 285 hours with HyperSpeed Wireless.",
      },
      {
        question: "Can all buttons on the Basilisk X be customized?",
        answer:
          "Yes, all 6 buttons can be fully customized via Razer Synapse software.",
      },
      {
        question: "What makes the Razer Basilisk X ergonomic?",
        answer:
          "Its right-handed ergonomic design and strategically placed buttons ensure comfort and accessibility.",
      },
      {
        question: "Is the Basilisk X suitable for non-gaming use?",
        answer:
          "Yes, it switches between high-performance gaming and efficient non-gaming use seamlessly.",
      },
      {
        question: "Is the Razer Basilisk X compatible with macOS?",
        answer:
          "Yes, it is compatible with macOS, though some customization features are best accessed via Windows.",
      },
      {
        question:
          "What makes HyperSpeed Wireless faster than standard Bluetooth?",
        answer:
          "It features low latency and smooth frequency switching for minimal interference and lag.",
      },
      {
        question: "Does the Basilisk X have RGB lighting?",
        answer:
          "No, this model focuses on performance and battery efficiency without RGB lighting.",
      },
      {
        question: "Is Razer Synapse software necessary for the Basilisk X?",
        answer:
          "For button customization and DPI settings, Razer Synapse offers valuable features, but the mouse can function without it.",
      },
    ],
  },
  {
    productId: "M004",
    name: "Dell WM126",
    description:
      "In a world of increasing complexity, the Dell WM126 Wireless Optical Mouse stands as a testament to the power of purposeful simplicity and unwavering reliability. Engineered for the modern professional, student, and everyday user, this mouse is the definitive solution for anyone seeking a seamless, clutter-free computing experience. It is designed to be an invisible partner in your daily tasks, a tool that just works the moment you need it, whether you're finalizing a report at the office in Bengaluru, preparing a presentation from a cozy café, or managing your digital life from home. The WM126 strips away unnecessary complications, focusing instead on delivering the core essentials of comfort, precision, and endurance with the quality and trust synonymous with the Dell brand.Timeless Design and Ambidextrous Comfort .The WM126 features a classic, understated design that is both timeless and universally professional. Its lightweight and compact form factor makes it an exceptional companion for professionals on the move, sliding effortlessly into a laptop bag or briefcase without adding bulk. However, its portability does not come at the expense of comfort. The mouse's elegantly contoured shape has been ergonomically sculpted to support the natural curve of the hand, minimizing wrist strain and providing a comfortable grip for hours of continuous use. A key feature of its intelligent design is its perfect symmetry, making it a truly ambidextrous mouse that offers the same exceptional comfort and control to both right-handed and left-handed users. This makes it an ideal choice for businesses deploying hardware across a diverse workforce or for family use in a shared home office. For added convenience, a dedicated storage compartment inside the mouse securely houses the USB nano receiver, ensuring it is never misplaced during travel.Dependable Performance for Everyday ProductivityAt the heart of the WM126 is a 1000 DPI (Dots Per Inch) optical sensor, a resolution that is perfectly optimized for everyday productivity on the most common laptop and desktop screen resolutions. This sensor provides a stable, predictable, and exceptionally smooth tracking experience, giving you precise control over your cursor. Whether you are navigating intricate spreadsheets, selecting text in documents, or browsing your favorite websites, the mouse translates your movements with dependable accuracy. This level of precision eliminates the frustration of overshooting links or struggling to click on small interface elements, directly enhancing your efficiency and workflow. The responsive optical engine ensures immediate reaction to your commands, providing a fluid and intuitive connection to your work.Unplugged Freedom and Universal CompatibilityEmbrace a clean, modern workspace with the robust 2.4 GHz wireless connection. This dedicated frequency, paired with its tiny USB nano receiver, provides a stable, consistent, and interference-resistant signal with an effective range of up to 10 meters. This liberates you from the tangle of cables, offering not only a tidier desk but also the flexibility to work from a distance. The setup is the epitome of user-friendly design: a true plug-and-play experience. Simply insert the nano receiver into any available USB port, and the mouse is ready to use in seconds, with no software, drivers, or complicated pairing procedures required.This zero-configuration approach extends to its broad compatibility. The Dell WM126 is designed to work flawlessly across a wide spectrum of operating systems, including Windows, macOS, Ubuntu Linux, and Chrome OS, making it a versatile and reliable choice for any user, regardless of their technology ecosystem.Built to Last with Exceptional Battery Life . Durability and efficiency are hallmarks of Dell engineering. The WM126 is powered by a single AA battery and is designed for incredible longevity, offering an outstanding battery life of up to 12 months of typical use. This remarkable endurance is achieved through a sophisticated, energy-efficient optical sensor and an automatic sleep function that intelligently conserves power by entering a low-power state when the mouse is inactive, waking instantly with a single click. This means you can work with confidence for an entire year without the disruption of a dead battery. The mouse's solid construction is rigorously tested to withstand the demands of daily use, ensuring it remains a dependable part of your tech arsenal for years to come. In summary, the Dell WM126 proves that the most essential features—reliability, comfort, and simplicity—are the keys to a truly productive and satisfying user experience",
    price: 899,
    brand: "Dell",
    imageUrl:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    stock: 25,
    category: "mouse",
    specs: {
      dpi: "1000",
      connectivity: "Wireless",
      sensorType: "Optical",
      weight: "56.9g",
      batteryLife: "12 hours",
      wireless: "Yes",
    },
    faq: [
      {
        question: "What is the DPI setting of the Dell WM126?",
        answer: "The mouse operates with a 1000 DPI optical sensor.",
      },
      {
        question: "How do I set up the Dell WM126?",
        answer:
          "Setup is easy with plug-and-play functionality; insert the USB receiver and start using the mouse.",
      },
      {
        question: "Does the Dell WM126 support left-handed users?",
        answer:
          "Yes, its ambidextrous design supports both left and right-handed users.",
      },
      {
        question: "What is the battery life for the Dell WM126?",
        answer:
          "The mouse offers up to 12 hours of battery life with one AA battery.",
      },
      {
        question: "What type of wireless technology does the WM126 use?",
        answer:
          "It uses a 2.4 GHz wireless connection for reliable signal strength.",
      },
      {
        question: "Can the Dell WM126 be used on all surfaces?",
        answer:
          "While it works on most, using a mouse pad on glass or reflective surfaces is recommended.",
      },
      {
        question: "Which operating systems are compatible with the WM126?",
        answer:
          "It's compatible with Windows, macOS, and various Linux distributions.",
      },
      {
        question: "Does the WM126 come with color options?",
        answer:
          "Yes, it is available in multiple colors to suit your preference.",
      },
      {
        question: "What makes the Dell WM126 ideal for office use?",
        answer:
          "Its precision tracking, quiet operation, and durable build make it suited for office environments.",
      },
      {
        question: "Is the WM126 mouse easy to transport?",
        answer:
          "Yes, its compact size makes it ideal for portability between home and office.",
      },
    ],
  },
  {
    productId: "M005",
    name: "Microsoft BT5600",
    description:
      "In today's dynamic work environment, where professionals in bustling cities like Bengaluru transition seamlessly between the corporate office, the home study, and collaborative co-working spaces, technology must be as agile and adaptable as the user. The Microsoft BT5600 Bluetooth Mouse is engineered precisely for this reality. It is a sophisticated and compelling choice for the mobile professional, student, and digital nomad who values a harmonious blend of minimalist design, reliable performance, and untethered convenience. The BT5600 is not merely a peripheral; it is an indispensable partner for productivity, designed to support a flexible lifestyle with the quality and intuitive functionality that are hallmarks of the Microsoft brand.Elegant Design and Refined Ergonomics. The BT5600 is a masterclass in minimalist design, crafted with meticulous attention to detail. It features an elegant, low-profile unibody shell with a premium matte finish that resists fingerprints and complements any modern tech setup. Its sleek, compact silhouette is not only stylish but also eminently practical, designed to slip into the slimmest laptop sleeve or a crowded backpack without adding bulk. Despite its portability, comfort is paramount. The mouse's subtle contouring and lightweight construction provide a comfortable and secure grip for a wide variety of hand sizes, ensuring ease of use and reducing fatigue during long working or study sessions. Every element is refined for a superior user experience, from its solid build quality to its aesthetically pleasing form.Precision Tracking for Professional Workflow. Integrated within its elegant frame is a 1000 DPI High-Definition Optical Sensor, perfectly tuned for professional productivity. This level of precision delivers exceptionally smooth, predictable, and responsive tracking, allowing users to navigate with fluid accuracy through dense documents, detailed presentations, and complex creative projects. The sensor's performance ensures that every movement is translated on-screen with fidelity, enhancing your efficiency whether you're editing a crucial report or making fine adjustments in a design application. Furthermore, the BT5600 is equipped with Microsoft's advanced tracking technology, enabling it to perform reliably on a wide variety of surfaces beyond a traditional mouse pad, a crucial advantage for those who often find themselves working from unconventional locations. The Freedom of Seamless Bluetooth Connectivity A standout feature of the BT5600 is its seamless, dongle-free Bluetooth integration. By connecting directly to your laptop, tablet, or PC, it completely eliminates the need for a USB receiver. This is a significant advantage for users of modern ultrabooks and MacBooks, where USB-A ports are often scarce or entirely absent, freeing up valuable ports for other essential peripherals. The setup is remarkably straightforward, especially on Windows devices featuring Microsoft Swift Pair, which allows for near-instant, one-click pairing without navigating through settings menus. This effortless connectivity makes the BT5600 a truly versatile tool, allowing you to easily switch between controlling your work laptop and a personal tablet, creating a cohesive and efficient multi-device workflow. Enduring Performance and Thoughtful Experience The BT5600 offers impressive battery performance, achieving up to 6 months of continuous use from a single AA battery. This exceptional longevity is made possible through the use of the highly efficient Bluetooth Low Energy (BLE) protocol and intelligent, multi-stage power-saving modes that automatically activate when the mouse is idle. This ensures your device is always ready for action, providing peace of mind during long commutes or business trips where charging opportunities may be limited. The user experience is further enhanced by a responsive scroll wheel with satisfying detents for precise, line-by-line scrolling, and meticulously engineered buttons that offer quiet, tactile feedback. This quiet operation makes it a considerate choice for shared or noise-sensitive environments like open-plan offices or libraries. With its wide-ranging compatibility across Windows, macOS, and Android, the Microsoft BT5600 excels at delivering the quality, performance, and wireless freedom that a modern, adaptable lifestyle demands. It redefines the expectations of a portable mouse, integrating thoughtful design with reliable functionality in one sleek, accessible package.",
    price: 2199,
    brand: "Microsoft",
    imageUrl:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91c2V8ZW58MHx8MHx8fDA%3D",
    stock: 12,
    category: "mouse",
    specs: {
      dpi: "1000",
      connectivity: "Bluetooth",
      sensorType: "Optical",
      weight: "80g",
      batteryLife: "6 hours",
      wireless: "Yes",
    },
    faq: [
      {
        question: "How does the Microsoft BT5600 connect to devices?",
        answer:
          "The mouse connects via Bluetooth, eliminating the need for a USB receiver.",
      },
      {
        question: "What is the tracking DPI for the BT5600?",
        answer:
          "It features a 1000 DPI sensor for smooth and accurate tracking.",
      },
      {
        question: "Is the BT5600 suitable for right and left-handed users?",
        answer:
          "Yes, its design is comfortable for both left and right-handed users.",
      },
      {
        question: "How long does the BT5600's battery last?",
        answer: "Up to 6 hours on a single AA battery, depending on usage.",
      },
      {
        question: "What makes the BT5600 portable?",
        answer:
          "Its compact design makes it easy to carry in bags or laptop cases.",
      },
      {
        question: "Which operating systems are compatible with the BT5600?",
        answer: "It works with Windows, macOS, and Android platforms.",
      },
      {
        question: "Is Bluetooth setup with the BT5600 complicated?",
        answer:
          "No, pairing is straightforward and doesn't require a USB receiver.",
      },
      {
        question: "Can the Microsoft BT5600 track on all surfaces?",
        answer:
          "It tracks effectively on many surfaces, but for glass, a mouse pad is recommended.",
      },
      {
        question: "What distinguishes the BT5600's design?",
        answer:
          "Its sleek, comfortable design is both functional and aesthetically pleasing.",
      },
      {
        question: "Is the BT5600 ideal for travel?",
        answer:
          "Absolutely, its light weight and size make it perfect for mobility-focused users.",
      },
    ],
  },
  {
    productId: "M006",
    name: "Logitech G-Force Pro Wireless",
    description:
      "In the world of competitive esports, there is no room for compromise. Every piece of equipment must be an extension of the player's will, an instrument of pure performance. The Logitech G-Force Pro Wireless is engineered with this singular vision. It is a testament to years of collaboration with top esports professionals, designed to remove every conceivable barrier between you and victory. This mouse is not for the casual player; it is a precision tool for the dedicated competitor who demands a frictionless, near-telepathic connection to the game, offering an unparalleled combination of an ultra-lightweight design, a flawless sensor, and zero-latency wireless technology.Engineered for Victory: The Sub-63g Design\nAt a breathtakingly light weight of under 63 grams, the G-Force Pro feels almost non-existent in your hand. This extreme weight reduction, achieved through meticulous engineering without sacrificing structural integrity, translates to tangible in-game advantages. It allows for faster target acquisition, quicker flick shots, and less fatigue during marathon gaming sessions, enabling you to maintain peak performance for hours on end. The minimalist, ambidextrous shape is a perfect canvas for a variety of grip styles, while the large, zero-additive PTFE feet provide the smoothest possible glide across your mousepad.The Apex Predator: HERO 25K Sensor\nAt the heart of the G-Force Pro is the revolutionary HERO 25K sensor, Logitech's most accurate gaming sensor ever. Capable of tracking at a sub-micron level with zero smoothing, filtering, or acceleration across its entire 100 - 25,600 DPI range, it delivers a level of precision that is simply unmatched. This means every subtle movement, every micro-adjustment, is translated on-screen with absolute fidelity, giving you the supreme confidence to hit the most demanding shots when the stakes are highest. LIGHTSPEED Wireless: Faster Than Wired\nDitch the drag and embrace true freedom with LIGHTSPEED pro-grade wireless technology. With an end-to-end engineered solution, Logitech has overcome the traditional limitations of wireless latency, stability, and connectivity. LIGHTSPEED delivers a blistering 1 ms report rate, providing a connection that is as fast, and often more stable, than many of its wired competitors. This is wireless performance without compromise, ensuring your every action is registered the instant you make it.Built for the Grind\nDesigned for the rigors of professional play, the G-Force Pro is built to endure. The internal rechargeable battery provides over 70 hours of continuous motion, enough to last through an entire tournament weekend on a single charge. The LIGHTFORCE hybrid optical-mechanical switches provide the crisp, tactile feedback of mechanical switches with the speed and reliability of optical actuation, ensuring every click is both satisfying and instantaneous. In essence, the G-Force Pro Wireless is the definitive tool for those who don't just play to compete—they play to win.",
    price: 9499,
    brand: "Logitech",
    imageUrl:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91c2V8ZW58MHx8MHx8fDA%3D",
    stock: 12,
    category: "mouse",
    specs: {
      dpi: "100 - 25,600 DPI",
      connectivity: "LIGHTSPEED Wireless",
      sensorType: "HERO 25K Optical",
      weight: "<63g",
      batteryLife: "Up to 70 hours (rechargeable)",
      buttons: "5 Programmable Buttons",
      switches: "LIGHTFORCE Hybrid Optical-Mechanical",
    },
    faq: [
      {
        question: "Is this mouse really as fast as a wired mouse?",
        answer:
          "Yes. Logitech's LIGHTSPEED wireless technology is engineered to have a 1ms report rate, making it as fast or even faster and more stable than many wired gaming mice.",
      },
      {
        question: "How do you charge the mouse and how long does it take?",
        answer:
          "It charges via a standard USB-C cable (included). A full charge takes approximately 1-2 hours and provides up to 70 hours of continuous use.",
      },
      {
        question: "Is the ultra-lightweight design durable?",
        answer:
          "Absolutely. It is engineered with a minimalist internal endoskeleton to be incredibly light without sacrificing structural integrity, designed to withstand professional use.",
      },
      {
        question: "What software is used for customization?",
        answer:
          "All customization, including DPI settings, button assignments, and power profiles, is done through the Logitech G HUB software.",
      },
      {
        question: "Is it suitable for users with large hands?",
        answer:
          "Its safe, ambidextrous shape is designed to fit a wide range of hand sizes and grip styles, but users who prefer a very large, sculpted ergonomic mouse might want to test the feel first.",
      },
      {
        question: "Does this mouse have RGB lighting?",
        answer:
          "No, to maximize battery life and minimize weight for competitive performance, this model does not include any RGB lighting.",
      },
    ],
  },
  {
    productId: "M007",
    name: "Corsair Sabre Elite RGB",
    description:
      "For the versatile gamer who thrives on performance and demands deep customization, the Corsair Sabre Elite RGB is the ultimate weapon. This is a high-performance wired gaming mouse engineered to provide a perfect blend of pinpoint accuracy, ergonomic comfort, and a stunning visual aesthetic. It is designed for gamers who want to fine-tune every aspect of their equipment, from button macros to lighting effects, creating a peripheral that is uniquely their own. With a high-accuracy sensor, a hyper-responsive polling rate, and a battle-hardened build, the Sabre Elite is ready to dominate in any genre, from fast-paced FPS to complex MMOs.Pinpoint Accuracy, Hyper-Responsive Feel\nAt the core of the Sabre Elite is a competition-grade 18,000 DPI optical sensor, providing incredibly precise tracking for both swift maneuvers and pixel-perfect shots. What truly sets it apart is its 2,000Hz hyper-polling technology. By reporting your movements to the PC two times faster than standard gaming mice, it delivers an exceptionally smooth and responsive cursor feel, reducing micro-stutters and ensuring your aim is always true. This is the competitive edge you need to react faster and track targets more smoothly than the opposition.Built for Comfort, Made for Control\nThe Sabre Elite features a classic, ergonomic right-handed shape that has been refined for maximum comfort during long gaming sessions. Its contours are designed to perfectly support a palm grip while also providing the agility needed for claw grip players. The lightweight 95g design is perfectly balanced for control, and the durable, matte finish ensures a confident hold even in the most intense moments of gameplay.Your Mouse, Your Rules: Deep Customization\nUnleash your creativity with eight fully programmable buttons. Using the powerful Corsair iCUE software, you can remap buttons, create complex custom macros for one-click execution of in-game commands, and completely tailor the mouse to your playstyle. The dynamic two-zone RGB backlighting offers near-limitless color options and lighting effects, which can be synchronized with all your other iCUE-compatible Corsair gear to create a stunning, unified gaming setup that is truly yours.Battle-Hardened Build\nBuilt to withstand the rigors of competitive gaming, the Sabre Elite is equipped with high-performance Omron switches rated for 50 million clicks, ensuring a crisp, tactile, and reliable response for years to come. The lightweight, low-drag braided cable is designed to minimize friction, providing an unrestricted, near-wireless feel. The Corsair Sabre Elite RGB is the ultimate command center for the gamer who values both high performance and deep personalization.",
    price: 4299,
    brand: "Corsair",
    imageUrl:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91c2V8ZW58MHx8MHx8fDA%3D",
    stock: 22,
    category: "mouse",
    specs: {
      dpi: "100 - 18,000 DPI",
      connectivity: "Wired (USB)",
      sensorType: "High-Performance Optical",
      weight: "95g",
      pollingRate: "Up to 2,000Hz",
      buttons: "8 Programmable Buttons",
      lighting: "2-Zone Dynamic RGB",
    },
    faq: [
      {
        question: "What is the benefit of a 2,000Hz polling rate?",
        answer:
          "A higher polling rate means the mouse reports its position to the computer more frequently. This results in smoother cursor movement and lower click latency, which can be an advantage in fast-paced games.",
      },
      {
        question: "How do I customize the RGB lighting and buttons?",
        answer:
          "All customization is handled through Corsair's powerful iCUE software, which allows you to control lighting effects, program macros, remap buttons, and adjust DPI settings.",
      },
      {
        question: "Is this mouse good for people with smaller hands?",
        answer:
          "It's a standard-sized ergonomic mouse best suited for medium to large hands, particularly for users who prefer a palm grip. Users with very small hands might find it a bit large.",
      },
      {
        question: "Is the cable detachable?",
        answer:
          "No, the lightweight braided USB cable is permanently attached to the mouse to ensure a stable, high-performance connection.",
      },
      {
        question: "Can I save my settings directly to the mouse?",
        answer:
          "Yes, the Sabre Elite features onboard memory, allowing you to save your DPI and lighting profiles directly to the mouse and use them on any computer without needing iCUE installed.",
      },
      {
        question: "What kind of games is this mouse best for?",
        answer:
          "With its ergonomic shape and multiple programmable buttons, it's a versatile all-rounder, excelling in FPS, MMO, and MOBA games like Valorant, World of Warcraft, and League of Legends.",
      },
    ],
  },
  {
    productId: "M008",
    name: "Dell Essential WM301 Wireless Mouse",
    description:
      "In today's fast-paced world, you need tools that are simple, reliable, and just work. The Dell Essential WM301 is engineered with this philosophy at its core. It is the perfect no-fuss wireless mouse for students, professionals, and home users in India who value a clean workspace and dependable performance for their everyday computing needs. The WM301 is designed to be your steadfast companion, providing the freedom of wireless connectivity, all-day comfort, and incredible battery life in one practical and affordable package.Cut the Cord, Ditch the Clutter\nExperience true freedom with a reliable 2.4 GHz wireless connection. The WM301 allows you to break free from the tangle of cables, creating a neat, minimalist desk setup that enhances your focus and productivity. The tiny USB nano receiver provides a stable, lag-free connection from up to 10 meters away. Simply plug it into your laptop or desktop, and you're ready to go—it's that easy.Designed for All-Day Comfort\nThe WM301 features a comfortable and elegant ambidextrous design, making it a perfect fit for both right-handed and left-handed users. Its contoured shape provides excellent support for your hand, reducing strain and ensuring comfort even after hours of continuous use. Its compact, lightweight form makes it an ideal travel partner, easily slipping into a laptop bag for work on the go.Smooth and Dependable Performance\nAt its heart is a high-definition 1000 DPI optical sensor, perfectly tuned for everyday productivity. It delivers smooth, accurate, and predictable tracking on a wide variety of surfaces, making it ideal for navigating spreadsheets, creating presentations, and browsing the web with ease. The responsive clicks and satisfying scroll wheel make every interaction feel precise and reliable.Power for the Year\nForget about constantly changing batteries. The WM301 is engineered for exceptional power efficiency, delivering an incredible battery life of up to 18 months from a single AA battery. An intelligent sleep mode automatically conserves power when the mouse is not in use, ensuring it's always ready when you are. This incredible endurance means you can work with peace of mind, knowing your mouse won't let you down.Plug-and-Play Simplicity\nThe beauty of the WM301 lies in its simplicity. There is no software to install or complex setup procedures. Just plug the nano receiver into a USB port, and it works instantly with Windows, macOS, and Linux systems. In summary, the Dell Essential WM301 is the smart, reliable, and affordable choice for anyone seeking to enhance their daily productivity.",
    price: 899,
    brand: "Dell",
    imageUrl:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91c2V8ZW58MHx8MHx8fDA%3D",
    stock: 65,
    category: "mouse",
    specs: {
      dpi: "1000 DPI",
      connectivity: "2.4 GHz Wireless",
      sensorType: "Optical",
      weight: "91g (with battery)",
      batteryLife: "Up to 18 months",
      buttons: "3 (Left, Right, Middle Click)",
      batteryType: "1 x AA Battery",
    },
    faq: [
      {
        question: "How do I set up this mouse?",
        answer:
          "Setup is incredibly simple. Just plug the included USB nano receiver into an available USB port on your computer, insert the AA battery, and it will start working automatically.",
      },
      {
        question: "What type of battery does it use and is it included?",
        answer:
          "It uses a single AA battery. Yes, one AA battery is typically included in the package to get you started right away.",
      },
      {
        question:
          "Is this mouse suitable for both left and right-handed users?",
        answer:
          "Yes, it has a symmetrical, ambidextrous design that is comfortable for both left-handed and right-handed users.",
      },
      {
        question: "Will this mouse work on any surface?",
        answer:
          "The optical sensor works well on most common surfaces like desks, mouse pads, and books. It is not recommended for use on glass or highly reflective surfaces.",
      },
      {
        question: "Is this mouse a good size for travel?",
        answer:
          "Yes, its compact and lightweight design makes it an excellent choice for travel. The USB receiver can also be stored inside the mouse for convenience.",
      },
      {
        question: "Is it compatible with my MacBook/Linux computer?",
        answer:
          "Absolutely. It is a plug-and-play device that is fully compatible with Windows, macOS, and most Linux distributions without needing any additional drivers.",
      },
    ],
  },
  // Laptop Products
  {
    productId: "P100",
    name: "MSI Model 100",
    description:
      "The MSI Model 100 is a performance-driven laptop that blends power, portability, and professional-grade features, designed for creators, power users, and students who demand more from their machines. With MSI's reputation for delivering workstation-class internals at accessible prices, this model is no exception. At the heart of the MSI Model 100 lies the 13th Generation Intel Core i5-13420H, an 8-core processor that deftly balances performance and efficiency cores. Whether you're multitasking across productivity apps, rendering videos, or compiling code, the Model 100 handles it all with ease. Coupled with 16GB of dual-channel DDR5 RAM, clocked at 5200 MHz, it offers lightning-fast response times and future-proof memory performance. Storage is another strong suit. With a 512GB PCIe Gen4 NVMe SSD, users benefit from ultra-fast read/write speeds, making large file transfers, boot times, and application launches nearly instantaneous. This is especially advantageous for photographers, video editors, or 3D designers working with large assets. The 15.6-inch Full HD IPS display provides a 1920x1080 resolution with 100% sRGB color accuracy, making it ideal for content creation, photo editing, and video grading. With anti-glare coating and slim bezels, it also ensures an immersive visual experience without eye strain. NVIDIA GTX 1660, punch well above their weight for light creative tasks, 4K playback, and casual gaming like Valorant, Minecraft, and Sims 4. One of MSI's strengths lies in its build quality and thermal engineering. The Model 100 features dual-fan cooling with 4 heat pipes, allowing sustained performance even under heavy load. Despite its internals, the chassis remains thin and relatively lightweight at 1.78 kg, making it practical for portability. Connectivity is generous and future-ready. The Model 100 includes: 1x USB-C with DisplayPort and Power Delivery, 2x USB 3.2 Gen1 Type-A ports, 1x HDMI 2.1 output supporting 4K at 60Hz, 1x Ethernet port, Wi-Fi 6 and Bluetooth 5.3 for reliable wireless connectivity. The keyboard is backlit, tactile, and includes a full-size layout with a numeric keypad, making it perfect for both typing and data-heavy workflows. MSI has also included a 720p HD webcam with noise-reducing dual-array microphones and AI Noise Cancellation—ideal for professional video calls. Battery life clocks in at around 10 hours of mixed use, supported by Fast Charge technology, which can juice the battery up to 60% in under an hour. The 3-cell, 52WHr battery is optimized for performance and mobility. Finally, MSI's Creator Center software offers fine-grained control over performance modes, fan profiles, and resource allocation. Whether you're optimizing for battery life on the go or squeezing maximum power during rendering, the Model 100 gives you total control. In summary, the MSI Model 100 is not just another mid-tier laptop—it's a creative workhorse wrapped in a subtle, professional shell. It delivers workstation-like power in a form factor suitable for classrooms, studios, and home offices alike.",
    price: 93885,
    brand: "MSI",
    imageUrl:
      "https://images.unsplash.com/photo-1657936412057-67a8bb0a04a8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    stock: 5,
    category: "laptop",
    specs: {
      ram: "16GB DDR5",
      storage: "512GB PCIe Gen4 SSD",
      processor: "Intel Core i5-13420H (13th Gen, 8-core)",
      battery: "10 hours",
      display: '15.6" FHD IPS, 100% sRGB',
      backlitKeyboard: "Yes",
      graphics: "NVIDIA GTX 1660",
      weight: "1.78 kg",
      ports: "USB-C, 2x USB-A, HDMI 2.1, Ethernet",
      os: "Windows 11 Home",
    },
    faq: [
      {
        question: "Is the MSI Model 100 suitable for 1080p video editing?",
        answer:
          "Yes, the Intel Core i5-13420H and 16GB DDR5 RAM handle 1080p editing smoothly with Intel Iris Xe graphics.",
      },
      {
        question: "Does it have a color-accurate display?",
        answer:
          "Yes, the 100% sRGB FHD IPS panel is well-suited for design and creative work.",
      },
      {
        question: "Can I connect to an external monitor via USB-C?",
        answer:
          "Yes, both the USB-C and HDMI 2.1 ports support external displays.",
      },
      {
        question: "What kind of SSD is included?",
        answer:
          "A fast 512GB PCIe Gen4 SSD ensures quick boot times and snappy performance.",
      },
      {
        question: "Is the RAM upgradeable?",
        answer:
          "Yes, DDR5 RAM is upgradeable depending on model configuration.",
      },
      {
        question: "Is it portable?",
        answer:
          "Weighing 1.78 kg, it's not ultra-light, but manageable for frequent movement.",
      },
      {
        question: "Can it handle programming or analytics?",
        answer:
          "Absolutely, the i5 chip and 16GB RAM can handle Python, SQL, Excel, and BI tools.",
      },
      {
        question: "How's the battery life?",
        answer: "Expect around 7–8 hours with regular usage.",
      },
      {
        question: "Does it support fast charging?",
        answer: "Yes, it charges quickly for productivity on the go.",
      },
      {
        question: "How's the thermal performance?",
        answer: "It remains cool and quiet for general and moderate workloads.",
      },
    ],
  },
  {
    productId: "P101",
    name: "Acer Model 101",
    description:
      "In today's fast-paced environment, where students are preparing for competitive exams and professionals in cities like Bengaluru are navigating the demands of a hybrid work culture, the need for a reliable and efficient computing companion has never been greater. The Acer Model 101 is engineered precisely for this reality. It is a thoughtfully designed laptop that focuses on delivering a seamless, powerful, and enduring performance for day-to-day tasks. Eschewing flashy gimmicks for practical innovation, the Model 101 is the quintessential tool for students, remote workers, and multitasking professionals who require a dependable workhorse in a compact, lightweight, and refreshingly affordable package.The Engine Room: 12th Gen Hybrid PerformanceUnder the hood, the Acer Model 101 is powered by the intelligent 12th Generation Intel Core i3-1215U processor. This is not a typical dual-core CPU; it features Intel's revolutionary hybrid architecture, combining two high-performance Performance-cores (P-cores) with four power-efficient Efficient-cores (E-cores). This design allows the laptop to smartly allocate resources: the P-cores handle demanding, immediate tasks like launching applications or running complex calculations in a spreadsheet, while the E-cores efficiently manage background processes like system updates or antivirus scans. The result is a remarkably snappy and responsive user experience that doesn't drain the battery. Whether you're juggling multiple Chrome tabs for research, attending a crucial virtual meeting on Microsoft Teams, or streaming educational content in Full HD, this processor handles it all without breaking a sweat.Supporting this capable CPU is 8GB of high-speed LPDDR4X RAM. This ensures smooth, stutter-free multitasking, allowing you to switch between common productivity applications effortlessly. The LP in LPDDR4X stands for Low Power, meaning the memory is optimized for energy efficiency, further contributing to the laptop's impressive battery life. For storage, the 256GB PCIe NVMe Solid-State Drive (SSD) represents a massive leap in performance. It enables the system to boot up in seconds, load applications almost instantly, and transfer large files in a fraction of the time it would take a traditional hard drive. This solid-state architecture also means quieter, cooler operation and greater durability against accidental bumps and drops.An Immersive and Comfortable Visual Experience The visual centerpiece of the Model 101 is its 14-inch Full HD (1920x1080) LED-backlit display. This crisp, vibrant screen brings content to life with sharp text, natural colours, and excellent detail, making it perfect for both work and entertainment. To combat the strain of long hours spent in front of the screen—a daily reality for students and professionals alike—Acer has integrated its vision-care technologies. Acer ComfyView™, a matte anti-glare finish, significantly reduces reflections and distracting glare from overhead lights or windows. Simultaneously, Acer BlueLightShield™ works at the software level to reduce harmful blue light emissions, which can disrupt sleep patterns and cause eye fatigue. This dual-pronged approach makes the Model 101 an ideal companion for late-night study sessions or marathon coding sprints.Designed for Modern Mobility and Durability . Weighing just 1.45 kg and measuring a slim 18mm in thickness, the Acer Model 101 is built for life on the move. It's light enough to carry in a backpack across a university campus or on the Namma Metro without being a burden. The chassis, while constructed from durable plastic, features a premium matte finish that resists fingerprints and lends it a professional, understated aesthetic. The user experience is further enhanced by a comfortable, quiet chiclet-style keyboard with good key travel, and a responsive precision touchpad that supports multi-finger gestures for intuitive navigation in Windows 11.Connectivity is robust and future-proof. The inclusion of a versatile USB-C 3.2 Gen 1 port is a standout feature, allowing you to charge the laptop, transfer data at high speeds, and connect to an external display with a single cable. This is complemented by two traditional USB-A 3.2 ports, a full-size HDMI 1.4 port, and the latest Wi-Fi 6 and Bluetooth 5.2 standards for blazing-fast and reliable wireless performance, even in congested network environments. All-Day Battery and Crystal-Clear Communication One of the most critical features for any portable device is battery life, and here the Model 101 truly excels. It offers up to 10 hours of real-world use on a single charge, providing the confidence to get through a full day of classes or work meetings without being tethered to a power outlet—a crucial feature during unexpected power cuts. And when you do need to top up, the fast-charging capability can replenish the battery to 50% in under 45 minutes. The integrated 720p HD webcam and digital microphone array, enhanced with AI-powered noise reduction, ensure you are seen and heard with clarity during all your virtual interactions. In conclusion, the Acer Model 101 is a masterclass in pragmatic design. It intelligently delivers on the features that matter most, making it the smart, reliable, and value-driven choice for India's ambitious generation.",
    price: 86216,
    brand: "Acer",
    imageUrl:
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bGFwdG9wfGVufDB8fDB8fHww",
    stock: 7,
    category: "laptop",
    specs: {
      ram: "8GB LPDDR4X",
      storage: "256GB PCIe SSD",
      processor: "Intel Core i3-1215U (12th Gen, 6-core)",
      battery: "Up to 10 hours",
      display: '14" FHD LED, BlueLightShield',
      backlitKeyboard: "Yes",
      graphics: "NVIDIA GTX 960",
      weight: "1.45 kg",
      ports: "USB-C, 2x USB-A, HDMI, SD card",
      os: "Windows 11 Home",
    },
    faq: [
      {
        question: "Is this laptop good for students?",
        answer:
          "Yes, it's ideal for schoolwork, online classes, and everyday productivity.",
      },
      {
        question: "Can it run MS Office applications?",
        answer: "Yes, Word, Excel, and PowerPoint run without issues.",
      },
      {
        question: "Can I upgrade the RAM?",
        answer: "No, the 8GB LPDDR4X RAM is soldered and non-upgradable.",
      },
      {
        question: "Is it okay for basic coding?",
        answer:
          "Suitable for light coding and web development; not ideal for heavier IDEs.",
      },
      {
        question: "How's the webcam and mic quality?",
        answer: "Good enough for Zoom calls and online learning.",
      },
      {
        question: "Does it have eye protection features?",
        answer: "Yes, Acer's BlueLightShield reduces eye strain.",
      },
      {
        question: "How is the display for daily use?",
        answer:
          'The 14" FHD LED display is crisp and clear for browsing and documents.',
      },
      {
        question: "Is there an SD card slot?",
        answer: "Yes, it includes one for easy media transfer.",
      },
      {
        question: "Can I connect it to a monitor?",
        answer: "Yes, both USB-C and HDMI ports support display output.",
      },
      {
        question: "Is it lightweight?",
        answer: "Yes, at 1.45 kg, it's ultra-portable and bag-friendly.",
      },
    ],
  },
  {
    productId: "P102",
    name: "Lenovo Model 102",
    description:
      "On a day that celebrates freedom, the modern Indian professional seeks their own form of independence: the liberty to work, create, and connect from anywhere, on their own terms. The Lenovo Model 102 is engineered to be the ultimate enabler of this professional freedom. Drawing inspiration from the legendary reliability of Lenovo's ThinkPad series, this compact, business-focused laptop is meticulously designed for the dynamic professionals, ambitious students, and mobile workers of cities like Bengaluru who demand a device that is secure, powerful, and enduring. It is a masterclass in pragmatic engineering, delivering a potent blend of performance and portability for those who are not just doing a job, but building a future.The Heart of Productivity: AMD Ryzen Power. At its core, the Model 102 is powered by the exceptionally efficient and capable AMD Ryzen 5 7530U processor. Built on the proven Zen 3 architecture, this CPU's 6-core, 12-thread design is a multitasking powerhouse, adept at handling the complex workflows of today's professionals. It intelligently balances high-performance bursts for demanding tasks with incredible efficiency for background processes, ensuring a consistently smooth experience. This means you can run data-heavy Excel workbooks, participate in a high-definition Microsoft Teams call with your global counterparts, and have dozens of browser tabs open for research simultaneously—all without a hint of lag. This robust processor is paired with 16GB of high-speed LPDDR4x RAM, running at a brisk 4266 MHz. This generous amount of memory is the new standard for future-proof productivity, ensuring the system never slows down even when juggling enterprise-grade applications. The RAM is soldered directly to the motherboard, a design choice that not only allows for the laptop's slim profile but also enhances data transfer speeds and reliability. Complementing this is a capacious 512GB PCIe Gen3 SSD, which provides near-instantaneous access to your digital world. System boot-up from a cold start takes under ten seconds, and large applications load in a flash, saving precious time for the busy professional.A Display and Design Built for MobilityThe visual experience is delivered through a crisp 13.3-inch Full HD (1920x1080) IPS display. This compact screen is the perfect canvas for mobile productivity, offering wide viewing angles and vibrant, accurate colours essential for reviewing presentations or collaborating with a colleague. With 300 nits of brightness and a superb anti-glare treatment, the display remains clear and comfortable to view in a variety of lighting conditions, from a brightly lit corporate office in Electronic City to a seat by the window in a coffee shop.Weighing in at a mere 1.25 kg, the Model 102 is the epitome of portability. Its legendary Lenovo keyboard offers a typing experience that is second to none, with sculpted keycaps and a deep, tactile feedback that makes writing for hours a genuine pleasure. For enhanced collaboration, the durable hinge allows the screen to rotate a full 180 degrees, letting the laptop lay completely flat for easy screen sharing during client meetings.Ironclad Security and Premium CollaborationIn an era of hybrid work, security is non-negotiable. The Model 102 is fortified with a suite of business-grade security features. A fingerprint sensor is seamlessly integrated into the power button for one-touch, password-free login. A hardware TPM 2.0 chip encrypts your data from the moment you boot up, safeguarding sensitive information. For absolute peace of mind, a physical privacy shutter on the sharp 1080p webcam guarantees that you are only on camera when you choose to be.The collaboration suite is designed for crystal-clear communication. The high-resolution webcam is paired with Dolby Audio-tuned speakers and a dual-array microphone system that filters out background noise, ensuring you look and sound professional in every virtual meeting.All-Day Battery for Uninterrupted Work . The Model 102’s standout feature is its marathon battery life. The 56WHr battery delivers an incredible 12 to 13 hours of real-world usage, enough to power you through a full workday from your morning commute to late-night emails, without ever reaching for the charger. For those rare moments when you do run low, Lenovo's RapidCharge technology is a lifesaver, replenishing 80% of the battery in under an hour. Shipping with Windows 11 Pro and the intuitive Lenovo Vantage software, the Lenovo Model 102 is more than just a laptop; it's a declaration of your professional independence—a secure, reliable, and powerful companion for wherever your work takes you.",
    price: 68957,
    brand: "Lenovo",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1681566925324-ee1e65d9d53e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGFjZXIlMjBsYXB0b3B8ZW58MHx8MHx8fDA%3D",
    stock: 10,
    category: "laptop",
    specs: {
      ram: "16GB LPDDR4X (soldered)",
      storage: "512GB PCIe Gen3 SSD",
      processor: "AMD Ryzen 5 7530U (6-core, 12-thread)",
      battery: "Up to 13 hours",
      display: '13.3" FHD IPS, Anti-glare',
      backlitKeyboard: "Yes",
      graphics: "Integrated Radeon Graphics",
      weight: "1.25 kg",
      ports: "2x USB-C, USB-A, HDMI",
      os: "Windows 11 Pro",
    },
    faq: [
      {
        question: "Is this good for business professionals?",
        answer:
          "Yes, it comes with Windows 11 Pro, privacy features, and great battery life.",
      },
      {
        question: "Does it support charging over USB-C?",
        answer: "Yes, both USB-C ports support charging and display output.",
      },
      {
        question: "What's the battery life like?",
        answer: "Up to 13 hours—perfect for travel and long workdays.",
      },
      {
        question: "Can I upgrade the RAM?",
        answer: "No, the 16GB LPDDR4X RAM is soldered and non-upgradable.",
      },
      {
        question: "Is multitasking smooth?",
        answer:
          "Yes, the Ryzen 5 chip and 16GB RAM handle multiple apps easily.",
      },
      {
        question: "How's the display quality?",
        answer:
          'The anti-glare 13.3" IPS screen is sharp and easy on the eyes.',
      },
      {
        question: "Does it overheat?",
        answer: "No, it maintains good thermal performance under normal use.",
      },
      {
        question: "Can it connect to external monitors?",
        answer: "Yes, via HDMI or USB-C.",
      },
      {
        question: "Is it lightweight?",
        answer: "Extremely—it weighs just 1.25 kg.",
      },
      {
        question: "Is the storage fast enough?",
        answer:
          "Yes, the 512GB PCIe Gen3 SSD ensures quick boot and load times.",
      },
    ],
  },
  {
    productId: "P103",
    name: "Dell Model 103",
    description:
      "In today's dynamic world, the modern Indian professional and student requires a tool that grants them true freedom: the liberty to be productive, creative, and connected, wherever their ambitions take them. The Dell Model 103 is a rock-solid productivity laptop engineered precisely for this purpose. It is a declaration of dependability, designed for the demanding environments of small businesses, remote workers, and ambitious students across India. For those juggling complex documents, critical client meetings, and heavy multitasking in a city like Bengaluru, this system doesn't chase fleeting trends—it delivers practical, consistent power where it matters most, day in and day out.Unstoppable Performance for Your Daily Grind   At the heart of the Model 103 lies the Intel Core i5-1135G7, a robust 4-core, 8-thread processor from Intel's highly regarded 11th Generation Tiger Lake family. It provides the responsive, real-world performance needed to power through your daily workflow. This is complemented by integrated Intel Iris Xe graphics, a significant leap in performance for visual tasks like editing presentations or light creative work in Adobe Photoshop. With 12GB of DDR4 RAM in a dual-channel configuration, the laptop is a true multitasking champion, ensuring a remarkably smooth experience even when you have dozens of browser tabs open, a large Excel file running calculations, and a high-definition Zoom call in progress. The 256GB PCIe NVMe SSD ensures the system boots in seconds and your most-used applications load in a flash.An Expansive View, Easy on the Eyes. Your workspace is a vibrant 15.6-inch Full HD (1920x1080) display. This expansive canvas is perfect for productivity, allowing you to view large spreadsheets or have two documents open side-by-side without constant scrolling. To combat the strain of long hours, the screen features an anti-glare coating and Dell's ComfortView technology, which reduces harmful blue light emissions to protect your eyes and reduce fatigue during marathon work sessions. Built Tough, Designed for Comfort. Engineered to withstand the rigors of a daily commute on Bengaluru's roads, the Model 103 features a durable, minimalist body with a professional matte graphite grey finish. The user experience is headlined by a full-size, backlit keyboard with a dedicated numeric keypad—a massive productivity booster for anyone working with numbers. The comfortable, well-spaced keys make typing for long periods a pleasure. All the Ports You Need, No Dongles Required Stay connected without compromise. The Model 103 is equipped with a comprehensive selection of ports, including USB-C, multiple USB-A ports, HDMI, an SD card reader, and a crucial RJ-45 Ethernet port for when you need the most stable, high-speed wired internet connection for critical tasks. This no-dongle philosophy ensures you are always prepared, whether in the office or on the move. Power Through Your Day (and Power Cuts) With up to 9 hours of battery life, the Model 103 is designed to last through your workday, providing a reliable buffer during frequent power cuts. When you do need a boost, Dell's ExpressCharge™ technology is a game-changer, replenishing up to 50% of the battery in just 30-40 minutes—perfect for a quick top-up during a lunch break.Look and Sound Professional Online. The integrated 720p HD webcam includes a physical privacy shutter for absolute peace of mind. The dual-array microphones with noise reduction and stereo speakers powered by Waves MaxxAudio Pro work in harmony to ensure you are seen and heard with crystal clarity during every virtual meeting and online class.",
    price: 99112,
    brand: "Dell",
    imageUrl:
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bGFwdG9wfGVufDB8fDB8fHww",
    stock: 6,
    category: "laptop",
    specs: {
      ram: "12GB DDR4",
      storage: "256GB PCIe NVMe SSD",
      processor: "Intel Core i5-1135G7 (11th Gen, 4-core)",
      battery: "8-9 hours",
      display: '15.6" FHD Anti-glare',
      backlitKeyboard: "Yes",
      graphics: "Intel Iris Xe",
      weight: "1.85 kg",
      ports: "USB-C, 2x USB-A, HDMI, Ethernet, SD",
      os: "Windows 11 Home",
    },
    faq: [
      {
        question: "Is this good for office and productivity use?",
        answer: "Yes, it's reliable for multitasking and daily productivity.",
      },
      {
        question: "Is the keyboard comfortable?",
        answer:
          "Yes, it's a full-size backlit keyboard ideal for typing long hours.",
      },
      {
        question: "Does it support wired internet?",
        answer: "Yes, it includes an Ethernet port.",
      },
      {
        question: "Is there an SD card reader?",
        answer: "Yes, helpful for photographers and media professionals.",
      },
      {
        question: "Can I upgrade the storage?",
        answer: "Yes, the 256GB SSD is upgradable.",
      },
      {
        question: "What's the RAM configuration?",
        answer: "12GB DDR4 – usually 4GB soldered + 8GB slot.",
      },
      {
        question: "How long does the battery last?",
        answer: "About 8–9 hours depending on usage.",
      },
      {
        question: "Can I use dual displays?",
        answer: "Yes, via HDMI and USB-C.",
      },
      {
        question: "How's it for video conferencing?",
        answer: "Decent webcam and mic for Zoom, Teams, etc.",
      },
      {
        question: "Is it heavy to carry daily?",
        answer: "At 1.85 kg, it's a bit heavier but still manageable.",
      },
    ],
  },
  {
    productId: "P104",
    name: "Asus Model 104",
    description:
      "In the vibrant creator economy, a new generation of Indian freelancers, entrepreneurs, and artists are forging their own paths, driven by passion and innovation. For this dynamic class of professionals in hubs like Bengaluru, the line between a demanding work project and a personal passion has disappeared. The Asus Model 104 is engineered precisely for this reality. It is a premium, high-performance laptop that grants you the creative freedom to blur the lines between work and play, a sophisticated tool that doesn’t force you to choose between power and portability. It is designed to keep pace with your ambition, from building a client presentation by day to editing 4K video and gaming by night.The Creative Powerhouse: 13th Gen Intel and NVIDIA Graphics. At the heart of the Model 104 is the formidable Intel Core i7-1360P processor. Part of Intel's cutting-edge 13th Generation lineup, this CPU features an advanced 12-core hybrid architecture, intelligently combining 4 high-performance Performance-cores with 8 power-efficient Efficient-cores. The P-cores handle the heavy lifting, rocketing up to 5.0 GHz to tear through intensive tasks like video rendering, compiling code, or applying complex filters. Meanwhile, the E-cores masterfully manage background tasks, ensuring a fluid and responsive multitasking experience.Elevating the visual performance is the dedicated NVIDIA GeForce MX550 graphics card. This is the creative accelerator that integrated graphics simply cannot match. It provides the dedicated VRAM and processing power needed for a smooth, lag-free timeline in video editing software like DaVinci Resolve, faster rendering in Adobe Premiere Pro, and seamless graphic design work. After hours, it transforms into a capable gaming companion, allowing you to enjoy popular e-sports titles like Valorant, Fortnite, or Rocket League at respectable frame rates.The Foundation of Flow: High-Speed Memory and Storage. To ensure your workflow is never bottlenecked, the Model 104 is equipped with 16GB of fast DDR4 RAM. This is the sweet spot for creative multitasking, allowing you to run demanding applications like the Adobe Creative Suite alongside dozens of browser tabs and communication tools without a stutter. For those with an eye on the future, the memory is expandable up to 24GB, giving you the freedom to upgrade as your projects grow in complexity. Storage is handled by a massive 1TB PCIe Gen3 NVMe SSD. This expansive, high-speed drive means you can keep your entire portfolio, large 4K video assets, and software library directly on your machine for instant access, eliminating the reliance on slow external hard drives and dramatically reducing boot and application load times.A Canvas for Creativity: The 100% sRGB Display. For any creator, color is paramount. The 15.6-inch NanoEdge IPS display is your professional-grade canvas, boasting a sharp Full HD (1920x1080) resolution and, most importantly, 100% sRGB color gamut coverage. This ensures true-to-life color accuracy, meaning the colors you see on screen are the colors that will appear in print or on other calibrated devices—a non-negotiable feature for client work. The slim NanoEdge bezels create an immersive, near-borderless viewing experience, while 300 nits of brightness keeps the screen clear and vibrant. Asus Splendid and Tru2Life technologies further enhance the visuals by intelligently optimizing color, contrast, and sharpness for a more engaging picture. Sophistication in Motion: Design and Ergonomics. The Asus Model 104 is as elegant as it is powerful. The chassis, featuring a durable aluminum lid, keeps the weight down to a travel-friendly 1.75 kg. A standout feature is the precision-engineered ErgoLift hinge, which automatically tilts the backlit keyboard to a more comfortable typing angle when the lid is opened. This not only reduces wrist strain during long typing sessions but also creates extra space underneath for improved airflow, allowing the advanced Asus IceCool thermal system to keep components running cool and quiet even under heavy load.Next-Generation Connectivity and Premium Features Ready for the modern workflow, the Model 104 features Wi-Fi 6E, providing access to the exclusive 6 GHz band for a faster, more stable connection in congested environments. The versatile USB-C port supports charging, high-speed data transfer, and DisplayPort for connecting to an external monitor—a true single-cable solution. For audiophiles and remote professionals, the Harman/Kardon-certified speakers deliver rich, immersive sound, while the AI Noise-Canceling microphone ensures your voice is crystal-clear on calls by filtering out background distractions. Security is instant and effortless with the IR webcam, which enables hands-free facial recognition login via Windows Hello.In summary, the Asus Model 104 is a versatile and powerful creative partner that refuses to compromise. It is the perfect machine for the new generation of Indian creators who work hard, play hard, and demand a laptop that can seamlessly do both.",
    price: 102375,
    brand: "Asus",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1681336999969-516d993e88cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGFzdXMlMjBsYXB0b3B8ZW58MHx8MHx8fDA%3D",
    stock: 4,
    category: "laptop",
    specs: {
      ram: "16GB DDR4 (expandable to 24GB)",
      storage: "1TB PCIe Gen3 SSD",
      processor: "Intel Core i7-1360P (13th Gen, 12-core)",
      battery: "Up to 9 hours",
      display: '15.6" FHD IPS, 100% sRGB',
      backlitKeyboard: "Yes",
      graphics: "NVIDIA GeForce MX550",
      weight: "1.75 kg",
      ports: "USB-C, 2x USB-A, HDMI, MicroSD",
      os: "Windows 11 Home",
    },
    faq: [
      {
        question: "Is this suitable for Adobe Suite and light 3D rendering?",
        answer:
          "Yes, the i7 processor, 16GB RAM, and MX550 GPU make it a great machine for Photoshop, Illustrator, Premiere Pro, and basic 3D tasks.",
      },
      {
        question: "Can I upgrade the RAM or storage later?",
        answer:
          "Yes, the RAM is expandable up to 24GB and the 1TB SSD offers ample room for storage.",
      },
      {
        question: "How's the display for designers or content creators?",
        answer:
          "It has a 100% sRGB color-accurate screen, perfect for color-critical tasks like photo and video editing.",
      },
      {
        question: "Does it heat up under creative workloads?",
        answer:
          "Fans do ramp up under load, especially with multitasking or rendering, but cooling is effective.",
      },
      {
        question: "Is it portable enough for daily commuting?",
        answer:
          "At 1.75 kg, it's reasonably portable for a performance laptop—good balance of power and mobility.",
      },
      {
        question: "What's the battery backup like?",
        answer: "Expect up to 9 hours of use depending on your workload.",
      },
      {
        question: "Does it support external displays?",
        answer: "Yes, through HDMI and USB-C.",
      },
      {
        question: "Can it handle casual gaming?",
        answer:
          "Yes, the MX550 can run older titles and light modern games at medium settings.",
      },
      {
        question: "Is there a MicroSD card reader?",
        answer: "Yes, ideal for content creators needing fast transfers.",
      },
      {
        question: "Does it support fast charging?",
        answer: "Yes, for quick recharges between tasks.",
      },
    ],
  },
  {
    productId: "P105",
    name: "Acer Aspire Lite AL105",
    description:
      "Empower your journey of learning and growth with the Acer Aspire Lite AL105. This laptop is engineered for the ambitious students, first-time job seekers, and aspiring professionals of India who need a reliable and affordable tool to achieve their dreams. For those in bustling hubs like Bengaluru, it's the perfect first step into digital independence, providing the freedom to learn, connect, and create without a heavy financial burden.The Dependable Performer: 12th Gen Intel Core i3At its heart is the Intel Core i3-1215U, a modern processor with a smart hybrid architecture. Its Performance-cores handle your active tasks like browsing and video calls, while its Efficient-cores manage background processes, ensuring a smooth experience and great battery life. Combined with 8GB of DDR4 RAM, it's perfectly tuned for everyday multitasking—whether you're attending online classes on Zoom, researching with multiple Chrome tabs, or preparing your first resume in MS Word. The fast 512GB NVMe SSD means no more waiting; the laptop boots up in seconds and your applications launch instantly, with plenty of space for all your projects, notes, and memories.A Clear View for Work and Play The large 15.6-inch Full HD display provides a crisp, clear canvas for everything you do. The expansive screen real estate is great for seeing more of a spreadsheet or having two documents side-by-side, boosting your productivity. When it's time to unwind, movies and YouTube content look sharp and vibrant. Acer's BlueLightShield technology also helps reduce eye strain during those long study sessions or late-night projects.Practical Design and Essential ConnectivityThe Aspire Lite is designed for practical, everyday use. It features a clean, professional look and a lightweight chassis that's easy to carry to class or the office. It comes equipped with all the essential ports you need, including USB-C for modern devices, USB-A for your existing peripherals, and an HDMI port for connecting to a larger screen or projector for presentations All-Day Companion. With a battery designed to last through your most important lectures and work sessions, you can focus on what matters without constantly searching for a power outlet. The Aspire Lite is more than just a laptop; it's a reliable partner for your daily hustle, offering the perfect blend of performance, practicality, and value to kickstart your journey to success.",
    price: 38990,
    brand: "Acer",
    imageUrl:
      "https://images.unsplash.com/photo-1555117391-6c0795768da8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    stock: 25,
    category: "laptop",
    specs: {
      ram: "8GB DDR4 (expandable to 16GB)",
      storage: "512GB PCIe Gen3 SSD",
      processor: "Intel Core i3-1215U (12th Gen, 6-core)",
      battery: "Up to 6 hours",
      display: '15.6" FHD (1920x1080) Anti-Glare',
      backlitKeyboard: "No",
      graphics: "Intel UHD Graphics",
      weight: "1.7 kg",
      ports: "1x USB-C (Data), 2x USB-A, HDMI",
      os: "Windows 11 Home",
    },
    faq: [
      {
        question:
          "Is this laptop good for online classes and using Microsoft Office?",
        answer:
          "Absolutely. It's designed specifically for these tasks, offering smooth performance for video calls, browsing, word processing, and spreadsheets.",
      },
      {
        question: "Can I play games like Valorant or BGMI on this?",
        answer:
          "This laptop is not designed for gaming. It can handle very simple, older, or browser-based games, but it will not run modern titles like Valorant smoothly.",
      },
      {
        question: "Is the RAM upgradeable in the future?",
        answer:
          "Yes, the RAM can be upgraded. It comes with 8GB, but you can expand it to 16GB for even better multitasking performance down the line.",
      },
      {
        question: "What is the build quality like?",
        answer:
          "It features a durable polycarbonate chassis designed to handle the rigors of daily student or office life. It's built to be a reliable everyday machine.",
      },
      {
        question: "Does the keyboard have backlighting?",
        answer:
          "No, this model does not include a backlit keyboard, which is common for laptops in this budget category.",
      },
      {
        question: "Is it suitable for a beginner learning to code?",
        answer:
          "Yes, it's an excellent choice for beginners learning programming languages like Python, Java, C++, or for web development (HTML, CSS, JavaScript).",
      },
      {
        question: "What is the real-world battery life?",
        answer:
          "You can expect around 5 to 6 hours of continuous mixed-use, such as browsing, watching videos, and document editing, on a single charge.",
      },
      {
        question: "Can I connect it to an external monitor?",
        answer:
          "Yes, it has a full-size HDMI port that allows you to easily connect to an external monitor or a projector.",
      },
    ],
  },
  {
    productId: "P106",
    name: "Lenovo Ideapad Slim 3(2025)",
    description:
      "Celebrate your own independence to achieve, create, and innovate with the Lenovo IdeaPad Slim 3 (2025 Edition). This laptop is engineered for the next generation of India's doers—the ambitious students, the resourceful startup founders, and the hybrid professionals of Bengaluru who demand performance without compromise. It's a smart powerhouse that doesn't just enable your work; it accelerates it, offering the freedom to tackle demanding tasks from anywhere your hustle takes you.The Multitasking Powerhouse: AMD Ryzen 5 & 16GB RAM\nAt the core of the IdeaPad Slim 3 is the formidable AMD Ryzen 5 7530U processor. With 6 cores and 12 threads, this CPU is a multitasking beast, built to handle modern, complex workloads with remarkable efficiency. This means you can compile code in VS Code, run a local server, manage a data-heavy Excel workbook, and participate in a high-definition Microsoft Teams call simultaneously, all without a hint of lag. Supporting this powerhouse is a generous 16GB of high-speed DDR4 RAM. This is the end of multitasking compromises, providing a massive performance ceiling that ensures your workflow remains fluid and responsive, today and for years to come. The lightning-fast 512GB NVMe SSD ensures your system boots in seconds and your applications load instantly, keeping you in a state of uninterrupted flow.A Vibrant Window to Your Work\nYour ideas come to life on the 14-inch Full HD IPS display. This screen is the perfect balance of portability and productivity, offering crisp details, vibrant colours, and wide viewing angles thanks to its IPS panel—perfect for sharing your screen during a team collaboration. With 300 nits of brightness and an anti-glare finish, it remains clear and comfortable to view in various lighting conditions, from a brightly lit office to a seat by the window in your favourite café. The experience is enhanced by user-facing speakers tuned with Dolby Audio, delivering clear and immersive sound for both video calls and entertainment.Premium Design, Practical Experience\nThe IdeaPad Slim 3 lives up to its name with a sleek, lightweight chassis weighing just 1.4 kg, making it an effortless companion on your daily commute. The design is clean, professional, and features the legendary Lenovo keyboard—a backlit, ergonomic layout with sculpted keycaps that provides a quiet, comfortable, and exceptionally accurate typing experience, perfect for long coding sessions or writing reports. Security and convenience are seamlessly integrated with a one-touch fingerprint reader on the power button for instant, secure login with Windows Hello, and a physical privacy shutter on the webcam for absolute peace of mind.Connectivity for the Modern Professional\nThis laptop is equipped for the demands of a modern workflow. A full-function USB-C port allows you to charge the device, transfer data at high speeds, and connect to an external 4K display—all with a single cable. This is complemented by traditional USB-A ports, HDMI, and the latest Wi-Fi 6 for blazing-fast, reliable wireless connectivity in congested environments. The 7-8 hour battery life is built for the unpredictable Bengaluru workday, and with Lenovo's RapidCharge technology, a quick 60-minute charge can restore up to 80% of the battery, ensuring you're always ready for what's next.In summary, the Lenovo IdeaPad Slim 3 is the intelligent choice for those who are ready to take their ambitions to the next level. It's a feature-packed, reliable, and powerful machine that delivers a premium experience without the premium price tag.",
    price: 48490,
    brand: "Lenovo",
    imageUrl:
      "https://images.unsplash.com/photo-1504707748692-419802cf939d?q=80&w=1147&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    stock: 18,
    category: "laptop",
    specs: {
      ram: "16GB DDR4 (Soldered)",
      storage: "512GB PCIe Gen3 SSD",
      processor: "AMD Ryzen 5 7530U (6-Core, 12-Thread)",
      battery: "Up to 8 hours with RapidCharge",
      display: '14" FHD (1920x1080) IPS Anti-Glare, 300 nits',
      backlitKeyboard: "Yes",
      graphics: "Integrated AMD Radeon Graphics",
      weight: "1.4 kg",
      ports: "1x USB-C (Full Function: Power/Data/Display), 2x USB-A, HDMI",
      os: "Windows 11 Home",
      security: "Fingerprint Reader, Webcam Privacy Shutter",
    },
    faq: [
      {
        question:
          "Is this laptop good for programming and software development?",
        answer:
          "Yes, it's an excellent choice. The powerful 6-core Ryzen 5 processor and 16GB of RAM can comfortably handle coding, compiling, and running local servers and virtual machines.",
      },
      {
        question: "Can it handle photo and video editing?",
        answer:
          "It's great for photo editing in applications like Photoshop and is capable of smooth 1080p video editing, making it a solid choice for content creators and hobbyists.",
      },
      {
        question: "Is the 14-inch screen comfortable for long work sessions?",
        answer:
          "Many users find the 14-inch size to be the perfect balance of portability and productivity. The FHD IPS panel is sharp and easy on the eyes, and you can always connect to a larger external monitor via HDMI or USB-C.",
      },
      {
        question: "Can the RAM be upgraded later?",
        answer:
          "No, the 16GB of RAM is soldered to the motherboard to achieve the slim design and higher performance speeds. It is not user-upgradeable.",
      },
      {
        question: "Does the USB-C port support charging the laptop?",
        answer:
          "Yes, the USB-C port is full-function, which means it supports Power Delivery (charging the laptop), data transfer, and video output (DisplayPort).",
      },
      {
        question: "How is the build quality?",
        answer:
          "It features a durable polycarbonate chassis with a premium finish, designed to be both lightweight for portability and sturdy enough for daily use.",
      },
      {
        question: "Is the webcam good for meetings?",
        answer:
          "It has a standard 720p HD webcam with a physical privacy shutter. It's perfectly suitable for clear video in meetings on platforms like Zoom, Teams, and Google Meet.",
      },
      {
        question: "How fast is the 'RapidCharge' feature?",
        answer:
          "Lenovo's RapidCharge technology can typically recharge the battery from 0 to 80% in approximately 60 minutes, which is extremely convenient for quick top-ups.",
      },
    ],
  },
  {
    productId: "P107",
    name: "Asus VivoBook 14",
    description:
      "In today's digital world, having a reliable laptop is no longer a luxury—it's an essential gateway to learning, connection, and opportunity. The Asus VivoBook Go 14 is engineered to be that perfect first step. It is a smart, accessible, and ultra-portable laptop designed for the students, first-time users, and families of India who need a dependable companion for their daily digital journey. For those in bustling hubs like Bengaluru, it provides the freedom to learn online, stay connected, and manage everyday tasks with ease and efficiency.Essential Everyday Performance\nAt the heart of the VivoBook Go 14 is the efficient Intel Celeron N4500 processor. This CPU is designed to handle your essential daily tasks—like web browsing with multiple tabs, sending emails, attending video calls, and working on documents in Microsoft Office—with smooth, responsive performance while sipping power. It is paired with 8GB of fast LPDDR4 RAM, a crucial feature that ensures you can multitask between a few applications without frustrating slowdowns. The 256GB NVMe SSD provides a massive speed boost compared to older laptops; your system boots up in seconds, applications launch quickly, and your files are always instantly accessible.Clear and Comfortable Viewing\nThe 14-inch HD (1366x768) display is bright and clear for all your daily needs. The anti-glare finish is a key feature, reducing distracting reflections and making it comfortable to view for hours, whether you're in a brightly lit classroom or working near a window at home. The compact screen size, combined with slim bezels, creates an immersive viewing experience while maintaining the laptop's excellent portability.Designed for Life on the Go\nWeighing an incredibly light 1.3 kg and featuring a slim profile, the VivoBook Go 14 is built for mobility. It's effortless to carry in a backpack across campus or in a tote bag to a nearby café. The practical design includes a clever 180-degree lay-flat hinge, which makes it easy to share your screen with a classmate or colleague during collaborative projects. Despite its price, the build is durable and designed to handle the demands of everyday use.All-Day Battery for True Portability\nOne of the standout features of the VivoBook Go 14 is its exceptional battery life. Thanks to its power-efficient processor, you can get up to 10 hours of use on a single charge. This gives you the true freedom to leave the charger at home and get through a full day of classes, work, or browsing from the couch without ever worrying about finding a power outlet. It's the ultimate companion for a life in motion.In summary, the Asus VivoBook Go 14 is the smart, simple, and incredibly accessible laptop that provides all the essentials for a productive digital life. It is the perfect, value-driven choice for anyone needing a reliable and long-lasting companion for learning, connecting, and exploring the world online.",
    price: 27990,
    brand: "Asus",
    imageUrl:
      "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    stock: 45,
    category: "laptop",
    specs: {
      ram: "8GB LPDDR4 (Soldered)",
      storage: "256GB NVMe SSD",
      processor: "Intel Celeron N4500 (Dual-Core)",
      battery: "Up to 10 hours",
      display: '14" HD (1366x768) Anti-Glare',
      backlitKeyboard: "No",
      graphics: "Integrated Intel UHD Graphics",
      weight: "1.3 kg",
      ports: "1x USB-C (Data), 1x USB-A 3.2, 1x USB-A 2.0, HDMI",
      os: "Windows 11 Home",
    },
    faq: [
      {
        question:
          "Is this laptop fast enough for everyday tasks like browsing and watching YouTube?",
        answer:
          "Yes, absolutely. It is specifically designed for these essential tasks and provides a smooth, responsive experience for web browsing, video streaming, email, and Microsoft Office.",
      },
      {
        question:
          "Can it run software like Photoshop or be used for video editing?",
        answer:
          "No, this laptop is not powerful enough for demanding creative software. It is intended for light productivity, browsing, and media consumption.",
      },
      {
        question:
          "Is the HD screen resolution good enough for a 14-inch display?",
        answer:
          "Yes, for a 14-inch screen, the HD resolution is sharp and clear for everyday tasks like reading text, attending online classes, and watching videos.",
      },
      {
        question: "What is the main advantage of this laptop?",
        answer:
          "Its key benefits are its excellent portability due to its very light weight (1.3 kg) and its outstanding all-day battery life, all at a very affordable price.",
      },
      {
        question: "Can I upgrade the RAM or storage later on?",
        answer:
          "No, on this ultra-portable model, the RAM and storage are typically soldered to the motherboard to save space and cost, and are not designed to be user-upgradeable.",
      },
      {
        question: "Is this a good choice for my child's online schooling?",
        answer:
          "It is an excellent and highly recommended choice for online classes, school projects, and educational websites due to its long battery life, lightweight design, and reliable performance for these tasks.",
      },
      {
        question: "What is the build material of the laptop?",
        answer:
          "The laptop has a lightweight and durable polycarbonate (plastic) build, which helps keep it portable and affordable.",
      },
      {
        question: "Does it have a good webcam for video calls?",
        answer:
          "It comes with a standard webcam that is perfectly suitable for clear video during online classes and meetings on platforms like Zoom, Google Meet, and Microsoft Teams.",
      },
    ],
  },
];

// Function to seed the database

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${products.length} sample products`);

    // Display the created products
    console.log("\nSample Products Created:");
    products.forEach((product) => {
      console.log(`- ${product.name} (${product.brand}) - Rs${product.price}`);
    });

    mongoose.connection.close();
    console.log("\nDatabase seeding completed!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();
