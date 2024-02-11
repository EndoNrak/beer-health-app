export class ActivityGoalModel {
    public GoalId: string;
    public Category: string;
    public TargetValue: number;
    public GoalDate: Date;
  
    constructor(goalId: string, category: string, targetValue: number, createdAt: Date) {
      this.GoalId = goalId;
      this.Category = category;
      this.TargetValue = targetValue;
      this.GoalDate = createdAt;
    }
  
    // Factory method to create an instance from JSON with default values
    static fromJson(json: any): ActivityGoalModel {
      return new ActivityGoalModel(
        json.GoalId || 'defaultGoalId',
        json.Category || 'defaultCategory',
        json.TargetValue ? Number(json.TargetValue) : 0,
        json.CreatedAt ? new Date(Number(json.CreatedAt)*1000) : new Date(0)
      );
    }
    
    toJson(): any {
      return {
        GoalId: this.GoalId,
        Category: this.Category,
        TargetValue: this.TargetValue,
        GoalDate: this.GoalDate.getTime(),
      };
    }
  }
  