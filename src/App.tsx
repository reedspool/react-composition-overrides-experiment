import React from 'react';
import logo from './logo.svg';
import './App.css';

type Sauce = 'ketchup' | 'mustard' | 'aioli'
type Extra = 'lettuce' | 'onion' | 'tomato'
type Bun = 'sesame' | 'plain' | 'waffle' | 'lettuce'
type Cheese = 'american' | 'swiss' | 'gruyere'
type Doneness = 'rare' | 'medium' | 'well-done'
interface HamburgerProps {
  bun: Bun
  cheese: Cheese
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

const Hamburger : React.FC<HamburgerProps> = ({ bun, cheese, doneness, extras, sauces }) => {
  return <span>A {doneness} burger on a {bun} bun with {cheese} cheese. On top, {formatList(extras)}. A healthy amount of {formatList(sauces)}.</span>
}

function App() {
  return (
    <Hamburger
      bun={'sesame'}
      cheese={'american'}
      doneness={'medium'}
      extras={['lettuce', 'onion', 'tomato']}
      sauces={['ketchup', 'mustard']}
    />
  );
}

export default App;
