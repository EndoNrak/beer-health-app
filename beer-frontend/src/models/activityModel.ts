// ユーザーモデルのインターフェースを定義
export interface Activity {
    id: string;
    name: string;
    calories: number;
    activityName: string;
    startTime: string;
}

export class ActivityFactory {
    static fromJson(json: any): Activity {
        return {
            id: json.logId || "",
            name: json.activity || "",
            activityName: json.activityName || "",
            calories: json.calories || 0,
            startTime: json.startTime || "",
        };
    }
}
