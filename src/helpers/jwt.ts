import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: string;
    nombre: string;
    email: string;
    iat: number;
    exp: number;
  }
  export const generarJWT = async(uid:string) => {

    return new Promise((resolve, reject) => {

        const payload = {
            uid
        };

        jwt.sign(payload,
            process.env.JWT as string, {
                expiresIn: '24h'
            },
            (err, token) => {
                if (err) {
                    
                    reject('could not generate JWT')
                }else{
                    resolve(token)
                }

            }
        )

    })

}

export const generarScriptJWT = (uid:string) => {

    return new Promise((resolve, reject) => {

        const payload = {
            uid
        };

        jwt.sign(payload,
            process.env.JWT as string, {
                
            },
            (err, token) => {
                if (err) {
                    
                    reject('could not generate JWT')
                }else{
                    resolve(token)
                }

            }
        )

    })

}
