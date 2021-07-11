import {Layout} from 'antd';
import React, {ComponentType, FC, useEffect} from 'react';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import './App.less';
import {withSuspense} from './hoc/withSuspense';
import Sider from "antd/es/layout/Sider";
import {Content} from 'antd/lib/layout/layout';
import {Header} from "antd/es/layout/layout";
import ConnectMetaMask from "./components/common/ConnectMetaMask/Connect";
import {AppStateType} from "./redux/redux-store";
import {connect} from "react-redux";
import {actionsAuth} from "./redux/auth-reducer";
import { compose } from 'redux';

const CreateNFTToken = React.lazy(() => import("./components/CreateNFTToken/CreateNFTToken"));

type MapStateToPropsType = {
    isConnected: boolean,
}
type MapDispatchToPropsType = {
    setIsConnected: (isConnected: boolean) => void
}
type OwnPropsType = {}
type PropsType = MapStateToPropsType & MapDispatchToPropsType & OwnPropsType;

const App: FC<PropsType> = React.memo((props) => {
    useEffect(() => {
        const isConnect = !!window.ethereum.selectedAddress
        props.setIsConnected(isConnect)
    }, [])
    return (
        <Layout className="App">
            <Header className='flex justify-end'>
                <ConnectMetaMask isConnected={props.isConnected} setIsConnected={props.setIsConnected}/>
            </Header>
            <Layout>
                <Sider width={300} theme={'dark'}>

                </Sider>
                <Content>
                    <Switch>
                        <Route exact path='/'
                               render={() => <Redirect to={"/create"}/>}/>

                        <Route path='/create'
                               render={withSuspense(CreateNFTToken)}/>

                        <Route path='*'
                               render={() => <div>404 NOT FOUND</div>}/>
                    </Switch>
                </Content>
            </Layout>

        </Layout>
    );
})
const MapStateToProps = (state: AppStateType) => ({
    isConnected: state.auth.isConnected
})
const MainApp = compose<ComponentType>(
    withRouter,
    connect<MapStateToPropsType, MapDispatchToPropsType, OwnPropsType, AppStateType>(MapStateToProps, {setIsConnected: actionsAuth.setIsConnected})
)(App)

export default MainApp;
