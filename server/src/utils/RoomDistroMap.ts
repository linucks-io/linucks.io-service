export interface RoomDistroMap {
    [key: string]: {
        taskArn?: string,
        url?: string,
    }
}

export const rooms: RoomDistroMap = {};
