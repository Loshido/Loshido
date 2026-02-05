import { lazy, Show } from "solid-js"

const Satellite = lazy(() => import('./satellite'))

export default () => {
    return <Show when={window.innerWidth >= 800}>
        <Satellite/>
    </Show>
}