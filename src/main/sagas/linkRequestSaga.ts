import { takeEvery, select, put, call } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { BdapActions } from "../../shared/actions/bdap";
import { MainRootState } from "../reducers";
import { LinkRequestResponse } from "../../dynamicdInterfaces/LinkRequestResponse";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";
import { UserState } from "../../shared/reducers/user";
import { RpcClient } from "../RpcClient";
import { getRpcClient } from "../getRpcClient";
import { entries } from "../../shared/system/entries";

export function* linkRequestSaga() {

    yield takeEvery(getType(BdapActions.beginCreateLinkRequest), function* (action: ActionType<typeof BdapActions.beginCreateLinkRequest>) {
        const { requestor, recipient } = action.payload
        console.log(`link request: requestor : ${requestor} , recipient : ${recipient}`)

        const { common_name: commonName }: BdapAccount = yield getMyBdapAccount()
        //console.log(`my common name : ${commonName}`)

        const userName: string | undefined = yield select((state: MainRootState) => state.user.userName)
        if (typeof userName === 'undefined') {
            throw Error("user.userName unexpectedly undefined")
        }
        const inviteMessage = `${commonName} (${userName}) wants to link with you`
        const requestAction = BdapActions.createLinkRequest({ ...action.payload, inviteMessage })
        console.log(requestAction)
        yield put(requestAction)
    })



    yield takeEvery(getType(BdapActions.createLinkRequest), function* (action: ActionType<typeof BdapActions.createLinkRequest>) {
        const { payload: { recipient, requestor, inviteMessage } } = action
        const user: UserState = yield select((state: MainRootState) => state.user)
        const { userName } = user
        if (typeof userName === 'undefined') {
            throw Error("current user has no userName")
        }
        if (requestor !== userName) {
            throw Error(`cannot issue link requests for any user other than ${userName}`)
        }


        let response: LinkRequestResponse;

        try {
            response =
                yield unlockedCommandEffect(command => command("link", "request", requestor, recipient, inviteMessage))

        } catch (err) {
            if (/^BDAP_SEND_LINK_RPC_ERROR\: ERRCODE\: 4001/.test(err.message)) {
                console.log("link already exists")
                yield put(BdapActions.createLinkRequestFailed("Link request or accept already exists for these accounts"))
                return
            }
            debugger
            throw err
        }

        console.log(response)
        yield put(BdapActions.getPendingRequestLinks())

    })



}
interface BdapAccount {
    _id: string,
    version: number,
    domain_component: string,
    common_name: string,
    organizational_unit: string,
    organization_name: string,
    object_id: string,
    object_full_path: string,
    object_type: string,
    wallet_address: string,
    public: number,
    dht_publickey: string,
    link_address: string,
    txid: string,
    time: number,
    expires_on: number,
    expired: boolean
}

const getMyBdapAccount = () => call(function* () {
    const rpcClient: RpcClient = yield call(async () => getRpcClient())
    const myBdapAccountsResponse: Record<string, BdapAccount> = yield call(() => rpcClient.command("mybdapaccounts"))
    const myBdapAccounts = entries(myBdapAccountsResponse).select(([, v]) => v)
    const user: UserState = yield select((state: MainRootState) => state.user)
    const myBdapAccount = myBdapAccounts.singleOrDefault(acc => acc.object_id === user.userName)
    return myBdapAccount
})
