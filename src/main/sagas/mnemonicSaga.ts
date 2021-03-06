import { takeEvery, put } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { OnboardingActions } from "../../shared/actions/onboarding";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";
import { HdInfo } from "../../dynamicdInterfaces/HdInfo";
import { RpcClient } from "../RpcClient";

export function* mnemonicSaga(rpcClient: RpcClient) {
    yield takeEvery(getType(OnboardingActions.walletPasswordSetSuccess), function* () {

        const mnemonic: string = yield unlockedCommandEffect(rpcClient, async (client) => {
            const hdInfo: HdInfo = await client.command("dumphdinfo");
            return hdInfo.mnemonic;
        })
        yield put(OnboardingActions.mnemonicAcquired(mnemonic))
    })
}

