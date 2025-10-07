export interface CommunityCommentI {
    name: string,
    date: string,
    text: string,
    like: number | string,
    avatar: string,
    _id: string,
    comments: Array<{
        name: string,
        text: string,
        avatar: string,
        _id: string,
    }>,
}
