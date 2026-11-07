import assert from 'node:assert/strict';
import test from 'node:test';
import {
 normalizeAdminProducts, normalizeAdminOrders, normalizeAdminSettings,
 nextDemoOrderId, summarizeDemo, orderStatuses
} from '../lib/admin-logic.ts';

const catalog = [
 { id: 'vestido-viva', name: 'Vestido Viva', category:'Vestidos', price: 189.9, active: true, sizes:['38'] },
 { id: 'saia-midi', name: 'Saia Midi', category:'Saias', price: 149.9, active: true, sizes:['M'] },
];
const originalOrders = [{ id:'EF-2481', date:'12 de outubro de 2026', status:'Em trânsito', total:219.9, items:'1 item' }];

test('não aceita dados falsificados do storage no catálogo administrativo', () => {
 const data = [
  {id:'vestido-viva',name:'Produto inventado',price:99.5,active:false,sizes:['PROMO']},
  {id:'saia-midi',price:Infinity,active:'false'},
  {id:'inexistente',price:0.01,active:true},
 ];
 const fixed=normalizeAdminProducts(data,catalog);
 assert.equal(fixed.length,2);
 assert.equal(fixed[0].name,'Vestido Viva');
 assert.deepEqual(fixed[0].sizes,['38']);
 assert.equal(fixed[0].price,99.5);
 assert.equal(fixed[0].active,false);
 assert.equal(fixed[1].price,149.9);
 assert.equal(fixed[1].active,true);
});

test('restaura pedidos demonstrativos sem números absurdos, duplicatas ou status inválidos', () => {
 const stored=[
  {id:'EF-2483',date:'Agora',status:'Recebido',total:50.25,items:'1 item'},
  {id:'EF-2483',date:'Agora',status:'Recebido',total:50.25,items:'1 item'},
  {id:'EF-2',date:'Agora',status:'Inexistente',total:400,items:'1 item'},
  {id:'EF-2484',date:'Agora',status:'Entregue',total:1e50,items:'1 item'},
 ];
 const fixed=normalizeAdminOrders(stored, originalOrders);
 assert.deepEqual(fixed,[{id:'EF-2483',date:'Agora',status:'Recebido',total:50.25,items:'1 item'}]);
 assert.deepEqual(normalizeAdminOrders({orders:'invalido'}, originalOrders), originalOrders);
 assert.deepEqual(normalizeAdminOrders([], originalOrders), []);
});

test('restringe filtros e seção a valores permitidos',()=>{
 const fixed=normalizeAdminSettings({category:'não existe',status:'Hackeado',section:'secret'},['Todos','Vestidos']);
 assert.deepEqual(fixed,{category:'Todos',status:'Todos',section:'overview'});
 const valid=normalizeAdminSettings({category:'Vestidos',status:orderStatuses[2],section:'reports'},['Todos','Vestidos']);
 assert.deepEqual(valid,{category:'Vestidos',status:'Em trânsito',section:'reports'});
});

test('gera IDs de pedidos únicos mesmo ao carregar uma sessão persistida',()=>{
 assert.equal(nextDemoOrderId([...originalOrders,{id:'EF-2487',date:'Agora',status:'Recebido',total:1,items:'1 item'}]),'EF-2488');
 assert.equal(nextDemoOrderId([]),'EF-2482');
});

test('indicadores de status e categorias refletem dados locais e não estatísticas inventadas',()=>{
 const summary=summarizeDemo(
  [...originalOrders,{id:'EF-2482',date:'Agora',status:'Recebido',total:100.1,items:'1 item'}],
  [{...catalog[0],active:true},{...catalog[1],active:false}]
 );
 assert.equal(summary.total,320);
 assert.equal(summary.pending,2);
 assert.deepEqual(summary.statusCounts.map(x=>x.count),[1,0,1,0,0]);
 assert.deepEqual(summary.categoryCounts,[{category:'Vestidos',count:1}]);
});
