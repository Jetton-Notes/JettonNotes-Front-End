import { RelayerURL } from "../constants"

export async function RelayTransaction(proof: any, publicSignals: any) {

    const res = await fetch(RelayerURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ proof, publicSignals })
    })

    if (res.status !== 200) {
        //error, the relayer is not available via internet

    }

    const result = await res.json();

    if (result.success) {

        //SUccess
        console.log("success")
    } else {
        console.log(result.reason);
        //Error, maybe simulaiton failed?
    }

}