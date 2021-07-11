import { createStore, combineReducers } from 'redux';
import authReducer from './auth-reducer';


let rootReducer = combineReducers({
    auth: authReducer,
});

type PropertiesTypes<T> = T extends { [key: string]: infer U } ? U : never;
export type InferActionsTypes<T extends { [key: string]: (...args: any[]) => any }> = ReturnType<PropertiesTypes<T>>

type RootReducerType = typeof rootReducer;
export type AppStateType = ReturnType<RootReducerType>

let store = createStore(rootReducer);

export default store;