const translationDefinitions = {
  en: {
    nav: {
      primaryNavigation: "Primary navigation",
      dashboard: "Dashboard",
      products: "Products",
      orders: "Orders",
      expenses: "Expenses",
      inventory: "Inventory",
      help: "Help",
      meetDeveloper: "About",
      openSidebar: "Open sidebar",
      closeSidebar: "Close sidebar",
      openUserMenu: "Open user menu",
    },
    common: {
      search: "Search",
      action: "Action",
      add: "Add",
      update: "Update",
      cancel: "Cancel",
      category: "Category",
      description: "Description",
      about: "About",
      date: "Date:",
      dateShort: "Date",
      amount: "Amount:",
      amountShort: "Amount",
      notes: "Notes:",
      notesShort: "Notes",
      qty: "Qty",
      calculated: "(Calculated)",
      switchToChinese: "Switch language to Chinese",
      switchToEnglish: "Switch language to English",
      guestUser: "Guest User",
      localMode: "Local Mode",
      preferences: "Preferences",
      dataStorage: "Data & Storage",
      privacySettings: "Privacy Settings",
      signInComingSoon: "Sign in coming soon",
      preferencesComingSoon: "Preferences panel is planned for a future version.",
      dataStorageComingSoon: "Data and storage tools are planned for a future version.",
    },
    dashboard: {
      summary: "Summary",
      businessWorkspace: "Business Workspace",
      quickActions: "Quick Actions",
      quickActionsDesc: "Quickly create or update key business records from the dashboard.",
      recentActivity: "Recent Activity",
      recentActivityDesc: "Latest saved records from local browser data.",
      latestProduct: "Latest product",
      latestOrder: "Latest order",
      latestExpense: "Latest expense",
      noProductsYet: "No products yet",
      noOrdersYet: "No orders yet",
      noExpensesYet: "No expenses yet",
      orderStatusOverview: "Order Status Overview",
      orderStatusOverviewDesc: "Current order status summary.",
      analytics: "Analytics",
      revenue: "Revenue",
      balance: "Balance",
      ordersCount: "Orders",
      totalSales: "Total Sales",
      totalSalesDollars: "Total Sales ($)",
      salesByCategory: "Sales by Product Category",
      viewRevenueDetails: "View revenue details on the Orders page",
      viewExpenseDetails: "View expense details on the Expenses page",
      viewOrdersDetails: "View orders on the Orders page",
      currentBalanceSummary: "Current balance summary",
      salesChartDesc: "Bar chart showing total sales grouped by product category, based on saved product data.",
      expensesChartDesc: "Donut chart showing expense totals grouped by transaction category, based on saved expense data.",
    },
    products: {
      addProduct: "Add Product",
      downloadCSV: "Export to CSV",
      productID: "Product ID:",
      productIDShort: "Product ID",
      productName: "Product Name",
      productDescription: "Product Description:",
      productCategory: "Product Category:",
      productPrice: "Product Price:",
      unitsSold: "Number of Units Sold:",
      unitsSoldShort: "Units Sold",
      chooseProduct: "Choose a product",
      chooseCategory: "Choose a category",
      price: "Price",
      editProduct: "Edit product",
      deleteProduct: "Delete product",
      hats: "Hats",
      drinkware: "Drinkware",
      clothing: "Clothing",
      accessories: "Accessories",
      homeDecor: "Home decor",
      baseballCaps: "Baseball caps",
      snapbacks: "Snapbacks",
      beanies: "Beanies",
      bucketHats: "Bucket hats",
      mugs: "Mugs",
      waterBottles: "Water bottles",
      tumblers: "Tumblers",
      tshirts: "T-shirts",
      sweatshirts: "Sweatshirts",
      hoodies: "Hoodies",
      pillowCases: "Pillow cases",
      toteBags: "Tote bags",
      stickers: "Stickers",
      posters: "Posters",
      framedPosters: "Framed posters",
      canvasPrints: "Canvas prints",
      peaceEmbroideredCap: "Peace embroidered cap",
      floralLotusPrintedBottle: "Floral lotus printed bottle",
      palestineSweater: "Palestine sweater",
      vibesPrintedPoster: "Vibes printed poster",
      morrocanPrintPillowCase: "Morrocan print pillow case",
    },
    orders: {
      addOrder: "Add Order",
      exportCSV: "Export to CSV",
      orderID: "Order ID:",
      orderIDShort: "Order ID",
      orderDate: "Order Date:",
      orderDateShort: "Order Date",
      itemName: "Item Name:",
      itemNameShort: "Item Name",
      itemPrice: "Item Price:",
      itemPriceShort: "Item Price",
      quantityBought: "Quantity Bought:",
      shippingFee: "Shipping Fee:",
      shippingFeeShort: "Shipping Fee",
      taxes: "Taxes (VAT/GST/HST):",
      taxesShort: "Taxes",
      orderStatus: "Order Status:",
      orderStatusShort: "Order Status",
      totalOrderAmount: "Total Order Amount:",
      orderTotalShort: "Order Total",
      chooseItem: "Choose an item",
      chooseStatus: "Choose a status",
      pending: "Pending",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      totalRevenue: "Total Revenue",
      editOrder: "Edit order",
      deleteOrder: "Delete order",
    },
    expenses: {
      addExpense: "Add Expense",
      expenseCategory: "Expense Category",
      categoryLabel: "Category:",
      chooseExpenseCategory: "Choose an expense category",
      serialNumber: "S/N",
      totalExpenses: "Total Expenses",
      rent: "Rent",
      orderFulfillment: "Order Fulfillment",
      utilities: "Utilities",
      supplies: "Supplies",
      miscellaneous: "Miscellaneous",
      editExpense: "Edit expense",
      deleteExpense: "Delete expense",
    },
    help: {
      usingGuide: "Using BizTrack: A Quick Guide",
      whatIsBizTrack: "What is BizTrack?",
      whatIsBizTrackText: "BizTrack is your go-to business management tool designed with small business owners in mind. It's an all-in-one platform that helps you effortlessly manage your products, track orders, and stay on top of your finances. Let me walk you through the basics:",
      navigatingDashboard: "Navigating the Dashboard",
      navigatingDashboardText: "The Dashboard is your central hub, giving you a snapshot of your business's overall performance. Here, you'll find key metrics like total expenses, revenues, profits and the number of orders. It's your command center for a quick overview.",
      expensesPage: "Expenses Page",
      recordExpensesText: "Record Your Expenses: Head to the Expenses page to add your business expenses. Fill in the date, choose a category, enter the amount, and jot down any notes. It's that simple.",
      editDeleteExpensesText: "Edit or Delete Expenses: Made a mistake? You can easily edit or delete expense records right from the Expenses page.",
      ordersPage: "Orders Page",
      trackOrdersText: "Track Your Orders: On the Orders page, you can keep tabs on all your orders. Each entry details the product, quantity, and order status.",
      effortlessEditingText: "Effortless Editing: Need to update an order status? Click the Edit button and make your changes.",
      addingNewEntry: "Adding a New Expense, Order or Product",
      addingNewEntryStep1: "Click Add Expense or the equivalent button on the order or product page.",
      addingNewEntryStep2: "Fill in the product details, order details, or expense details.",
      addingNewEntryStep3: "Submit the form and the new record will appear on the relevant page and dashboard.",
      sortingSearching: "Sorting and Searching Entries/Tables",
      sortingSearchingStep1: "Click a table heading to sort records by that column.",
      sortingSearchingStep2: "Use the search box at the top of each page to find matching records.",
      exportToCSVTitle: "Export to CSV",
      exportToCSVText: "Click Export to CSV to download a backup of your business data.",
      helpClosingText: "BizTrack is designed to be intuitive, user-friendly, and adaptable to your business needs.",
      contactPrompt: "Have questions, feedback, or want to connect? Feel free to reach out!",
    },
    about: {
      codingJourney: "My Coding Journey",
      aboutIntroTitle: "Hey, I'm Sumayyah!",
      aboutIntroText: "Welcome to my little corner of the internet, where I'm rolling up my sleeves and diving into the coding world. I'm not your typical tech guru; I'm just a small business owner navigating entrepreneurship and learning to code.",
      aboutBizTrackOrigin: "BizTrack was born from the need to keep track of products, orders, and finances in one place.",
      aboutBizTrackPurpose: "BizTrack is my attempt at making business management more straightforward for small business owners.",
      aboutLearningJourney: "I'm a student at GetCoding NL, and BizTrack is my first module project.",
      aboutCoachThanks: "I am grateful for the guidance of my coding coach, Sam Russell.",
      aboutInvitation: "Whether you're into small business life, coding, or both, you're welcome here.",
      aboutClosing: "Here's to coding, business, and everything in between.",
    },
    privacy: {
      cookieBannerTitle: "Your privacy matters",
      cookieBannerText: "BizTrack uses local storage to remember your language, cookie choice, and locally saved business data.",
      cookieAccept: "Accept",
      cookieReject: "Reject",
      cookiePrivacyPolicy: "Privacy Policy",
      privacyPolicyTitle: "Privacy Policy",
      privacyPolicyIntro: "This page explains how BizTrack uses browser storage in this coursework prototype.",
      privacyStoredDataTitle: "What BizTrack stores",
      privacyStoredDataText: "BizTrack stores products, orders, expenses, language preference, and cookie consent choice locally in your browser.",
      privacyLocalStorageTitle: "Cookies and local storage",
      privacyLocalStorageText: "BizTrack mainly uses localStorage to support core app features. This prototype does not use third-party advertising cookies.",
      privacyChoicesTitle: "Your choices",
      privacyChoicesText: "You can accept or reject optional storage. Rejecting optional storage does not disable core app functionality.",
      privacySecurityTitle: "Security notice",
      privacySecurityText: "Data is stored locally in this browser and should not be treated as secure cloud storage.",
      privacyResetChoice: "Reset Cookie Choice",
      privacyBackToDashboard: "Back to Dashboard",
      privacyChoiceResetMessage: "Cookie choice has been reset. The banner will appear again.",
      privacyHelpTitle: "Need privacy information?",
      privacyHelpPrompt: "Need privacy information?",
      privacyHelpLink: "View our Privacy Policy",
      viewPrivacyPolicy: "View our Privacy Policy",
      openPrivacyInSettings: "Open Privacy Policy in Settings",
    },
    accessibility: {
      visitLinkedIn: "Visit Sumayyah's LinkedIn profile",
      visitGithub: "Visit Sumayyah's GitHub profile",
      sendEmail: "Send an email to Sumayyah",
    },
  },
  zh: {
    nav: {
      primaryNavigation: "主导航",
      dashboard: "仪表盘",
      products: "产品",
      orders: "订单",
      expenses: "支出",
      inventory: "库存",
      help: "帮助",
      meetDeveloper: "关于",
      openSidebar: "打开侧边栏",
      closeSidebar: "关闭侧边栏",
      openUserMenu: "打开用户菜单",
    },
    common: {
      search: "搜索",
      action: "操作",
      add: "添加",
      update: "更新",
      cancel: "取消",
      category: "类别",
      description: "描述",
      about: "关于",
      date: "日期：",
      dateShort: "日期",
      amount: "金额：",
      amountShort: "金额",
      notes: "备注：",
      notesShort: "备注",
      qty: "数量",
      calculated: "（自动计算）",
      switchToChinese: "切换语言为中文",
      switchToEnglish: "切换语言为英文",
      guestUser: "访客用户",
      localMode: "本地模式",
      preferences: "偏好设置",
      dataStorage: "数据与存储",
      privacySettings: "隐私设置",
      signInComingSoon: "登录功能待加入",
      preferencesComingSoon: "偏好设置面板将在未来版本中加入。",
      dataStorageComingSoon: "数据与存储工具将在未来版本中加入。",
    },
    dashboard: {
      summary: "概览",
      businessWorkspace: "业务工作台",
      quickActions: "快捷操作",
      quickActionsDesc: "从仪表盘快速创建或更新关键业务记录。",
      recentActivity: "最近记录",
      recentActivityDesc: "来自浏览器本地数据的最近保存记录。",
      latestProduct: "最新产品",
      latestOrder: "最新订单",
      latestExpense: "最新支出",
      noProductsYet: "暂无产品",
      noOrdersYet: "暂无订单",
      noExpensesYet: "暂无支出",
      orderStatusOverview: "订单状态概览",
      orderStatusOverviewDesc: "当前订单状态汇总。",
      analytics: "数据分析",
      revenue: "收入",
      balance: "余额",
      ordersCount: "订单",
      totalSales: "总销售额",
      totalSalesDollars: "总销售额（$）",
      salesByCategory: "按产品类别统计销售额",
      viewRevenueDetails: "在订单页面查看收入详情",
      viewExpenseDetails: "在支出页面查看支出详情",
      viewOrdersDetails: "在订单页面查看订单详情",
      currentBalanceSummary: "当前余额概览",
      salesChartDesc: "柱状图显示按产品类别分组的总销售额，数据来自已保存的产品信息。",
      expensesChartDesc: "环形图显示按支出类别分组的总金额，数据来自已保存的支出记录。",
    },
    products: {
      addProduct: "添加产品",
      downloadCSV: "下载 CSV",
      productID: "产品编号：",
      productIDShort: "产品编号",
      productName: "产品名称",
      productDescription: "产品描述：",
      productCategory: "产品类别：",
      productPrice: "产品价格：",
      unitsSold: "已售数量：",
      unitsSoldShort: "已售数量",
      chooseProduct: "请选择产品",
      chooseCategory: "请选择类别",
      price: "价格",
      editProduct: "编辑产品",
      deleteProduct: "删除产品",
      hats: "帽子",
      drinkware: "饮具",
      clothing: "服装",
      accessories: "配饰",
      homeDecor: "家居装饰",
      baseballCaps: "棒球帽",
      snapbacks: "平檐帽",
      beanies: "针织帽",
      bucketHats: "渔夫帽",
      mugs: "马克杯",
      waterBottles: "水瓶",
      tumblers: "随行杯",
      tshirts: "T 恤",
      sweatshirts: "卫衣",
      hoodies: "连帽衫",
      pillowCases: "枕套",
      toteBags: "托特包",
      stickers: "贴纸",
      posters: "海报",
      framedPosters: "装框海报",
      canvasPrints: "帆布画",
      peaceEmbroideredCap: "和平刺绣帽",
      floralLotusPrintedBottle: "莲花印花水瓶",
      palestineSweater: "巴勒斯坦主题毛衣",
      vibesPrintedPoster: "氛围印花海报",
      morrocanPrintPillowCase: "摩洛哥印花枕套",
    },
    orders: {
      addOrder: "添加订单",
      exportCSV: "导出 CSV",
      orderID: "订单编号：",
      orderIDShort: "订单编号",
      orderDate: "订单日期：",
      orderDateShort: "订单日期",
      itemName: "商品名称：",
      itemNameShort: "商品名称",
      itemPrice: "商品价格：",
      itemPriceShort: "商品价格",
      quantityBought: "购买数量：",
      shippingFee: "运费：",
      shippingFeeShort: "运费",
      taxes: "税费（VAT/GST/HST）：",
      taxesShort: "税费",
      orderStatus: "订单状态：",
      orderStatusShort: "订单状态",
      totalOrderAmount: "订单总金额：",
      orderTotalShort: "订单总额",
      chooseItem: "请选择商品",
      chooseStatus: "请选择状态",
      pending: "待处理",
      processing: "处理中",
      shipped: "已发货",
      delivered: "已送达",
      totalRevenue: "总收入",
      editOrder: "编辑订单",
      deleteOrder: "删除订单",
    },
    expenses: {
      addExpense: "添加支出",
      expenseCategory: "支出类别",
      categoryLabel: "类别：",
      chooseExpenseCategory: "请选择支出类别",
      serialNumber: "序号",
      totalExpenses: "总支出",
      rent: "租金",
      orderFulfillment: "订单履约",
      utilities: "公用事业",
      supplies: "用品",
      miscellaneous: "杂项",
      editExpense: "编辑支出",
      deleteExpense: "删除支出",
    },
    help: {
      usingGuide: "BizTrack 使用指南",
      whatIsBizTrack: "什么是 BizTrack？",
      whatIsBizTrackText: "BizTrack 是一款面向小型企业主的业务管理工具。它将产品管理、订单跟踪和财务管理整合到一个平台中，帮助你更轻松地处理日常业务。",
      navigatingDashboard: "浏览仪表盘",
      navigatingDashboardText: "仪表盘是系统的核心页面，可以快速查看总支出、收入、利润和订单数量等关键指标。",
      expensesPage: "支出页面",
      recordExpensesText: "记录支出：前往支出页面添加业务支出，填写日期、类别、金额和备注即可。",
      editDeleteExpensesText: "编辑或删除支出：如果记录有误，你可以直接在支出页面编辑或删除对应记录。",
      ordersPage: "订单页面",
      trackOrdersText: "跟踪订单：订单页面会列出所有订单，并显示商品、数量和订单状态等信息。",
      effortlessEditingText: "轻松编辑：如果需要更新订单状态，点击编辑按钮即可修改。",
      addingNewEntry: "添加新的支出、订单或产品",
      addingNewEntryStep1: "点击“添加支出”或订单、产品页面上的对应按钮。",
      addingNewEntryStep2: "填写产品、订单或支出的相关信息。",
      addingNewEntryStep3: "提交表单后，新记录会显示在对应页面，并同步到仪表盘。",
      sortingSearching: "排序和搜索记录/表格",
      sortingSearchingStep1: "点击表格列标题，可以按该列对记录进行排序。",
      sortingSearchingStep2: "使用每个页面顶部的搜索框来查找匹配的记录。",
      exportToCSVTitle: "导出 CSV",
      exportToCSVText: "点击导出 CSV 下载你的业务数据备份。",
      helpClosingText: "BizTrack 旨在做到直观、易用，并适应你的业务需求。",
      contactPrompt: "如果你有问题、反馈，或想进一步联系，欢迎随时联系！",
    },
    about: {
      codingJourney: "我的编程旅程",
      aboutIntroTitle: "你好，我是 Sumayyah！",
      aboutIntroText: "欢迎来到我的小角落。在这里，我正在认真学习编程。我不是传统意义上的技术专家，而是一位在创业过程中学习如何用代码解决问题的小企业主。",
      aboutBizTrackOrigin: "BizTrack 源于一个真实需求：我需要在一个地方管理产品、订单和财务。",
      aboutBizTrackPurpose: "BizTrack 是我让小企业管理变得更简单的一次尝试。",
      aboutLearningJourney: "我是 GetCoding NL 的学生，而 BizTrack 是我的第一个课程模块项目。",
      aboutCoachThanks: "我非常感谢我的编程导师 Sam Russell 在学习过程中的指导。",
      aboutInvitation: "无论你关注小企业经营、编程学习，还是两者的结合，这里都欢迎你。",
      aboutClosing: "献给编程、业务，以及两者之间的一切。",
    },
    privacy: {
      cookieBannerTitle: "您的隐私很重要",
      cookieBannerText: "BizTrack 使用本地存储来记住语言、Cookie 选择和保存在本机的业务数据。",
      cookieAccept: "接受",
      cookieReject: "拒绝",
      cookiePrivacyPolicy: "隐私政策",
      privacyPolicyTitle: "隐私政策",
      privacyPolicyIntro: "本页面说明 BizTrack 在这个课程项目原型中如何使用浏览器存储。",
      privacyStoredDataTitle: "BizTrack 存储哪些信息",
      privacyStoredDataText: "BizTrack 会将产品、订单、支出、语言偏好和 Cookie 选择保存在当前浏览器的本地存储中。",
      privacyLocalStorageTitle: "Cookie 与本地存储",
      privacyLocalStorageText: "BizTrack 主要使用 localStorage 来支持核心功能。本原型不使用第三方广告 Cookie。",
      privacyChoicesTitle: "您的选择",
      privacyChoicesText: "您可以接受或拒绝可选存储。拒绝可选存储不会禁用核心应用功能。",
      privacySecurityTitle: "安全说明",
      privacySecurityText: "数据保存在当前浏览器本地，不应被视为安全的云端存储。",
      privacyResetChoice: "重置 Cookie 选择",
      privacyBackToDashboard: "返回仪表盘",
      privacyChoiceResetMessage: "Cookie 选择已重置，提示横幅将再次出现。",
      privacyHelpTitle: "需要了解隐私信息？",
      privacyHelpPrompt: "需要了解隐私信息？",
      privacyHelpLink: "查看我们的隐私政策",
      viewPrivacyPolicy: "查看隐私政策",
      openPrivacyInSettings: "在设置中打开隐私政策",
    },
    accessibility: {
      visitLinkedIn: "访问 Sumayyah 的 LinkedIn 主页",
      visitGithub: "访问 Sumayyah 的 GitHub 主页",
      sendEmail: "向 Sumayyah 发送电子邮件",
    },
  },
};

