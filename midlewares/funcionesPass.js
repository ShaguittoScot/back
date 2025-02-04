import crypto from 'crypto';

export function encriptarPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex'); // Tamaño de salt más convencional
    const hash = crypto.scryptSync(password, salt, 64, 'sha512').toString('hex'); // Parámetro de iteraciones corregido
    return { salt, hash };
}

export function validarPassword(password, salt, hash) {
    const hashEvaluar = crypto.scryptSync(password, salt, 64, 'sha512').toString('hex');
    return hashEvaluar === hash;
}

export function usuarioAutorizado(){

}

export function adminAutorizado(){

}

/*

const{salt,hash}=encriptarPassword('abcd');

console.log('salt:',salt);
console.log('hash: ',hash);


const aprobado = validarPassword("abc",salt,hash);
console.log("Aprobado;",aprobado);
*/