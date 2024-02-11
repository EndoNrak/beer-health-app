export interface DeviceModel {
    id: string;
    name: string;
    type: string;
    status: string;
    image_src: string;
}

export class DeviceFactory {
    static fromJson(json: any): DeviceModel {
        return {
            id: json.id || "",
            type: json.type || "",
            name: json.name || "",
            status: json.status || "",
            image_src: json.image_src || "",
        };
    }
}

export class Device implements DeviceModel {
    constructor(public id: string, public type: string, public name: string, public status: string, public image_src: string) {}

    copyWith({
        id,
        type,
        name,
        status,
        image_src,
    }: {
        id?: string;
        type?: string;
        name?: string;
        status?: string;
        image_src?: string;
    }): Device {
        return new Device(
            id !== undefined ? id : this.id,
            type !== undefined ? type : this.type,
            name !== undefined ? name : this.name,
            status !== undefined ? status : this.status,
            image_src !== undefined ? image_src : this.image_src
        );
    }
}