function flattenTranslationSection(section, output = {}) {
  Object.entries(section).forEach(([key, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenTranslationSection(value, output);
      return;
    }

    output[key] = value;
  });

  return output;
}

const translations = Object.fromEntries(
  Object.entries(translationDefinitions).map(([language, section]) => [
    language,
    flattenTranslationSection(section),
  ]),
);

Object.assign(translations.en, {
  login: "Login",
  logout: "Log out",
  createLocalAccount: "Create Local Account",
  account: "Account",
  localAccount: "Local Account",
  username: "Username",
  password: "Password",
  confirmPassword: "Confirm password",
  displayName: "Display name",
  closeAuthPanel: "Close login panel",
  localAccountPrototypeNotice: "This is a local prototype account. Do not use real passwords.",
  needCreateAccount: "Need an account? Create one locally",
  alreadyHaveAccount: "Already have an account? Login",
  loginSuccess: "Login successful.",
  logoutSuccess: "You have logged out.",
  registerSuccess: "Local account created and signed in.",
  invalidLogin: "Invalid username or password.",
  usernameRequired: "Username is required.",
  displayNameRequired: "Display name is required.",
  passwordRequired: "Password is required.",
  passwordTooShort: "Password must be at least 6 characters.",
  passwordMismatch: "Passwords do not match.",
  usernameInvalid: "Username must be 3–20 characters and only use letters, numbers, underscore, or hyphen.",
  usernameTaken: "This username already exists.",
  accountDesc: "Manage the local prototype account for this browser.",
  guestAccountStatus: "You are using BizTrack as a guest.",
  notSignedIn: "Not signed in",
  signedIn: "Signed in",
  currentUser: "Current user",
  createdAt: "Created at",
  localAccountNotice: "This account is stored locally in this browser only.",
  guestAccountNotice: "This prototype does not provide cloud sync or secure authentication.",
  privacySettingsGuide: "To manage cookie consent or local business data, open the sidebar user panel and choose Data & Storage.",
  cookieChoice: "Cookie choice",
  cookieChoiceDesc: "Reset the consent banner so you can choose again.",
  localBusinessData: "Local business data",
  localBusinessDataDesc: "Clear saved products, orders, and expenses from this browser.",
  userSettings: "User Settings",
  closeSettings: "Close settings",
  preferencesDesc: "Customize basic interface preferences for this browser.",
  languagePreference: "Language preference",
  languagePreferenceDesc: "Choose the interface language for this browser.",
  themePreference: "Theme",
  themePreferenceDesc: "Choose a light or dark BizTrack interface theme.",
  lightTheme: "Light",
  darkTheme: "Dark",
  biztrackDefault: "BizTrack Default",
  accountMode: "Account mode",
  accountModeDesc: "This prototype runs in guest mode without cloud login.",
  dataStorageDesc: "BizTrack stores products, orders, expenses, language preference, and cookie choice in this browser.",
  localStorageMode: "Local browser storage",
  localStorageModeDesc: "Your business data is saved locally and is not synced across devices.",
  enabled: "Enabled",
  resetCookieChoiceShort: "Reset",
  clearLocalBusinessDataShort: "Clear",
  clearLocalBusinessData: "Clear local business data",
  clearLocalBusinessDataWarning: "Clearing local business data removes saved products, orders, and expenses from this browser.",
  confirmClearLocalBusinessData: "Clear saved products, orders, and expenses from this browser?",
  localBusinessDataCleared: "Local business data has been cleared. Demo data will be restored on reload.",
  cookieChoiceResetFromSettings: "Cookie choice has been reset. The banner will appear again.",
});

