import syuzo from "../assets/shuzo.png";
const image_origin = "https://d2xuq81w4f1cof.cloudfront.net/instructors/images"

export interface AssistantModel {
    name: string;
    level: number;
    image_src: string;
    description: string;
    prompt: string;
}

export class AssistantModelFactory {
    static fromJson(json: any): AssistantModel {
        return {
            name: json.name || "",
            level: json.level || 0,
            image_src: `${image_origin}/${json.image}` || "",
            description: json.description || "",
            prompt: json.prompt || "",
        };
    }
}


export const AssistantList: AssistantModel[] = [
    {
        name: "鬼トレーナー修三",
        level: 100,
        image_src: syuzo,
        description: "絶対にあきらめない！",
        prompt: ""
    },
    {
        name: "トレーナー修三",
        level: 50,
        image_src: syuzo,
        description: "時には妥協も大切",
        prompt: ""
    },
    {
        name: "やさしいトレーナー修三",
        level: 0,
        image_src: syuzo,
        description: "死にさえしなければいいさ",
        prompt: ""
    },

]