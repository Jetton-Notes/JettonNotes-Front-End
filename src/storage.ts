import {
    set,
    get,
    keys
} from 'idb-keyval';


export async function saveAccountKey(cipherText: Uint8Array) {
    try {
        const key = `account-key`

        await set(key, cipherText)
        return {
            success: true,
            error: ""
        }
    } catch (err) {
        return {
            success: false,
            error: "Unable to set"
        }
    }
}

export async function getAccountKey(): Promise<{ success: boolean, cipherText: Uint8Array, error: string }> {
    try {
        const key = "account-key";

        const res = await get(key);

        if (res) {
            return {
                success: true,
                error: "",
                cipherText: res
            }
        }

        return {
            success: false,
            error: "not found",
            cipherText: new Uint8Array()
        }

    } catch (err) {
        return {
            success: false,
            error: "threw error",
            cipherText: new Uint8Array()
        }
    }
}

//These are used to get the account ids

export async function saveAccountIdentifier(account_id: string) {
    try {
        const key = `account-id`

        await set(key, account_id)
        return {
            success: true,
            error: ""
        }
    } catch (err) {
        return {
            success: false,
            error: "Unable to set"
        }
    }
}

export async function getAccountIdentifier() {
    try {
        const key = "account-id";

        const res = await get(key);

        if (res) {
            return {
                success: true,
                error: "",
                res: res
            }
        }

        return {
            success: false,
            error: "not found",
            res: ""
        }

    } catch (err) {
        return {
            success: false,
            error: "threw error",
            res: ""
        }
    }
}

export async function getAllUTXOs(account_id: string) {
    const allKeys = await keys();
    let results = [];
    for (let i = 0; i < allKeys.length; i++) {
        if (allKeys[i].toString().startsWith(account_id)) {
            results.push(allKeys[i]);
        }
    }
    return results;
}

//TODO: I need to encrypt the notes before I save them...
export async function saveManyUTXOs(keys: string[], values: { index: number, ciphertext: string, commitment: string }) {
}

export async function getLastAddressUTXOIndex(): Promise<{ success: boolean, data: number, error: string }> {
    try {
        const key = `last-utxo`;

        const res = await get(key);

        if (res) {
            return {
                success: true,
                error: "",
                data: res
            }
        }
        return {
            success: false,
            error: "not found",
            data: -1
        }

    } catch (err) {
        return {
            success: false,
            error: "not found",
            data: -1
        }

    }
}

export async function setLastAddressUTXOIndex(index: number) {
    try {
        const key = `last-utxo`;
        await set(key, index);
        return {
            success: true,
            error: ""
        }
    } catch (err) {
        return {
            success: false,
            error: "Unable to set"
        }
    }
}