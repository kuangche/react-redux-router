/**
 * Created by Anchao on 2017/6/29.
 */

// 公共js
import $ from 'jquery'
import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Immutable from 'immutable'
import pathToRegExp from 'path-to-regexp'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider, connect } from 'react-redux'
import createHistory from 'history/createHashHistory'
import {
    NavLink, Link, HashRouter as Router, Route, Redirect, Switch, withRouter
} from 'react-router-dom'
import { routerReducer } from 'react-router-redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createSelector } from 'reselect'
import { AppContainer } from 'react-hot-loader'
import dialog from '../plugins/dialog'
import Tools from './Tools'
// require('../plugins/bootstrap')

// state日志
const logger = createLogger({
    stateTransformer: (state) => {
        const newState = {}

        for (const i of Object.keys(state)) {
            if (Immutable.Iterable.isIterable(state[i])) {
                newState[i] = state[i].toJS()
            } else {
                newState[i] = state[i]
            }
        }

        return newState
    }
})

// store创建工具
const storeCreateByReducer = reducers => createStore(
    combineReducers({
        ...reducers,
        routing: routerReducer
    }),
    applyMiddleware(thunkMiddleware, logger)
)

export {
    $,
    axios,
    dialog,
    Tools,
    React,
    ReactDOM,
    PropTypes,
    Immutable,
    pathToRegExp,
    storeCreateByReducer,
    combineReducers,
    Provider,
    connect,
    createSelector,
    Router,
    Route,
    withRouter,
    NavLink,
    Link,
    Redirect,
    Switch,
    createHistory,
    AppContainer
}