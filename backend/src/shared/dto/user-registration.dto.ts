export interface CompanyDetails {
    name: string;
    type: string;
    industry: string;
    employeeCount: string;
    website: string;
    logoUrl?: string; // Optional, will be set after upload
}

export interface UserRegistrationData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    company: CompanyDetails;
}