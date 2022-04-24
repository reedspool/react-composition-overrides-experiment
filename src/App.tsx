import React, { useEffect, useState } from 'react';
import './App.css';


// Utility returning promise which will resolve after n millis
// Useful in async contexts
const wait = (n: number) => new Promise(resolve => setTimeout(resolve, n));

// Utility component to toggle DOM rendering of children
// Usage: <Show when={true}><span>hello</span></Show>
interface ShowProps { when: boolean }
type ShowPropsWChildren = React.PropsWithChildren<ShowProps>

const Show: React.FC<ShowPropsWChildren> = ({ when, children }) => {
    if (when && children) return <>{children}</>;
    return null;
}

// Utility component for when a component is necessary but you don't want anything to render
const NullComponent: React.FC<{}> = () => null;

type Sauce = 'ketchup' | 'mustard' | 'aioli'
type Extra = 'lettuce' | 'onion' | 'tomato'
type BunTypes = 'sesame' | 'plain' | 'waffle' | 'lettuce'
type IsToasted = boolean
type CheeseTypes = 'american' | 'swiss' | 'gruyere'
type Doneness = 'rare' | 'medium' | 'well-done'
interface SandwichProps {
    Bun?: React.FC
    Patty?: React.FC
    Cheese?: React.FC
    Extras?: React.FC
    Sauces?: React.FC
}

const formatList: (list: string[]) => string = (list) => {
    if (list.length === 0) return '<none>';
    if (list.length === 1) return list[0];
    if (list.length === 2) return list.join(" and ");
    const beginning = list.slice(0, -1);
    const end = list.slice(-1);
    return beginning.join(", ") + " and " + end;
}

const BeefPatty: React.FC<{ doneness: Doneness }> = ({ doneness }) => <span>{doneness} burger</span>
const BeetrootPatty: React.FC<{}> = () => <span>beetroot patty</span>
const Bun: React.FC<{ type: BunTypes, isToasted: IsToasted }> = ({ type, isToasted }) =>
    <span>{isToasted ? 'toasted' : 'untoasted'} {type} bun</span>
const Cheese: React.FC<{ type: CheeseTypes }> = ({ type }) => <span>{type} cheese</span>
const Extras: React.FC<{ which: Extra[] }> = ({ which }) => <span>{formatList(which)}</span>
const Sauces: React.FC<{ which: Sauce[] }> = ({ which }) => <span>{formatList(which)}</span>

const DefaultBun = () => <Bun type={'sesame'} isToasted={true} />
const DefaultPatty = () => <BeefPatty doneness={'medium'} />
const DefaultCheese = () => <Cheese type={'american'} />
const DefaultExtras = () => <Extras which={['lettuce', 'onion', 'tomato']} />
const DefaultSauces = () => <Sauces which={['ketchup', 'mustard']} />

const Sandwich: React.FC<SandwichProps> =
    (
        {
            Bun = DefaultBun,
            Patty = DefaultPatty,
            Cheese = DefaultCheese,
            Extras = DefaultExtras,
            Sauces = DefaultSauces
        }
    ) => {
        return <span>
            A <Patty /> on
            a <Bun />
            {' '}with <Cheese />.
            On top, <Extras />.
            A healthy amount of <Sauces />.
        </span>
    }

enum COOKING_PROCESS {
    WAITING_TO_BEGIN,
    BEGINNING,
    COOKING_ITEM,
    ADDING_ITEM,
    PAUSED,
    READY
}

interface BaseCookingProcessProps<S extends COOKING_PROCESS> {
    state: S
}
interface CookingProcessPropsWithoutItem<S extends COOKING_PROCESS> extends BaseCookingProcessProps<S> {
    Item: typeof NullComponent
}

interface CookingProcessPropsWithItem<S extends COOKING_PROCESS> extends BaseCookingProcessProps<S> {
    Item: React.FC
}

type CookingProcessProps =
    CookingProcessPropsWithoutItem<COOKING_PROCESS.WAITING_TO_BEGIN> |
    CookingProcessPropsWithoutItem<COOKING_PROCESS.BEGINNING> |
    CookingProcessPropsWithoutItem<COOKING_PROCESS.PAUSED> |
    CookingProcessPropsWithItem<COOKING_PROCESS.COOKING_ITEM> |
    CookingProcessPropsWithItem<COOKING_PROCESS.ADDING_ITEM> |
    CookingProcessPropsWithItem<COOKING_PROCESS.READY>

const INITIAL_COOKING_PROCESS = {
    state: COOKING_PROCESS.WAITING_TO_BEGIN,
    Item: NullComponent
};

interface CookProps {
    CookingProcess?: typeof DefaultCookingProcess
}

// TODO Can this be made generic? Can it just cook whatever single thing we pass it?
const DefaultCookingProcess: React.FC<CookingProcessProps> = ({ Item, state }) => {
    switch (state) {
        case COOKING_PROCESS.WAITING_TO_BEGIN:
            return <>Your item is waiting to begin cooking</>;

        case COOKING_PROCESS.BEGINNING:
            return <>Your item is being prepared</>;

        case COOKING_PROCESS.COOKING_ITEM:
            return <>Cooking your <Item /> now</>;

        case COOKING_PROCESS.ADDING_ITEM:
            return <>Adding <Item /> to your item.</>;

        case COOKING_PROCESS.READY:
            return <>Your item is ready! <Item /></>;

        case COOKING_PROCESS.PAUSED:
            return <>Your item is in progress but delayed</>
    }
};

const CookableSandwich: React.FC<SandwichProps & CookProps> =
    (
        {
            // Again I find myself prop drilling here.
            // TODO Could a provider take in all these things and return a function that
            // returns a cooking process and a sandwich component from the same ingredients?
            Bun = DefaultBun,
            Patty = DefaultPatty,
            Cheese = DefaultCheese,
            Extras = DefaultExtras,
            Sauces = DefaultSauces,

            CookingProcess = DefaultCookingProcess
        }
    ) => {
        const [process, setProcess] = useState<CookingProcessProps>(INITIAL_COOKING_PROCESS);

        useEffect(() => {
            (async () => {
                const delay = 3000;
                await wait(delay);
                setProcess({ state: COOKING_PROCESS.BEGINNING, Item: NullComponent });
                await wait(delay);
                setProcess({ state: COOKING_PROCESS.COOKING_ITEM, Item: Patty });
                await wait(delay);
                setProcess({ state: COOKING_PROCESS.ADDING_ITEM, Item: Cheese });
                await wait(delay);
                setProcess({ state: COOKING_PROCESS.ADDING_ITEM, Item: Extras });
                await wait(delay);
                setProcess({ state: COOKING_PROCESS.ADDING_ITEM, Item: Sauces });
                await wait(delay);
                setProcess({
                    state: COOKING_PROCESS.READY,
                    Item: () => <Sandwich Bun={Bun} Patty={Patty} Cheese={Cheese} Extras={Extras} Sauces={Sauces} />
                });
            })()
        }, [])

        return (<>
            <CookingProcess {...process} /><button></button>
        </>);
    }

function App() {
    return (
        <ul>
            <li><Sandwich /></li>
            <li><Sandwich Patty={BeetrootPatty} /></li>
            <li><Sandwich
                Bun={() => <span>pair of chocolate cookies</span>}
                Patty={() => <span>slab of vanila ice cream</span>}
                Cheese={() => <span>chunks of caramel</span>}
                Extras={() => <span>sprinkles</span>}
                Sauces={() => <span>chocolate drizzle</span>}
            /></li>
            <li>
                <CookableSandwich />
            </li>
        </ul>
    );
}

export default App;
