export interface Answer {
    question: string;
    value: string;
}

export interface SurveyEntry {
    id: string;
    businessUserId: string;
    surveyId: string;
    researcherId: string;
    answers: Answer[];
    createdAt: string;
    updatedAt: string;
}

export interface Transaction {
    id: string;
    walletId: string;
    type: string;
    amount: number;
    paymentStatus: string;
    tx_ref: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface SurveyField {
    label: string;
    key: string;
    type: string;
    required: boolean;
    options: string[];
    id: string;
    createdAt: string;
    updatedAt: string;
}

export interface Survey {
    id: string;
    businessUserId: string;
    employeeUserId?: string | null;
    surveyName: string;
    surveyDescription: string;
    field: SurveyField[];
    isActive: boolean;
    paymentStatus: string;
    tx_ref?: string;
    createdAt: string;
    updatedAt: string;
    city: string;
    country: string;
    state: string;
}

export interface Researcher {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    countryCode: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    country: string;
    role: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SuperUser {
    id: string;
    fullName: string;
    email: string;
    role: string;
    profilePicture: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface BusinessUser {
    id: string;
    businessName: string;
    contactPersonFirstName: string;
    contactPersonLastName: string;
    countryCode: string;
    contactNumber: string;
    businessAddress: string;
    businessCity: string;
    businessState: string;
    businessCountry: string;
    sector: string;
    organizationSize: string;
    email: string;
    role: string;
    businessLogo: string;
    isVerified: boolean;
}

export interface AdminUser {
    id: string;
    businessName: string;
    userType: string;
    firstName: string;
    lastName: string;
    email: string;
    countryCode: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    country: string;
    role: string;
    hash: string;
    image: string;
    certificateOfIncorporation?: string | null;
    individualValidMeansOfId?: string | null;
    kycReviewReason?: string | null;
    kycStatus: string;
    isVerified: boolean;
    otp: string;
    otpExpiresAt: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface EmployeeUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    countryCode: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    country: string;
    role: string;
    position?: string;
    image?: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface DataPoint {
    id: string;
    businessUserId: string;
    departmentId: string;
    employeeUserId: string;
    dataPointName: string;
    dataPointDescription: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Department {
    id: string;
    businessUserId: string;
    departmentName: string;
    departmentDescription: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface SearchMgtResponse {
    success: boolean;
    message: string;
    data: {
        surveyentries: SurveyEntry[];
        transactions: Transaction[];
        surveys: Survey[];
        researchers: Researcher[];
        superusers: SuperUser[];
        businessusers: BusinessUser[];
        adminusers: AdminUser[];
        employeeusers: EmployeeUser[];
        datapoints: DataPoint[];
        departments: Department[];
    };
}
