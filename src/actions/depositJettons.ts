import { beginCell, OpenedContract, Sender, toNano } from "@ton/core";
import { TonClient } from "ton";

import { Address } from "ton-core";
import { currentNetwork, JETTONNOTES_ADDRESS, MainnetAPI, TestnetAPI, tgBTC_jetton_master } from "../constants";
import { depositJettonsForwardPayload, DepositWithdraw } from "../contracts/depositWithdraw";
import { JettonMinter } from "../contracts/jettonMinter";
import { JettonWallet } from "../contracts/jettonWallet";


export async function getJettonWalletClient(client: TonClient, sender_address: string): Promise<OpenedContract<JettonWallet>> {
    const jettonMinter = JettonMinter.createFromAddress(Address.parse(tgBTC_jetton_master));
    //@ts-ignore
    const jettonMinterClient = client.open(jettonMinter) as OpenedContract<JettonMinter>;

    const userJettonAddress = await jettonMinterClient.getWalletAddress(sender_address);

    const jettonWallet = JettonWallet.createFromAddress(userJettonAddress);

    //    @ts-ignore
    const jettonWalletClient = client.open(jettonWallet) as OpenedContract<JettonWallet>;

    return jettonWalletClient;
}

export async function depositJettons(
    commitment: bigint,
    depositedAmount: bigint,
    jettonWalletClient: OpenedContract<JettonWallet>,
    sender: Sender,
    depositWithdrawContract: OpenedContract<DepositWithdraw>,
    senderAddress: Address
) {
    const payload = depositJettonsForwardPayload({ commitment });

    const depositMessageResult = await jettonWalletClient.sendTransfer(
        sender,
        toNano("1"),
        depositedAmount,
        depositWithdrawContract.address, //TODO: This is bypassed now Send to
        senderAddress, //Response address
        beginCell().endCell(), //CustomPayload
        toNano("0.1"), //Must have enough Ton to forward it...
        payload
    );

    return depositMessageResult;

}

export function getDepositWithdrawContract(client: TonClient) {
    const depositWithdraw = DepositWithdraw.createFromAddress(Address.parse(JETTONNOTES_ADDRESS));
    //@ts-ignore
    const depositWithdrawClient = client.open(depositWithdraw) as OpenedContract<DepositWithdraw>;
    return depositWithdrawClient;
}

export async function getCommitmentBalance(client: TonClient, commitment: bigint) {

    const depositWithdrawClient = getDepositWithdrawContract(client);

    const deposit = await depositWithdrawClient.getDeposit(commitment);
    return deposit;
}

export async function getCommitmentBalanceWithoutWallet(commitment: bigint) {
    const client = new TonClient({
        endpoint: currentNetwork === "testnet" ? TestnetAPI : MainnetAPI
    })
    const depositWithdrawClient = getDepositWithdrawContract(client);

    const deposit = await depositWithdrawClient.getDeposit(commitment);
    return deposit;
}

export async function getRelayerFeeWithoutWallet() {
    const client = new TonClient({
        endpoint: currentNetwork === "testnet" ? TestnetAPI : MainnetAPI
    })
    const depositWithdrawClient = getDepositWithdrawContract(client);

    const relayerData = await depositWithdrawClient.getRelayerData();

    return relayerData.exact_fee_amount;
}