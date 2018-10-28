//tools
export interface Tools {
    id: number,
    name?: string,
    version?: string,
    type?: number,
    inputFile?: boolean,
}

//Downloaded file
export interface RawData {
    id: number,
    name?: string,
    url?: string,
    createdAt?: Date,
    isDeleted?: boolean,
}