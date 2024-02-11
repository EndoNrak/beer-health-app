// ユーザーモデルのインターフェースを定義
export interface DayCalories {
    date: Date;
    calories: number;
}

export class DayCaloriesFactory {
    static fromJson(json: any): DayCalories {
        return {
            date: json.dateTime ? new Date(json.dateTime) : new Date(0),
            calories: json.value ? json.value : 0,
        };
    }
}
