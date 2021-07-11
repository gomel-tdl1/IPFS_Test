import {InferActionsTypes} from "./redux-store";

export const actionsAuth = {
    setIsConnected: (isConnected: boolean) => ({
        type: 'SET_IS_CONNECTED',
        isConnected
    })
}

const initialState = {
    isConnected: false
};
export type InitialStateType = typeof initialState;
type ActionsTypes = InferActionsTypes<typeof actionsAuth>

const authReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch (action.type) {
        case 'SET_IS_CONNECTED':
            return {
                ...state,
                isConnected: action.isConnected
            };

        default:
            return {...state};
    }
};

export default authReducer;