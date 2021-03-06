import { Middleware, Action, createStore, compose, applyMiddleware, Reducer } from "redux";
import { getRootReducer, MainRootState } from "../../reducers";
import { createReduxLocalStorageAdapter } from '../../../shared/system/createReduxLocalStorageAdapter'
import persistState, { mergePersistedState } from 'redux-localstorage';
import { RootActions } from "../../../shared/actions";
import filter from 'redux-localstorage-filter';
import { deepMerge } from "../../../shared/system/deepMerge";


export function createStoreWithHotReload(middlewares: Middleware<Action<any>>[], persistencePaths: string[] | undefined = undefined) {
    const persistenceKey = ".pshare.settings";
    const persistenceEnhancer = getPersistenceEnhancer(persistencePaths, persistenceKey);
    const enhancers = compose(applyMiddleware(...middlewares), persistenceEnhancer)
    const reducer: Reducer<MainRootState, RootActions> = getPersistingReducer();
    const store = createStore(reducer, enhancers);
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (isDevelopment && module.hot) {
        module.hot.accept("../../reducers", () => {
            console.info("hot-reloading reducers");
            const reducer: Reducer<MainRootState, RootActions> = getPersistingReducer();
            store.replaceReducer(reducer);
            console.warn("reducers reloaded");
        });
    }
    return store;
}

function getPersistenceEnhancer(persistencePaths: string[] | undefined, persistenceKey: string) {
    const storageAdapter = createReduxLocalStorageAdapter();
    const storage = persistencePaths ? compose(filter(persistencePaths))(storageAdapter) : storageAdapter;
    const persistenceEnhancer = persistState(storage, persistenceKey);
    return persistenceEnhancer;
}

function getPersistingReducer() {
    const rootReducer = getRootReducer();
    const reducer: Reducer<MainRootState, RootActions> = compose(mergePersistedState(deepMerge))(rootReducer);
    return reducer;
}
