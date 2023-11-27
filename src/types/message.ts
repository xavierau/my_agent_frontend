export interface Message {
    role: string
    id: string;
    content: string;
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
