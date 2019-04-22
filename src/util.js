export function getRedirectPath({type, avatar}) {

    // return the redirect path the user should be redirected to

    let url = (type === 'boss') ? '/boss' : '/genius'

    // if no avatar, it means the user has not finished filled 
    // in the information
    
    if (!avatar) {
        url += 'info'
    }
    return url
}

// helper function which generates a unique chat id between two users.
export function getChatId(userId, targetId) {
    return [userId, targetId].sort().join('_')
}