Object.assign(translations.en, {
  addInventory: "Add Inventory",
  inventoryID: "Inventory ID:",
  inventoryIDShort: "Inventory ID",
  inventoryCategory: "Category",
  stockQuantity: "Stock Quantity",
  reorderLevel: "Reorder Level",
  supplier: "Supplier",
  lastUpdated: "Last Updated",
  inventoryStatus: "Status",
  inStock: "In Stock",
  lowStock: "Low Stock",
  outOfStock: "Out of Stock",
  chooseInventoryProduct: "Choose a product",
  chooseInventoryCategory: "Choose a category",
  editInventory: "Edit inventory",
  deleteInventory: "Delete inventory",
});

Object.assign(translations.en, {
  inventoryProduct: "Product",
  inventoryAlerts: "Inventory Alerts",
  inventoryAlertsDesc: "Stock levels that may need attention.",
  noInventoryYet: "No inventory records yet.",
  notEnoughStock: "Not enough stock for this order.",
  inventoryProductExists: "An inventory record for this product already exists.",
  inventoryRecordRequired: "A matching inventory record is required before this order can be fulfilled.",
  fulfilledOrderLocked: "This fulfilled order has already updated inventory. Product and quantity cannot be changed.",
  deleteAppliedOrderWarning: "This order has already updated inventory. Deleting it will not restore stock automatically. Continue?",
});

