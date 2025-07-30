// lib/user.ts
let tempId = localStorage.getItem('temp_user_id')
if (!tempId) {
    tempId = crypto.randomUUID()
    localStorage.setItem('temp_user_id', tempId)
}

export const tempUserId = tempId

let clientId = localStorage.getItem('client_id')
if (!clientId) {
    clientId = crypto.randomUUID()
    localStorage.setItem('client_id', clientId)
}
export const tempClientId = clientId
