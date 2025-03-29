
import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type RandomnessProviderConfig = {
    owner: Address;
    casino: Address;
};

export function randomnessProviderConfigToCell(config: RandomnessProviderConfig): Cell {
    return beginCell()
        .storeAddress(config.owner)
        .storeAddress(config.casino)
        .storeDict(null) // empty request dict
        .endCell();
}

export class RandomnessProvider implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new RandomnessProvider(address);
    }

    static createFromConfig(config: RandomnessProviderConfig, code: Cell, workchain = 0) {
        const data = randomnessProviderConfigToCell(config);
        const init = { code, data };
        return new RandomnessProvider(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendUpdateCasino(
        provider: ContractProvider,
        via: Sender,
        opts: {
            newCasinoAddress: Address;
            value: bigint;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(3, 32) // op::update_casino = 3
                .storeAddress(opts.newCasinoAddress)
                .endCell(),
        });
    }
}