Object.assign(translations.en, {
  updateStock: "Update Stock",
  totalInventoryItems: "Total Items",
  notAssigned: "Not assigned",
  autoCreatedInventoryNote: "Auto-created from Products",
  confirmDeletion: "Confirm deletion",
  deleteConfirmMessage: "Are you sure you want to delete this record?",
  deleteCannotUndo: "This action cannot be undone.",
  delete: "Delete",
  deleteAppliedOrderModalWarning: "This order has already updated inventory. Deleting it will not restore stock automatically.",
});

Object.assign(translations.en, {
  settings: "Settings",
  settingsCenter: "Settings Center",
  preferences: "Preferences",
  dataStorage: "Data & Storage",
  privacySettings: "Privacy Settings",
  storageMode: "Storage Mode",
  browserStorage: "Browser Storage",
  browserStorageDesc: "Business data is stored in this browser.",
  dataStorageDesc: "Manage BizTrack data stored in this browser.",
  storedDataDesc: "Products, inventory, orders, expenses, language preference, theme preference, and cookie choice are stored in this browser.",
  clearBusinessData: "Clear Business Data",
  clearBusinessDataDesc: "Clear saved products, inventory, orders, and expenses from this browser.",
  confirmClearBusinessData: "Clear saved products, inventory, orders, and expenses from this browser?",
  businessDataCleared: "Business data has been cleared. Demo data will be restored on reload.",
  userSettings: "Settings Center",
  languagePreference: "Language Preference",
  accountMode: "Storage Mode",
  accountModeDesc: "Business data is stored in this browser.",
  cookieChoiceDesc: "Reset cookie choice.",
  clearLocalBusinessData: "Clear Business Data",
  clearLocalBusinessDataWarning: "Clear saved products, inventory, orders, and expenses from this browser.",
  confirmClearLocalBusinessData: "Clear saved products, inventory, orders, and expenses from this browser?",
  localBusinessDataCleared: "Business data has been cleared. Demo data will be restored on reload.",
  privacySettingsGuide: "To manage cookie consent or browser-stored business data, open the Settings panel at the bottom of the sidebar and choose Data & Storage.",
  privacyStoredDataText: "BizTrack stores products, inventory, orders, expenses, language preference, theme preference, and cookie consent choice in your browser.",
});

