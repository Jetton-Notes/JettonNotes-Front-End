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

//TODO: I need to get all the gift cards
//TODO: the encryption key for the account needs an identifier which should be part of the keys
// Get them one by one
export async function storeGiftCard(account_id: string, cipherText: string) {
}
export async function getGiftCard(account_id: string, commitment: string) { }


//Get them all with keys an filter...
export async function getAllGiftCards(account_id: string) {
  //Filter by keys that contain the account_id string
}


//TODO: the utxos should be stored indexed in the order they are derived

export async function storeUTXOs(account_id: string, commitment: string, cipherText: string) { }

export async function getUTXOs(account_id: string, commitment: string) { }

export async function getAllUTXOs(account_id: string) { }

