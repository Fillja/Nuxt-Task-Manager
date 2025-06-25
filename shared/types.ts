export interface Task {
    id: string;
    title: string;
}

export interface ResponseResult{
    status: number;
    error?: string;
    data?: object;
}

export function responseResult(status: number,  error?: string, data?: object): ResponseResult {
    return {
        status,
        error,
        data
    };
}