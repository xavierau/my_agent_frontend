export interface Message {
    role: string
    id: string;
    content: string;
    urls?: Array<string>;
}

export interface DBMessage {
    "id": string,
    "session_id": string,
    "created_at": Date,
    "message": {
        "id": string,
        "role": string,
        "content": string | Array<{ type: string, text: string }>,
    },
    "role": string,
    "updated_at": Date,
}


export interface SubmitMessagePayload {
    message:string,
    file:File|null,
    fileName:string|null,
    filePreview:string|null,
}