Object.assign(translations.zh, {
  login: "登录",
  logout: "退出登录",
  createLocalAccount: "创建本地账户",
  account: "账户",
  localAccount: "本地账户",
  username: "用户名",
  password: "密码",
  confirmPassword: "确认密码",
  displayName: "显示名称",
  closeAuthPanel: "关闭登录面板",
  localAccountPrototypeNotice: "这是本地原型账户，请勿使用真实密码。",
  needCreateAccount: "还没有账户？创建一个本地账户",
  alreadyHaveAccount: "已有账户？登录",
  loginSuccess: "登录成功。",
  logoutSuccess: "你已退出登录。",
  registerSuccess: "本地账户已创建并登录。",
  invalidLogin: "用户名或密码不正确。",
  usernameRequired: "请输入用户名。",
  displayNameRequired: "请输入显示名称。",
  passwordRequired: "请输入密码。",
  passwordTooShort: "密码至少需要 6 个字符。",
  passwordMismatch: "两次输入的密码不一致。",
  usernameInvalid: "用户名需为 3–20 个字符，只能包含字母、数字、下划线或连字符。",
  usernameTaken: "该用户名已存在。",
  accountDesc: "管理当前浏览器中的本地原型账户。",
  guestAccountStatus: "你正在以访客身份使用 BizTrack。",
  notSignedIn: "未登录",
  signedIn: "已登录",
  currentUser: "当前用户",
  createdAt: "创建时间",
  localAccountNotice: "此账户仅保存在当前浏览器本地。",
  guestAccountNotice: "当前原型不提供云端同步或安全认证。",
  privacySettingsGuide: "如需管理 Cookie 同意或本地业务数据，请打开侧边栏底部的用户面板，并选择“数据与存储”。",
  cookieChoice: "Cookie 选择",
  cookieChoiceDesc: "重置同意提示，以便重新选择。",
  localBusinessData: "本地业务数据",
  localBusinessDataDesc: "清除当前浏览器中保存的产品、订单和支出。",
  userSettings: "用户设置",
  closeSettings: "关闭设置",
  preferencesDesc: "自定义当前浏览器中的基础界面偏好。",
  languagePreference: "语言偏好",
  languagePreferenceDesc: "选择当前浏览器中的界面语言。",
  themePreference: "主题",
  themePreferenceDesc: "选择 BizTrack 的白天或黑夜界面主题。",
  lightTheme: "白天",
  darkTheme: "黑夜",
  biztrackDefault: "BizTrack 默认",
  accountMode: "账户模式",
  accountModeDesc: "当前原型以访客模式运行，不包含云端登录。",
  dataStorageDesc: "BizTrack 会将产品、订单、支出、语言偏好和 Cookie 选择保存在当前浏览器中。",
  localStorageMode: "浏览器本地存储",
  localStorageModeDesc: "你的业务数据保存在本地浏览器中，不会跨设备同步。",
  enabled: "已启用",
  resetCookieChoiceShort: "重置",
  clearLocalBusinessDataShort: "清除",
  clearLocalBusinessData: "清除本地业务数据",
  clearLocalBusinessDataWarning: "清除本地业务数据会移除当前浏览器中保存的产品、订单和支出。",
  confirmClearLocalBusinessData: "是否清除当前浏览器中保存的产品、订单和支出？",
  localBusinessDataCleared: "本地业务数据已清除，刷新后将恢复示例数据。",
  cookieChoiceResetFromSettings: "Cookie 选择已重置，提示横幅将再次出现。",
});

Object.assign(translations.zh, {
  addInventory: "添加库存",
  inventoryID: "库存编号：",
  inventoryIDShort: "库存编号",
  inventoryCategory: "类别",
  stockQuantity: "库存数量",
  reorderLevel: "补货阈值",
  supplier: "供应商",
  lastUpdated: "最后更新",
  inventoryStatus: "状态",
  inStock: "库存充足",
  lowStock: "库存偏低",
  outOfStock: "缺货",
  chooseInventoryProduct: "请选择产品",
  chooseInventoryCategory: "请选择类别",
  editInventory: "编辑库存",
  deleteInventory: "删除库存",
});

Object.assign(translations.zh, {
  inventoryProduct: "产品",
  inventoryAlerts: "库存提醒",
  inventoryAlertsDesc: "需要关注的库存状态。",
  noInventoryYet: "暂无库存记录",
  notEnoughStock: "该订单库存不足。",
  inventoryProductExists: "该产品已经存在库存记录。",
  inventoryRecordRequired: "该订单发货或完成前需要先创建对应库存记录。",
  fulfilledOrderLocked: "该已履约订单已经更新库存，不能再修改产品和数量。",
  deleteAppliedOrderWarning: "该订单已经更新库存，删除它不会自动恢复库存。是否继续？",
});

Object.assign(translations.zh, {
  updateStock: "更新库存",
  totalInventoryItems: "库存项目",
  notAssigned: "未设置",
  autoCreatedInventoryNote: "已根据产品自动创建",
});

Object.assign(translations.zh, {
  updateStock: "\u66f4\u65b0\u5e93\u5b58",
  totalInventoryItems: "\u5e93\u5b58\u9879\u76ee",
  notAssigned: "\u672a\u8bbe\u7f6e",
  autoCreatedInventoryNote: "\u5df2\u6839\u636e\u4ea7\u54c1\u81ea\u52a8\u521b\u5efa",
  confirmDeletion: "\u786e\u8ba4\u5220\u9664",
  deleteConfirmMessage: "\u786e\u5b9a\u8981\u5220\u9664\u8fd9\u6761\u8bb0\u5f55\u5417\uff1f",
  deleteCannotUndo: "\u6b64\u64cd\u4f5c\u65e0\u6cd5\u64a4\u9500\u3002",
  delete: "\u5220\u9664",
  deleteAppliedOrderModalWarning: "\u8be5\u8ba2\u5355\u5df2\u7ecf\u66f4\u65b0\u5e93\u5b58\uff0c\u5220\u9664\u5b83\u4e0d\u4f1a\u81ea\u52a8\u6062\u590d\u5e93\u5b58\u3002",
});

