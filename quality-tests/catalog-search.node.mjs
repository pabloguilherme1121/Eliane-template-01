import assert from 'node:assert/strict';
import test from 'node:test';
import { matchesCatalogQuery } from '../lib/catalog-search.ts';
const p={name:'Vestido Básico',category:'Vestidos',color:'Verde esmeralda',description:'Peça confortável para o dia a dia'};

test('busca ignora acentos, pontuação de espaços e diferenças de caixa',()=>{
 assert.equal(matchesCatalogQuery(p,'VESTÍDO'),true);
 assert.equal(matchesCatalogQuery(p,'  verde   ESMERALDA  '),true);
 assert.equal(matchesCatalogQuery(p,' confortável '),true);
 assert.equal(matchesCatalogQuery(p,'moleton'),false);
});

test('a busca vazia mantém todas as peças e não quebra com dados inesperados',()=>{
 assert.equal(matchesCatalogQuery(p,' '),true);
 assert.equal(matchesCatalogQuery({...p,description:''},'vestido'),true);
});
