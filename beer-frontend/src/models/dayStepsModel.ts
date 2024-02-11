export interface DaySteps {
    date: Date;
    steps: number;
}

export class DayStepsFactory {
    static fromJson(json: any): DaySteps {
        return {
            date: json.dateTime ? new Date(json.dateTime) : new Date(0),
            steps: json.value ? json.value : 0,
        };
    }

    static createGuestData(): DaySteps {
        return {
            date: new Date(0),
            steps: 0,
        };
    }
}