Object.assign(translations.zh, {
  settings: "\u8bbe\u7f6e",
  settingsCenter: "\u8bbe\u7f6e\u4e2d\u5fc3",
  preferences: "\u504f\u597d\u8bbe\u7f6e",
  dataStorage: "\u6570\u636e\u4e0e\u5b58\u50a8",
  privacySettings: "\u9690\u79c1\u8bbe\u7f6e",
  storageMode: "\u5b58\u50a8\u6a21\u5f0f",
  browserStorage: "\u6d4f\u89c8\u5668\u5b58\u50a8",
  browserStorageDesc: "\u4e1a\u52a1\u6570\u636e\u4fdd\u5b58\u5728\u5f53\u524d\u6d4f\u89c8\u5668\u4e2d\u3002",
  dataStorageDesc: "\u7ba1\u7406\u4fdd\u5b58\u5728\u5f53\u524d\u6d4f\u89c8\u5668\u4e2d\u7684 BizTrack \u6570\u636e\u3002",
  storedDataDesc: "\u4ea7\u54c1\u3001\u5e93\u5b58\u3001\u8ba2\u5355\u3001\u652f\u51fa\u3001\u8bed\u8a00\u504f\u597d\u3001\u4e3b\u9898\u504f\u597d\u548c Cookie \u9009\u62e9\u4f1a\u4fdd\u5b58\u5728\u5f53\u524d\u6d4f\u89c8\u5668\u4e2d\u3002",
  clearBusinessData: "\u6e05\u9664\u4e1a\u52a1\u6570\u636e",
  clearBusinessDataDesc: "\u6e05\u9664\u5f53\u524d\u6d4f\u89c8\u5668\u4e2d\u4fdd\u5b58\u7684\u4ea7\u54c1\u3001\u5e93\u5b58\u3001\u8ba2\u5355\u548c\u652f\u51fa\u3002",
  confirmClearBusinessData: "\u662f\u5426\u6e05\u9664\u5f53\u524d\u6d4f\u89c8\u5668\u4e2d\u4fdd\u5b58\u7684\u4ea7\u54c1\u3001\u5e93\u5b58\u3001\u8ba2\u5355\u548c\u652f\u51fa\uff1f",
  businessDataCleared: "\u4e1a\u52a1\u6570\u636e\u5df2\u6e05\u9664\uff0c\u5237\u65b0\u540e\u5c06\u6062\u590d\u793a\u4f8b\u6570\u636e\u3002",
  userSettings: "\u8bbe\u7f6e\u4e2d\u5fc3",
  languagePreference: "\u8bed\u8a00\u504f\u597d",
  accountMode: "\u5b58\u50a8\u6a21\u5f0f",
  accountModeDesc: "\u4e1a\u52a1\u6570\u636e\u4fdd\u5b58\u5728\u5f53\u524d\u6d4f\u89c8\u5668\u4e2d\u3002",
  cookieChoiceDesc: "\u91cd\u7f6e Cookie \u9009\u62e9\u3002",
  clearLocalBusinessDataShort: "\u6e05\u9664",
  clearLocalBusinessData: "\u6e05\u9664\u4e1a\u52a1\u6570\u636e",
  clearLocalBusinessDataWarning: "\u6e05\u9664\u5f53\u524d\u6d4f\u89c8\u5668\u4e2d\u4fdd\u5b58\u7684\u4ea7\u54c1\u3001\u5e93\u5b58\u3001\u8ba2\u5355\u548c\u652f\u51fa\u3002",
  confirmClearLocalBusinessData: "\u662f\u5426\u6e05\u9664\u5f53\u524d\u6d4f\u89c8\u5668\u4e2d\u4fdd\u5b58\u7684\u4ea7\u54c1\u3001\u5e93\u5b58\u3001\u8ba2\u5355\u548c\u652f\u51fa\uff1f",
  localBusinessDataCleared: "\u4e1a\u52a1\u6570\u636e\u5df2\u6e05\u9664\uff0c\u5237\u65b0\u540e\u5c06\u6062\u590d\u793a\u4f8b\u6570\u636e\u3002",
  privacySettingsGuide: "\u5982\u9700\u7ba1\u7406 Cookie \u540c\u610f\u6216\u4fdd\u5b58\u5728\u6d4f\u89c8\u5668\u4e2d\u7684\u4e1a\u52a1\u6570\u636e\uff0c\u8bf7\u6253\u5f00\u4fa7\u8fb9\u680f\u5e95\u90e8\u7684\u8bbe\u7f6e\u9762\u677f\uff0c\u5e76\u9009\u62e9\u201c\u6570\u636e\u4e0e\u5b58\u50a8\u201d\u3002",
  privacyStoredDataText: "\u5728\u5f53\u524d\u6d4f\u89c8\u5668\u4e2d\uff0cBizTrack \u4f1a\u4fdd\u5b58\u4ea7\u54c1\u3001\u5e93\u5b58\u3001\u8ba2\u5355\u3001\u652f\u51fa\u3001\u8bed\u8a00\u504f\u597d\u3001\u4e3b\u9898\u504f\u597d\u548c Cookie \u540c\u610f\u9009\u62e9\u3002",
});

Object.assign(translations.en, {
  privacyPolicy: "Privacy Policy",
  viewPrivacyPolicy: "View our Privacy Policy",
  openPrivacyInSettings: "Open Privacy Policy in Settings",
  privacySettingsIntro: "This section explains how BizTrack handles browser-stored data in this coursework prototype.",
  privacyStoredInfoTitle: "What BizTrack stores",
  privacyStoredInfoDesc: "BizTrack stores products, inventory, orders, expenses, language preference, theme preference, and cookie choice.",
  privacyStorageLocationTitle: "Where data is stored",
  privacyStorageLocationDesc: "Data is stored in this browser through localStorage. It is not synchronized to a cloud account or backend database.",
  privacyCookieTitle: "Cookie and preference choices",
  privacyCookieDesc: "BizTrack uses browser storage to remember cookie consent and interface preferences. You can reset cookie choice in Data & Storage.",
  privacySafetyTitle: "Security note",
  privacySafetyDesc: "Because this is a frontend coursework prototype, browser-stored data should not be treated as secure cloud storage.",
  privacySettingsGuide: "Privacy settings are now available in the Settings panel. Open the sidebar Settings button and choose Privacy Policy.",
  privacyPanelFallbackIntro: "Privacy settings are now available in the Settings panel. Open the sidebar Settings button and choose Privacy Policy.",
  privacyPanelFallbackTitle: "Open Privacy Policy in Settings",
  privacyPanelFallbackDesc: "Use the Settings panel for the latest privacy explanation, browser storage details, and cookie choice controls.",
});

