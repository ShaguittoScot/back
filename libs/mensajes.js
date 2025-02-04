export function mensaje(status, mensajeUsuario, mensajeOrijinal ='',token = '') {
    return {
        status,
        mensajeUsuario,
        mensajeOrijinal,
        token
    }
}