export function getRedirectPath({type, avatar}) {

    // the redirect path the user should be redirected to based on the state of the user.

    let url = (type === 'boss') ? '/boss' : '/genius'

    // if no avatar, it means the user has not finished all the information
    // in this case, should be redirected to info page
    if (!avatar) {
        url += 'info'
    }
    return url
}

// helper function which generates a unique chat id between two users.
export function getChatId(userId, targetId) {
    return [userId, targetId].sort().join('_')
}