Object.assign(translations.zh, {
  privacyPolicy: "\u9690\u79c1\u653f\u7b56",
  viewPrivacyPolicy: "\u67e5\u770b\u9690\u79c1\u653f\u7b56",
  openPrivacyInSettings: "\u5728\u8bbe\u7f6e\u4e2d\u6253\u5f00\u9690\u79c1\u653f\u7b56",
  privacySettingsIntro: "\u672c\u90e8\u5206\u8bf4\u660e BizTrack \u5728\u8be5\u8bfe\u7a0b\u539f\u578b\u4e2d\u5982\u4f55\u5904\u7406\u4fdd\u5b58\u5728\u6d4f\u89c8\u5668\u4e2d\u7684\u6570\u636e\u3002",
  privacyStoredInfoTitle: "BizTrack \u5b58\u50a8\u54ea\u4e9b\u4fe1\u606f",
  privacyStoredInfoDesc: "BizTrack \u4f1a\u5b58\u50a8\u4ea7\u54c1\u3001\u5e93\u5b58\u3001\u8ba2\u5355\u3001\u652f\u51fa\u3001\u8bed\u8a00\u504f\u597d\u3001\u4e3b\u9898\u504f\u597d\u548c Cookie \u9009\u62e9\u3002",
  privacyStorageLocationTitle: "\u6570\u636e\u4fdd\u5b58\u5728\u54ea\u91cc",
  privacyStorageLocationDesc: "\u6570\u636e\u901a\u8fc7 localStorage \u4fdd\u5b58\u5728\u5f53\u524d\u6d4f\u89c8\u5668\u4e2d\uff0c\u4e0d\u4f1a\u540c\u6b65\u5230\u4e91\u7aef\u8d26\u6237\u6216\u540e\u7aef\u6570\u636e\u5e93\u3002",
  privacyCookieTitle: "Cookie \u4e0e\u504f\u597d\u9009\u62e9",
  privacyCookieDesc: "BizTrack \u4f7f\u7528\u6d4f\u89c8\u5668\u5b58\u50a8\u6765\u8bb0\u4f4f Cookie \u540c\u610f\u72b6\u6001\u548c\u754c\u9762\u504f\u597d\u3002\u4f60\u53ef\u4ee5\u5728\u201c\u6570\u636e\u4e0e\u5b58\u50a8\u201d\u4e2d\u91cd\u7f6e Cookie \u9009\u62e9\u3002",
  privacySafetyTitle: "\u5b89\u5168\u8bf4\u660e",
  privacySafetyDesc: "\u7531\u4e8e\u672c\u9879\u76ee\u662f\u524d\u7aef\u8bfe\u7a0b\u539f\u578b\uff0c\u4fdd\u5b58\u5728\u6d4f\u89c8\u5668\u4e2d\u7684\u6570\u636e\u4e0d\u5e94\u88ab\u89c6\u4e3a\u5b89\u5168\u7684\u4e91\u7aef\u5b58\u50a8\u3002",
  privacySettingsGuide: "\u9690\u79c1\u8bbe\u7f6e\u73b0\u5728\u53ef\u5728\u201c\u8bbe\u7f6e\u201d\u9762\u677f\u4e2d\u67e5\u770b\u3002\u8bf7\u6253\u5f00\u4fa7\u8fb9\u680f\u5e95\u90e8\u7684\u201c\u8bbe\u7f6e\u201d\u6309\u94ae\uff0c\u5e76\u9009\u62e9\u201c\u9690\u79c1\u653f\u7b56\u201d\u3002",
  privacyPanelFallbackIntro: "\u9690\u79c1\u8bbe\u7f6e\u73b0\u5728\u53ef\u5728\u201c\u8bbe\u7f6e\u201d\u9762\u677f\u4e2d\u67e5\u770b\u3002\u8bf7\u6253\u5f00\u4fa7\u8fb9\u680f\u5e95\u90e8\u7684\u201c\u8bbe\u7f6e\u201d\u6309\u94ae\uff0c\u5e76\u9009\u62e9\u201c\u9690\u79c1\u653f\u7b56\u201d\u3002",
  privacyPanelFallbackTitle: "\u5728\u201c\u8bbe\u7f6e\u201d\u4e2d\u6253\u5f00\u9690\u79c1\u653f\u7b56",
  privacyPanelFallbackDesc: "\u8bf7\u4f7f\u7528\u201c\u8bbe\u7f6e\u201d\u9762\u677f\u67e5\u770b\u6700\u65b0\u7684\u9690\u79c1\u8bf4\u660e\u3001\u6d4f\u89c8\u5668\u5b58\u50a8\u8be6\u60c5\u548c Cookie \u9009\u62e9\u63a7\u5236\u3002",
});

Object.assign(translations.en, {
  addStock: "Add Stock",
  quickBusinessEntry: "Quick Business Entry",
  closeQuickEntry: "Close quick entry",
  product: "Product",
  order: "Order",
  expense: "Expense",
  edit: "Edit",
  selectExisting: "Select Existing",
  createNew: "Create New",
  selectProduct: "Select product",
  selectInventoryItem: "Select inventory item",
  selectOrder: "Select order",
  selectExpense: "Select expense",
  productSaved: "Product saved successfully.",
  inventorySaved: "Inventory saved successfully.",
  orderSaved: "Order saved successfully.",
  expenseSaved: "Expense saved successfully.",
  chooseRecordToEdit: "Choose a record to edit.",
  recordUpdated: "Record updated successfully.",
  productIdInvalid: "Product ID must be a positive integer. For example, enter 6 to create PD006.",
  duplicateProductId: "Product ID already exists. Please use a unique ID.",
  productNameRequired: "Product name is required.",
  productDescriptionRequired: "Product description is required.",
  productDescriptionTooLong: "Product description must be 120 characters or fewer.",
  productCategoryRequired: "Please choose a category.",
  productPriceInvalid: "Product price must be between 0.01 and 10000.00.",
  unitsSoldInvalid: "Units sold must be a whole number of 0 or more.",
  inventoryProductRequired: "Please choose a product.",
  inventoryExistsSwitchEdit: "This product already has an inventory record. Use Edit mode instead.",
  stockQuantityInvalid: "Stock quantity must be a whole number of 0 or more.",
  reorderLevelInvalid: "Reorder level must be a whole number of 0 or more.",
  supplierRequired: "Supplier is required.",
  supplierTooLong: "Supplier must be 80 characters or fewer.",
  lastUpdatedRequired: "Last updated date is required.",
  orderIdInvalid: "Order ID must be a positive integer.",
  duplicateOrderId: "Order ID already exists. Please use a unique ID.",
  orderDateRequired: "Order date is required.",
  orderProductRequired: "Please choose an item.",
  orderPriceInvalid: "Item price must be between 0.01 and 10000.00.",
  orderQuantityInvalid: "Quantity bought must be a positive integer.",
  shippingInvalid: "Shipping fee must be between 0.00 and 10000.00.",
  taxesInvalid: "Taxes must be between 0.00 and 10000.00.",
  orderStatusRequired: "Please choose a status.",
  expenseDateRequired: "Expense date is required.",
  expenseCategoryRequired: "Please choose a valid expense category.",
  expenseAmountInvalid: "Expense amount must be between 0.01 and 10000.00.",
  expenseNotesRequired: "Notes are required.",
  expenseNotesTooLong: "Notes must be 120 characters or fewer.",
});

Object.assign(translations.zh, {
  addStock: "添加库存",
  quickBusinessEntry: "快速业务录入",
  closeQuickEntry: "关闭快速业务录入",
  product: "产品",
  order: "订单",
  expense: "支出",
  edit: "修改",
  selectExisting: "选择已有",
  createNew: "新建",
  selectProduct: "选择产品",
  selectInventoryItem: "选择库存项目",
  selectOrder: "选择订单",
  selectExpense: "选择支出",
  productSaved: "产品已保存。",
  inventorySaved: "库存已保存。",
  orderSaved: "订单已保存。",
  expenseSaved: "支出已保存。",
  chooseRecordToEdit: "请选择要修改的记录。",
  recordUpdated: "记录已更新。",
  productIdInvalid: "产品编号必须是正整数。例如输入 6 会生成 PD006。",
  duplicateProductId: "产品编号已存在，请使用其他编号。",
  productNameRequired: "请输入产品名称。",
  productDescriptionRequired: "请输入产品描述。",
  productDescriptionTooLong: "产品描述不能超过 120 个字符。",
  productCategoryRequired: "请选择产品分类。",
  productPriceInvalid: "产品价格必须在 0.01 到 10000.00 之间。",
  unitsSoldInvalid: "已售数量必须是 0 或以上的整数。",
  inventoryProductRequired: "请选择产品。",
  inventoryExistsSwitchEdit: "该产品已经有库存记录，请改用“修改”模式。",
  stockQuantityInvalid: "库存数量必须是 0 或以上的整数。",
  reorderLevelInvalid: "补货阈值必须是 0 或以上的整数。",
  supplierRequired: "请输入供应商。",
  supplierTooLong: "供应商名称不能超过 80 个字符。",
  lastUpdatedRequired: "请选择最后更新日期。",
  orderIdInvalid: "订单编号必须是正整数。",
  duplicateOrderId: "订单编号已存在，请使用其他编号。",
  orderDateRequired: "请选择订单日期。",
  orderProductRequired: "请选择产品。",
  orderPriceInvalid: "单价必须在 0.01 到 10000.00 之间。",
  orderQuantityInvalid: "购买数量必须是大于 0 的整数。",
  shippingInvalid: "运费必须在 0.00 到 10000.00 之间。",
  taxesInvalid: "税费必须在 0.00 到 10000.00 之间。",
  orderStatusRequired: "请选择订单状态。",
  expenseDateRequired: "请选择支出日期。",
  expenseCategoryRequired: "请选择有效的支出分类。",
  expenseAmountInvalid: "支出金额必须在 0.01 到 10000.00 之间。",
  expenseNotesRequired: "请输入备注。",
  expenseNotesTooLong: "备注不能超过 120 个字符。",
});

