import React from 'react';
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
        </ul>
    );
}

export default App;
