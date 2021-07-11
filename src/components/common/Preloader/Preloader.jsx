import React from 'react'
import s from "./Preloader.module.css";
import Spin from "antd/es/spin";

export default function Preloader(props) {
    return (
        <div style={{height: props.height}} className={s.content}>
            <Spin size="large" className={s.preloader}/>
        </div>
    );
}