
import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type TonCasinoConfig = {
    owner: Address;
    minBet: bigint;
    maxBet: bigint;
    houseEdgeBps: number;
    randomnessSource: Address;
};

export function tonCasinoConfigToCell(config: TonCasinoConfig): Cell {
    return beginCell()
        .storeAddress(config.owner)
        .storeCoins(config.minBet)
        .storeCoins(config.maxBet)
        .storeUint(config.houseEdgeBps, 16)
        .storeCoins(0) // initial house balance
        .storeDict(null) // empty bets dict
        .storeDict(null) // empty user bets dict
        .storeAddress(config.randomnessSource)
        .endCell();
}

export class TonCasino implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new TonCasino(address);
    }

    static createFromConfig(config: TonCasinoConfig, code: Cell, workchain = 0) {
        const data = tonCasinoConfigToCell(config);
        const init = { code, data };
        return new TonCasino(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendPlaceBet(
        provider: ContractProvider,
        via: Sender,
        opts: {
            gameType: number;
            prediction: number;
            value: bigint;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(1, 32) // op::place_bet = 1
                .storeUint(opts.gameType, 8)
                .storeUint(opts.prediction, 32)
                .endCell(),
        });
    }

    async sendWithdrawProfits(
        provider: ContractProvider,
        via: Sender,
        opts: {
            amount: bigint;
            value: bigint;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(5, 32) // op::withdraw_profits = 5
                .storeCoins(opts.amount)
                .endCell(),
        });
    }

    async sendAddHouseFunds(
        provider: ContractProvider,
        via: Sender,
        value: bigint
    ) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(6, 32) // op::add_house_funds = 6
                .endCell(),
        });
    }
}
