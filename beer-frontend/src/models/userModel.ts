export interface User {
    id: string;
    name: string;
    first_name: string;
    avatar_url: string;
}

export class FitbitUserFactory {
    static fromJson(json: any): User {
        return {
            id: json.user.encodedId || "",
            name: json.user.fullName || "",
            first_name: json.user.firstName || "guest",
            avatar_url: json.user.avatar || "",
        };
    }
}

export class CognitoUserFactory {
    static fromJson(json: any): User {
        return {
            id: json.sub || "",
            name: json.username|| "",
            first_name: "",
            avatar_url: "",
        };
    }
}