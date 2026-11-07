import assert from 'node:assert/strict';
import test from 'node:test';
import { restoreSelection, addCartLine, setCartLineQuantity, calculateSubtotal, calculateCartLineTotal, buildOrderMessage, getCartAdditionStatus, MAX_LINE_QUANTITY } from '../lib/cart-logic.ts';

const inventory = [
  { id: 'vestido-viva', name: 'Vestido Viva', sizes: ['38', '40'], price: 189.9 },
  { id: 'moletom-leve', name: 'Moletom Leve', sizes: ['M', 'G'], price: 159.9 },
];

test('recupera dados de armazenamento corruptos sem quebrar a loja', () => {
  assert.deepEqual(restoreSelection('{bad json', inventory), {favorites:[], cart:[]});
  assert.deepEqual(restoreSelection('{"cart":"invalid","favorites":null}', inventory), {favorites:[], cart:[]});
});

test('ignora favoritos e itens desconhecidos, tamanhos inválidos e quantidades fracionadas', () => {
  const raw = JSON.stringify({favorites:['vestido-viva','desconhecido','vestido-viva',42], cart:[
    {productId:'vestido-viva',size:'38',quantity:2},
    {productId:'vestido-viva',size:'38',quantity:3},
    {productId:'vestido-viva',size:'999',quantity:2},
    {productId:'none',size:'M',quantity:1},
    {productId:'moletom-leve',size:'M',quantity:1.5},
  ]});
  assert.deepEqual(restoreSelection(raw,inventory), {favorites:['vestido-viva'],cart:[{productId:'vestido-viva',size:'38',quantity:5}]});
});

test('nunca ultrapassa limite por tamanho ao adicionar ou aumentar quantidade', () => {
  const initial=[{productId:'vestido-viva',size:'38',quantity:MAX_LINE_QUANTITY}];
  assert.deepEqual(addCartLine(initial, inventory[0], '38'), initial);
  assert.equal(setCartLineQuantity(initial,'vestido-viva','38',999)[0].quantity,MAX_LINE_QUANTITY);
  assert.deepEqual(addCartLine([], inventory[0], 'XX'), []);
  assert.deepEqual(setCartLineQuantity(initial, 'vestido-viva','38',0),[]);
});

test('subtotal usa somente itens válidos e calcula sem NaN',()=>{
  const cart=[{productId:'vestido-viva',size:'38',quantity:2},{productId:'none',size:'X',quantity:4}];
  assert.equal(calculateSubtotal(cart,inventory),379.8);
});

test('mensagem de atendimento contém itens e tamanhos, mas não promete frete ou pagamento',()=>{
  const cart=[{productId:'vestido-viva',size:'40',quantity:2}];
  const message=buildOrderMessage(cart,inventory);
  assert.match(message,/Vestido Viva/);
  assert.match(message,/tam\. 40/);
  assert.match(message,/2x/);
  assert.match(message,/R\$\s?379,80/);
  assert.match(message,/confirmar a disponibilidade e entrega/i);
  assert.doesNotMatch(message,/frete grátis|pagamento aprovado/i);
});

test('limita tamanho de estado local para evitar dados excessivos no carregamento', () => {
  const oversized = JSON.stringify({favorites:['vestido-viva'],cart:[],padding:'x'.repeat(210_000)});
  assert.deepEqual(restoreSelection(oversized, inventory), {favorites:[],cart:[]});
});

test('limita linhas diferentes da sacola restaurada sem descartar quantidades repetidas válidas', () => {
  const manySizes = Array.from({length: 130}, (_, index) => String(index));
  const largeCatalog = [{ id:'peca', sizes:manySizes,price:10 }];
  const entries = manySizes.map((size) => ({productId:'peca',size,quantity:1}));
  entries.push({productId:'peca',size:'0',quantity:2});
  const state = restoreSelection(JSON.stringify({favorites:['peca'],cart:entries}),largeCatalog);
  assert.equal(state.cart.length,100);
  assert.equal(state.cart[0].quantity,3);
  assert.equal(addCartLine(state.cart,largeCatalog[0],'120').length,100);
});


test('informação de limite de sacola é fiel ao resultado da inclusão', () => {
  assert.equal(getCartAdditionStatus([],inventory[0],'38'),'added');
  assert.equal(getCartAdditionStatus([],inventory[0],'inexistente'),'invalid-size');
  const atLineLimit=[{productId:'vestido-viva',size:'38',quantity:MAX_LINE_QUANTITY}];
  assert.equal(getCartAdditionStatus(atLineLimit,inventory[0],'38'),'quantity-limit');
  assert.equal(getCartAdditionStatus(atLineLimit,inventory[0],'40'),'added');
  const atCartLimit=Array.from({length:100}, (_,i)=>({productId:'p'+i,size:'M',quantity:1}));
  assert.equal(getCartAdditionStatus(atCartLimit,inventory[0],'38'),'cart-full');
});

test('total de cada linha arredonda em centavos, sem multiplicar valores inválidos', () => {
  assert.equal(calculateCartLineTotal({productId:'vestido-viva',size:'38',quantity:3},inventory[0]),569.7);
  assert.equal(calculateCartLineTotal({productId:'vestido-viva',size:'38',quantity:1},undefined),0);
  assert.equal(calculateCartLineTotal({productId:'vestido-viva',size:'XX',quantity:2},inventory[0]),0);
  assert.equal(calculateCartLineTotal({productId:'vestido-viva',size:'38',quantity:1.5},inventory[0]),0);
  assert.equal(calculateCartLineTotal({productId:'vestido-viva',size:'38',quantity:100},inventory[0]),3798);
  assert.equal(calculateCartLineTotal({productId:'vestido-viva',size:'38',quantity:2},{...inventory[0],price:Infinity}),0);
});
