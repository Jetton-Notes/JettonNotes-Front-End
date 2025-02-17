export async function encryptData(file: string, passwd: string): Promise<Options<Uint8Array>> {
    const startblob = new Blob([JSON.stringify(file, null, 2)], {
        type: "application/json",
    });
    const cipher = await encrypt(startblob, passwd) as Uint8Array;

    if (!cipher) {
        return {
            status: Status.Failure,
            data: new Uint8Array(),
            error: "Unable to encrypt data"
        }
    } else {
        return {
            status: Status.Success,
            data: cipher,
            error: ""
        }
    }
}

export async function decryptData(
    cipherbytes: ArrayBuffer,
    passwd: string
): Promise<Options<string>> {
    const options: Options<string> = {
        error: "",
        data: "",
        status: Status.Success,
    };

    const onError = (err: any) => {
        options.error = "Unable to decrypt keyfile.";
        options.status = Status.Failure;
    };

    try {
        const decryptedBytes = await decrypt(cipherbytes, passwd, onError);
        const decodedBytes = decodeUint8Array(decryptedBytes);
        options.data = JSON.parse(decodedBytes);
    } catch (err) {
        options.status = Status.Failure;
        options.error = "Unable to decrypt keyfile";
    }
    return options;
}


export enum Status {
    Success,
    Failure
}

export type Options<T> = {
    status: Status;
    error: any;
    data: T;
};


async function encrypt(startblob: Blob, passwd: string) {
    let plaintextbytes = await startblob.arrayBuffer();
    plaintextbytes = new Uint8Array(plaintextbytes);
    const pbkdf2iterations = 10000;
    const passphrasebytes = new TextEncoder().encode(passwd);
    const pbkdf2salt = window.crypto.getRandomValues(new Uint8Array(8));
    const passphrasekey = await window.crypto.subtle
        .importKey("raw", passphrasebytes, { name: "PBKDF2" }, false, [
            "deriveBits",
        ])
        .catch((err) => {
            console.log(err);
        });

    let pbkdf2bytes = await window.crypto.subtle
        .deriveBits(
            {
                name: "PBKDF2",
                salt: pbkdf2salt,
                iterations: pbkdf2iterations,
                hash: "SHA-256",
            },
            passphrasekey as CryptoKey,
            384
        )
        .catch((err) => {
            console.log(err);
        });
    pbkdf2bytes = new Uint8Array(pbkdf2bytes as ArrayBuffer);
    const keybytes = pbkdf2bytes.slice(0, 32);
    const ivbytes = pbkdf2bytes.slice(32);

    const encryptionkey = await window.crypto.subtle.importKey(
        "raw",
        keybytes,
        { name: "AES-CBC", length: 256 },
        false,
        ["encrypt"]
    );

    let cipherBytes = await window.crypto.subtle
        .encrypt({ name: "AES-CBC", iv: ivbytes }, encryptionkey, plaintextbytes)
        .catch((err) => {
            console.error(err);
        });

    if (!cipherBytes) {
        return;
    }

    cipherBytes = new Uint8Array(cipherBytes) as Uint8Array;

    const resultBytes = new Uint8Array((cipherBytes as Uint8Array).length + 16);
    resultBytes.set(new TextEncoder().encode("Salted__"));
    resultBytes.set(pbkdf2salt, 8);
    resultBytes.set(cipherBytes as Uint8Array, 16);
    return resultBytes;
}


//@ts-ignore
async function decrypt(
    cipherbytes: ArrayBuffer,
    passwd: string,
    onError: CallableFunction
): Promise<Uint8Array> {
    const pbkdf2iterations = 10000;
    const passphrasebytes = new TextEncoder().encode(passwd);
    const pbkdf2salt = cipherbytes.slice(8, 16);
    const passphrasekey = await window.crypto.subtle
        .importKey("raw", passphrasebytes, { name: "PBKDF2" }, false, [
            "deriveBits",
        ])
        .catch((err) => {
            onError(err);
        });

    let pbkdf2bytes = await window.crypto.subtle
        .deriveBits(
            {
                name: "PBKDF2",
                salt: pbkdf2salt,
                iterations: pbkdf2iterations,
                hash: "SHA-256",
            },
            passphrasekey as CryptoKey,
            384
        )
        .catch((err) => {
            onError(err);
        });
    pbkdf2bytes = new Uint8Array(pbkdf2bytes as ArrayBuffer);

    const keybytes = pbkdf2bytes.slice(0, 32);
    const ivbytes = pbkdf2bytes.slice(32);
    cipherbytes = cipherbytes.slice(16);

    const decryptionKey = await window.crypto.subtle
        .importKey("raw", keybytes, { name: "AES-CBC", length: 256 }, false, [
            "decrypt",
        ])
        .catch((err) => {
            onError(err);
        });
    let plaintextbytes = await window.crypto.subtle
        .decrypt(
            { name: "AES-CBC", iv: ivbytes },
            decryptionKey as CryptoKey,
            cipherbytes
        )
        .catch((err) => {
            onError(err);
        });

    if (!plaintextbytes) {
        onError("Error Decrypting File, Wrong password.");
    }

    plaintextbytes = new Uint8Array(plaintextbytes as ArrayBufferLike);

    return plaintextbytes as Uint8Array;
}

export function decodeUint8Array(uint8array: Uint8Array): string {
    return new TextDecoder("utf-8").decode(uint8array);
}

export function encodeStringToUint8Array(data: string): Uint8Array {
    return new TextEncoder().encode(data);
}