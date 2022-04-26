import React, { PropsWithChildren, useEffect, useState } from 'react';
import './App.css';
import { Span } from './BasicComponents';
import { LocalPagination, Pagination, PaginationAnchor } from './Pagination';
import { withBoundProps, withDefaultProps } from './PropsUtilities';


// Utility returning promise which will resolve after n millis
// Useful in async contexts
const wait = (n: number) => new Promise(resolve => setTimeout(resolve, n));

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

const CookableSandwich: React.FC<SandwichProps> =
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
        }
    ) => {
        const [State, setState] = useState<React.FC>(() => NullComponent);

        useEffect(() => {
            (async () => {
                const delay = 3000;
                setState(() => () => <>Your item is waiting to begin cooking</>);
                await wait(delay);
                setState(() => () => <>Your item is being prepared</>);
                await wait(delay);
                setState(() => () => <>Cooking your <Patty /> now</>);
                await wait(delay);
                setState(() => () => <>Adding <Cheese /> to your item.</>);
                await wait(delay);
                setState(() => () => <>Adding <Extras /> to your item.</>);
                await wait(delay);
                setState(() => () => <>Adding <Sauces /> to your item.</>);
                await wait(delay);
                setState(() => () =>
                    <>
                        Your item is ready!{' '}
                        <Sandwich Bun={Bun} Patty={Patty} Cheese={Cheese} Extras={Extras} Sauces={Sauces} />
                    </>);
                await wait(delay);
            })()
        }, [])

        return <State />;
    }

const MyPagination: typeof Pagination = ({ ...rest }) => {
    return <Pagination Target={PaginationAnchor} {...rest} />
}

const MyParentComponent: React.FC<React.PropsWithChildren<{
    Child?: React.FC<React.PropsWithChildren<any>>
}>> = ({ Child = Span, ...rest }) => {
    return <Child {...rest} />
}

const MyParentComponentFactory: (Child: React.FC) => React.FC<React.PropsWithChildren<any>> =
    (Child) => {
        return (props) => <MyParentComponent Child={Child} {...props} />
    }

const MyGeneratedParentComponent = MyParentComponentFactory(Span);

const MyGeneratedGenericComponent = withBoundProps(MyParentComponent, { Child: Span });

function App() {
    return (
        <ol>
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
            <li>
                <LocalPagination
                    total={3}
                    onPageChange={(page) => { console.log(`page changed to ${page}`) }}
                />
            </li>
            <li>
                <LocalPagination
                    total={3}
                    onPageChange={(page) => { console.log(`page changed to ${page}`) }}
                    Pagination={MyPagination}
                />
            </li>
            <li>
                <LocalPagination
                    total={3}
                    onPageChange={(page) => { console.log(`page changed to ${page}`) }}
                    Pagination={withBoundProps(Pagination, { Target: PaginationAnchor })}
                />
            </li>
            <li>
                <LocalPagination
                    total={3}
                    onPageChange={(page) => { console.log(`page changed to ${page}`) }}
                    Pagination={withDefaultProps(Pagination, { Target: PaginationAnchor })}
                />
            </li>
            <li>
                <MyParentComponent>Test</MyParentComponent>
            </li>
            <li>
                <MyGeneratedParentComponent>Test</MyGeneratedParentComponent>
            </li>
            <li>
                <MyGeneratedGenericComponent>Test</MyGeneratedGenericComponent>
            </li>
        </ol>
    );
}

export default App;
