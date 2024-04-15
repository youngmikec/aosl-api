export const CHINOS_APP = {
  ADMIN: "5a51bc91860d8b5ba000a000",
  USERID: "5a51bc91860d8b5ba0001000",
  USERID2: "5a51bc91860d8b5ba0002000",
  WALLET_DEBIT: "1234ABCDEF",
  WALLET_CREDIT: "1000ABCDEF",
  WALLET_AMOUNT: 1_000_000_000_000,
  START_DATE: "2021-04-01",
};

export const TRANSACTION = {
  DEPOSIT: "D", // Crediting by Merchant or Customer
  WITHDRAW: "W", // Cashing out by Merchant or Customer
  TRANSFER: "T", // Spending within Ewallet System between Mechant and Cutsomer
};

export const ORDERS = {
  TYPES: {
    AIRTIME: "AIRTIME",
    GIFTCARD: "GIFTCARD",
    BUY_CRYPTO: "BUY_CRYPTO",
    SELL_CRYPTO: "SELL_CRYPTO",
  },
  STATUS: {
    PENDING: "PENDING",
    PROOFED: "PROOFED",
    APPROVED: "APPROVED",
    DECLINED: "DECLINED",
    COMPLETED: "COMPLETED",
    CANCLED: "CANCLED",
  },
  PAYMENT_METHOD: {
    BANK: "BANK",
    WALLET: "WALLET",
    GATEWAY: "GATEWAY",
  },
  PAYMENT_GATEWAY: {
    PAYPAL: "PAYPAL",
    STRIPE: "STRIPE",
  },
};

export const PAYMENT = {
  GATEWAY: {
    PAYSTACK: "PAYSTACK",
    STRIPE: "STRIPE",
    PAYPAL: "PAYPAL",
    GOOGLE_WALLET: "GOOGLE_WALLET",
    FREEXIT_WALLET: "FREEXIT_WALLET",
  },
  PAYMENT_METHOD: {
    CASH: "CASH",
    GATEWAY: "GATEWAY",
    TRANSFER: "TRANSFER",
    WALLET: "WALLET",
  },
  STATUS: {
    PENDING: "PENDING",
    SUCCESS: "SUCCESS",
    FAIL: "FAIL",
  },
};

export const WALLET = {
  STATUS: {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    BLOCKED: "BLOCKED",
    DELETED: "DELETED",
  },
};

export const PAYPAL = {
  INTENT: {
    SALE: 'sale',
    INVOICE: 'invoice'
  },
  PAYMENT_METHOD: 'paypal',
  CURRENCY: {
    USD: 'USD',
    NGN: 'NGN',
    GBP: 'GBP'
  },
  REDIRECT_URLS: {
    RETURN_URL: 'https://aosl-online.com/paypal/?status=suceess',
    CANCLE_URL: 'https://aosl-online.com/paypal/?status=failed'
  }
}

export const EMAIL = {
  ADMIN: "freexittechnologies@gmail.com",
  SENDER: "sender@freexitnow.com",
  DISPATCHER: "dispatcher@freexitnow.com",
  CONTACT: "contact@freexitnow.com",
  NO_REPLY: "no-reply@freexitnow.com",
};

export const GENDER = {
  MALE: "M",
  FEMALE: "F",
  OTHER: "O",
};

export const COVERAGE = {
  GLOBAL: 1,
  COUNTRY: 2,
  REGION: 3,
};

export const USER_ROLE = {
  OWNER: 1,
  ADMIN: 2,
  SUPPORT: 3,
  USER: 4,
};