const valueTranslationKeys = {
  Hats: "hats",
  Drinkware: "drinkware",
  Clothing: "clothing",
  Accessories: "accessories",
  "Home decor": "homeDecor",
  "Baseball caps": "baseballCaps",
  Snapbacks: "snapbacks",
  Beanies: "beanies",
  "Bucket hats": "bucketHats",
  Mugs: "mugs",
  "Water bottles": "waterBottles",
  Tumblers: "tumblers",
  "T-shirts": "tshirts",
  Sweatshirts: "sweatshirts",
  Hoodies: "hoodies",
  "Pillow cases": "pillowCases",
  "Tote bags": "toteBags",
  Stickers: "stickers",
  Posters: "posters",
  "Framed posters": "framedPosters",
  "Canvas prints": "canvasPrints",
  "Peace embroidered cap": "peaceEmbroideredCap",
  "Floral lotus printed bottle": "floralLotusPrintedBottle",
  "Palestine sweater": "palestineSweater",
  "Vibes printed poster": "vibesPrintedPoster",
  "Morrocan print pillow case": "morrocanPrintPillowCase",
  Rent: "rent",
  "Order Fulfillment": "orderFulfillment",
  Utilities: "utilities",
  Supplies: "supplies",
  Miscellaneous: "miscellaneous",
  Pending: "pending",
  Processing: "processing",
  Shipped: "shipped",
  Delivered: "delivered",
};

Object.assign(valueTranslationKeys, {
  "In Stock": "inStock",
  "Low Stock": "lowStock",
  "Out of Stock": "outOfStock",
});

const LANGUAGE_STORAGE_KEY = "bizTrackLanguage";

function getCurrentLanguage() {
  const language = localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";
  return translations[language] ? language : "en";
}

function getText(key) {
  const language = getCurrentLanguage();
  return translations[language][key] || translations.en[key] || key;
}

function translateValue(value) {
  const key = valueTranslationKeys[value];
  return key ? getText(key) : value;
}

function updateElementTextNode(element, text) {
  const textNodes = Array.from(element.childNodes).filter(
    (node) => node.nodeType === Node.TEXT_NODE,
  );

  if (textNodes.length === 0) {
    element.appendChild(document.createTextNode(text));
    return;
  }

  textNodes[0].textContent = text;
  textNodes.slice(1).forEach((node) => node.remove());
}

function applyTranslatedText(element, translatedText) {
  const directBoldChild = Array.from(element.children).find(
    (child) => child.tagName === "B",
  );

  if (directBoldChild) {
    const smallElement = directBoldChild.querySelector("small");

    if (smallElement) {
      directBoldChild.replaceChildren(
        document.createTextNode(`${translatedText} `),
        smallElement,
      );
      smallElement.textContent = getText("calculated");
      return;
    }

    const separatorMatch = translatedText.match(/^(.+?[锛?])\s*(.*)$/);

    if (separatorMatch) {
      directBoldChild.textContent = separatorMatch[1];
      updateElementTextNode(element, separatorMatch[2] ? ` ${separatorMatch[2]}` : "");
      return;
    }

    if (element.children.length === 1) {
      directBoldChild.textContent = translatedText;
      return;
    }
  }

  element.textContent = translatedText;
}

function updateLanguageToggle(language) {
  const toggleButton = document.getElementById("language-toggle");

  if (!toggleButton) {
    return;
  }

  const nextActionKey = language === "en" ? "switchToChinese" : "switchToEnglish";
  const nextActionText = translations[language][nextActionKey] || translations.en[nextActionKey];

  toggleButton.dataset.currentLanguage = language;
  toggleButton.dataset.active = language;
  toggleButton.setAttribute("aria-label", nextActionText);
  toggleButton.setAttribute("title", nextActionText);

  toggleButton.querySelectorAll("[data-lang-option]").forEach((option) => {
    const isActive = option.dataset.langOption === language;
    option.classList.toggle("is-active", isActive);
  });
}

function applyLanguage(language, options = {}) {
  const normalizedLanguage = translations[language] ? language : "en";
  const { persist = false, dispatchEvent = true } = options;

  if (persist && getCurrentLanguage() !== normalizedLanguage) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
  }

  document.documentElement.lang = normalizedLanguage === "zh" ? "zh-CN" : "en";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    applyTranslatedText(element, getText(element.getAttribute("data-i18n")));
  });

  document.querySelectorAll("[data-i18n-label]").forEach((element) => {
    element.setAttribute("label", getText(element.getAttribute("data-i18n-label")));
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", getText(element.getAttribute("data-i18n-aria-label")));
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", getText(element.getAttribute("data-i18n-placeholder")));
  });

  updateLanguageToggle(normalizedLanguage);

  if (dispatchEvent) {
    document.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: { language: normalizedLanguage },
      }),
    );
  }
}

function setLanguage(language) {
  applyLanguage(language, { persist: true, dispatchEvent: true });
}

function toggleLanguage() {
  setLanguage(getCurrentLanguage() === "en" ? "zh" : "en");
}

function bindLanguageToggle() {
  const toggleButton = document.getElementById("language-toggle");

  if (!toggleButton || toggleButton.dataset.bound === "true") {
    return;
  }

  toggleButton.addEventListener("click", toggleLanguage);
  toggleButton.dataset.bound = "true";
}

function safeCSVValue(value) {
  const str = String(value);

  if (str === "") {
    return '""';
  }

  if (
    str.includes(",") ||
    str.includes('"') ||
    str.includes("\n") ||
    str.includes("\r") ||
    /^[=+\-@]/.test(str)
  ) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

function safeGenerateCSV(data) {
  if (!data || data.length === 0) {
    return "";
  }

  const headers = Object.keys(data[0]).map(safeCSVValue).join(",");
  const rows = data.map((row) => Object.values(row).map(safeCSVValue).join(","));

  return `${headers}\n${rows.join("\n")}`;
}

window.translations = translations;
window.getCurrentLanguage = getCurrentLanguage;
window.getText = getText;
window.translateValue = translateValue;
window.setLanguage = setLanguage;
window.toggleLanguage = toggleLanguage;
window.safeGenerateCSV = safeGenerateCSV;

document.addEventListener("DOMContentLoaded", () => {
  bindLanguageToggle();
  applyLanguage(getCurrentLanguage(), { persist: false, dispatchEvent: false });
});
