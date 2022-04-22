import React from 'react';
import './App.css';

type Sauce = 'ketchup' | 'mustard' | 'aioli'
type Extra = 'lettuce' | 'onion' | 'tomato'
type BunTypes = 'sesame' | 'plain' | 'waffle' | 'lettuce'
type IsToasted = boolean
type CheeseTypes = 'american' | 'swiss' | 'gruyere'
type Doneness = 'rare' | 'medium' | 'well-done'
interface HamburgerProps {
  Bun: React.FC
  cheese: CheeseTypes
  doneness: Doneness
  extras: Extra[]
  sauces: Sauce[]
}

const formatList : (list : string[]) => string = (list) => {
  if (list.length === 0) return '<none>';
  if (list.length === 1) return list[0];
  if (list.length === 2) return list.join(" and ");
  const beginning = list.slice(0, -1);
  const end = list.slice(-1);
  return beginning.join(", ") + " and " + end;
}

const Patty : React.FC<{doneness: Doneness}> = ({ doneness }) => <span>{doneness} burger</span>
const Bun : React.FC<{type: BunTypes, isToasted: IsToasted}> = ({ type, isToasted }) =>
  <span>{isToasted ? 'toasted' : 'untoasted'} {type} bun</span>
const Cheese : React.FC<{type: CheeseTypes}> = ({ type }) => <span>{type} cheese</span>
const Extras: React.FC<{which: Extra[]}> = ({ which }) => <span>{formatList(which)}</span>
const Sauces: React.FC<{which: Sauce[]}> = ({ which }) => <span>{formatList(which)}</span>

const Hamburger : React.FC<HamburgerProps> = ({ Bun, cheese, doneness, extras, sauces }) => {
  return <span>
    A <Patty doneness={doneness} /> on
    a <Bun />
    {' '}with <Cheese type={cheese} />.
    On top, <Extras which={extras} />.
    A healthy amount of <Sauces which={sauces} />.
  </span>
}

function App() {
  return (
    <Hamburger
      Bun={() => <Bun type={'sesame'} isToasted={true} />}
      cheese={'american'}
      doneness={'medium'}
      extras={['lettuce', 'onion', 'tomato']}
      sauces={['ketchup', 'mustard']}
    />
  );
}

export default App;
