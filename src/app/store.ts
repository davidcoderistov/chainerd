import { configureStore } from '@reduxjs/toolkit'
import rootReducer from '../slices'
import rootSaga from "../sagas";
import createSagaMiddleware from 'redux-saga'


// Init saga middleware
const sagaMiddleware = createSagaMiddleware()

// Configure store
const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(sagaMiddleware)
})

// Run the root saga
sagaMiddleware.run(rootSaga)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store