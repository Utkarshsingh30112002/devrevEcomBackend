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
      "The Logitech MX200 is a versatile wireless mouse designed for users who prioritize precision and comfort, making it a perfect fit for both professional and personal use. Whether you're conquering spreadsheets, designing intricate graphics, or casually browsing the web, the MX200 is engineered to deliver smooth, responsive performance across all applications. At the core of the MX200 is its advanced Optical Sensor Technology, boasting a DPI range of up to 1600. This ensures accurate tracking on a variety of surfaces, from high-gloss desks to rugged fabric mouse pads. Experience minimal latency and seamless movement, catering to tasks that demand high precision—such as photo editing, data analysis, and even lightweight gaming. In terms of design, the MX200 features an ergonomic contour that's optimized for right-handed users, ensuring comfort during extended use. Its form factor is slightly larger than standard mice, providing a natural hand position that reduces wrist strain. Soft rubber grips enhance control, while the lightweight construction (weighing just 100g) makes it effortless to navigate across your workspace. The mouse offers robust connectivity with its 2.4 GHz wireless technology, allowing a stable connection up to 10 meters away, which is ideal for a tidy setup free of cables. The included unifying receiver can connect to multiple Logitech devices, saving valuable USB ports. Battery efficiency is one of the MX200's standout features. It runs on a standard AA battery and offers impressive battery life of up to 12 hours. An integrated power switch and smart sleep mode conserve energy when the mouse is not in use, ensuring it's always ready when you are. Complementary software support includes the Logitech Options software, allowing users to customize button functions and gestures. Plus, the mouse is compatible with both Windows and macOS, making it an excellent choice for multi-device users. Additional features include: Hyper-fast scrolling wheel for rapid navigation through long documents and web pages. Five programmable buttons to tailor your workflow, enabling quick access to favorite functions or applications. Compatibility with Logitech Flow for seamless control and file sharing across multiple computers. In summary, the Logitech MX200 combines ergonomic comfort with precise functionality, providing a reliable tool for professionals and enthusiasts alike. Its sleek design, paired with long-lasting performance and customizable features, makes it a valuable addition to any desktop, whether for work or leisure pursuits. Embrace the power of effortless navigation with the Logitech MX200, where every click, scroll, and gesture meets industry-leading reliability and sophistication.",
    price: 2999,
    brand: "Logitech",
    imageUrl: "https://example.com/logitech-mx200.jpg",
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
      "The HP Z3700 isn't just a mouse; it's a statement of style and functionality. Built for those who appreciate both aesthetics and performance, this wireless mouse is crafted to seamlessly integrate with your home or office environment. Its sleek lines and modern design are not only eye-catching but also provide a comfortable grip, making it an ideal companion for prolonged use. Sporting a slim and symmetrical design, the HP Z3700 caters to both left and right-handed users, ensuring a comfortable fit for anyone. Available in a range of vibrant colors, it allows users to match their mouse with their personal style or existing hardware aesthetics. This mouse is remarkably compact, making it incredibly easy to slip into a laptop bag or purse without taking up too much space, which is ideal for mobile professionals. Underneath its stylish exterior lies a 1200 DPI optical sensor, providing smooth and accurate tracking on most surfaces. This level of precision is perfectly suited for day-to-day tasks like navigating documents and browsing the internet, whether at home or in the office. The performance consistency ensures that casual users and professionals alike enjoy a fluid computing experience. The HP Z3700 operates on a robust 2.4 GHz wireless connection, offering a stable interface with minimal interference up to 30 feet. Insert the USB nano receiver into your computer's USB port, and you're ready to work—no additional software is required. For those frequently on the move, this mouse provides the ultimate in ease-of-use and setup, so you can focus on your tasks without the hassle of cables getting in the way. Efficiency is at the core of the HP Z3700's design ethos. It is engineered to offer up to 16 hours of battery life from a single AA battery, reducing the annoyance of frequent replacements. The mouse also incorporates intelligent sleep and waken functions to further extend battery longevity, ensuring that it remains a reliable component of your tech lineup. Tailored for a variety of users, the HP Z3700 is equally at home in a business meeting, a study nook, or your home office. Its quiet operation makes it a suitable choice for environments where keeping noise to a minimum is crucial. HP's commitment to sustainability is evident in the Z3700, and its design embraces eco-friendly practices by minimizing packaging waste. Furthermore, the mouse is universally compatible with multiple operating systems, including Windows and macOS, which enhances its versatility. In conclusion, the HP Z3700 is not just about getting the job done but doing so with style and simplicity. Its blend of high performance, chic design, and long battery life ensures that users can enjoy an uninterrupted, efficient computing experience.",
    price: 1499,
    brand: "HP",
    imageUrl: "https://example.com/hp-z3700.jpg",
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
      "The Razer Basilisk X represents the pinnacle of wireless gaming performance. For the dedicated gamer and tech enthusiast, this mouse is more than just a tool; it is an extension of your skills and capabilities in the digital realm. Designed with the competitive gamer in mind, the Basilisk X offers a combination of speed, precision, and cutting-edge technology that ensures you stay ahead of the curve. The Razer Basilisk X boasts a sleek and aggressive design that immediately sets it apart. Its ergonomic form factor is crafted to fit snugly in the palm of your hand, providing a grip that minimizes fatigue even during marathon gaming sessions. This ensures increased comfort and control, which is crucial when precision is needed most. The mouse is optimized for right-handed use, complete with accessible side buttons that can be customized for quick in-game actions. Equipped with a state-of-the-art 16,000 DPI optical sensor, the Basilisk X is capable of tracking even the finest movements with exceptional accuracy. Whether you're sniping enemies from a distance or engaging in quick head-to-head combats, the precision that the sensor provides is unparalleled. This high level of DPI is adjustable via Razer Synapse software, allowing gamers to switch sensitivity on-the-fly depending on the necessity of the moment. The highlight of the Basilisk X is its Razer HyperSpeed Wireless technology, claiming one of the lowest rates of latency in wireless peripherals. This technology provides a stable connection and smooth performance critical for high-stakes gaming, outperforming even some wired alternatives. Furthermore, the mouse can switch to Bluetooth connectivity seamlessly to extend battery life for non-gaming tasks like web browsing and media consumption. Energy efficiency is at the heart of the Basilisk X's design. While operating in Bluetooth mode, the battery life can last up to 450 hours, while HyperSpeed Wireless mode offers around 285 hours of continuous gaming use. The mouse operates on a single AA battery, keeping the device light and nimble, which is vital during fast-paced gaming. Customization is a hallmark of Razer products, and the Basilisk X is no exception. It features 6 programmable buttons, allowing users to assign macros and secondary functions through Razer Synapse software. These features add a new depth of strategy in gameplay and productivity tasks. Moreover, the mechanical switches in the buttons are rated for up to 50 million clicks, ensuring durability and responsiveness. In addition to Windows compatibility, the Basilisk X extends its utility across platforms such as macOS and Chrome OS, allowing users from different ecosystems to enjoy the mouse's full capabilities without additional software. Ultimately, the Razer Basilisk X embodies what it means to be a top-tier gaming mouse—precision, performance, and customizability in one compelling package. Whether in the heat of battle or managing daily tasks, this mouse delivers reliable performance that will enhance your digital life.",
    price: 3999,
    brand: "Razer",
    imageUrl: "https://example.com/razer-basilisk-x.jpg",
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
      "The Dell WM126 is engineered with simplicity and efficiency at its core, providing a reliable wireless solution for all your everyday computing needs. Whether working from home, in the office, or on the go, this mouse integrates seamlessly into any workstation setup. The WM126 features a straightforward, classic design that is both lightweight and portable. Its small size, while perfect for anyone who needs to carry it in a laptop or briefcase, does not compromise on comfort. This mouse supports an ambidextrous design, ensuring accessibility for both right-handed and left-handed users. Its smooth, contoured shape provides a comfortable grip that is vital for extended periods of use. With a 1000 DPI optical sensor, the WM126 guarantees accurate tracking for everyday tasks. Whether you're navigating complex spreadsheets, crafting presentations, or simply browsing the web, this mouse offers smooth and dependable performance. The responsive sensor ensures quick reaction times, enhancing productivity in both business and educational environments. Operating at a 2.4 GHz frequency, the WM126's wireless connection is reliable, providing a consistent signal strength with a range of up to 10 meters. This allows users to maintain a neat workspace free from the clutter of cables, allowing for straightforward setup and easy movement. Powered by a single AA battery, the WM126 is designed to last, offering up to 12 hours of battery life. This longevity is achieved through sophisticated energy efficiency design and an automatic sleep function that conserves power when the mouse is not in use. This mouse features plug-and-play simplicity, enabling quick setup with any computer system. The inclusion of a tiny USB nano receiver allows the WM126 to work across a wide range of operating systems, including Windows, macOS, and Ubuntu Linux, making it a versatile addition to any tech arsenal. Available in multiple colors, the WM126 offers a choice to suit personal style or match with other Dell products, enhancing the aesthetic of any personal or professional space. The Dell WM126 stands out with its reputation for durability and reliability—a hallmark of Dell products. Its solid construction assures users of lasting performance and makes it an excellent choice for those who value quality and simplicity at an affordable price. In summary, the Dell WM126 is all about providing the essentials in a sleek and efficient form. Users can expect dependable performance, a comfortable design, and the ease of a durable wireless setup. As a reliable daily driver for both personal and professional use, the WM126 proves that sometimes, simplicity is key.",
    price: 899,
    brand: "Dell",
    imageUrl: "https://example.com/dell-wm126.jpg",
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
      "For those who value mobility without compromising on performance, the Microsoft BT5600 is a compelling choice, offering a balance of portability, precision, and sophisticated design. Designed to support flexible lifestyles, this mouse is ideal for mobile professionals and students seeking efficiency on the go. The BT5600 is crafted with attention to detail, featuring an elegant, compact design suitable for slipping into laptop bags or backpacks. It's comfortable to hold with a subtle contouring ideal for many hand sizes, enhancing ease of use during long working or study sessions. Its sleek profile is both practical and stylish, making it a natural fit for those who prioritize both functionality and aesthetics. The mouse integrates a 1000 DPI high-definition optical sensor, known for delivering smooth tracking on various surfaces. This precision ensures that users experience fluid navigation through tasks such as document editing, graphical work, or digital presentations, enhancing productivity considerably. A standout feature of the BT5600 is its seamless Bluetooth integration, offering a clean setup by connecting directly to devices without the need for a USB receiver. This eliminates cable clutter and frees up USB ports, enhancing device interoperability. The mouse is designed to work across platforms, making it advantageous for users with multiple devices requiring a single, cohesive input solution. The BT5600 offers impressive battery performance, achieving up to 6 hours of use with a single AA battery. This is made possible through efficient energy management, including power-saving sleep modes when the mouse is idle, ensuring the device is always ready when you need to reconnect. The mouse boasts a responsive scroll wheel and precisely placed buttons that offer tactile feedback and quiet operation, promoting an ergonomic and fatigue-free user experience. These features are especially beneficial during prolonged periods of use. The BT5600's wide-ranging compatibility with Windows, macOS, and Android enhances its utility across both mobile and stationary devices. Its ease of pairing through Bluetooth ensures that setup is straightforward, providing easy portability between home and office environments. How you use technology is personal, and Microsoft recognizes this by creating a product that caters to user convenience. With an emphasis on portability and simplicity, the BT5600 can effortlessly support users whether at work, at home, or on the move. The Microsoft BT5600 excels at delivering quality performance combined with the freedom of wireless connectivity, supporting a lifestyle that requires adaptability and efficiency. By integrating thoughtful design with reliable functionality, it redefines expectations of what a portable mouse can achieve, all within a sleek and accessible package.",
    price: 2199,
    brand: "Microsoft",
    imageUrl: "https://example.com/microsoft-bt5600.jpg",
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
  // Laptop Products
  {
    productId: "P100",
    name: "MSI Model 100",
    description:
      "The MSI Model 100 is a performance-driven laptop that blends power, portability, and professional-grade features, designed for creators, power users, and students who demand more from their machines. With MSI's reputation for delivering workstation-class internals at accessible prices, this model is no exception. At the heart of the MSI Model 100 lies the 13th Generation Intel Core i5-13420H, an 8-core processor that deftly balances performance and efficiency cores. Whether you're multitasking across productivity apps, rendering videos, or compiling code, the Model 100 handles it all with ease. Coupled with 16GB of dual-channel DDR5 RAM, clocked at 5200 MHz, it offers lightning-fast response times and future-proof memory performance. Storage is another strong suit. With a 512GB PCIe Gen4 NVMe SSD, users benefit from ultra-fast read/write speeds, making large file transfers, boot times, and application launches nearly instantaneous. This is especially advantageous for photographers, video editors, or 3D designers working with large assets. The 15.6-inch Full HD IPS display provides a 1920x1080 resolution with 100% sRGB color accuracy, making it ideal for content creation, photo editing, and video grading. With anti-glare coating and slim bezels, it also ensures an immersive visual experience without eye strain. Intel Iris Xe Graphics, while integrated, punch well above their weight for light creative tasks, 4K playback, and casual gaming like Valorant, Minecraft, and Sims 4. One of MSI's strengths lies in its build quality and thermal engineering. The Model 100 features dual-fan cooling with 4 heat pipes, allowing sustained performance even under heavy load. Despite its internals, the chassis remains thin and relatively lightweight at 1.78 kg, making it practical for portability. Connectivity is generous and future-ready. The Model 100 includes: 1x USB-C with DisplayPort and Power Delivery, 2x USB 3.2 Gen1 Type-A ports, 1x HDMI 2.1 output supporting 4K at 60Hz, 1x Ethernet port, Wi-Fi 6 and Bluetooth 5.3 for reliable wireless connectivity. The keyboard is backlit, tactile, and includes a full-size layout with a numeric keypad, making it perfect for both typing and data-heavy workflows. MSI has also included a 720p HD webcam with noise-reducing dual-array microphones and AI Noise Cancellation—ideal for professional video calls. Battery life clocks in at around 7–8 hours of mixed use, supported by Fast Charge technology, which can juice the battery up to 60% in under an hour. The 3-cell, 52WHr battery is optimized for performance and mobility. Finally, MSI's Creator Center software offers fine-grained control over performance modes, fan profiles, and resource allocation. Whether you're optimizing for battery life on the go or squeezing maximum power during rendering, the Model 100 gives you total control. In summary, the MSI Model 100 is not just another mid-tier laptop—it's a creative workhorse wrapped in a subtle, professional shell. It delivers workstation-like power in a form factor suitable for classrooms, studios, and home offices alike.",
    price: 93885,
    brand: "MSI",
    imageUrl: "https://example.com/msi-model-100.jpg",
    stock: 5,
    category: "laptop",
    specs: {
      ram: "16GB DDR5",
      storage: "512GB PCIe Gen4 SSD",
      processor: "Intel Core i5-13420H (13th Gen, 8-core)",
      battery: "7-8 hours",
      display: '15.6" FHD IPS, 100% sRGB',
      backlitKeyboard: "Yes",
      graphics: "Intel Iris Xe",
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
      "Designed to meet the needs of students, remote workers, and multitasking professionals, the Acer Model 101 focuses on efficiency, simplicity, and affordability—without sacrificing modern features. This laptop is perfect for those who need dependable day-to-day computing in a compact and lightweight chassis. Under the hood, the Acer Model 101 features a 12th Gen Intel Core i3-1215U, a 6-core hybrid processor (2 performance cores + 4 efficiency cores) that delivers solid everyday performance with excellent power efficiency. Tasks like browsing with multiple tabs, working on spreadsheets, attending virtual meetings, or streaming HD content are handled effortlessly. The 8GB LPDDR4X RAM ensures smooth multitasking across common productivity applications, while the 256GB PCIe NVMe SSD offers rapid boot-up, application loading, and data access. The SSD also contributes to lower power consumption and quieter operation compared to traditional hard drives. Its 14-inch Full HD LED-backlit display provides a 1920x1080 resolution with sharp visuals and natural colors. Acer's BlueLightShield™ and ComfyView™ technologies reduce glare and eye fatigue, making it ideal for long study or work sessions. The display's compact size and thin bezels help maintain a highly portable design, weighing just 1.45 kg and measuring 18mm in thickness. Despite its budget-friendly positioning, the Model 101 includes thoughtful additions like a precision touchpad, chiclet-style keyboard, and a durable hinge mechanism tested for thousands of open/close cycles. The laptop's body, though plastic, has a premium matte finish that resists fingerprints and smudges. Connectivity includes: 1x USB-C 3.2 Gen 1 (data + power + display), 2x USB-A 3.2, 1x HDMI 1.4, Wi-Fi 6 and Bluetooth 5.2 for fast and reliable wireless performance. A 720p HD webcam with digital microphone makes virtual meetings and online classes crystal-clear. The stereo speakers deliver decent output for voice and media, though serious media users may still prefer headphones or external speakers. The battery life stands out, offering up to 10 hours of real-world use. Whether you're working from a library, attending Zoom classes, or typing on the go, the Model 101 won't need a recharge mid-day. The battery supports fast charging, taking it from 0 to 50% in under 45 minutes. The Acer Model 101 runs Windows 11 Home with Acer's suite of support software including Acer Care Center for updates and diagnostics. In conclusion, the Acer Model 101 doesn't aim to be flashy—it aims to be smart, efficient, and reliable. For students, remote workers, and anyone looking for a no-fuss laptop that gets the job done, it's one of the best values in its class.",
    price: 86216,
    brand: "Acer",
    imageUrl: "https://example.com/acer-model-101.jpg",
    stock: 7,
    category: "laptop",
    specs: {
      ram: "8GB LPDDR4X",
      storage: "256GB PCIe SSD",
      processor: "Intel Core i3-1215U (12th Gen, 6-core)",
      battery: "Up to 10 hours",
      display: '14" FHD LED, BlueLightShield',
      backlitKeyboard: "Yes",
      graphics: "Intel UHD Graphics",
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
      "The Lenovo Model 102 is a compact, business-focused laptop designed for professionals, students, and mobile workers who value reliability, security, and long battery life. Taking inspiration from Lenovo's renowned ThinkPad series, the Model 102 blends smart engineering with practical performance in a portable package. Powering the Model 102 is the efficient and capable AMD Ryzen 5 7530U, a 6-core/12-thread processor based on Zen 3 architecture. This CPU is built for productivity, offering a strong balance of single- and multi-core performance. Whether you're editing documents, managing spreadsheets, attending Zoom calls, or running light data analytics workloads, this system handles them all without a hitch. With 16GB of soldered LPDDR4x RAM running at 4266 MHz, the laptop supports heavy multitasking, multiple browser windows, and enterprise-grade tools like MS Teams, Outlook, and Slack, without slowing down. Paired with a fast 512GB PCIe Gen3 SSD, boot times are under 10 seconds and application loads are seamless. The 13.3-inch Full HD (1920x1080) IPS display features anti-glare treatment and 300 nits of brightness, making it suitable for indoor and semi-outdoor use. The compact screen size keeps the laptop lightweight at just 1.25 kg, ideal for professionals who travel frequently. The Model 102 stands out for its business-ready features: Fingerprint sensor integrated into the power button, TPM 2.0 encryption module for secure boot and file protection, Physical privacy shutter on the 1080p webcam, Dolby Audio-tuned speakers and dual-array mics for clear virtual meetings. The full-sized keyboard offers Lenovo's signature typing experience—quiet, deeply tactile, and durable. The touchpad is responsive, and the hinge rotates 180° for flexible usage in various environments. Port selection includes: 2x USB-C (one for charging and data, one for data/video), 1x USB-A 3.2, HDMI 1.4b, Wi-Fi 6 and Bluetooth 5.2. Battery life is a standout feature. With a 56WHr battery, the Model 102 delivers 12 to 13 hours of usage on a single charge under typical productivity scenarios. Lenovo's RapidCharge technology gives you 80% battery in under an hour—perfect for fast top-ups between meetings. It ships with Windows 11 Pro, making it ideal for enterprise environments, and comes preloaded with Lenovo Vantage for diagnostics, driver updates, and power optimization. In short, the Lenovo Model 102 offers a near-perfect balance of portability, performance, and security—tailored for professionals and business learners who need a dependable and secure computing companion wherever work takes them.",
    price: 68957,
    brand: "Lenovo",
    imageUrl: "https://example.com/lenovo-model-102.jpg",
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
      "The Dell Model 103 is a rock-solid productivity laptop engineered for reliability, comfort, and performance. Ideal for small business users, remote workers, students, and professionals juggling documents, meetings, and multitasking, this system doesn't chase flash—it delivers practical power where it matters most. At the core is an Intel Core i5-1135G7, a 4-core, 8-thread processor from Intel's 11th Generation Tiger Lake family. Clocked at up to 4.2 GHz with Intel Turbo Boost Technology, it delivers responsive performance for spreadsheets, web apps, presentations, and office communication tools. Intel Iris Xe integrated graphics brings improved performance for visual tasks like HD video editing, rendering presentations, or light creative work in Photoshop or Illustrator. With 12GB of DDR4 RAM (8GB + 4GB in dual-channel configuration), the Model 103 enables smooth multitasking even when juggling dozens of browser tabs, Excel files, and cloud-based platforms like Salesforce or Zoom. The 256GB PCIe NVMe SSD ensures fast boot times and quick access to frequently used files, making your workflow consistently snappy. The 15.6-inch anti-glare Full HD display (1920x1080) delivers a sharp and comfortable viewing experience, with Dell's ComfortView technology to reduce harmful blue light. The wide display area makes it great for multitasking with side-by-side apps or detailed spreadsheet work, while its anti-glare coating is a boon for working under fluorescent office lights or near windows. The laptop's design is clean and minimalist, featuring a matte graphite grey finish, durable ABS-polycarbonate body, and a well-spaced full-size keyboard with backlighting and numeric keypad. Dell's build quality ensures it's rugged enough to withstand daily commutes and everyday use. In terms of I/O, the Model 103 is very well-equipped: 1x USB-C (data only), 2x USB-A 3.2 Gen 1, 1x HDMI 1.4, 1x RJ-45 Ethernet port, SD card reader, Wi-Fi 5 and Bluetooth 5.0. This laptop includes a 720p HD webcam with a privacy shutter, dual-array microphones with noise reduction, and stereo speakers powered by Waves MaxxAudio Pro, offering clear sound for calls and presentations. Battery life is a key highlight for on-the-go users. The 3-cell 42WHr battery delivers around 8–9 hours of mixed-use productivity on a single charge. Dell's ExpressCharge™ feature recharges up to 50% of battery life in just 30–40 minutes, making quick top-ups easy during lunch or between classes. Security features include TPM 2.0, optional Windows Hello PIN support, and BIOS-level protections available via Dell Command software. With Windows 11 Home pre-installed and Dell's bundled SupportAssist diagnostics, the Model 103 is ready out-of-the-box for both home offices and classroom environments. In summary, the Dell Model 103 is a trustworthy companion for users who prioritize durability, functionality, and long-term usability. It's a balanced workhorse for everyday tasks—powerful enough to support growing workloads, yet simple enough to maintain and manage.",
    price: 99112,
    brand: "Dell",
    imageUrl: "https://example.com/dell-model-103.jpg",
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
      "The Asus Model 104 is a premium mid-range laptop designed for users who blur the lines between work and play. Whether you're building presentations by day or editing videos and streaming by night, the Model 104 is built to keep up—thanks to a combination of cutting-edge performance, dedicated graphics, and polished aesthetics. Under the hood, this system runs on the Intel Core i7-1360P, a 12-core (4 Performance + 8 Efficiency) processor that hits up to 5.0 GHz. This processor is part of Intel's 13th Gen lineup and offers fantastic performance-per-watt ratios, enabling smooth operation even under demanding multitasking and creative workloads. Graphics are powered by an NVIDIA GeForce MX550, offering a step up from integrated GPUs. While it won't compete with gaming-class RTX cards, it's more than capable of handling: 1080p video editing in DaVinci Resolve or Premiere Pro, Graphic design in Adobe Suite, 3D rendering and light CAD, Modern games like Fortnite or Rocket League on medium settings. Paired with 16GB DDR4 RAM (expandable to 24GB) and a 1TB PCIe Gen3 NVMe SSD, this laptop ensures high-speed boot times, file transfers, and plenty of space for large creative assets or projects. Multitasking between tabs, apps, and media workflows is fluid and reliable. The 15.6-inch NanoEdge IPS display delivers a sharp 1920x1080 resolution with excellent 100% sRGB color accuracy, slim bezels, and 300-nit brightness. It's ideal for creators who need color precision, and it features Asus Splendid and Tru2Life technologies for visual optimization. The laptop weighs just 1.75 kg, thanks to a thin aluminum lid and carefully balanced chassis. The ErgoLift hinge slightly raises the base during typing for better airflow and typing comfort. The keyboard is backlit, quiet, and accompanied by a large precision touchpad with palm rejection. Port selection is versatile: 1x USB-C 3.2 Gen 1 with DisplayPort + charging, 2x USB-A 3.2, 1x HDMI 2.1, 1x MicroSD card reader, Wi-Fi 6E and Bluetooth 5.3. Battery life is rated at up to 9 hours, with a 65W USB-C fast charger included. It supports up to 60% charge in 49 minutes—ideal for mobile workflows and hybrid work schedules. Additional features include: Harman/Kardon speakers with AI noise suppression, 720p webcam with IR for facial recognition (Windows Hello), MyAsus software for system tuning, app mirroring, and diagnostics. With Windows 11 Home pre-installed and solid thermals (thanks to Asus IceCool cooling system), the Asus Model 104 is an all-rounder with flair. It fits neatly into the lifestyle of a designer, freelancer, entrepreneur, or power student. In short, the Asus Model 104 is the kind of machine that doesn't force you to choose between power and portability. It's an elegant multitasker that works just as hard as you do—across work, play, and everything in between.",
    price: 102375,
    brand: "Asus",
    imageUrl: "https://example.com/asus-model-104.jpg",
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
];

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