export const USER_TYPE = {
  USER: "USER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

export const ACCESS_LEVEL = {
  BLOCKED: 0,
  LOGIN: 1,
  READ: 2,
  CREATE: 3,
  UPDATE: 4,
  DELETE: 5,
  ASSIGNMENT: 6,
  SCHEDULE: 7,
  TRANSFER: 8,
  WITHDRAW: 9,
};

export const BUCKET = {
  PARCEL: "parcel",
  BLOG: "blog",
  PROFILE: "profile",
  VEHICLE: "vehicle",
  CATEGORY: "category",
};

export const DATABASE = {
  ERP_VERSION: 1,
  OBJECT_ID_REGEX: /^[0-9a-fA-F]{24}$/,
  PRELOAD_TABLE_DATA: { TRUE: true, FALSE: false, DEFAULT: false },
  RECORD_STATUS: {
    REJECTED: 0,
    PENDING: 1,
    APPROVED: 2,
    AUDITED: 3,
    CLOSED: 4,
  },
  BASE_ID: {
    COUNTRY: "5c51bc91860d8bab00000001",
    REGION: "5c51bc91860d8bbc00000001",
  },
  OPTIONS: {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    autoIndex: true,
    minimize: false,
    versionKey: false,
    toJSON: {
      virtuals: true,
      // eslint-disable-next-line object-shorthand
      transform: function (doc, ret) {
        ret.id = ret._id;
        // ret.createdAt = ret.created_at;
        // ret.updatedAt = ret.updated_at;
        delete ret._id;
        delete ret.updated_at;
        delete ret.created_at;
        delete ret.__v;
      },
    },
    toObject: { virtuals: true },
  },
};

export const ENTITY = {
  USERS: "Users",
  CRYPTOCURRENCY: "Cryptocurrency",
  JOB: "Jobs",
  GIFTCARD: "Giftcard",
  NEWSLETTER: "Newsletter",
  ORDERS: "Orders",
};
export const JWT = {
  saltRounds: 2,
  jwtSecret: "chinos_app-investment_world-pays",
  tokenExpireTime: "30m",
  adminTokenExpirationTime: '3h'
};

export const SMS = {
  CHINOS_SMS_SENDER: "+1323649 6765",
};

export const API = {
  URL: "https://chinosExchange.com",
};

export const INPUT_TYPE = {
  TEXT: "TEXT",
  TEXTAREA: "TEXTAREA",
  DROPDOWN: "DROPDOWN",
  FILE: "FILE",
  DATETIME: "DATETIME",
  LOCATION: "LOCATION",
  SELECTLIST: "SELECTLIST",
  RADIOBUTTON: "RADIOBUTTON",
  CHECKBOXES: "CHECKBOXES",
  DATE: "DATE",
  TIME: "TIME",
  NUMBER: "NUMBER",
};

export const APPLICATION = {
  CERTLEVEL: {
    MSC: 'MSC',
    PHD: 'PHD',
    HIGHSCHOOL: 'HIGHSCHOOL',
    BSC: 'BSC',
    DEGREE: 'DEGREE',
    DOCTORATE: 'DOCTORATE'
  },
  STATUS: {
    APPLIED: 'APPLIED',
    ACCEPTED: 'ACCEPTED',
    REVIEW: 'REVIEW',
    DECLINED: 'DECLINED'
  }
}

export const JOB = {
  TYPE: {
    WORK: "WORK",
    TRAINING: "TRAINING",
  },
  STATUS: {
    OPEN: "OPEN",
    CLOSED: "CLOSED",
  },
  WORKMODE: {
    REMOTE: 'REMOTE',
    HYBRID: 'HYBRID',
    ONSITE: 'ONSITE',
    FULLTIME: 'FULLTIME',
    PART_TIME: 'PART_TIME'
  },
  PAYMENTMETHOD: {
    NONE: 'NONE',
    BANK: 'BANK',
    PAYPAL: 'PAYPAL',
  },
  PAYMENTDURATION: {
    NONE: 'NONE',
    MONTHLY: 'MONTHLY',
    HOURLY: 'HOURLY',
    WEEKLY: 'WEEKLY',
    ANNUALY: 'ANNUALY'
  }
};

export const GIFTCARD = {
  STATUS: {
    ACTIVE: "ACTIVE",
    DEACTIVATED: "DEACTIVATED",
  },
  TYPE: {
    PHYSICAL: "PHYSICAL",
    ECODE: "ECODE",
  },
};

export const COUNTRIES = [
  { name: 'Afghanistan', code: '+93' },
  { name: 'Albania', code: '+355' },
  { name: 'Algeria', code: '+213' },
  { name: 'Andorra', code: '+376' },
  { name: 'Angola', code: '+244' },
  { name: 'Antigua and Barbuda', code: '+1-268' },
  { name: 'Argentina', code: '+54' },
  { name: 'Armenia', code: '+374' },
  { name: 'Australia', code: '+61' },
  { name: 'Austria', code: '+43' },
  { name: 'Azerbaijan', code: '+994' },
  { name: 'Bahamas', code: '+1-242' },
  { name: 'Bahrain', code: '+973' },
  { name: 'Bangladesh', code: '+880' },
  { name: 'Barbados', code: '+1-246' },
  { name: 'Belarus', code: '+375' },
  { name: 'Belgium', code: '+32' },
  { name: 'Belize', code: '+501' },
  { name: 'Benin', code: '+229' },
  { name: 'Bhutan', code: '+975' },
  { name: 'Bolivia', code: '+591' },
  { name: 'Bosnia and Herzegovina', code: '+387' },
  { name: 'Botswana', code: '+267' },
  { name: 'Brazil', code: '+55' },
  { name: 'Brunei', code: '+673' },
  { name: 'Bulgaria', code: '+359' },
  { name: 'Burkina Faso', code: '+226' },
  { name: 'Burundi', code: '+257' },
  { name: 'Cabo Verde', code: '+238' },
  { name: 'Cambodia', code: '+855' },
  { name: 'Cameroon', code: '+237' },
  { name: 'Canada', code: '+1' },
  { name: 'Central African Republic', code: '+236' },
  { name: 'Chad', code: '+235' },
  { name: 'Chile', code: '+56' },
  { name: 'China', code: '+86' },
  { name: 'Colombia', code: '+57' },
  { name: 'Comoros', code: '+269' },
  { name: 'Congo (Congo-Brazzaville)', code: '+242' },
  { name: 'Costa Rica', code: '+506' },
  { name: 'Croatia', code: '+385' },
  { name: 'Cuba', code: '+53' },
  { name: 'Cyprus', code: '+357' },
  { name: 'Czech Republic', code: '+420' },
  { name: 'Democratic Republic of the Congo', code: '+243' },
  { name: 'Denmark', code: '+45' },
  { name: 'Djibouti', code: '+253' },
  { name: 'Dominica', code: '+1-767' },
  { name: 'Dominican Republic', code: '+1-809, +1-829, +1-849' },
  { name: 'East Timor (Timor-Leste)', code: '+670' },
  { name: 'Ecuador', code: '+593' },
  { name: 'Egypt', code: '+20' },
  { name: 'El Salvador', code: '+503' },
  { name: 'Equatorial Guinea', code: '+240' },
  { name: 'Eritrea', code: '+291' },
  { name: 'Estonia', code: '+372' },
  { name: 'Eswatini (fmr. "Swaziland")', code: '+268' },
  { name: 'Ethiopia', code: '+251' },
  { name: 'Fiji', code: '+679' },
  { name: 'Finland', code: '+358' },
  { name: 'France', code: '+33' },
  { name: 'Gabon', code: '+241' },
  { name: 'Gambia', code: '+220' },
  { name: 'Georgia', code: '+995' },
  { name: 'Germany', code: '+49' },
  { name: 'Ghana', code: '+233' },
  { name: 'Greece', code: '+30' },
  { name: 'Grenada', code: '+1-473' },
  { name: 'Guatemala', code: '+502' },
  { name: 'Guinea', code: '+224' },
  { name: 'Guinea-Bissau', code: '+245' },
  { name: 'Guyana', code: '+592' },
  { name: 'Haiti', code: '+509' },
  { name: 'Honduras', code: '+504' },
  { name: 'Hungary', code: '+36' },
  { name: 'Iceland', code: '+354' },
  { name: 'India', code: '+91' },
  { name: 'Indonesia', code: '+62' },
  { name: 'Iran', code: '+98' },
  { name: 'Iraq', code: '+964' },
  { name: 'Ireland', code: '+353' },
  { name: 'Israel', code: '+972' },
  { name: 'Italy', code: '+39' },
  { name: 'Ivory Coast', code: '+225' },
  { name: 'Jamaica', code: '+1-876' },
  { name: 'Japan', code: '+81' },
  { name: 'Jordan', code: '+962' },
  { name: 'Kazakhstan', code: '+7' },
  { name: 'Kenya', code: '+254' },
  { name: 'Kiribati', code: '+686' },
  { name: 'Kosovo', code: '+383' },
  { name: 'Kuwait', code: '+965' },
  { name: 'Kyrgyzstan', code: '+996' },
  { name: 'Laos', code: '+856' },
  { name: 'Latvia', code: '+371' },
  { name: 'Lebanon', code: '+961' },
  { name: 'Lesotho', code: '+266' },
  { name: 'Liberia', code: '+231' },
  { name: 'Libya', code: '+218' },
  { name: 'Liechtenstein', code: '+423' },
  { name: 'Lithuania', code: '+370' },
  { name: 'Luxembourg', code: '+352' },
  { name: 'Madagascar', code: '+261' },
  { name: 'Malawi', code: '+265' },
  { name: 'Malaysia', code: '+60' },
  { name: 'Maldives', code: '+960' },
  { name: 'Mali', code: '+223' },
  { name: 'Malta', code: '+356' },
  { name: 'Marshall Islands', code: '+692' },
  { name: 'Mauritania', code: '+222' },
  { name: 'Mauritius', code: '+230' },
  { name: 'Mexico', code: '+52' },
  { name: 'Micronesia', code: '+691' },
  { name: 'Moldova', code: '+373' },
  { name: 'Monaco', code: '+377' },
  { name: 'Mongolia', code: '+976' },
  { name: 'Montenegro', code: '+382' },
  { name: 'Morocco', code: '+212' },
  { name: 'Mozambique', code: '+258' },
  { name: 'Myanmar', code: '+95' },
  { name: 'Namibia', code: '+264' },
  { name: 'Nauru', code: '+674' },
  { name: 'Nepal', code: '+977' },
  { name: 'Netherlands', code: '+31' },
  { name: 'New Zealand', code: '+64' },
  { name: 'Nicaragua', code: '+505' },
  { name: 'Niger', code: '+227' },
  { name: 'Nigeria', code: '+234' },
  { name: 'North Korea', code: '+850' },
  { name: 'North Macedonia', code: '+389' },
  { name: 'Norway', code: '+47' },
  { name: 'Oman', code: '+968' },
  { name: 'Pakistan', code: '+92' },
  { name: 'Palau', code: '+680' },
  { name: 'Palestine', code: '+970' },
  { name: 'Panama', code: '+507' },
  { name: 'Papua New Guinea', code: '+675' },
  { name: 'Paraguay', code: '+595' },
  { name: 'Peru', code: '+51' },
  { name: 'Philippines', code: '+63' },
  { name: 'Poland', code: '+48' },
  { name: 'Portugal', code: '+351' },
  { name: 'Qatar', code: '+974' },
  { name: 'Romania', code: '+40' },
  { name: 'Russia', code: '+7' },
  { name: 'Rwanda', code: '+250' },
  { name: 'Saint Kitts and Nevis', code: '+1-869' },
  { name: 'Saint Lucia', code: '+1-758' },
  { name: 'Saint Vincent and the Grenadines', code: '+1-784' },
  { name: 'Samoa', code: '+685' },
  { name: 'San Marino', code: '+378' },
  { name: 'Sao Tome and Principe', code: '+239' },
  { name: 'Saudi Arabia', code: '+966' },
  { name: 'Senegal', code: '+221' },
  { name: 'Serbia', code: '+381' },
  { name: 'Seychelles', code: '+248' },
  { name: 'Sierra Leone', code: '+232' },
  { name: 'Singapore', code: '+65' },
  { name: 'Slovakia', code: '+421' },
  { name: 'Slovenia', code: '+386' },
  { name: 'Solomon Islands', code: '+677' },
  { name: 'Somalia', code: '+252' },
  { name: 'South Africa', code: '+27' },
  { name: 'South Korea', code: '+82' },
  { name: 'South Sudan', code: '+211' },
  { name: 'Spain', code: '+34' },
  { name: 'Sri Lanka', code: '+94' },
  { name: 'Sudan', code: '+249' },
  { name: 'Suriname', code: '+597' },
  { name: 'Sweden', code: '+46' },
  { name: 'Switzerland', code: '+41' },
  { name: 'Syria', code: '+963' },
  { name: 'Taiwan', code: '+886' },
  { name: 'Tajikistan', code: '+992' },
  { name: 'Tanzania', code: '+255' },
  { name: 'Thailand', code: '+66' },
  { name: 'Togo', code: '+228' },
  { name: 'Tonga', code: '+676' },
  { name: 'Trinidad and Tobago', code: '+1-868' },
  { name: 'Tunisia', code: '+216' },
  { name: 'Turkey', code: '+90' },
  { name: 'Turkmenistan', code: '+993' },
  { name: 'Tuvalu', code: '+688' },
  { name: 'Uganda', code: '+256' },
  { name: 'Ukraine', code: '+380' },
  { name: 'United Arab Emirates', code: '+971' },
  { name: 'United Kingdom', code: '+44' },
  { name: 'United States', code: '+1' },
  { name: 'Uruguay', code: '+598' },
  { name: 'Uzbekistan', code: '+998' },
  { name: 'Vanuatu', code: '+678' },
  { name: 'Vatican City (Holy See)', code: '+379' },
  { name: 'Venezuela', code: '+58' },
  { name: 'Vietnam', code: '+84' },
  { name: 'Yemen', code: '+967' },
  { name: 'Zambia', code: '+260' },
  { name: 'Zimbabwe', code: '+263' }
];


export * from "./env-constant.js";
export * from './email-templates.js';