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

export const COUNTRIES = {
  NG: "NIGERIA",
  GH: "GHANA",
};

export * from "./env-constant.js";
export * from './email-templates.js';